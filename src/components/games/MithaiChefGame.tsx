import React, { useState, useEffect } from 'react';
import { ChefHat, Trophy, RotateCcw, Timer, Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface Sweet {
  id: string;
  name: string;
  emoji: string;
  points: number;
}

const SWEETS: Sweet[] = [
  { id: 'laddoo', name: 'Besan Laddoo', emoji: '🟡', points: 15 },
  { id: 'kaju', name: 'Kaju Katli', emoji: '💎', points: 25 },
  { id: 'jalebi', name: 'Crispy Jalebi', emoji: '🥨', points: 20 },
  { id: 'gujiya', name: 'Mawa Gujiya', emoji: '🥟', points: 30 },
  { id: 'gulab', name: 'Gulab Jamun', emoji: '🟤', points: 20 },
  { id: 'barfi', name: 'Pista Barfi', emoji: '🟩', points: 25 },
];

interface Order {
  id: number;
  customer: string;
  items: { [sweetId: string]: number };
  reward: number;
}

const CUSTOMERS = ['Sharma Family', 'Aarav & Meera', 'Uncle & Aunty', 'Priya', 'Vikram & Riya'];

export const MithaiChefGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [packedBox, setPackedBox] = useState<{ [sweetId: string]: number }>({});
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('diwali_mithai_highscore');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const generateOrder = (orderNum: number): Order => {
    const cust = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    // Pick 2 random sweet types
    const picks = [...SWEETS].sort(() => Math.random() - 0.5).slice(0, 2);
    const items: { [id: string]: number } = {};
    let reward = 50;

    picks.forEach((sw) => {
      const qty = Math.floor(Math.random() * 2) + 1; // 1 or 2
      items[sw.id] = qty;
      reward += sw.points * qty;
    });

    return {
      id: orderNum,
      customer: cust,
      items,
      reward,
    };
  };

  const startGame = () => {
    setScore(0);
    setOrdersCompleted(0);
    setTimeLeft(60);
    setPackedBox({});
    setCurrentOrder(generateOrder(1));
    setIsPlaying(true);
    setIsGameOver(false);
    festiveAudio.playDiyaLightSound();
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    festiveAudio.playFireworkSound();

    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        try {
          localStorage.setItem('diwali_mithai_highscore', String(currentScore));
        } catch {
          // ignore
        }
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      }
      return currentScore;
    });
  };

  // Timer loop
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

  const addSweetToBox = (sweetId: string) => {
    if (!isPlaying || isGameOver) return;
    festiveAudio.playSparklerSound();
    setPackedBox((prev) => ({
      ...prev,
      [sweetId]: (prev[sweetId] || 0) + 1,
    }));
  };

  const clearPackedBox = () => {
    setPackedBox({});
    festiveAudio.playDiyaLightSound();
  };

  const verifyAndDeliver = () => {
    if (!currentOrder) return;

    // Check if packed box matches current order
    let matches = true;
    const orderItems = currentOrder.items;

    for (const id in orderItems) {
      if ((packedBox[id] || 0) !== orderItems[id]) {
        matches = false;
        break;
      }
    }

    for (const id in packedBox) {
      if (packedBox[id] > 0 && !orderItems[id]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      festiveAudio.playDiyaLightSound();
      setScore((s) => s + currentOrder.reward);
      setOrdersCompleted((o) => o + 1);
      setPackedBox({});
      setCurrentOrder(generateOrder(ordersCompleted + 2));
    } else {
      festiveAudio.playSparklerSound();
      // small shake or error feedback
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-yellow-400" />
            <span>Diwali Mithai Chef (Sweets Baker)</span>
          </h3>
          <p className="text-xs text-amber-200/70">Pack custom Diwali sweet boxes for festive guests!</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-amber-500/30 font-mono text-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Record: {highScore}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="w-full flex items-center justify-between mb-4 text-xs">
        <span className="text-amber-200">
          Boxes Packed: <span className="font-mono font-bold text-amber-300">{ordersCompleted}</span>
        </span>

        <div className="flex items-center gap-1 font-mono font-bold text-amber-200">
          <Timer className="w-3.5 h-3.5 text-amber-400" />
          <span className={timeLeft <= 8 ? 'text-rose-400 animate-pulse' : ''}>{timeLeft}s</span>
        </div>

        <div className="text-sm font-bold font-mono text-yellow-300">
          Points: {score}
        </div>
      </div>

      {/* Game Content Arena */}
      {!isPlaying && !isGameOver && (
        <div className="w-full p-8 rounded-2xl bg-black/75 border border-amber-500/30 flex flex-col items-center text-center my-4">
          <span className="text-5xl mb-2 animate-bounce">🥟</span>
          <h4 className="text-lg font-bold text-amber-200 font-serif">Diwali Sweets Kitchen</h4>
          <p className="text-xs text-amber-200/70 max-w-xs mt-1 leading-relaxed">
            Customers need custom Diwali Mithai Dabbas (sweet gift boxes)! Tap sweets from the kitchen to match each order and deliver on time!
          </p>
          <button
            type="button"
            onClick={startGame}
            className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Start Sweets Kitchen
          </button>
        </div>
      )}

      {isGameOver && (
        <div className="w-full p-8 rounded-2xl bg-black/85 border border-amber-400/50 flex flex-col items-center text-center my-4 animate-fadeIn">
          <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
          <h4 className="text-xl font-bold font-serif text-amber-200">Shop Closed for Deepavali!</h4>
          <p className="text-xs text-amber-100/90 mt-1">
            You packed <span className="text-yellow-300 font-bold">{ordersCompleted} boxes</span> and earned{' '}
            <span className="text-yellow-300 font-bold font-mono text-sm">{score} points</span>!
          </p>
          <button
            type="button"
            onClick={startGame}
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Open Kitchen Again</span>
          </button>
        </div>
      )}

      {isPlaying && currentOrder && (
        <div className="w-full flex flex-col gap-4">
          {/* Active Customer Order Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/60 to-amber-950/40 border border-amber-400/50 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Order for: {currentOrder.customer}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-yellow-300 font-mono font-bold">
                +{currentOrder.reward} pts
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(currentOrder.items).map(([swId, qty]) => {
                const sweet = SWEETS.find((s) => s.id === swId);
                const currentInBox = packedBox[swId] || 0;
                const isSatisfied = currentInBox === qty;

                return (
                  <div
                    key={swId}
                    className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 ${
                      isSatisfied
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 font-bold'
                        : 'bg-black/50 border-amber-500/30 text-amber-100'
                    }`}
                  >
                    <span className="text-xl">{sweet?.emoji}</span>
                    <span>{sweet?.name}:</span>
                    <span className="font-mono font-bold">
                      {currentInBox} / {qty}
                    </span>
                    {isSatisfied && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kitchen Sweets Selection Tray */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 block mb-2">
              Kitchen Preparation Tray (Tap to Pack):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SWEETS.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => addSweetToBox(sw.id)}
                  className="p-2.5 rounded-xl bg-[#0e031a] hover:bg-purple-900 border border-amber-500/30 hover:border-amber-400 flex flex-col items-center justify-center transition-all active:scale-90 cursor-pointer shadow"
                >
                  <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">{sw.emoji}</span>
                  <span className="text-[10px] text-amber-200 font-medium truncate max-w-full">
                    {sw.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-amber-400/60 font-mono">+{sw.points}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Player Packed Box & Delivery Actions */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="truncate text-xs">
              <span className="font-bold text-amber-300 block mb-0.5">Your Gift Box:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {Object.keys(packedBox).length === 0 ? (
                  <span className="text-amber-400/50 italic text-[11px]">Box is empty. Tap sweets above!</span>
                ) : (
                  Object.entries(packedBox).map(([swId, count]) => {
                    const sw = SWEETS.find((s) => s.id === swId);
                    if (count === 0) return null;
                    return (
                      <span key={swId} className="px-2 py-0.5 rounded bg-purple-950 border border-amber-500/20 text-[10px] text-amber-200">
                        {sw?.emoji} x{count}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={clearPackedBox}
                className="p-2 rounded-lg bg-black/40 hover:bg-rose-950/60 border border-amber-500/30 text-rose-300 cursor-pointer"
                title="Clear Box"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={verifyAndDeliver}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                <span>Deliver Box! 🎁</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
