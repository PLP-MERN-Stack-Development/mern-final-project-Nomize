import { useEffect, useRef } from "react";

type SoundType = "click" | "correct" | "wrong" | "questComplete" | "levelUp" | "badgeUnlock";

const SOUND_URLS: Record<SoundType, string> = {
  click: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBQI=",
  correct: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTiM0fHWhzgJFGi47OihUhELTKXh8bllHAU7k9XyznUsBSSBzvLZijgIG2m98OWhUREMUKnk8bhnHAY=",
  wrong: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAB/cnJyf39/f39/cnJyf39/f39/f39/f39/f39/cnJyf39/f39/cnJyf39/f39/f39/f39/f39/cnJyf39/f39/cnJyf39/f39/f39/f39/f39/cnJyf39/f39/cnJyf39/f39/f39/f39/f39/cnJyf39/f39/f39=",
  questComplete: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgYKDg4OCgYB/fn19fX5/gIGCg4ODgoGAf359fX1+f4CBgoODg4KBgH9+fX19fn+AgYKDg4OCgYB/fn19fX5/gIGCg4ODgoGAf359fX1+f4CBgoODg4KBgH9+fX19fn+AgYKDg4ODgoGAf35=",
  levelUp: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgoOEhYWEg4KBgH9+fX1+f4CCg4SFhYSEgoGAf359fX1/gIKDhIWFhIOCgYB/fn19foCBg4SFhYWEg4GAgH9+fn5/gYKEhYaGhYSCgYB/fn19fX+Bg4SFhoaFg4KBgH9+fX1+gIGDhIWGhoWDgoF=",
  badgeUnlock: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBg4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fHt7fH6Ag4WGhoWDgYB+fA==",
};

export const useSound = () => {
  const audioContext = useRef<AudioContext | null>(null);
  const enabled = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContext.current = new AudioContext();
    }
    
    // Check localStorage for sound preference
    const soundPref = localStorage.getItem('soundEnabled');
    if (soundPref !== null) {
      enabled.current = soundPref === 'true';
    }
  }, []);

  const playSound = (type: SoundType) => {
    if (!enabled.current) return;

    try {
      const audio = new Audio(SOUND_URLS[type]);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors (user interaction required on some browsers)
      });
    } catch (error) {
      // Silently fail
    }
  };

  const toggleSound = () => {
    enabled.current = !enabled.current;
    localStorage.setItem('soundEnabled', String(enabled.current));
    return enabled.current;
  };

  const isSoundEnabled = () => enabled.current;

  return { playSound, toggleSound, isSoundEnabled };
};
