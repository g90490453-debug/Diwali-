import React, { useState } from 'react';
import {
  Gamepad2,
  Flame,
  Brain,
  HelpCircle,
  Puzzle,
  Cookie,
  Zap,
  ArrowLeft,
  Search,
  Palette,
  Music,
  ChefHat,
} from 'lucide-react';
import { DiyaLightingGame } from './DiyaLightingGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { DiwaliQuizGame } from './DiwaliQuizGame';
import { RangoliPuzzleGame } from './RangoliPuzzleGame';
import { CatchLaddooGame } from './CatchLaddooGame';
import { FireworkReactionGame } from './FireworkReactionGame';
import { DiwaliTreasureHuntGame } from './DiwaliTreasureHuntGame';
import { BuildRangoliGame } from './BuildRangoliGame';
import { SparklerSymphonyGame } from './SparklerSymphonyGame';
import { MithaiChefGame } from './MithaiChefGame';
import { festiveAudio } from '../../utils/audio';

export type GameId =
  | 'diya'
  | 'memory'
  | 'quiz'
  | 'rangoli'
  | 'laddoo'
  | 'reaction'
  | 'treasure'
  | 'builder'
  | 'sparkler'
  | 'sweets'
  | null;

interface GameMeta {
  id: NonNullable<GameId>;
  title: string;
  category: string;
  tagline: string;
  icon: React.ReactNode;
  accent: string;
  badge: string;
}

const GAMES_LIST: GameMeta[] = [
  {
    id: 'diya',
    title: 'Diya Lighting Challenge',
    category: 'Speed & Reflexes',
    tagline: 'Kindle as many sacred glowing diyas as possible within 30 seconds!',
    icon: <Flame className="w-6 h-6 text-orange-400" />,
    accent: 'from-amber-600 to-orange-500',
    badge: '30s Challenge',
  },
  {
    id: 'memory',
    title: 'Diwali Memory Match',
    category: 'Memory & Focus',
    tagline: 'Flip cards and find pairs of golden diyas, sweets & festive fireworks.',
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    accent: 'from-purple-600 to-indigo-500',
    badge: '6 Pairs Match',
  },
  {
    id: 'quiz',
    title: 'Diwali Cultural Quiz',
    category: 'Heritage & Lore',
    tagline: '10 cultural trivia questions on Diwali mythology, rituals & traditions.',
    icon: <HelpCircle className="w-6 h-6 text-emerald-400" />,
    accent: 'from-emerald-600 to-teal-500',
    badge: '10 Questions',
  },
  {
    id: 'rangoli',
    title: 'Rangoli Pattern Puzzle',
    category: 'Visual Puzzle',
    tagline: 'Swap & slide colorful tiles to reconstruct the auspicious peacock rangoli.',
    icon: <Puzzle className="w-6 h-6 text-pink-400" />,
    accent: 'from-pink-600 to-rose-500',
    badge: '3x3 Puzzle',
  },
  {
    id: 'laddoo',
    title: 'Catch the Laddoo!',
    category: 'Action Arcade',
    tagline: 'Catch falling golden laddoos and jalebis in your thali; dodge firecracker bombs!',
    icon: <Cookie className="w-6 h-6 text-yellow-400" />,
    accent: 'from-yellow-600 to-amber-500',
    badge: 'Sweets Catcher',
  },
  {
    id: 'reaction',
    title: 'Firework Reaction Challenge',
    category: 'Reflex Speed',
    tagline: 'Tap bursting fireworks the instant they appear to benchmark your reaction time!',
    icon: <Zap className="w-6 h-6 text-cyan-400" />,
    accent: 'from-cyan-600 to-blue-500',
    badge: 'Speed Test',
  },
  {
    id: 'treasure',
    title: 'Palace Treasure Hunt',
    category: 'Hidden Quest',
    tagline: 'Find sacred diyas, Lakshmi coins, lanterns & sweets hidden within the palace courtyard!',
    icon: <Search className="w-6 h-6 text-emerald-400" />,
    accent: 'from-emerald-600 to-teal-500',
    badge: 'Hidden Quest',
  },
  {
    id: 'builder',
    title: 'Build Your Own Rangoli',
    category: 'Creative Canvas',
    tagline: 'Paint dazzling symmetric radial rangoli art with sacred gulal powders & export as PNG.',
    icon: <Palette className="w-6 h-6 text-fuchsia-400" />,
    accent: 'from-fuchsia-600 to-pink-500',
    badge: 'Art Studio',
  },
  {
    id: 'sparkler',
    title: 'Sparkler Rhythm Symphony',
    category: 'Music Arcade',
    tagline: 'Strike falling musical notes to the rhythm across 4 festive sparkler lanes (D, F, J, K)!',
    icon: <Music className="w-6 h-6 text-violet-400" />,
    accent: 'from-violet-600 to-indigo-500',
    badge: 'Rhythm Arcade',
  },
  {
    id: 'sweets',
    title: 'Diwali Mithai Chef',
    category: 'Kitchen Rush',
    tagline: 'Pack and serve custom Diwali sweet gift boxes for visiting friends and family before time runs out!',
    icon: <ChefHat className="w-6 h-6 text-amber-400" />,
    accent: 'from-amber-600 to-yellow-500',
    badge: 'Sweets Kitchen',
  },
];

