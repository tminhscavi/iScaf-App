// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { autoRegisterSW } from '@/utils/registerSW';

export default function RegisterSW() {
  useEffect(() => {
    // Auto-register service worker
    autoRegisterSW({
      onSuccess: (reg) => console.log('SW registered:', reg),
      onUpdate: (reg) => {
        if (confirm('Đã có phiên bản mới, vui lòng tải lại để cập nhật')) {
          window.location.reload();
        }
      },
      onError: (err) => console.error('SW error:', err),
    });
  }, []);
  return <></>;
}
