import React, { useState, useEffect } from 'react';
import { Flame, Trophy, RotateCcw, Timer, Zap, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

export const DiyaLightingGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);
  const [activeDiyas, setActiveDiyas] = useState<boolean[]>(Array(12).fill(false));
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('diwali_diya_highscore');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(1);
    setTimeLeft(30);
    setIsPlaying(true);
    setIsGameOver(false);
    setActiveDiyas(Array(12).fill(false));
    festiveAudio.playDiyaLightSound();
  };

  // Timer countdown loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Random diya spawning loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveDiyas((prev) => {
        const next = [...prev];
        const unlit = [];
        for (let i = 0; i < next.length; i++) {
          if (!next[i]) unlit.push(i);
        }
        if (unlit.length > 0) {
          const pick = unlit[Math.floor(Math.random() * unlit.length)];
          next[pick] = true;
        }
        return next;
      });
    }, 650);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleLightDiya = (index: number) => {
    if (!isPlaying) return;

    if (activeDiyas[index]) {
      festiveAudio.playDiyaLightSound();
      setScore((s) => s + 10 * combo);
      setCombo((c) => Math.min(c + 1, 5));

      setActiveDiyas((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    } else {
      // Missed or already unlit
      setCombo(1);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    festiveAudio.playFireworkSound();

    setScore((finalScore) => {
      if (finalScore > highScore) {
        setHighScore(finalScore);
        try {
          localStorage.setItem('diwali_diya_highscore', String(finalScore));
        } catch {
          // ignore
        }
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      }
      return finalScore;
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Diya Lighting Speed Challenge</span>
          </h3>
          <p className="text-xs text-amber-200/70">Kindle sacred glowing diyas within 30 seconds!</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-amber-500/30 font-mono text-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Record: {highScore}</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="p-2 rounded-xl bg-black/40 border border-amber-500/20">
          <span className="text-[10px] text-amber-400/80 uppercase font-semibold block">Time Left</span>
          <div className="text-sm sm:text-base font-bold font-mono text-amber-200 flex items-center justify-center gap-1">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span className={timeLeft <= 5 ? 'text-rose-400 animate-pulse' : ''}>{timeLeft}s</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-black/40 border border-amber-500/20">
          <span className="text-[10px] text-amber-400/80 uppercase font-semibold block">Score</span>
          <div className="text-sm sm:text-base font-bold font-mono text-yellow-300">{score}</div>
        </div>

        <div className="p-2 rounded-xl bg-black/40 border border-amber-500/20">
          <span className="text-[10px] text-amber-400/80 uppercase font-semibold block">Combo</span>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 flex items-center justify-center gap-0.5">
            <Zap className="w-3.5 h-3.5" />
            <span>x{combo}</span>
          </div>
        </div>
      </div>

      {/* 4x3 Diya Grid */}
      <div className="w-full grid grid-cols-4 gap-2.5 sm:gap-3 p-4 rounded-xl bg-[#090214] border border-amber-500/30 relative min-h-[260px] flex items-center justify-center select-none touch-manipulation">
        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center rounded-xl">
            <span className="text-4xl mb-2 animate-bounce">🪔</span>
            <h4 className="text-base font-bold text-amber-200 font-serif">Diya Lighting Challenge</h4>
            <p className="text-xs text-amber-200/70 max-w-xs mt-1">
              Tap each glowing oil lamp before it extinguishes. Build combos to achieve the highest blessing score!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-stone-950" />
              <span>Start 30s Challenge</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center rounded-xl animate-fadeIn">
            <Trophy className="w-10 h-10 text-yellow-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold text-amber-200 font-serif">Sacred Illumination Complete!</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Final Score: <span className="text-yellow-300 font-bold font-mono text-sm">{score} points</span>
            </p>
            {score >= highScore && score > 0 && (
              <span className="text-xs text-emerald-400 font-semibold mt-1">✨ New Record Achieved! ✨</span>
            )}
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        )}

        {activeDiyas.map((isLit, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleLightDiya(idx)}
            className={`h-16 sm:h-20 rounded-xl flex flex-col items-center justify-center transition-all select-none cursor-pointer border relative overflow-hidden ${
              isLit
                ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105'
                : 'bg-purple-950/20 border-amber-500/10 hover:border-amber-500/30 opacity-60'
            }`}
          >
            {isLit && (
              <div className="absolute top-1 flex flex-col items-center animate-flame">
                <div className="w-2.5 h-5 rounded-full bg-gradient-to-t from-red-600 via-orange-400 to-yellow-100 shadow-[0_0_10px_#f59e0b]" />
              </div>
            )}
            <div className={`transition-transform duration-200 mt-2 ${isLit ? 'scale-110' : 'scale-90 opacity-40'}`}>
              <span className="text-2xl sm:text-3xl filter drop-shadow">🪔</span>
            </div>
            {isLit && (
              <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider mt-0.5">
                TAP!
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
