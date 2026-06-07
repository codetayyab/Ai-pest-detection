import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Processing leaf diagnostics..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
        {/* Inner Sprouting Icon */}
        <div className="absolute animate-pulse">
          <Sprout className="h-6 w-6 text-emerald-400" />
        </div>
      </div>
      <p className="text-emerald-300 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};
