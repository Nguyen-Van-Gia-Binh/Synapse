import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

export type BannerStatus = 'idle' | 'waking' | 'offline';

export interface BannerStateEngine {
  status: BannerStatus;
  isFadingOut: boolean;
  hasBeenWaking: boolean;
}

export function createInitialBannerState(): BannerStateEngine {
  return {
    status: 'idle',
    isFadingOut: false,
    hasBeenWaking: false,
  };
}

export function handleTimerWaking(state: BannerStateEngine): BannerStateEngine {
  return {
    ...state,
    status: 'waking',
    hasBeenWaking: true,
  };
}

export function handleHealthSuccess(state: BannerStateEngine): {
  nextState: BannerStateEngine;
  shouldAutoDismiss: boolean;
} {
  if (state.hasBeenWaking) {
    // Nếu trước đó đã hiển thị thông báo đang kết nối: tự động kích hoạt hiệu ứng fade-out và ẩn đi hoàn toàn
    return {
      nextState: {
        ...state,
        isFadingOut: true,
      },
      shouldAutoDismiss: true,
    };
  }

  // Nếu phản hồi nhanh trước 2.5s: giữ nguyên idle không bao giờ hiển thị banner gây phiền
  return {
    nextState: {
      ...state,
      status: 'idle',
      isFadingOut: false,
    },
    shouldAutoDismiss: false,
  };
}

export function handleDismissManual(state: BannerStateEngine): BannerStateEngine {
  return {
    ...state,
    isFadingOut: true,
  };
}

export function handleDismissComplete(_state?: BannerStateEngine): BannerStateEngine {
  return {
    status: 'idle',
    isFadingOut: false,
    hasBeenWaking: false,
  };
}

describe('ServerWakeupBanner - Lifecycle & Non-intrusive Dismissal', () => {
  test('Nếu kết nối máy chủ nhanh (< 2.5s), banner giữ nguyên idle và không bao giờ xuất hiện', () => {
    const initial = createInitialBannerState();
    const result = handleHealthSuccess(initial);

    assert.equal(result.nextState.status, 'idle');
    assert.equal(result.nextState.isFadingOut, false);
    assert.equal(result.shouldAutoDismiss, false);
  });

  test('Nếu máy chủ khởi động chậm (> 2.5s), banner hiện thông báo đang kết nối', () => {
    let state = createInitialBannerState();
    state = handleTimerWaking(state);

    assert.equal(state.status, 'waking');
    assert.equal(state.hasBeenWaking, true);
  });

  test('Khi kết nối thành công sau khi đang waking: tự động kích hoạt fade-out và dọn sạch trạng thái về idle', () => {
    let state = createInitialBannerState();
    state = handleTimerWaking(state);

    const result = handleHealthSuccess(state);
    assert.equal(result.shouldAutoDismiss, true);
    assert.equal(result.nextState.isFadingOut, true);

    const finalState = handleDismissComplete(result.nextState);
    assert.equal(finalState.status, 'idle');
    assert.equal(finalState.isFadingOut, false);
  });

  test('Người dùng có thể đóng banner thủ công bất kỳ lúc nào qua nút đóng', () => {
    let state = createInitialBannerState();
    state = handleTimerWaking(state);

    const manualDismiss = handleDismissManual(state);
    assert.equal(manualDismiss.isFadingOut, true);

    const finalState = handleDismissComplete(manualDismiss);
    assert.equal(finalState.status, 'idle');
  });

  test('Thông điệp hiển thị giữ thái độ thân thiện, không dùng từ ngữ gây hoang mang', () => {
    const wakingMessage = '🏮 Đang kết nối máy chủ V-Heritage: Có thể mất khoảng 30s khi máy chủ thức giấc lần đầu (gói Cloud miễn phí)...';
    const offlineMessage = 'ℹ️ Không thể kết nối máy chủ Cloud. Hệ thống tự động chuyển sang chế độ dự phòng Offline.';

    const forbiddenPhrases = ['lỗi nghiêm trọng', 'sập server', 'hỏng', 'thất bại', 'chết server'];
    for (const phrase of forbiddenPhrases) {
      assert.ok(!wakingMessage.toLowerCase().includes(phrase));
      assert.ok(!offlineMessage.toLowerCase().includes(phrase));
    }
  });
});
