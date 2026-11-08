import React, { useState, useEffect } from 'react';
import { Brain, Trophy, RotateCcw, Timer, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface Card {
  id: number;
  pairId: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = [
  { pairId: 'diya', emoji: '🪔', name: 'Golden Diya' },
  { pairId: 'laddoo', emoji: '🍬', name: 'Besan Laddoo' },
  { pairId: 'rocket', emoji: '🚀', name: 'Firecracker' },
  { pairId: 'bell', emoji: '🔔', name: 'Temple Bell' },
  { pairId: 'lantern', emoji: '🏮', name: 'Sky Lantern' },
  { pairId: 'peacock', emoji: '🦚', name: 'Peacock Rangoli' },
];

export const MemoryMatchGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestMoves, setBestMoves] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('diwali_memory_best');
      return saved ? parseInt(saved, 10) : 999;
    } catch {
      return 999;
    }
  });

  const initGame = () => {
    const deck: Card[] = [];
    let idCounter = 0;

    // Create 2 cards for each of the 6 symbols (12 cards total)
    [...SYMBOLS, ...SYMBOLS].forEach((item) => {
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // High quality Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsPlaying(true);
    setIsWon(false);
    festiveAudio.playDiyaLightSound();
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer loop
  useEffect(() => {
    if (!isPlaying || isWon) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || isWon) return;
    // Guard: already flipped or matched, or 2 cards already being evaluated
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length >= 2) return;

    festiveAudio.playSparklerSound();

    const nextCards = [...cards];
    nextCards[index].isFlipped = true;
    setCards(nextCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = nextCards[firstIdx];
      const secondCard = nextCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...nextCards]);
          setSelectedCards([]);
          setMatches((prev) => {
            const next = prev + 1;
            festiveAudio.playDiyaLightSound();
            if (next === SYMBOLS.length) {
              setIsWon(true);
              festiveAudio.playFireworkSound();
              confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
            }
            return next;
          });
        }, 400);
      } else {
        // Not matched - flip both back smoothly
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...nextCards]);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // Save best moves
  useEffect(() => {
    if (isWon && moves > 0 && moves < bestMoves) {
      setBestMoves(moves);
      try {
        localStorage.setItem('diwali_memory_best', String(moves));
      } catch {
        // ignore
      }
    }
  }, [isWon, moves, bestMoves]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Diwali Memory Match</span>
          </h3>
          <p className="text-xs text-amber-200/70">Flip cards to match all 6 pairs of festive treasures!</p>
        </div>

        <button
          type="button"
          onClick={initGame}
          className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
          title="Restart Game"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="w-full flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-amber-200">
            Moves: <span className="font-mono font-bold text-amber-300">{moves}</span>
          </span>
          <span className="text-amber-200">
            Matched: <span className="font-mono font-bold text-yellow-300">{matches} / 6</span>
          </span>
          {bestMoves < 999 && (
            <span className="text-emerald-400 hidden sm:inline">
              Best: <span className="font-mono font-bold">{bestMoves} moves</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-lg border border-amber-500/30 font-mono text-amber-300 font-bold">
          <Timer className="w-3.5 h-3.5" />
          <span>{timer}s</span>
        </div>
      </div>

      {/* 4x3 Cards Grid */}
      <div className="w-full grid grid-cols-4 gap-2.5 sm:gap-3 relative select-none">
        {/* Victory Screen */}
        {isWon && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center rounded-xl animate-fadeIn">
            <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold text-amber-200 font-serif">Auspicious Memory!</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Matched all 6 pairs in <span className="text-yellow-300 font-bold font-mono text-sm">{moves} moves</span> and{' '}
              <span className="text-yellow-300 font-bold font-mono text-sm">{timer}s</span>!
            </p>
            {moves <= bestMoves && (
              <span className="text-xs text-emerald-400 font-semibold mt-1">✨ New Best Move Record! ✨</span>
            )}
            <button
              type="button"
              onClick={initGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
              <span>Play Again</span>
            </button>
          </div>
        )}

        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed}
              className={`h-20 sm:h-24 rounded-xl flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer border ${
                card.isMatched
                  ? 'bg-gradient-to-b from-emerald-950/70 to-purple-950/80 border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : card.isFlipped
                  ? 'bg-gradient-to-b from-amber-500/30 to-purple-900/60 border-amber-400 shadow-md scale-100'
                  : 'bg-[#120524] border-amber-500/30 hover:border-amber-400/60 hover:scale-105 active:scale-95'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <span className="text-2xl sm:text-3xl filter drop-shadow">{card.emoji}</span>
                  <span className="text-[10px] text-amber-200 font-medium mt-1 truncate max-w-[70px]">
                    {card.name.split(' ')[0]}
                  </span>
                  {card.isMatched && <Check className="w-3 h-3 text-emerald-400 mt-0.5" />}
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <span className="text-xl text-amber-400 font-serif">🪔</span>
                  <span className="text-[9px] text-amber-400/60 font-mono mt-1">✦</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
