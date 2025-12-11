import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-christmas-red hover:bg-red-700 text-white shadow-lg shadow-red-200 focus:ring-red-500",
    secondary: "bg-christmas-green hover:bg-green-800 text-white shadow-lg shadow-green-200 focus:ring-green-500",
    outline: "bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  );
};