import React, { useEffect, useState, useRef } from 'react';
import { apiClient } from '../../services/api';
import { X } from 'lucide-react';

export const ServerWakeupBanner: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'waking' | 'offline'>('idle');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const isWakingRef = useRef<boolean>(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Sau 2.5s nếu request chưa xong -> hiển thị thông báo đang đánh thức máy chủ Render
    const timer = setTimeout(() => {
      if (isMounted) {
        isWakingRef.current = true;
        setStatus('waking');
      }
    }, 2500);

    apiClient
      .getHealth()
      .then((res) => {
        if (!isMounted) return;
        clearTimeout(timer);

        if (res.success) {
          // Khi kết nối thành công: nếu trước đó đang hiển thị thông báo thì fade-out và ẩn đi ngay
          if (isWakingRef.current) {
            setIsFadingOut(true);
            dismissTimerRef.current = setTimeout(() => {
              if (isMounted) {
                setStatus('idle');
                setIsFadingOut(false);
              }
            }, 300);
          } else {
            setStatus('idle');
          }
        } else {
          setStatus('offline');
          dismissTimerRef.current = setTimeout(() => {
            if (isMounted) {
              setIsFadingOut(true);
              setTimeout(() => {
                if (isMounted) setStatus('idle');
              }, 300);
            }
          }, 4000);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        clearTimeout(timer);
        setStatus('offline');
        // Tự ẩn thông báo offline sau 4s vì app có fallback
        dismissTimerRef.current = setTimeout(() => {
          if (isMounted) {
            setIsFadingOut(true);
            setTimeout(() => {
              if (isMounted) setStatus('idle');
            }, 300);
          }
        }, 4000);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setStatus('idle');
      setIsFadingOut(false);
    }, 200);
  };

  if (status === 'idle') return null;

  return (
    <aside
      aria-label="Trạng thái kết nối máy chủ"
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-xs md:text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
        isFadingOut ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0 animate-fade-in'
      }`}
      style={{
        backgroundColor:
          status === 'offline'
            ? 'rgba(111, 78, 55, 0.9)'
            : 'rgba(233, 196, 106, 0.95)',
        color: status === 'waking' ? '#1D1E2C' : '#FFFFFF',
        borderColor: status === 'offline' ? '#6F4E37' : '#E9C46A',
      }}
    >
      <div className="flex items-center gap-2">
        {status === 'waking' && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-900 animate-ping inline-block" />
            <span>
              🏮 <strong>Đang kết nối máy chủ V-Heritage:</strong> Có thể mất khoảng 30s khi máy chủ thức giấc lần đầu (gói Cloud miễn phí)...
            </span>
          </>
        )}
        {status === 'offline' && (
          <>
            <span>ℹ️</span>
            <span>Không thể kết nối máy chủ Cloud. Hệ thống tự động chuyển sang chế độ dự phòng Offline.</span>
          </>
        )}
        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Đóng thông báo"
          className="ml-2 p-0.5 rounded-full hover:bg-black/10 transition-colors inline-flex items-center justify-center text-current opacity-70 hover:opacity-100 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
