import React, { useState } from 'react';
import { HelpCircle, Check, X, RotateCcw, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festiveAudio } from '../../utils/audio';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question: "What does the Sanskrit word 'Deepavali' literally translate to?",
    options: ['Row of clay lamps (Diyas)', 'Night of firecrackers', 'Festival of spring colors', 'Royal feast of sweets'],
    correct: 0,
    explanation: "'Deepa' means clay oil lamp and 'Avali' means row or series. Deepavali symbolizes rows of lights dispelling darkness.",
  },
  {
    question: 'Which deity is primarily worshipped on Diwali evening for auspicious wealth, wisdom and prosperity?',
    options: ['Lord Shiva', 'Goddess Lakshmi & Lord Ganesha', 'Lord Indra', 'Lord Brahma'],
    correct: 1,
    explanation: 'Goddess Lakshmi (goddess of prosperity) and Lord Ganesha (remover of obstacles) are worshipped together.',
  },
  {
    question: 'Diwali marks the joyful return of which divine avatars to Ayodhya after 14 years of exile?',
    options: ['Lord Krishna and Balarama', 'Lord Rama, Sita, and Lakshmana', 'The Five Pandavas', 'King Harishchandra'],
    correct: 1,
    explanation: 'The citizens of Ayodhya lit thousands of clay oil lamps across the kingdom to welcome Lord Rama, Sita, and Lakshmana.',
  },
  {
    question: 'The first day of the 5-day Diwali celebration is dedicated to good health and buying precious metals:',
    options: ['Dhanteras', 'Choti Diwali', 'Govardhan Puja', 'Bhai Dooj'],
    correct: 0,
    explanation: 'Dhanteras honors Lord Dhanvantari (the father of Ayurveda) and Goddess Lakshmi, marking new auspicious beginnings.',
  },
  {
    question: 'What is the traditional decorative floor art made with colored powders and flower petals called?',
    options: ['Kalamkari', 'Rangoli (Kolam)', 'Warli Painting', 'Madhubani'],
    correct: 1,
    explanation: 'Rangoli is drawn at entrances to welcome positive energy, good fortune, and Goddess Lakshmi.',
  },
  {
    question: 'In which Hindu lunar calendar month does Diwali take place on the darkest new moon (Amavasya) night?',
    options: ['Chaitra', 'Kartik', 'Shravana', 'Ashwin'],
    correct: 1,
    explanation: 'Diwali falls on Amavasya in the holy month of Kartik, demonstrating that even the darkest night can be flooded with light.',
  },
  {
    question: 'In Southern India, Naraka Chaturdashi commemorates Lord Krishna and Queen Satyabhama defeating which demon?',
    options: ['Ravana', 'Narakasura', 'Mahishasura', 'Kumbhakarna'],
    correct: 1,
    explanation: 'Lord Krishna and Satyabhama vanquished Narakasura, liberating thousands of captives and restoring dharma.',
  },
  {
    question: 'Which sweet festival is celebrated on the 5th day, honouring the lifelong bond between brothers and sisters?',
    options: ['Raksha Bandhan', 'Bhai Dooj (Yama Dwitiya)', 'Karwa Chauth', 'Teej'],
    correct: 1,
    explanation: 'Bhai Dooj celebrates the eternal bond and affection between brothers and sisters with prayers and tilak.',
  },
  {
    question: 'What pure fuel is traditionally burned in sacred terracotta diyas for positive spiritual vibrations?',
    options: ['Kerosene', 'Pure Cow Ghee or Mustard/Sesame Oil', 'Paraffin Wax', 'Alcohol'],
    correct: 1,
    explanation: 'Pure cow ghee or cold-pressed sesame/mustard oil with handmade cotton wicks emit sattvic, purifying energy.',
  },
  {
    question: 'On Govardhan Puja, which holy hill did Lord Krishna lift on his little finger to shield the villagers from rain?',
    options: ['Mount Kailash', 'Mount Meru', 'Govardhan Hill', 'Vindhyachal'],
    correct: 2,
    explanation: 'Lord Krishna lifted Mount Govardhan to provide refuge to the people and cattle of Vrindavan.',
  },
];

export const DiwaliQuizGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correct) {
      festiveAudio.playDiyaLightSound();
      setScore((s) => s + 1);
    } else {
      festiveAudio.playSparklerSound();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((c) => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      festiveAudio.playFireworkSound();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    festiveAudio.playDiyaLightSound();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-purple-950/70 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-amber-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Diwali Cultural Quiz</span>
          </h3>
          <p className="text-xs text-amber-200/70">10 questions on Diwali mythology, traditions & rituals!</p>
        </div>

        <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30">
          {currentIndex + 1} / {QUESTIONS.length}
        </span>
      </div>

      {!isCompleted ? (
        <div className="w-full flex flex-col">
          {/* Question text box */}
          <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
              Question {currentIndex + 1}
            </span>
            <p className="text-sm sm:text-base font-serif text-amber-100 font-semibold leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-2 mb-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correct;

              let btnStyle = 'bg-[#100322] border-amber-500/25 text-amber-200 hover:border-amber-400/50';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)]';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-400 text-rose-200';
                } else {
                  btnStyle = 'bg-[#100322]/50 border-amber-500/10 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-100 mb-4 animate-fadeIn">
              <span className="font-bold text-amber-300 block mb-0.5">Festive Lore:</span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next / Submit Button */}
          {isAnswered && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-sm shadow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 === QUESTIONS.length ? 'View Final Results 🎉' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="w-full flex flex-col items-center text-center py-6 animate-fadeIn">
          <Trophy className="w-14 h-14 text-yellow-400 mb-3 animate-bounce" />
          <h4 className="text-xl font-bold font-serif text-amber-200">Diwali Quiz Completed!</h4>
          <p className="text-sm text-amber-100/90 mt-1">
            You scored <span className="text-yellow-300 font-bold font-mono text-xl">{score}</span> out of{' '}
            <span className="font-mono text-xl">{QUESTIONS.length}</span>!
          </p>

          <p className="text-xs text-amber-200/80 max-w-sm mt-3 leading-relaxed italic">
            {score >= 8
              ? '🌟 Master of Deepavali Traditions! You know the sacred legends, rituals, and spirit of Diwali by heart!'
              : score >= 5
              ? '✨ Wonderful accomplishment! Your knowledge reflects the warmth and enlightenment of the festival!'
              : '🪔 Beautiful effort! Every story learned kindles another lamp of knowledge in our hearts!'}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
