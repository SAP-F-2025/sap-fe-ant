import React from 'react';
import { fadeIn } from '../../styles/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  delay?: number;
}

/**
 * AnimatedPage wrapper component
 * Adds fade-in animation to page content
 */
export const AnimatedPage: React.FC<AnimatedPageProps> = ({ 
  children, 
  delay = 0 
}) => {
  return (
    <div 
      style={{
        ...fadeIn,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedPage;
