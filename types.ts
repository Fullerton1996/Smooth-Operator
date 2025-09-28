export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'ease-in-back'
  | 'ease-out-back'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-quint'
  | 'ease-out-quint'
  | 'ease-in-out-quint';

export interface AnimationProps {
  duration: number; // in seconds
  easing: EasingFunction;
}

export interface Level {
  description: string;
  targetProps: AnimationProps;
}