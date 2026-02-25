import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // We use specific hex codes (e.g. bg-[#1d74f5]) to ensure the color loads 
  // even if the tailwind.config script in HTML has a delay.
  
  // Updated: Reduced padding (px-6 py-3) and text size (text-base) for better desktop proportion
  const baseStyles = "px-6 py-3 rounded-full font-bold text-base transition-all duration-200 shadow-md hover:shadow-xl active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    // Primary: Bright Blue background, White text
    primary: "bg-[#1d74f5] text-white hover:bg-blue-600 border border-transparent",
    
    // Secondary: White background, Dark text
    secondary: "bg-white text-slate-800 hover:bg-gray-50 border border-gray-200",
    
    // Outline: Transparent background, Blue text and border
    outline: "bg-transparent text-[#1d74f5] border-2 border-[#1d74f5] hover:bg-blue-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};