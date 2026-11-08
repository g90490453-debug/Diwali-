import React, { useState } from 'react';
import { Sparkles, Heart, Sun, Flame, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface FestiveDay {
  dayNumber: number;
  title: string;
  hindiTitle: string;
  theme: string;
  description: string;
  rituals: string[];
}

const FIVE_DAYS: FestiveDay[] = [
  {
    dayNumber: 1,
    title: 'Dhanteras (Dhantrayodashi)',
    hindiTitle: 'धनतेरस',
    theme: 'Wealth, Longevity & Prosperity',
    description:
      'Celebrated on the 13th lunar day of Krishna Paksha, honoring Lord Dhanvantari—the divine physician and teacher of Ayurveda—and Goddess Lakshmi.',
    rituals: [
      'Purchasing precious metals, utensils, or new auspicious tools',
      'Lighting the Yamadeep lamp facing south at dusk to ward off untimely death',
      'Thoroughly purifying homes to invite divine energy',
    ],
  },
  {
    dayNumber: 2,
    title: 'Naraka Chaturdashi (Choti Diwali)',
    hindiTitle: 'नरक चतुर्दशी',
    theme: 'Liberation & Victory Over Ego',
    description:
      'Commemorates Lord Krishna and Queen Satyabhama vanquishing the demon Narakasura, liberating 16,000 imprisoned maidens and restoring dharma.',
    rituals: [
      'Early pre-dawn Abhyanga Snan (ritual herbal oil bath with ubtan)',
      'Lighting 14 small diyas around the house courtyard',
      'Preparation of traditional festival sweets and snacks',
    ],
  },
  {
    dayNumber: 3,
    title: 'Lakshmi Puja & Deepavali',
    hindiTitle: 'लक्ष्मी पूजन व दीपावली',
    theme: 'The Grand Night of Endless Lights',
    description:
      'The darkest Amavasya night made radiant by millions of lamps. Goddess Lakshmi visits spotless, lit homes to bestow spiritual and material abundance.',
    rituals: [
      'Evening Lakshmi-Ganesha and Saraswati ceremonial aarti',
      'Lighting terracotta ghee diyas at doorways, windows, and balconies',
      'Drawing vibrant peacocks and lotus rangolis to welcome prosperity',
      'Sharing gourmet sweets like Kaju Katli, Besan Laddoos, and Gujiyas',
    ],
  },
  {
    dayNumber: 4,
    title: 'Govardhan Puja & Annakut',
    hindiTitle: 'गोवर्धन पूजा / अन्नकूट',
    theme: 'Gratitude to Nature & Mother Earth',
    description:
      'Commemorates Lord Krishna lifting the Govardhan Mountain on his little finger to shield villagers from torrential storms unleashed by Lord Indra.',
    rituals: [
      'Crafting miniature hillocks of flowers and cow dung representing Govardhan',
      'Annakut ("Mountain of Food"): Offering 56 vegetarian delicacies (Chhappan Bhog)',
      'In Gujarat, this day marks the auspicious New Year (Bestu Varas)',
    ],
  },
  {
    dayNumber: 5,
    title: 'Bhai Dooj (Yama Dwitiya)',
    hindiTitle: 'भाई दूज',
    theme: 'Unbreakable Sibling Bond',
    description:
      'Celebrates the sacred love between brothers and sisters. Legend says Yamraj (the Lord of Death) visited his sister Yami (the Yamuna river), who welcomed him with aarti.',
    rituals: [
      'Sisters apply vermilion and rice tilak on their brothers’ foreheads with prayers for long life',
      'Exchange of thoughtful gifts and delicious festive feasts',
      'Prayers for protection, warmth, and enduring friendship',
    ],
  },
];

export const AboutDiwali: React.FC = () => {
  const [expandedDay, setExpandedDay] = useState<number | null>(3); // Default to main Diwali

  return (
    <section id="about" className="w-full max-w-5xl mx-auto px-4 py-8 relative z-10 scroll-mt-20">
      <div className="festive-card-glass rounded-2xl gold-border-glow shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Spiritual & Cultural Heritage</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-serif gold-shimmer-text"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            The Sacred Spirit of Deepavali
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-amber-200/80 leading-relaxed font-sans">
            Deepavali—from the Sanskrit words <em>Deepa</em> (lamp) and <em>Avali</em> (row)—is more than just fireworks and lights.
            It is a timeless celebration of the supreme victory of light over darkness, wisdom over ignorance, and truth over falsehood.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-purple-950/40 border border-amber-500/25 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-amber-200 font-serif mb-1">Inner Illumination</h3>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              Every lit diya symbolizes igniting the divine light of consciousness, dispel lingering negativity, and awakening compassion within our hearts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-purple-950/40 border border-amber-500/25 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-amber-200 font-serif mb-1">Auspicious Welcoming</h3>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              Cleaned homes, glowing torans, and vibrant peacock rangolis invite Goddess Lakshmi and Lord Ganesha to bestow virtue, health, and ethical prosperity.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-purple-950/40 border border-amber-500/25 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
              <Heart className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-amber-200 font-serif mb-1">Unity & Forgiveness</h3>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              Diwali is an auspicious time to release old grievances, forgive past misunderstandings, share sweet mithai, and embrace friends and family in love.
            </p>
          </div>
        </div>

        {/* 5 Days Accordion */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-amber-200 font-serif">
              The 5 Auspicious Days of Deepavali Festivities
            </h3>
          </div>

          <div className="space-y-3">
            {FIVE_DAYS.map((day) => {
              const isExpanded = expandedDay === day.dayNumber;
              return (
                <div
                  key={day.dayNumber}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? 'bg-purple-950/60 border-amber-400/50 shadow-md'
                      : 'bg-[#0d0319]/80 border-amber-500/20 hover:border-amber-400/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/40">
                        {day.dayNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-100">{day.title}</span>
                          <span className="text-xs text-amber-400/80 font-medium">({day.hindiTitle})</span>
                        </div>
                        <span className="text-[11px] text-amber-300/70 block mt-0.5">{day.theme}</span>
                      </div>
                    </div>

                    <div className="text-amber-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-amber-500/15 text-xs text-amber-200/80 animate-fadeIn">
                      <p className="leading-relaxed mb-3">{day.description}</p>
                      <div>
                        <span className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider block mb-1">
                          Key Customs & Observances:
                        </span>
                        <ul className="list-disc pl-5 space-y-1">
                          {day.rituals.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Traditional Sanskrit Shloka Box */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-center">
          <p className="text-sm font-serif font-bold text-amber-300 mb-1">
            ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
          </p>
          <p className="text-xs text-amber-200/80 italic font-sans max-w-lg mx-auto">
            "Lead me from falsehood to truth; lead me from darkness to divine light; lead me from mortality to immortality."
          </p>
        </div>
      </div>
    </section>
  );
};
