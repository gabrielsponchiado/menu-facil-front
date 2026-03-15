import { useEffect } from 'react';

let lockCount = 0;

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (lock) {
      lockCount++;
      const originalStyle = document.body.style.overflow;
      const originalHtmlStyle = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Prevent scroll
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Force touch-action none for mobile stability
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.touchAction = 'none';

      return () => {
        lockCount--;
        if (lockCount === 0) {
          document.body.style.overflow = originalStyle;
          document.documentElement.style.overflow = originalHtmlStyle;
          document.body.style.paddingRight = originalPaddingRight;
          document.body.style.touchAction = originalTouchAction;
        }
      };
    }
  }, [lock]);
}
