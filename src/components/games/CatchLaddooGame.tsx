import React, { useState, useEffect, useRef } from 'react';
import { Cookie, Trophy, RotateCcw, Heart, Play, Timer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface FallingItem {
  id: number;
  x: number; // percentage (8 to 92)
  y: number; // percentage (0 to 100)
  type: 'laddoo' | 'jalebi' | 'kaju' | 'diya' | 'bomb';
  speed: number;
  rotation: number;
}

export const CatchLaddooGame: React.FC = () => {
  const [basketX, setBasketX] = useState(50); // percentage 8 to 92
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<FallingItem[]>([]);
  const isPlayingRef = useRef(false);
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('diwali_laddoo_highscore');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(45);
    setBasketX(50);
    itemsRef.current = [];
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsGameOver(false);
    festiveAudio.playDiyaLightSound();
  };

  const endGame = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsGameOver(true);
    festiveAudio.playFireworkSound();

    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        try {
          localStorage.setItem('diwali_laddoo_highscore', String(currentScore));
        } catch {
          // ignore
        }
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      }
      return currentScore;
    });
  };

  // 45s Countdown Timer
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayingRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX((prev) => Math.max(10, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX((prev) => Math.min(90, prev + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pointer / Touch move tracking across the canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, pct)));
  };

  // Main physics loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    let lastSpawn = Date.now();
    let counter = 0;

    const loop = () => {
      if (!isPlayingRef.current) return;

      const now = Date.now();

      // Spawn falling sweets every 600ms
      if (now - lastSpawn > 600) {
        lastSpawn = now;
        const rand = Math.random();
        let type: FallingItem['type'] = 'laddoo';
        if (rand < 0.22) type = 'bomb';
        else if (rand < 0.45) type = 'jalebi';
        else if (rand < 0.70) type = 'kaju';
        else if (rand > 0.92) type = 'diya';

        itemsRef.current.push({
          id: counter++,
          x: Math.floor(Math.random() * 80) + 10,
          y: 0,
          type,
          speed: 1.4 + Math.random() * 0.9,
          rotation: Math.floor(Math.random() * 360),
        });
      }

      // Move & detect collision with basket
      const current = itemsRef.current;
      const remaining: FallingItem[] = [];

      for (let i = 0; i < current.length; i++) {
        const item = current[i];
        item.y += item.speed;
        item.rotation += 2;

        // Basket collision box: y between 82% and 92%
        if (item.y >= 82 && item.y <= 92) {
          const dist = Math.abs(item.x - basketX);
          if (dist < 13) {
            // Caught by player!
            if (item.type === 'bomb') {
              festiveAudio.playFireworkSound();
              setLives((l) => {
                const n = l - 1;
                if (n <= 0) endGame();
                return Math.max(0, n);
              });
            } else if (item.type === 'diya') {
              festiveAudio.playDiyaLightSound();
              setScore((s) => s + 50);
              setLives((l) => Math.min(3, l + 1));
            } else {
              festiveAudio.playSparklerSound();
              const points = item.type === 'kaju' ? 30 : item.type === 'jalebi' ? 20 : 10;
              setScore((s) => s + points);
            }
            continue; // consumed
          }
        }

        if (item.y <= 100) {
          remaining.push(item);
        }
      }

      itemsRef.current = remaining;
      setRenderTrigger((r) => r + 1);

      if (isPlayingRef.current) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, basketX]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Cookie className="w-4 h-4 text-yellow-400" />
            <span>Catch the Festive Sweets!</span>
          </h3>
          <p className="text-xs text-amber-200/70">Catch falling Laddoos and Jalebis in your thali; dodge bombs!</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-amber-500/30 font-mono text-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Record: {highScore}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${i < lives ? 'text-rose-500 fill-rose-500' : 'text-stone-600'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 font-mono font-bold text-amber-200">
          <Timer className="w-3.5 h-3.5 text-amber-400" />
          <span className={timeLeft <= 8 ? 'text-rose-400 animate-pulse' : ''}>{timeLeft}s</span>
        </div>

        <div className="text-sm font-bold font-mono text-yellow-300">
          Score: {score}
        </div>
      </div>

      {/* Playfield Canvas */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="w-full h-80 sm:h-96 rounded-xl bg-gradient-to-b from-[#090214] via-[#100424] to-[#0d0219] border-2 border-amber-400/50 relative overflow-hidden select-none touch-none shadow-inner cursor-ew-resize"
      >
        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl mb-2 animate-bounce">🍬</span>
            <h4 className="text-base font-bold text-amber-200 font-serif">Diwali Sweet Catcher</h4>
            <p className="text-xs text-amber-200/70 max-w-xs mt-1 leading-relaxed">
              Move your thali horizontally to catch golden sweets:
              <br />
              <span className="text-amber-300 font-semibold">Laddoo (10pts) · Jalebi (20pts) · Kaju Katli (30pts)</span>
              <br />
              Dodge firecracker bombs (💣)!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-stone-950" />
              <span>Start Catching Sweets</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <Trophy className="w-10 h-10 text-yellow-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold text-amber-200 font-serif">Sweet Feast Complete!</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Final Score: <span className="text-yellow-300 font-bold font-mono text-sm">{score} points</span>
            </p>
            {score >= highScore && score > 0 && (
              <span className="text-xs text-emerald-400 font-semibold mt-1">✨ New High Record! ✨</span>
            )}
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Catch Again</span>
            </button>
          </div>
        )}

        {/* Falling sweets & crackers */}
        {isPlaying &&
          itemsRef.current.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              }}
              className="text-2xl sm:text-3xl pointer-events-none select-none filter drop-shadow"
            >
              {item.type === 'laddoo' && '🟡'}
              {item.type === 'jalebi' && '🥨'}
              {item.type === 'kaju' && '💎'}
              {item.type === 'diya' && '🪔'}
              {item.type === 'bomb' && '💣'}
            </div>
          ))}

        {/* Player Brass Thali / Basket */}
        <div
          style={{
            position: 'absolute',
            left: `${basketX}%`,
            bottom: '12px',
            transform: 'translateX(-50%)',
          }}
          className="w-24 sm:w-28 h-8 rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border-2 border-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.6)] flex items-center justify-center select-none"
        >
          <span className="text-[11px] font-serif font-black text-amber-950 tracking-wider">
            ✦ THALI ✦
          </span>
        </div>
      </div>

      {/* Touch Left/Right helper buttons for mobile */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 sm:hidden">
        <button
          type="button"
          onClick={() => setBasketX((p) => Math.max(10, p - 10))}
          className="py-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-300 text-xs font-bold active:bg-amber-500/30"
        >
          ← Slide Left
        </button>
        <button
          type="button"
          onClick={() => setBasketX((p) => Math.min(90, p + 10))}
          className="py-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-300 text-xs font-bold active:bg-amber-500/30"
        >
          Slide Right →
        </button>
      </div>
    </div>
  );
};
