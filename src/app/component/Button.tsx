// components/Button.tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      aria-label="button"
      onClick={onClick}
      className={`${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
