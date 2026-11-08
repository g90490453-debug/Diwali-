import React, { useState, useEffect } from 'react';
import { Trophy, Timer, RotateCcw, Search, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface HiddenItem {
  id: string;
  name: string;
  emoji: string;
  x: number; // percentage left
  y: number; // percentage top
  found: boolean;
  clue: string;
}

const INITIAL_ITEMS: Omit<HiddenItem, 'found'>[] = [
  { id: 'diya', name: 'Golden Diya', emoji: '🪔', x: 28, y: 72, clue: 'Near the center temple doorstep' },
  { id: 'laddoo', name: 'Besan Laddoo', emoji: '🍬', x: 74, y: 64, clue: 'Resting on the right sweets thali' },
  { id: 'coin', name: 'Lakshmi Gold Coin', emoji: '🪙', x: 49, y: 46, clue: 'Shining near the central altar pillar' },
  { id: 'gift', name: 'Diwali Gift Box', emoji: '🎁', x: 84, y: 78, clue: 'Tucked into the lower right corner' },
  { id: 'lantern', name: 'Sky Lantern', emoji: '🏮', x: 18, y: 22, clue: 'Hanging from the upper left balcony arch' },
  { id: 'flower', name: 'Marigold Blossom', emoji: '🌼', x: 38, y: 84, clue: 'Woven into the bottom rangoli garland' },
  { id: 'tile', name: 'Rangoli Tile', emoji: '🌸', x: 62, y: 32, clue: 'Beside the ornate upper right wall pillar' },
  { id: 'bell', name: 'Temple Bell', emoji: '🔔', x: 80, y: 18, clue: 'Suspended high beneath the right ceiling arch' },
];

export const DiwaliTreasureHuntGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [items, setItems] = useState<HiddenItem[]>(() =>
    INITIAL_ITEMS.map((item) => ({ ...item, found: false }))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [activeClue, setActiveClue] = useState<string | null>(null);

  const initGame = (diff = difficulty) => {
    setDifficulty(diff);
    const duration = diff === 'easy' ? 60 : diff === 'medium' ? 45 : 30;
    setTimeLeft(duration);
    setItems(INITIAL_ITEMS.map((item) => ({ ...item, found: false })));
    setIsPlaying(true);
    setIsGameOver(false);
    setIsWon(false);
    setActiveClue(null);
    festiveAudio.playDiyaLightSound();
  };

  // Timer loop
  useEffect(() => {
    let interval: number;
    if (isPlaying && timeLeft > 0 && !isWon) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isWon]);

  const handleItemClick = (id: string) => {
    if (!isPlaying || isWon) return;

    const target = items.find((i) => i.id === id);
    if (!target || target.found) return;

    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, found: true } : item));
      const foundCount = updated.filter((item) => item.found).length;

      festiveAudio.playSparklerSound();

      if (foundCount === updated.length) {
        setIsWon(true);
        setIsPlaying(false);
        festiveAudio.playFireworkSound();
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 },
        });
      }

      return updated;
    });
  };

  const showNextClue = () => {
    const unfound = items.filter((item) => !item.found);
    if (unfound.length > 0) {
      const randomItem = unfound[Math.floor(Math.random() * unfound.length)];
      setActiveClue(`Hint for ${randomItem.name}: ${randomItem.clue}`);
      festiveAudio.playDiyaLightSound();
    }
  };

  const foundCount = items.filter((i) => i.found).length;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Diwali Palace Treasure Hunt</span>
          </h3>
          <p className="text-xs text-amber-200/70">Find all 8 hidden festive treasures in the royal palace!</p>
        </div>

        {/* Difficulty toggles */}
        <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-amber-500/30">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => initGame(diff)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                difficulty === diff ? 'bg-amber-400 text-stone-950' : 'text-amber-300/80 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-mono font-bold">
            Found: {foundCount} / {INITIAL_ITEMS.length}
          </span>
          {difficulty !== 'hard' && isPlaying && (
            <button
              type="button"
              onClick={showNextClue}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-amber-400" />
              <span>Clue</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-lg border border-amber-500/30 font-mono text-amber-300 font-bold">
          <Timer className="w-3.5 h-3.5" />
          <span className={timeLeft <= 8 ? 'text-rose-400 animate-pulse' : ''}>{timeLeft}s</span>
        </div>
      </div>

      {/* Clue notification */}
      {activeClue && (
        <div className="w-full p-2 mb-2 rounded-lg bg-amber-500/15 border border-amber-400/40 text-[11px] text-amber-200 text-center animate-pulse">
          {activeClue}
        </div>
      )}

      {/* Virtual Palace Scene Arena */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border-2 border-amber-500/40 select-none shadow-inner touch-manipulation">
        <img
          src="/assets/images/theme_royal_palace.jpg"
          alt="Royal Palace Treasure Hunt"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Start Game Overlay */}
        {!isPlaying && !isWon && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-5xl mb-2 animate-bounce">🏰</span>
            <h4 className="text-xl font-bold font-serif text-amber-200">Diwali Royal Treasure Hunt</h4>
            <p className="text-xs text-amber-200/80 max-w-xs mt-1 leading-relaxed">
              8 sacred Diwali items are hidden inside the palace. Can you find them all before time runs out?
            </p>
            <button
              type="button"
              onClick={() => initGame(difficulty)}
              className="mt-5 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>Begin Exploration</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-4xl mb-2">⏳</span>
            <h4 className="text-xl font-bold font-serif text-amber-200">Time Expired!</h4>
            <p className="text-sm text-amber-100/90 mt-1">
              You discovered <span className="font-bold text-yellow-300">{foundCount}</span> out of 8 hidden treasures.
            </p>
            <button
              type="button"
              onClick={() => initGame(difficulty)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Win Screen with Festive Diwali Blessing Wish */}
        {isWon && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />

            <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400/60 shadow-xl max-w-sm mb-3 text-center">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
                👑 Royal Deepavali Blessings! 🪔
              </span>
              <p className="text-xs sm:text-sm text-amber-100 font-serif leading-relaxed italic">
                "You have uncovered all 8 sacred treasures of the royal palace! May Goddess Lakshmi bestow divine wisdom, glowing prosperity, and eternal happiness upon you and your loved ones! Shubh Deepavali!"
              </p>
            </div>

            <p className="text-sm text-amber-100/90">
              Discovered all 8 sacred items with{' '}
              <span className="font-bold text-yellow-300 font-mono">{timeLeft}s</span> remaining!
            </p>

            <button
              type="button"
              onClick={() => initGame(difficulty)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Explore Again</span>
            </button>
          </div>
        )}

        {/* Hidden Items in Palace */}
        {isPlaying &&
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              disabled={item.found}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 select-none ${
                item.found
                  ? 'bg-emerald-500/80 ring-2 ring-emerald-300 scale-110 shadow-lg pointer-events-none'
                  : difficulty === 'easy'
                  ? 'bg-amber-400/20 ring-2 ring-amber-300/50 animate-pulse hover:scale-125'
                  : 'bg-black/20 hover:bg-amber-400/30 hover:scale-125'
              }`}
              title={item.found ? `${item.name} Found!` : `Tap to discover ${item.name}!`}
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {item.emoji}
              </span>
            </button>
          ))}
      </div>

      {/* Inventory Bar */}
      <div className="w-full mt-3 p-2.5 bg-black/40 rounded-xl border border-amber-500/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1.5">
          Sacred Palace Treasures ({foundCount} / {INITIAL_ITEMS.length}):
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center justify-center p-1 rounded-lg border text-center transition-all ${
                item.found
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                  : 'bg-purple-950/40 border-amber-500/15 text-stone-500 opacity-60'
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[9px] truncate max-w-full font-medium">{item.name.split(' ')[0]}</span>
              {item.found && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
