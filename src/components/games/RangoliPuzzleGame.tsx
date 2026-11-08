import React, { useState, useEffect } from 'react';
import { Puzzle, Trophy, RotateCcw, Timer, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

// 9 tile motifs of a sacred peacock rangoli
const RANGOLI_TILES = [
  { id: 0, label: 'North Petals', symbol: '🌸', color: 'from-pink-600 to-rose-700', border: 'border-pink-400' },
  { id: 1, label: 'Golden Diya', symbol: '🪔', color: 'from-amber-600 to-yellow-600', border: 'border-amber-400' },
  { id: 2, label: 'Marigold Arch', symbol: '🌼', color: 'from-orange-600 to-amber-700', border: 'border-orange-400' },
  { id: 3, label: 'Peacock Wing', symbol: '🦚', color: 'from-teal-600 to-cyan-700', border: 'border-teal-400' },
  { id: 4, label: 'Sacred Lotus Heart', symbol: '🪷', color: 'from-fuchsia-600 to-purple-700', border: 'border-fuchsia-400' },
  { id: 5, label: 'Aura Swirl', symbol: '✨', color: 'from-yellow-500 to-amber-600', border: 'border-yellow-300' },
  { id: 6, label: 'Temple Bell Base', symbol: '🔔', color: 'from-amber-700 to-yellow-800', border: 'border-amber-400' },
  { id: 7, label: 'Auspicious Kalash', symbol: '🏺', color: 'from-orange-700 to-red-800', border: 'border-orange-500' },
  { id: 8, label: 'South Petals', symbol: '🌺', color: 'from-rose-600 to-pink-700', border: 'border-rose-400' },
];

export const RangoliPuzzleGame: React.FC = () => {
  // Current board state: array of 9 tile IDs in slots 0..8
  const [board, setBoard] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);

  const initGame = () => {
    // Generate scrambled permutation
    const shuffled = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let isSame = true;
    while (isSame) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Ensure it's not already solved
      isSame = shuffled.every((val, i) => val === i);
    }

    setBoard(shuffled);
    setSelectedSlot(null);
    setDraggedSlot(null);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsWon(false);
    setShowGuide(false);
    festiveAudio.playDiyaLightSound();
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer loop
  useEffect(() => {
    if (!isPlaying || isWon) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  // Swap two slots
  const swapSlots = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const nextBoard = [...board];
    [nextBoard[fromIndex], nextBoard[toIndex]] = [nextBoard[toIndex], nextBoard[fromIndex]];

    setBoard(nextBoard);
    setMoves((m) => m + 1);
    setSelectedSlot(null);
    setDraggedSlot(null);

    festiveAudio.playSparklerSound();

    // Check if solved
    const solved = nextBoard.every((val, i) => val === i);
    if (solved) {
      setIsWon(true);
      festiveAudio.playFireworkSound();
      confetti({ particleCount: 120, spread: 85, origin: { y: 0.6 } });
    }
  };

  // Tap-to-Swap for touchscreens & mouse clicks
  const handleSlotClick = (index: number) => {
    if (!isPlaying || isWon) return;

    if (selectedSlot === null) {
      setSelectedSlot(index);
      festiveAudio.playDiyaLightSound();
    } else {
      swapSlots(selectedSlot, index);
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    setDraggedSlot(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = sourceIndexStr ? parseInt(sourceIndexStr, 10) : draggedSlot;
    if (sourceIndex !== null && !isNaN(sourceIndex)) {
      swapSlots(sourceIndex, targetIndex);
    }
  };

  // Calculate score
  const score = Math.max(100, 1000 - moves * 15 - timer * 3);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Puzzle className="w-4 h-4 text-pink-400" />
            <span>Peacock Rangoli Puzzle</span>
          </h3>
          <p className="text-xs text-amber-200/70">
            Drag or tap any 2 tiles to swap and restore the sacred mandala!
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Toggle Guide"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showGuide ? 'Hide Guide' : 'Guide'}</span>
          </button>
          <button
            type="button"
            onClick={initGame}
            className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
            title="Restart Puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-amber-200">
            Swaps: <span className="font-mono font-bold text-amber-300">{moves}</span>
          </span>
          <span className="text-amber-200">
            Score: <span className="font-mono font-bold text-yellow-300">{score}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-lg border border-amber-500/30 font-mono text-amber-300 font-bold">
          <Timer className="w-3.5 h-3.5" />
          <span>{timer}s</span>
        </div>
      </div>

      {/* Reference Guide Visual */}
      {showGuide && (
        <div className="w-full p-3 mb-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-center animate-fadeIn">
          <span className="text-[11px] font-bold text-amber-300 uppercase block mb-1">
            Target Completed Rangoli Mandala Order:
          </span>
          <div className="grid grid-cols-3 gap-1.5 max-w-[240px] mx-auto text-xs">
            {RANGOLI_TILES.map((t) => (
              <div key={t.id} className="p-1.5 rounded bg-black/50 border border-amber-500/30 flex items-center justify-center gap-1">
                <span>{t.symbol}</span>
                <span className="text-[10px] font-mono text-amber-300">{t.id + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3x3 Puzzle Arena */}
      <div className="w-72 sm:w-80 h-72 sm:h-80 grid grid-cols-3 gap-2 sm:gap-2.5 p-3 bg-[#0a0214] border-2 border-amber-400/60 rounded-2xl relative shadow-2xl select-none touch-manipulation">
        {/* Win Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 text-center rounded-2xl animate-fadeIn">
            <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold text-amber-200 font-serif">Sacred Rangoli Restored!</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Completed in <span className="text-yellow-300 font-bold font-mono">{moves} swaps</span> ({timer}s) with{' '}
              <span className="text-yellow-300 font-bold font-mono">{score} points</span>!
            </p>
            <button
              type="button"
              onClick={initGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
              <span>Solve Another Rangoli</span>
            </button>
          </div>
        )}

        {board.map((tileId, slotIndex) => {
          const tile = RANGOLI_TILES[tileId];
          const isSelected = selectedSlot === slotIndex;
          const isCorrect = tileId === slotIndex;

          return (
            <div
              key={slotIndex}
              draggable
              onDragStart={(e) => handleDragStart(e, slotIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slotIndex)}
              onClick={() => handleSlotClick(slotIndex)}
              className={`rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-pointer select-none border-2 relative overflow-hidden ${
                isSelected
                  ? 'ring-4 ring-amber-300 scale-105 z-10 shadow-2xl border-white bg-purple-900'
                  : isCorrect
                  ? 'bg-gradient-to-br from-purple-950 to-amber-950/80 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-[#15062a] border-amber-500/30 hover:border-amber-400/60'
              }`}
            >
              {/* Correct slot indicator badge */}
              {isCorrect && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
              )}

              {/* Slot index tag */}
              <div className="absolute top-1 left-1.5 text-[9px] font-mono text-amber-300/70">
                #{slotIndex + 1}
              </div>

              {/* Symbol */}
              <span className="text-3xl sm:text-4xl filter drop-shadow mt-1">
                {tile.symbol}
              </span>

              {/* Tile label */}
              <span className="text-[10px] text-amber-200/90 font-medium truncate max-w-full mt-1">
                {tile.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-amber-300/70 mt-3 text-center">
        💡 Tip: Tap one tile to select it, then tap another to swap their positions!
      </p>
    </div>
  );
};
