import React, { useState, useEffect, useRef } from 'react';
import { Music, Trophy, RotateCcw, Play, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface Note {
  id: number;
  lane: number; // 0, 1, 2, 3
  y: number; // 0 to 100%
  hit: boolean;
  missed: boolean;
}

const LANES = [
  { key: 'D', label: 'D / 1', color: 'from-amber-500 to-yellow-400', symbol: '🪔', freq: 523.25 },
  { key: 'F', label: 'F / 2', color: 'from-orange-500 to-rose-400', symbol: '✨', freq: 659.25 },
  { key: 'J', label: 'J / 3', color: 'from-cyan-500 to-blue-400', symbol: '🔔', freq: 783.99 },
  { key: 'K', label: 'K / 4', color: 'from-purple-500 to-fuchsia-400', symbol: '🎆', freq: 1046.5 },
];

export const SparklerSymphonyGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [highScore, setHighScore] = useState(0);

  const notesRef = useRef<Note[]>([]);
  const isPlayingRef = useRef(false);
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('diwali_symphony_highscore');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setFeedback('GET READY!');
    notesRef.current = [];
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
          localStorage.setItem('diwali_symphony_highscore', String(currentScore));
        } catch {
          // ignore
        }
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      }
      return currentScore;
    });
  };

  const handleHitLane = (laneIndex: number) => {
    if (!isPlayingRef.current) return;

    // Play lane note frequency
    festiveAudio.playBellSound(LANES[laneIndex].freq);

    const notes = notesRef.current;
    // Target line is at y = 80 to 92
    let matched = false;

    for (let i = 0; i < notes.length; i++) {
      const n = notes[i];
      if (n.lane === laneIndex && !n.hit && !n.missed) {
        // Distance to target line (y = 85)
        const dist = Math.abs(n.y - 85);
        if (dist <= 12) {
          n.hit = true;
          matched = true;

          const isPerfect = dist <= 5;
          const points = isPerfect ? 50 : 25;

          setFeedback(isPerfect ? 'PERFECT! ✨' : 'GREAT! 🌟');
          setScore((s) => s + points * (Math.floor(combo / 5) + 1));
          setCombo((c) => {
            const next = c + 1;
            setMaxCombo((m) => Math.max(m, next));
            return next;
          });
          break;
        }
      }
    }

    if (!matched) {
      setCombo(0);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayingRef.current) return;
      const key = e.key.toUpperCase();
      if (key === 'D' || key === '1') handleHitLane(0);
      else if (key === 'F' || key === '2') handleHitLane(1);
      else if (key === 'J' || key === '3') handleHitLane(2);
      else if (key === 'K' || key === '4') handleHitLane(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rhythm beat loop (generates 40 rhythmic notes then ends)
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    let lastSpawn = Date.now();
    let totalSpawned = 0;
    const maxNotes = 45;

    const loop = () => {
      if (!isPlayingRef.current) return;

      const now = Date.now();

      // Spawn note every 580ms
      if (now - lastSpawn > 580 && totalSpawned < maxNotes) {
        lastSpawn = now;
        totalSpawned++;
        const lane = Math.floor(Math.random() * 4);
        notesRef.current.push({
          id: totalSpawned,
          lane,
          y: 0,
          hit: false,
          missed: false,
        });
      }

      // Move notes down
      const current = notesRef.current;
      const remaining: Note[] = [];
      let allFinished = totalSpawned >= maxNotes;

      for (let i = 0; i < current.length; i++) {
        const n = current[i];
        if (!n.hit) {
          n.y += 1.35;
          if (n.y > 96 && !n.missed) {
            n.missed = true;
            setCombo(0);
            setFeedback('MISS! 💨');
          }
        }

        if (n.y <= 100 && !n.hit) {
          remaining.push(n);
          allFinished = false;
        }
      }

      notesRef.current = remaining;
      setRenderTrigger((r) => r + 1);

      if (allFinished && remaining.length === 0) {
        endGame();
        return;
      }

      if (isPlayingRef.current) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Sparkler Rhythm Symphony</span>
          </h3>
          <p className="text-xs text-amber-200/70">Tap the 4 lanes in rhythm with the festive temple chimes!</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-amber-500/30 font-mono text-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Best: {highScore}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>Combo: x{combo}</span>
        </div>

        {feedback && (
          <div className="text-xs font-bold font-serif text-amber-300 animate-pulse">
            {feedback}
          </div>
        )}

        <div className="text-sm font-bold font-mono text-yellow-300">
          Score: {score}
        </div>
      </div>

      {/* 4-Lane Rhythm Track */}
      <div className="w-full h-80 sm:h-96 rounded-xl bg-gradient-to-b from-[#080112] via-[#0f0322] to-[#0a0118] border-2 border-amber-400/50 relative overflow-hidden select-none touch-none shadow-2xl">
        {/* Lane dividers */}
        <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
          <div className="border-r border-amber-500/15" />
          <div className="border-r border-amber-500/15" />
          <div className="border-r border-amber-500/15" />
          <div className="" />
        </div>

        {/* Target Strike Line (at y = 85%) */}
        <div className="absolute left-0 right-0 top-[85%] -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_0_15px_#f59e0b] z-10 pointer-events-none flex items-center justify-between px-2">
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          <span className="text-[9px] uppercase font-bold text-amber-300/80 tracking-widest bg-black/70 px-2 rounded-full">
            STRIKE ZONE
          </span>
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
        </div>

        {/* Start Game Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl mb-2 animate-bounce">🎶</span>
            <h4 className="text-base font-bold text-amber-200 font-serif">Sparkler Rhythm Symphony</h4>
            <p className="text-xs text-amber-200/70 max-w-xs mt-1 leading-relaxed">
              Musical sparkler notes fall along 4 festive lanes. Strike each note as it crosses the golden strike line!
              <br />
              <span className="text-amber-300">Keys: D, F, J, K or tap on-screen lane buttons!</span>
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-stone-950" />
              <span>Start Rhythm Concert</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
            <Trophy className="w-10 h-10 text-yellow-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold text-amber-200 font-serif">Concert Complete!</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Final Symphony Score: <span className="text-yellow-300 font-bold font-mono text-sm">{score} points</span>
            </p>
            <p className="text-[11px] text-amber-300/80 mt-1">
              Max Combo Streak: <span className="font-bold text-emerald-400 font-mono">x{maxCombo}</span>
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
              <span>Play Again</span>
            </button>
          </div>
        )}

        {/* Falling Notes */}
        {isPlaying &&
          notesRef.current.map((note) => {
            if (note.hit) return null;
            const lane = LANES[note.lane];
            const leftPct = (note.lane * 25) + 12.5;

            return (
              <div
                key={note.id}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: `${note.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border border-amber-300/80 select-none bg-gradient-to-tr ${lane.color} ${
                  note.missed ? 'opacity-30 scale-75' : 'animate-pulse scale-100'
                }`}
              >
                <span>{lane.symbol}</span>
              </div>
            );
          })}
      </div>

      {/* 4 Interactive Lane Tap Buttons */}
      <div className="w-full grid grid-cols-4 gap-2 mt-3 select-none">
        {LANES.map((lane, index) => (
          <button
            key={index}
            type="button"
            onPointerDown={() => handleHitLane(index)}
            className={`py-3.5 rounded-xl border border-amber-500/40 bg-[#120524] hover:bg-purple-900 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer shadow-md`}
          >
            <span className="text-xl sm:text-2xl filter drop-shadow">{lane.symbol}</span>
            <span className="text-[10px] font-mono font-bold text-amber-300 mt-0.5">{lane.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
