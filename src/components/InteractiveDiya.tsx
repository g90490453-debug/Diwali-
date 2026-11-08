import React, { useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { festiveAudio } from '../utils/audio';

interface InteractiveDiyaProps {
  isLit: boolean;
  onToggleLight: () => void;
  recipientName?: string;
}

export const InteractiveDiya: React.FC<InteractiveDiyaProps> = ({
  isLit,
  onToggleLight,
}) => {
  const [, setPulseCount] = useState(0);

  const handleDiyaClick = () => {
    onToggleLight();
    setPulseCount((prev) => prev + 1);
    if (!isLit) {
      festiveAudio.playDiyaLightSound();
    } else {
      festiveAudio.playSparklerSound();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* Surrounding auspicious mini-diyas in an arc */}
      <div className="absolute -top-6 w-full max-w-sm flex items-center justify-between px-4 pointer-events-none z-10">
        {[0, 1, 2, 3, 4].map((index) => {
          const delay = index * 180;
          return (
            <div
              key={index}
              className="flex flex-col items-center transition-all duration-700"
              style={{
                transitionDelay: `${isLit ? delay : 0}ms`,
                transform: isLit ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.85)',
                opacity: isLit ? 1 : 0.45,
              }}
            >
              {/* Flame */}
              <div
                className={`w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 transition-all duration-500 ${
                  isLit ? 'animate-flame opacity-100' : 'opacity-0 scale-50'
                }`}
                style={{
                  boxShadow: isLit ? '0 0 14px rgba(251, 191, 36, 0.9), 0 0 25px rgba(234, 88, 12, 0.6)' : 'none',
                }}
              />
              {/* Clay base */}
              <div className="w-6 h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-b-full border border-amber-500/50 -mt-1 shadow-md" />
            </div>
          );
        })}
      </div>

      {/* Main Central Diya Interactive Container */}
      <div
        onClick={handleDiyaClick}
        className="relative group cursor-pointer p-4 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
        title={isLit ? 'Diya is glowing brightly! Click to enhance glow ✨' : 'Click to Light Your Diya 🪔'}
      >
        {/* Divine radiating golden auras when lit */}
        {isLit && (
          <>
            <div className="absolute inset-0 rounded-full bg-radial from-amber-400/40 via-orange-500/20 to-transparent blur-3xl animate-pulse-glow pointer-events-none" />
            <div className="absolute -inset-8 rounded-full bg-radial from-yellow-300/25 via-amber-600/15 to-transparent blur-2xl pointer-events-none" />
          </>
        )}

        {/* The Diya Vessel with Image & Layered Realistic Flame */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-[#150727] flex items-center justify-center">
          {/* Terracotta Diya Artwork */}
          <img
            src="/assets/images/diwali_sacred_diya.jpg"
            alt="Sacred Diwali Diya Oil Lamp"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // fallback to public asset path
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/diwali_sacred_diya_1794109042276_cc621d70.jpg';
            }}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isLit ? 'brightness-110 contrast-105 filter drop-shadow' : 'brightness-75 contrast-95 opacity-80'
            }`}
          />

          {/* Golden border vignette */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-amber-300/40 pointer-events-none" />

          {/* Animated Superimposed Pure Flame */}
          <div
            className={`absolute top-[16%] left-[49%] -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-700 ${
              isLit ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            {/* Outer Flame Glow */}
            <div className="absolute -inset-4 rounded-full bg-radial from-amber-300/80 via-orange-500/40 to-transparent blur-md animate-pulse" />

            {/* Flame Body */}
            <div
              className="w-7 h-14 sm:w-8 sm:h-16 rounded-full bg-gradient-to-t from-red-600 via-orange-400 to-amber-100 animate-flame relative z-10"
              style={{
                borderRadius: '50% 50% 35% 35% / 80% 80% 20% 20%',
                boxShadow: '0 0 20px #f59e0b, 0 0 40px #ea580c, 0 0 60px #f97316',
              }}
            >
              {/* Inner White-Hot Core */}
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-8 rounded-full bg-white/95 blur-[1px]"
                style={{
                  borderRadius: '50% 50% 35% 35% / 80% 80% 20% 20%',
                }}
              />
            </div>

            {/* Rising Sparks from Flame */}
            {isLit && (
              <div className="absolute -top-4 w-12 h-12 flex justify-center">
                <span className="w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping opacity-75" />
              </div>
            )}
          </div>

          {/* Unlit prompt overlay when dark */}
          {!isLit && (
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center transition-opacity hover:bg-black/30">
              <Flame className="w-9 h-9 text-amber-400 mb-2 animate-bounce" />
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold drop-shadow">
                Tap to Light
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Button: "Light Your Diya" */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleDiyaClick}
          className={`group relative px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 shadow-lg active:scale-95 cursor-pointer ${
            isLit
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 font-semibold shadow-amber-500/30 ring-2 ring-amber-300/60'
              : 'bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:text-amber-200 shadow-purple-950/50'
          }`}
        >
          <Flame
            className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
              isLit ? 'text-amber-950 fill-amber-950 animate-flame' : 'text-amber-400'
            }`}
          />
          <span className="whitespace-nowrap">
            {isLit ? '✨ Diya is Glowing Brightly' : '🪔 Light Your Diya'}
          </span>
          {isLit && <Sparkles className="w-3.5 h-3.5 text-amber-950 animate-spin" style={{ animationDuration: '4s' }} />}
        </button>

        <p className="text-xs text-amber-200/70 tracking-wide text-center max-w-xs">
          {isLit
            ? 'May the sacred flame illuminate your path with joy, wisdom & eternal light.'
            : 'Touch the diya or press the button to kindle the sacred light.'}
        </p>
      </div>
    </div>
  );
};
