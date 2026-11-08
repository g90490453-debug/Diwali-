import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  Gift,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveDiya } from './InteractiveDiya';
import { AnimatedRangoli } from './AnimatedRangoli';
import { FestiveToran } from './FestiveToran';
import { DesignThemeId, DIWALI_DESIGNS, getThemeById } from '../types/theme';
import { festiveAudio } from '../utils/audio';

interface DesignCardProps {
  recipientName: string;
  senderName?: string;
  customMessage?: string;
  designId?: DesignThemeId;
  isRecipient?: boolean;
  onOpenGames?: () => void;
  onBackToStudio?: () => void;
  currentUrl?: string;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  recipientName,
  senderName,
  customMessage,
  designId = 'royal',
  isRecipient = false,
  onOpenGames,
  onBackToStudio,
  currentUrl,
}) => {
  // Envelope opening state: recipient starts with the sealed envelope; sender preview starts unsealed
  const [isUnsealed, setIsUnsealed] = useState(!isRecipient);
  const [isDiyaLit, setIsDiyaLit] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(festiveAudio.isMuted);

  const theme = getThemeById(designId);

  const greetingUrl =
    currentUrl ||
    (typeof window !== 'undefined'
      ? (() => {
          const params = new URLSearchParams();
          params.set('name', recipientName);
          params.set('theme', theme.id);
          if (senderName && senderName.trim()) params.set('from', senderName.trim());
          if (customMessage && customMessage.trim()) params.set('msg', customMessage.trim());
          return `${window.location.origin}/wish?${params.toString()}`;
        })()
      : '');

  const messageText = customMessage?.trim() || theme.defaultMessage;

  // Sync audio mute state
  useEffect(() => {
    const unsub = festiveAudio.subscribe((muted) => setIsMuted(muted));
    return unsub;
  }, []);

  const triggerCelebration = () => {
    festiveAudio.playFireworkSound();

    // Multistage colorful confetti burst tailored to theme
    const count = 160;
    const defaults = { origin: { y: 0.65 } };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    if (theme.particleType === 'neon') {
      fire(0.3, { spread: 60, colors: ['#06b6d4', '#ec4899', '#a855f7'] });
      fire(0.3, { spread: 100, colors: ['#3b82f6', '#f43f5e', '#ffffff'] });
    } else if (theme.particleType === 'marigold') {
      fire(0.4, { spread: 70, colors: ['#ea580c', '#f59e0b', '#fbbf24'] });
      fire(0.3, { spread: 90, colors: ['#10b981', '#f97316'] });
    } else if (theme.particleType === 'lotus') {
      fire(0.35, { spread: 80, colors: ['#ec4899', '#fde047', '#fbbf24'] });
      fire(0.35, { spread: 110, colors: ['#f43f5e', '#ffffff'] });
    } else {
      // Golden Royal default
      fire(0.25, { spread: 30, startVelocity: 55, colors: ['#f59e0b', '#fbbf24', '#fde047'] });
      fire(0.2, { spread: 60, colors: ['#ec4899', '#f43f5e', '#a855f7'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#10b981', '#06b6d4', '#eab308'] });
      fire(0.2, { spread: 120, startVelocity: 40, colors: ['#ffffff', '#fbbf24'] });
    }
  };

  const handleUnsealEnvelope = () => {
    festiveAudio.playDiyaLightSound();
    setIsUnsealed(true);
    triggerCelebration();

    // Automatically trigger fun zone notification / expansion
    if (onOpenGames) {
      setTimeout(() => {
        onOpenGames();
      }, 1500);
    }
  };

  const handleCopy = async () => {
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(greetingUrl);
        success = true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = greetingUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = greetingUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `✨ *Happy Diwali, ${recipientName}!* 🪔\n\n"${messageText}"\n\n🌟 *Open your special ${theme.name} card:*\n👉 ${greetingUrl}\n\n${
        senderName ? `With warmest blessings,\n- ${senderName}` : 'Wishing you & your family a joyful Diwali!'
      }`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between pb-12 pt-0 px-4 overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Theme Full-Screen Backdrop Image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={theme.backdrop}
          alt={theme.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.72] contrast-105"
        />
        {/* Subtle Theme Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090212]/80 via-[#0d041c]/65 to-[#06010e]/95" />
      </div>

      {/* 2. Theme-Specific Visual Animated Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {theme.particles.concat(theme.particles).slice(0, 10).map((symbol, idx) => (
          <span
            key={idx}
            className="absolute text-xl sm:text-3xl animate-float-slow opacity-65 select-none"
            style={{
              left: `${5 + idx * 10}%`,
              top: `${12 + (idx % 4) * 22}%`,
              animationDuration: `${5 + (idx % 4) * 2}s`,
              animationDelay: `${idx * 0.4}s`,
            }}
          >
            {symbol}
          </span>
        ))}
      </div>

      {/* 3. Top Decorative Toran Garland */}
      <div className="relative z-10 w-full">
        <FestiveToran />
      </div>

      {/* 4. Top Utility Navigation Bar */}
      <header className="relative z-20 w-full max-w-4xl flex items-center justify-between px-3.5 py-2 mt-1 rounded-xl bg-black/50 backdrop-blur-md border border-amber-500/25 text-amber-200 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-serif tracking-widest uppercase text-[11px] text-amber-300 font-bold">
            {theme.name}
          </span>
          <span className="text-[10px] text-amber-400/60 hidden sm:inline">
            ({theme.taglineHindi})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={() => festiveAudio.toggleMute()}
            className="p-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all flex items-center gap-1 cursor-pointer"
            title={isMuted ? 'Unmute Festive Music & Sounds' : 'Mute Sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
            <span className="text-[10px] hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {/* Back to Studio button: ONLY visible to Sender (isRecipient === false) */}
          {!isRecipient && onBackToStudio && (
            <button
              type="button"
              onClick={onBackToStudio}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-[11px] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Studio</span>
            </button>
          )}

          {/* View-Only Badge for Recipient */}
          {isRecipient && (
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
              <span>Personalised Greeting</span>
            </div>
          )}
        </div>
      </header>

      {/* 5. Envelope Welcome Screen vs Unsealed Greeting */}
      {!isUnsealed ? (
        /* STEP 1-3: Sealed Envelope Welcome Experience */
        <main className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center my-auto py-12 animate-fadeIn">
          {/* Ornate Sealed Royal Card Envelope */}
          <div className="w-full p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#140628]/95 via-[#1a0833]/90 to-[#0e021c]/95 border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-2xl relative overflow-hidden flex flex-col items-center">
            {/* Top golden ribbon embellishment */}
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6" />

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-2xl flex items-center justify-center mb-5 animate-pulse">
              <div className="w-full h-full bg-[#120424] rounded-full flex items-center justify-center border border-amber-300/40">
                <Gift className="w-9 h-9 text-amber-300 animate-bounce" />
              </div>
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold font-serif mb-1">
              Shubh Deepavali Blessing
            </span>

            <h1
              className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-serif gold-shimmer-text mt-1 leading-tight"
              style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            >
              A Festive Surprise for {recipientName}!
            </h1>

            {senderName && (
              <p className="mt-2 text-sm text-amber-200/80 font-serif">
                Sent with warm affection from <span className="text-amber-300 font-bold">{senderName}</span>
              </p>
            )}

            <p className="text-xs text-amber-200/70 max-w-xs mt-3 leading-relaxed">
              Touch the royal seal to open your interactive greeting card with animated lights, blessings and games.
            </p>

            {/* Unseal Action Button */}
            <button
              type="button"
              onClick={handleUnsealEnvelope}
              className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-extrabold text-sm tracking-wide shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-amber-300/60"
            >
              <Flame className="w-5 h-5 fill-stone-950" />
              <span>Break Royal Seal & Open Greeting ✨</span>
            </button>
          </div>
        </main>
      ) : (
        /* STEP 4-8: The Full Animated Unsealed Greeting Stage */
        <main className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center my-6 animate-fadeIn">
          {/* Sacred Sanskrit Epigraph */}
          <div className="mb-2">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-300/90 font-serif font-bold">
              Tamaso Mā Jyotirgamaya · Shubh Deepavali
            </span>
          </div>

          {/* Personalized Main Headline with Reveal Animation */}
          <div className="relative py-2 px-4 max-w-xl">
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight font-serif gold-shimmer-text drop-shadow-[0_4px_24px_rgba(245,158,11,0.5)]"
              style={{ fontFamily: theme.fontStyle }}
            >
              Happy Diwali,{' '}
              <span className="underline decoration-amber-400 decoration-wavy underline-offset-8">
                {recipientName}
              </span>
              ! 🪔
            </h1>

            {senderName && (
              <p className="mt-3 text-sm sm:text-base text-amber-200/90 font-serif">
                With affectionate festive blessings from <span className="text-amber-300 font-bold">{senderName}</span>
              </p>
            )}
          </div>

          {/* Centerpiece Interactive Glowing Diya with Rotating Rangoli Background */}
          <div className="relative w-full flex items-center justify-center my-3">
            <div className="absolute w-80 h-80 rounded-full bg-radial from-amber-500/25 via-orange-500/15 to-transparent blur-3xl pointer-events-none" />
            
            {/* Subtle rotating rangoli mandala behind diya */}
            <div className="absolute opacity-40 pointer-events-none scale-90 sm:scale-100">
              <AnimatedRangoli size={360} isLit={isDiyaLit} />
            </div>

            <div className="relative z-20">
              <InteractiveDiya
                isLit={isDiyaLit}
                onToggleLight={() => setIsDiyaLit(!isDiyaLit)}
                recipientName={recipientName}
              />
            </div>
          </div>

          {/* Heartfelt Blessing Glassmorphic Card Box */}
          <div
            className={`w-full max-w-xl mt-4 p-6 sm:p-8 rounded-2xl festive-card-glass backdrop-blur-xl shadow-2xl relative overflow-hidden text-center border ${theme.cardGlow}`}
          >
            <span className="absolute top-2.5 left-3 text-amber-400/80 text-sm">🪔</span>
            <span className="absolute top-2.5 right-3 text-amber-400/80 text-sm">✨</span>
            <span className="absolute bottom-2.5 left-3 text-amber-400/80 text-sm">✨</span>
            <span className="absolute bottom-2.5 right-3 text-amber-400/80 text-sm">🪔</span>

            <blockquote className="text-base sm:text-lg text-amber-50 leading-relaxed font-serif font-medium italic">
              "{messageText}"
            </blockquote>

            <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4" />

            <p className="text-xs text-amber-300/80 font-serif tracking-widest uppercase">
              Light · Prosperity · Wisdom · Endless Bliss
            </p>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full max-w-lg">
            <button
              type="button"
              onClick={triggerCelebration}
              className="flex-1 min-w-[170px] px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span className="whitespace-nowrap">Launch Fireworks! 🎆</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-4 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-400/40 text-emerald-100 font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="whitespace-nowrap">Share WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-3.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-amber-500/40 text-amber-200 font-medium text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="whitespace-nowrap text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span className="whitespace-nowrap">Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={triggerCelebration}
              className="px-3.5 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Replay Celebration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          </div>

          {/* STEP 9-10: Automatically Expanded Fun Zone Anchor & Scroll Prompt */}
          <div className="w-full max-w-xl mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-purple-950/70 border border-amber-500/30 flex items-center justify-between gap-3 text-left">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-1.5">
                <span>🎮 Play 10 Diwali Festive Games Below</span>
              </h4>
              <p className="text-[11px] text-amber-300/70 mt-0.5">
                Diya Lighting, Memory Match, Quiz, Rangoli Puzzle, Laddoo Catcher, Fireworks, Palace Treasure, Rangoli Builder, Sparklers & Sweets Chef!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('fun-zone');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Play Games</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        </main>
      )}
    </div>
  );
};
