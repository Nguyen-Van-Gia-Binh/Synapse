import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';

export const ServerWakeupBanner: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'waking' | 'ready' | 'offline'>('idle');

  useEffect(() => {
    let isMounted = true;

    // Sau 2.5s nếu request chưa xong -> hiển thị thông báo đang đánh thức máy chủ Render
    const timer = setTimeout(() => {
      if (isMounted && status === 'idle') {
        setStatus('waking');
      }
    }, 2500);

    apiClient
      .getHealth()
      .then(() => {
        if (!isMounted) return;
        clearTimeout(timer);
        setStatus((prev) => (prev === 'waking' ? 'ready' : 'idle'));
        if (status === 'waking') {
          setTimeout(() => {
            if (isMounted) setStatus('idle');
          }, 2000);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        clearTimeout(timer);
        setStatus('offline');
        // Tự ẩn thông báo offline sau 5s vì app có fallback
        setTimeout(() => {
          if (isMounted) setStatus('idle');
        }, 5000);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (status === 'idle') return null;

  return (
    <aside
      aria-label="Trạng thái kết nối máy chủ"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-xs md:text-sm font-medium transition-all duration-300 backdrop-blur-md border animate-fade-in"
      style={{
        backgroundColor:
          status === 'ready'
            ? 'rgba(42, 157, 143, 0.9)'
            : status === 'offline'
            ? 'rgba(111, 78, 55, 0.9)'
            : 'rgba(233, 196, 106, 0.9)',
        color: status === 'waking' ? '#1D1E2C' : '#FFFFFF',
        borderColor:
          status === 'ready'
            ? '#2A9D8F'
            : status === 'offline'
            ? '#6F4E37'
            : '#E9C46A',
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
        {status === 'ready' && (
          <>
            <span>✅</span>
            <span>Kết nối máy chủ thành công! Chúc bạn sáng tạo vui vẻ.</span>
          </>
        )}
        {status === 'offline' && (
          <>
            <span>ℹ️</span>
            <span>Không thể kết nối máy chủ Cloud. Hệ thống tự động chuyển sang chế độ dự phòng Offline.</span>
          </>
        )}
      </div>
    </aside>
  );
};
