import React, { useState, useEffect, useRef } from 'react';
import { Zap, Trophy, RotateCcw, Timer, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface BurstTarget {
  id: number;
  x: number; // %
  y: number; // %
  spawnTime: number;
  color: string;
  emoji: string;
}

const FIREWORK_TYPES = [
  { emoji: '🎆', color: 'from-amber-400 to-yellow-200' },
  { emoji: '🎇', color: 'from-pink-500 to-rose-300' },
  { emoji: '✨', color: 'from-emerald-400 to-teal-200' },
  { emoji: '💥', color: 'from-cyan-400 to-blue-300' },
];

export const FireworkReactionGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [round, setRound] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<BurstTarget | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [isWaitingForSpawn, setIsWaitingForSpawn] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const clickedThisRoundRef = useRef(false);

  const [bestTime, setBestTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('diwali_reaction_best');
      return saved ? parseInt(saved, 10) : 999;
    } catch {
      return 999;
    }
  });

  const clearPendingTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearPendingTimeout();
  }, []);

  const startGame = () => {
    clearPendingTimeout();
    setIsPlaying(true);
    setIsGameOver(false);
    setRound(0);
    setReactionTimes([]);
    setCurrentTarget(null);
    clickedThisRoundRef.current = false;
    festiveAudio.playDiyaLightSound();
    scheduleNext(1);
  };

  const scheduleNext = (nextRound: number) => {
    if (nextRound > 8) {
      endGame();
      return;
    }

    setRound(nextRound);
    setCurrentTarget(null);
    setIsWaitingForSpawn(true);
    clickedThisRoundRef.current = false;

    // Random delay between 800ms and 2000ms
    const delay = Math.floor(Math.random() * 1200) + 800;
    timeoutRef.current = window.setTimeout(() => {
      const type = FIREWORK_TYPES[Math.floor(Math.random() * FIREWORK_TYPES.length)];
      setCurrentTarget({
        id: nextRound,
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 55) + 20,
        spawnTime: performance.now(),
        color: type.color,
        emoji: type.emoji,
      });
      setIsWaitingForSpawn(false);
      festiveAudio.playSparklerSound();
    }, delay);
  };

  const handleTargetClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    // Guard against multiple clicks on the same firework
    if (clickedThisRoundRef.current || !currentTarget) return;
    clickedThisRoundRef.current = true;

    const diff = Math.round(performance.now() - currentTarget.spawnTime);
    festiveAudio.playFireworkSound();

    setReactionTimes((prev) => [...prev, diff]);
    setCurrentTarget(null);
    scheduleNext(round + 1);
  };

  const endGame = () => {
    clearPendingTimeout();
    setIsPlaying(false);
    setIsGameOver(true);
    festiveAudio.playFireworkSound();
    confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
  };

  const avgTime =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  useEffect(() => {
    if (isGameOver && avgTime > 0 && avgTime < bestTime) {
      setBestTime(avgTime);
      try {
        localStorage.setItem('diwali_reaction_best', String(avgTime));
      } catch {
        // ignore
      }
    }
  }, [isGameOver, avgTime, bestTime]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Firework Reaction Speed Challenge</span>
          </h3>
          <p className="text-xs text-amber-200/70">Tap bursting fireworks the millisecond they ignite in the sky!</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-amber-500/30 font-mono text-cyan-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Best: {bestTime < 999 ? `${bestTime}ms` : '--'}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <span className="text-amber-200">
          Firework: <span className="font-mono font-bold text-amber-300">{round} / 8</span>
        </span>
        {reactionTimes.length > 0 && (
          <div className="flex items-center gap-1 font-mono text-amber-300">
            <Timer className="w-3.5 h-3.5" />
            <span>Latest: {reactionTimes[reactionTimes.length - 1]}ms</span>
          </div>
        )}
      </div>

      {/* Sky Canvas Arena */}
      <div className="w-full h-80 sm:h-96 rounded-xl bg-gradient-to-b from-[#05010a] via-[#0e041c] to-[#040108] border-2 border-amber-500/40 relative overflow-hidden select-none">
        {/* Sky stars */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="w-1 h-1 bg-white rounded-full absolute top-8 left-16 animate-ping" />
          <div className="w-1 h-1 bg-yellow-200 rounded-full absolute top-28 right-20 animate-ping" />
          <div className="w-1.5 h-1.5 bg-amber-300 rounded-full absolute top-44 left-36" />
        </div>

        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl mb-2 animate-bounce">🎆</span>
            <h4 className="text-base font-bold text-amber-200 font-serif">Firework Reaction Challenge</h4>
            <p className="text-xs text-amber-200/70 max-w-xs mt-1 leading-relaxed">
              8 fireworks will burst unpredictably across the dark night sky. Tap them as fast as humanly possible!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-stone-950" />
              <span>Begin Reflex Test</span>
            </button>
          </div>
        )}

        {/* Waiting indicator */}
        {isPlaying && isWaitingForSpawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-serif text-cyan-300/60 uppercase tracking-widest animate-pulse">
              Watch the sky...
            </span>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <Trophy className="w-10 h-10 text-yellow-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold text-amber-200 font-serif">Reaction Benchmark</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Average Reaction Speed:{' '}
              <span className="text-cyan-300 font-bold font-mono text-base">{avgTime}ms</span>
            </p>
            <p className="text-xs text-amber-300/80 mt-2 italic max-w-xs leading-relaxed">
              {avgTime < 290
                ? '⚡ Lightning Reflexes! Incredible focus and instant agility!'
                : avgTime < 390
                ? '🌟 Brilliant speed! Perfectly synchronized with festive sparklers!'
                : '🪔 Serene composure! Steady and radiant like a sacred flame!'}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Challenge</span>
            </button>
          </div>
        )}

        {/* Burst target button */}
        {isPlaying && currentTarget && (
          <button
            type="button"
            onClick={handleTargetClick}
            onTouchStart={handleTargetClick}
            style={{
              position: 'absolute',
              left: `${currentTarget.x}%`,
              top: `${currentTarget.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="w-20 h-20 rounded-full bg-radial from-amber-300/50 via-cyan-400/20 to-transparent flex items-center justify-center animate-ping select-none cursor-pointer active:scale-125 z-10"
          >
            <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.95)]">
              {currentTarget.emoji}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