interface DiwaliFunZoneProps {
  onBackToGreeting?: () => void;
  titlePrefix?: string;
  initialGame?: GameId;
}

export const DiwaliFunZone: React.FC<DiwaliFunZoneProps> = ({
  onBackToGreeting,
  titlePrefix,
  initialGame = null,
}) => {
  const [activeGame, setActiveGame] = useState<GameId>(initialGame);

  const handleSelectGame = (id: NonNullable<GameId>) => {
    setActiveGame(id);
    festiveAudio.playDiyaLightSound();
  };

  return (
    <section id="fun-zone" className="w-full max-w-5xl mx-auto px-4 py-8 relative z-10 scroll-mt-20">
      {/* Fun Zone Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>Diwali Fun Zone · 10 Interactive Festive Games</span>
        </div>
        <h2
          className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-serif gold-shimmer-text"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {titlePrefix ? `${titlePrefix} Play Diwali Games!` : 'Play Diwali Games'}
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/70 max-w-xl mx-auto mt-1">
          Enjoy 10 festive challenges: Diya lighting, memory match, quiz, rangoli puzzle, sweet catcher, fireworks, palace treasure hunt, rangoli builder, sparkler symphony & sweets chef!
        </p>

        {onBackToGreeting && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onBackToGreeting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-md hover:bg-purple-900 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Scroll Up to My Personalised Greeting</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Game Interface or Selector Grid */}
      {activeGame ? (
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Back button to Games list */}
          <div className="w-full max-w-xl flex justify-start mb-4">
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to All 10 Games</span>
            </button>
          </div>

          {activeGame === 'diya' && <DiyaLightingGame />}
          {activeGame === 'memory' && <MemoryMatchGame />}
          {activeGame === 'quiz' && <DiwaliQuizGame />}
          {activeGame === 'rangoli' && <RangoliPuzzleGame />}
          {activeGame === 'laddoo' && <CatchLaddooGame />}
          {activeGame === 'reaction' && <FireworkReactionGame />}
          {activeGame === 'treasure' && <DiwaliTreasureHuntGame />}
          {activeGame === 'builder' && <BuildRangoliGame />}
          {activeGame === 'sparkler' && <SparklerSymphonyGame />}
          {activeGame === 'sweets' && <MithaiChefGame />}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              onClick={() => handleSelectGame(game.id)}
              className="group p-5 rounded-2xl festive-card-glass border border-amber-500/25 hover:border-amber-400/60 shadow-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    {game.badge}
                  </span>
                </div>

                <span className="text-[10px] text-amber-400/80 font-serif uppercase tracking-widest block mb-0.5">
                  {game.category}
                </span>
                <h3 className="text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-amber-200/70 mt-1 leading-relaxed line-clamp-2">{game.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 group-hover:underline">Play Game</span>
                <span className="text-amber-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
