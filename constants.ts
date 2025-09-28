
import { EasingFunction, Level } from './types';

export const EASING_MAP: Record<EasingFunction, string> = {
  'linear': 'cubic-bezier(0, 0, 1, 1)',
  'ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
  'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
  'ease-in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'ease-in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  'ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
  'ease-in-out-quint': 'cubic-bezier(0.86, 0, 0.07, 1)',
};

export const LEVELS: Level[] = [
  {
    description: 'This animation moves at a constant speed from start to finish. Which easing function represents this?',
    targetProps: {
      duration: 2,
      easing: 'linear',
    },
  },
  {
    description: 'This animation starts slowly and then accelerates towards the end. Can you identify it?',
    targetProps: {
      duration: 2,
      easing: 'ease-in',
    },
  },
  {
    description: 'This animation starts quickly and decelerates to a gentle stop. Which one is it?',
    targetProps: {
      duration: 2,
      easing: 'ease-out',
    },
  },
  {
    description: 'A fundamental of animation. It starts slow, speeds up in the middle, and ends slow. Find this smooth motion.',
    targetProps: {
      duration: 2,
      easing: 'ease-in-out',
    },
  },
  {
    description: 'Slightly faster at the beginning and end than in the middle, this is the default timing for many animations.',
    targetProps: {
      duration: 2.2,
      easing: 'ease',
    },
  },
  {
    description: "This animation feels like it's being launched, starting fast and then coasting to a stop over a long period.",
    targetProps: {
      duration: 2.5,
      easing: 'ease-out',
    },
  },
  {
    description: 'Imagine a heavy object slowly starting to move. It takes a long time to get going but then quickly reaches its destination.',
    targetProps: {
      duration: 2.5,
      easing: 'ease-in',
    },
  },
  {
    description: 'A very quick, almost snappy movement that eases gently at both the beginning and the end.',
    targetProps: {
      duration: 1.2,
      easing: 'ease-in-out',
    },
  },
  {
    description: "This animation pulls back slightly before shooting forward, like a wind-up before a pitch.",
    targetProps: {
      duration: 1.5,
      easing: 'ease-in-back',
    },
  },
  {
    description: "This animation overshoots its target and then settles back into place, like a cartoon character skidding to a halt.",
    targetProps: {
      duration: 1.5,
      easing: 'ease-out-back',
    },
  },
  {
    description: "A more pronounced acceleration than 'ease-in'. It starts very slowly and then picks up speed dramatically.",
    targetProps: { duration: 2, easing: 'ease-in-cubic' },
  },
  {
    description: "The opposite of 'ease-in-cubic'. This animation bursts out of the gate and then gracefully slows to a halt.",
    targetProps: { duration: 2, easing: 'ease-out-cubic' },
  },
  {
    description: "A smooth but noticeable acceleration and deceleration at the beginning and end of the movement.",
    targetProps: { duration: 2, easing: 'ease-in-out-cubic' },
  },
  {
    description: 'This is a very aggressive acceleration. The animation barely moves at first, then suddenly darts to the end.',
    targetProps: { duration: 2.2, easing: 'ease-in-quint' },
  },
  {
    description: 'An extremely fast start, followed by a long, slow coast to the finish line. It feels very abrupt.',
    targetProps: { duration: 2.2, easing: 'ease-out-quint' },
  },
  {
    description: 'The most dramatic of the standard easings. It features a very slow start, rapid acceleration, and a very slow finish.',
    targetProps: { duration: 2.2, easing: 'ease-in-out-quint' },
  },
];