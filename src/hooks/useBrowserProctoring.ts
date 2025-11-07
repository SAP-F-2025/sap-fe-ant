import { useEffect, useRef } from 'react';

export interface BrowserProctoringEvent {
  type: 'tab_switch' | 'fullscreen_exit' | 'copy_paste';
  startTime: number;
  endTime: number;
  duration: number;
  metadata?: {
    action?: 'copy' | 'paste' | 'cut';
    hidden?: boolean;
  };
}

interface UseBrowserProctoringProps {
  enabled: boolean;
  requireFullscreen?: boolean;
  preventTabSwitching?: boolean;
  preventCopyPaste?: boolean;
  onViolation?: (event: BrowserProctoringEvent) => void;
}

export const useBrowserProctoring = ({
  enabled,
  requireFullscreen = false,
  preventTabSwitching = true,
  preventCopyPaste = true,
  onViolation
}: UseBrowserProctoringProps) => {
  const tabSwitchViolationRef = useRef<{ startTime: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Tab switching detection
    const handleVisibilityChange = () => {
      if (!preventTabSwitching) return;
      if (document.hidden) {
        if (!tabSwitchViolationRef.current) {
          tabSwitchViolationRef.current = { startTime: Date.now() };
          const event: BrowserProctoringEvent = {
            type: 'tab_switch',
            startTime: tabSwitchViolationRef.current.startTime,
            endTime: 0,
            duration: 0,
            metadata: { hidden: true }
          };
          onViolation?.(event);
        }
      } else {
        if (tabSwitchViolationRef.current) {
          const endTime = Date.now();
          const duration = endTime - tabSwitchViolationRef.current.startTime;
          const event: BrowserProctoringEvent = {
            type: 'tab_switch',
            startTime: tabSwitchViolationRef.current.startTime,
            endTime,
            duration,
            metadata: { hidden: false }
          };
          onViolation?.(event);
          tabSwitchViolationRef.current = null;
        }
      }
    };

    // Fullscreen exit detection
    const handleFullscreenChange = () => {
      if (requireFullscreen && !document.fullscreenElement) {
        const event: BrowserProctoringEvent = {
          type: 'fullscreen_exit',
          startTime: Date.now(),
          endTime: Date.now(),
          duration: 0
        };
        onViolation?.(event);
      }
    };

    // Copy/paste detection
    const handleCopy = () => {
      if (!preventCopyPaste) return;
      const event: BrowserProctoringEvent = {
        type: 'copy_paste',
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        metadata: { action: 'copy' }
      };
      onViolation?.(event);
    };

    const handlePaste = () => {
      if (!preventCopyPaste) return;
      const event: BrowserProctoringEvent = {
        type: 'copy_paste',
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        metadata: { action: 'paste' }
      };
      onViolation?.(event);
    };

    const handleCut = () => {
      if (!preventCopyPaste) return;
      const event: BrowserProctoringEvent = {
        type: 'copy_paste',
        startTime: Date.now(),
        endTime: Date.now(),
        duration: 0,
        metadata: { action: 'cut' }
      };
      onViolation?.(event);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
    };
  }, [enabled, requireFullscreen, onViolation]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  };

  return {
    enterFullscreen,
    isFullscreen: !!document.fullscreenElement
  };
};
