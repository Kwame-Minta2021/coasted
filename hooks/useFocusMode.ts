'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface FocusModeState {
  isFocused: boolean;
  violationsCount: number;
  isFullscreen: boolean;
  isWakeLockActive: boolean;
}

interface UseFocusModeOptions {
  onViolation?: () => void;
  onExit?: () => void;
  requirePin?: boolean;
}

export function useFocusMode(options: UseFocusModeOptions = {}) {
  const [state, setState] = useState<FocusModeState>({
    isFocused: false,
    violationsCount: 0,
    isFullscreen: false,
    isWakeLockActive: false,
  });

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const violationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if fullscreen is supported
  const isFullscreenSupported = typeof document !== 'undefined' && 
    (document.fullscreenEnabled || 
     (document as any).webkitFullscreenEnabled || 
     (document as any).mozFullScreenEnabled);

  // Check if wake lock is supported
  const isWakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    if (!isFullscreenSupported) return false;

    try {
      const element = document.documentElement;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      }
      
      setState(prev => ({ ...prev, isFullscreen: true }));
      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  }, [isFullscreenSupported]);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    if (!isFullscreenSupported) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      }
      
      setState(prev => ({ ...prev, isFullscreen: false }));
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, [isFullscreenSupported]);

  // Request wake lock
  const requestWakeLock = useCallback(async () => {
    if (!isWakeLockSupported) return false;

    try {
      wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      setState(prev => ({ ...prev, isWakeLockActive: true }));
      return true;
    } catch (error) {
      console.error('Failed to request wake lock:', error);
      return false;
    }
  }, [isWakeLockSupported]);

  // Release wake lock
  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setState(prev => ({ ...prev, isWakeLockActive: false }));
      } catch (error) {
        console.error('Failed to release wake lock:', error);
      }
    }
  }, []);

  // Start focus mode
  const startFocus = useCallback(async () => {
    setState(prev => ({ ...prev, isFocused: true, violationsCount: 0 }));
    
    // Request fullscreen and wake lock
    await Promise.all([
      requestFullscreen(),
      requestWakeLock()
    ]);
  }, [requestFullscreen, requestWakeLock]);

  // Stop focus mode
  const stopFocus = useCallback(async (requirePin: boolean = false) => {
    if (requirePin) {
      // This should be handled by the parent component
      // The hook just provides the state
      return;
    }

    setState(prev => ({ ...prev, isFocused: false }));
    
    // Release wake lock and exit fullscreen
    await Promise.all([
      releaseWakeLock(),
      exitFullscreen()
    ]);
  }, [releaseWakeLock, exitFullscreen]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (!state.isFocused) return;

    if (document.hidden) {
      setState(prev => ({ 
        ...prev, 
        violationsCount: prev.violationsCount + 1 
      }));
      
      if (options.onViolation) {
        options.onViolation();
      }
    }
  }, [state.isFocused, options]);

  // Handle window blur
  const handleWindowBlur = useCallback(() => {
    if (!state.isFocused) return;

    // Add a small delay to avoid false positives
    if (violationTimeoutRef.current) {
      clearTimeout(violationTimeoutRef.current);
    }

    violationTimeoutRef.current = setTimeout(() => {
      if (document.hidden) {
        setState(prev => ({ 
          ...prev, 
          violationsCount: prev.violationsCount + 1 
        }));
        
        if (options.onViolation) {
          options.onViolation();
        }
      }
    }, 100);
  }, [state.isFocused, options]);

  // Handle beforeunload
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (!state.isFocused) return;

    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your focus session will be interrupted.';
    return e.returnValue;
  }, [state.isFocused]);

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement
    );

    setState(prev => ({ ...prev, isFullscreen }));

    // If fullscreen was exited while in focus mode, trigger violation
    if (state.isFocused && !isFullscreen) {
      setState(prev => ({ 
        ...prev, 
        violationsCount: prev.violationsCount + 1 
      }));
      
      if (options.onViolation) {
        options.onViolation();
      }
    }
  }, [state.isFocused, options]);

  // Set up event listeners
  useEffect(() => {
    if (!state.isFocused) return;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, [state.isFocused, handleVisibilityChange, handleWindowBlur, handleBeforeUnload, handleFullscreenChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return {
    ...state,
    startFocus,
    stopFocus,
    isFullscreenSupported,
    isWakeLockSupported,
  };
}
