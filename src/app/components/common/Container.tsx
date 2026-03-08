import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-[1600px]',
  full: 'max-w-full',
};

export default function Container({ 
  children, 
  maxWidth = '2xl',
  className = '' 
}: ContainerProps) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-8 ${className}`}>
      {children}
    </div>
  );
}
