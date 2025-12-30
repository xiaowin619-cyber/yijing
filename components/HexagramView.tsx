
import React from 'react';
import { LineType } from '../types';

interface HexagramViewProps {
  lines: LineType[];
  size?: 'sm' | 'md' | 'lg';
  changingLines?: number[];
  isAnimating?: boolean;
}

export const HexagramView: React.FC<HexagramViewProps> = ({ 
  lines, 
  size = 'md', 
  changingLines = [],
  isAnimating = false
}) => {
  const widthClass = size === 'sm' ? 'w-16' : size === 'md' ? 'w-32' : 'w-48';
  const lineHeightClass = size === 'sm' ? 'h-1.5 mb-1' : size === 'md' ? 'h-3 mb-2' : 'h-4 mb-3';

  // Render from top to bottom (lines array is bottom to top)
  const reversedLines = [...lines].reverse();

  return (
    <div className={`flex flex-col items-center ${widthClass}`}>
      {reversedLines.map((line, index) => {
        const linePos = 6 - index;
        const isChanging = changingLines.includes(linePos);
        const animationClass = (isAnimating && isChanging) ? 'animate-changing-line' : '';
        
        return (
          <div key={index} className={`w-full relative transition-all duration-500 ${animationClass}`}>
            {line === LineType.YANG ? (
              <div 
                className={`iching-line yang-line ${lineHeightClass} ${isChanging ? 'bg-red-700' : 'bg-stone-800'}`} 
              />
            ) : (
              <div className={`iching-line yin-line ${lineHeightClass}`}>
                <div className={`${isChanging ? 'bg-red-700' : 'bg-stone-800'}`} />
                <div className={`${isChanging ? 'bg-red-700' : 'bg-stone-800'}`} />
              </div>
            )}
            {isChanging && (
              <div className={`absolute -right-6 top-1/2 -translate-y-1/2 text-red-700 font-bold ${size === 'lg' ? 'text-sm' : 'text-xs'} ${isAnimating ? 'animate-pulse' : ''}`}>
                ●
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
