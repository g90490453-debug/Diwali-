import React from 'react';

export const FestiveToran: React.FC = () => {
  return (
    <div className="w-full pointer-events-none select-none relative overflow-hidden h-14 sm:h-20 flex justify-between items-start px-2 sm:px-6">
      {/* Top hanging golden thread */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-md" />

      {/* Repeating scallops with marigold and golden bells */}
      {Array.from({ length: 9 }).map((_, index) => {
        const isCenter = index === 4;
        const delay = (index % 4) * 0.4;
        return (
          <div
            key={index}
            className="flex flex-col items-center animate-float-slow"
            style={{ animationDelay: `${delay}s`, animationDuration: `${4 + (index % 3)}s` }}
          >
            {/* Scallop arch */}
            <div className="w-8 sm:w-16 h-4 sm:h-6 border-b-2 border-amber-400/80 rounded-b-full shadow-[0_2px_8px_rgba(251,191,36,0.4)]" />

            {/* Marigold flower clusters */}
            <div className="flex -space-x-1 -mt-1">
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 shadow-sm" />
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 shadow-sm" />
            </div>

            {/* Hanging golden bell or mango leaf */}
            <div className="w-0.5 h-3 sm:h-5 bg-amber-400/70" />
            {isCenter ? (
              <div className="w-3.5 h-4 sm:w-5 sm:h-6 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 rounded-b-lg shadow-md border border-amber-200 flex items-center justify-center">
                <span className="w-1 h-1 bg-amber-950 rounded-full" />
              </div>
            ) : (
              <div className="w-2 h-3.5 sm:w-3 sm:h-5 bg-gradient-to-b from-emerald-700 to-emerald-500 rounded-b-full shadow-sm" />
            )}
          </div>
        );
      })}
    </div>
  );
};
