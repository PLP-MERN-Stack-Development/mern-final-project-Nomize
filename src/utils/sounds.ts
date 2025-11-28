import { Howl } from 'howler';

export const sounds = {
  click: new Howl({ 
    src: ['/sounds/click.mp3'],
    volume: 0.3,
    html5: true,
  }),
  correct: new Howl({ 
    src: ['/sounds/correct.mp3'],
    volume: 0.5,
    html5: true,
  }),
  wrong: new Howl({ 
    src: ['/sounds/wrong.mp3'],
    volume: 0.4,
    html5: true,
  }),
  questComplete: new Howl({ 
    src: ['/sounds/complete.mp3'],
    volume: 0.6,
    html5: true,
  }),
  levelUp: new Howl({ 
    src: ['/sounds/levelup.mp3'],
    volume: 0.7,
    html5: true,
  }),
  xpEarn: new Howl({ 
    src: ['/sounds/xp.mp3'],
    volume: 0.4,
    html5: true,
  }),
  badgeUnlock: new Howl({ 
    src: ['/sounds/badge.mp3'],
    volume: 0.5,
    html5: true,
  }),
  ruleChange: new Howl({ 
    src: ['/sounds/switch.mp3'],
    volume: 0.5,
    html5: true,
  }),
};

export const playSound = (name: keyof typeof sounds) => {
  const enabled = localStorage.getItem('soundEnabled') !== 'false';
  if (enabled && sounds[name]) {
    sounds[name].play();
  }
};

export const toggleSoundEnabled = () => {
  const current = localStorage.getItem('soundEnabled') !== 'false';
  localStorage.setItem('soundEnabled', (!current).toString());
  return !current;
};

export const isSoundEnabled = () => {
  return localStorage.getItem('soundEnabled') !== 'false';
};
