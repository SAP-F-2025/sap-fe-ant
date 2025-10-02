import { CSSProperties } from 'react';

// Animation durations
export const ANIMATION_DURATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// Easing functions
export const EASING = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

// Reusable animation styles
export const fadeIn: CSSProperties = {
  animation: 'fadeIn 300ms ease-in-out',
};

export const slideInUp: CSSProperties = {
  animation: 'slideInUp 400ms ease-out',
};

export const slideInRight: CSSProperties = {
  animation: 'slideInRight 300ms ease-out',
};

export const scaleIn: CSSProperties = {
  animation: 'scaleIn 200ms ease-out',
};

export const pulse: CSSProperties = {
  animation: 'pulse 2s ease-in-out infinite',
};

// Hover effects
export const hoverLift: CSSProperties = {
  transition: `all ${ANIMATION_DURATION.normal} ${EASING.easeOut}`,
  cursor: 'pointer',
};

export const hoverScale: CSSProperties = {
  transition: `transform ${ANIMATION_DURATION.fast} ${EASING.easeOut}`,
  cursor: 'pointer',
};

// Loading shimmer effect
export const shimmer: CSSProperties = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
};

// CSS keyframes (to be added to global styles)
export const keyframes = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;

// Transition utilities
export const createTransition = (
  properties: string[],
  duration: keyof typeof ANIMATION_DURATION = 'normal',
  easing: keyof typeof EASING = 'easeInOut'
): string => {
  return properties
    .map((prop) => `${prop} ${ANIMATION_DURATION[duration]} ${EASING[easing]}`)
    .join(', ');
};

// Stagger animation helper
export const getStaggerDelay = (index: number, baseDelay: number = 50): string => {
  return `${index * baseDelay}ms`;
};
