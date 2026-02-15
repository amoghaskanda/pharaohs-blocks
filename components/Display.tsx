import React from 'react';

interface DisplayProps {
  label: string;
  text: string | number;
  icon?: React.ReactNode;
  testId?: string;
}

const Display: React.FC<DisplayProps> = ({ label, text, icon, testId }) => {
  return (
    <div className="bg-stone-900 border-2 border-yellow-600/50 rounded-lg p-4 mb-4 relative overflow-hidden group" data-testid={testId}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-500"></div>

      <div className="flex items-center justify-between mb-1">
        <span className="text-yellow-600 font-bold font-egyptian text-lg uppercase tracking-wider">{label}</span>
        {icon && <span className="text-yellow-500">{icon}</span>}
      </div>
      <div className="text-white font-decorative text-2xl tracking-widest text-shadow-gold">
        {text}
      </div>
    </div>
  );
};

export default Display;