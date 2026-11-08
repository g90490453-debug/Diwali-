import React from 'react';
import { Palette, Eye, Check, Sparkles } from 'lucide-react';
import { DesignThemeId, DIWALI_DESIGNS } from '../types/theme';
import { festiveAudio } from '../utils/audio';

interface DesignSelectorProps {
  selectedDesignId: DesignThemeId;
  onSelectDesign: (id: DesignThemeId) => void;
  onLivePreviewDesign: (id: DesignThemeId) => void;
}

export const DesignSelector: React.FC<DesignSelectorProps> = ({
  selectedDesignId,
  onSelectDesign,
  onLivePreviewDesign,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold font-serif text-amber-100">
              Select Diwali Visual Theme (11 Available)
            </h2>
          </div>
          <p className="text-xs text-amber-200/70 mt-0.5">
            Choose any theme below. The live preview and generated link will immediately update.
          </p>
        </div>

        <div className="text-[11px] text-amber-400/90 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Tap eye for full-screen preview</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {DIWALI_DESIGNS.map((design, index) => {
          const isSelected = selectedDesignId === design.id || (design.id === 'royal' && selectedDesignId === 'classic');
          return (
            <div
              key={design.id}
              onClick={() => {
                onSelectDesign(design.id);
                festiveAudio.playDiyaLightSound();
              }}
              className={`group relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col text-left ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/70 shadow-[0_0_22px_rgba(245,158,11,0.45)] scale-[1.02] bg-purple-950/80'
                  : 'border-amber-500/25 hover:border-amber-400/50 hover:shadow-lg bg-[#0d031c]/80'
              }`}
            >
              {/* Thumbnail image with dark gradient */}
              <div className="relative w-full h-24 overflow-hidden bg-black/60">
                <img
                  src={design.thumbnail}
                  alt={design.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                {/* Theme number index */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-amber-300 border border-amber-500/30">
                  #{index + 1}
                </div>

                {/* Selected Checkmark badge */}
                {isSelected && (
                  <div className="absolute top-1.5 right-10 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 flex items-center justify-center shadow-lg animate-fadeIn">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Full Screen Live Preview Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLivePreviewDesign(design.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-amber-400 hover:text-stone-950 text-amber-300 transition-colors border border-amber-400/30"
                  title={`Full Screen Preview of ${design.name}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Small category tag */}
                <div className="absolute bottom-1 left-1.5 text-[9px] font-semibold text-amber-300 uppercase tracking-wider truncate max-w-[90%]">
                  {design.badge}
                </div>
              </div>

              {/* Title & info */}
              <div className="p-2 flex-1 flex flex-col justify-between bg-[#0e041c]">
                <div>
                  <h4 className="text-xs font-bold text-amber-100 group-hover:text-amber-300 transition-colors truncate">
                    {design.name}
                  </h4>
                  <p className="text-[10px] text-amber-200/60 line-clamp-1 mt-0.5">
                    {design.taglineHindi}
                  </p>
                </div>

                <div className="mt-1 pt-1 border-t border-amber-500/15 flex items-center justify-between text-[10px]">
                  <span className={isSelected ? 'text-amber-300 font-bold' : 'text-amber-400/60'}>
                    {isSelected ? '✓ Selected' : 'Choose'}
                  </span>
                  <span className="text-[10px] opacity-70">{design.particles[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
