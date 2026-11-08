import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Gamepad2, Eye, Menu, X, BookOpen, Palette, PenTool } from 'lucide-react';
import { festiveAudio } from '../utils/audio';

interface NavbarProps {
  onOpenPreview?: () => void;
  onGoHome?: () => void;
  isCardView: boolean;
  isRecipient?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreview, onGoHome, isCardView, isRecipient = false }) => {
  const [isMuted, setIsMuted] = useState(festiveAudio.isMuted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = festiveAudio.subscribe((muted) => setIsMuted(muted));
    return unsub;
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (isCardView && onGoHome && !isRecipient) {
      onGoHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#090212]/90 backdrop-blur-md border-b border-amber-500/30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => {
            if (!isRecipient && onGoHome) {
              onGoHome();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d041c] rounded-full flex items-center justify-center">
              <span className="text-base">🪔</span>
            </div>
          </div>
          <div>
            <span
              className="text-sm sm:text-base font-black tracking-tight font-serif gold-shimmer-text block"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Shubh Deepavali
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-300/80 -mt-0.5 block font-medium">
              {isRecipient ? 'Personalised Greeting' : 'Greeting Studio'}
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-5 text-xs font-medium text-amber-200/80">
          {!isRecipient && (
            <>
              <button
                type="button"
                onClick={() => handleScrollTo('create-wishes')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                <span>Create Wish</span>
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('choose-theme')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>11 Themes</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => handleScrollTo('fun-zone')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>10 Festive Games</span>
          </button>

          <button
            type="button"
            onClick={() => handleScrollTo('about')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>About Deepavali</span>
          </button>
        </div>

        {/* Actions (Sound, Preview Card, Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={() => festiveAudio.toggleMute()}
            className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-amber-500/30 text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer"
            title={isMuted ? 'Unmute Festive Music & Sounds' : 'Mute Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            <span className="text-[11px] hidden lg:inline font-medium">{isMuted ? 'Muted' : 'Music On'}</span>
          </button>

          {/* Sender Preview Card button */}
          {!isCardView && !isRecipient && onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Card</span>
            </button>
          )}

          {/* Sender Return to Studio button */}
          {isCardView && !isRecipient && onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Home</span>
            </button>
          )}

          {/* Recipient view indicator */}
          {isRecipient && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-amber-400/30 text-amber-300 text-xs font-serif font-bold">
              <span>Shubh Deepavali 🪔</span>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#0e041c] border-b border-amber-500/30 space-y-2 text-xs text-amber-200 animate-fadeIn">
          {!isRecipient && (
            <>
              <button
                type="button"
                onClick={() => handleScrollTo('create-wishes')}
                className="w-full p-2.5 rounded-lg bg-black/30 text-left flex items-center gap-2"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                <span>Create Wish Link</span>
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('choose-theme')}
                className="w-full p-2.5 rounded-lg bg-black/30 text-left flex items-center gap-2"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>11 Festive Themes</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => handleScrollTo('fun-zone')}
            className="w-full p-2.5 rounded-lg bg-black/30 text-left flex items-center gap-2"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>10 Festive Games</span>
          </button>

          <button
            type="button"
            onClick={() => handleScrollTo('about')}
            className="w-full p-2.5 rounded-lg bg-black/30 text-left flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>About Deepavali</span>
          </button>
        </div>
      )}
    </nav>
  );
};
