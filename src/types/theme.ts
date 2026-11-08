export type DesignThemeId =
  | 'royal'
  | 'traditional'
  | 'magical'
  | 'cartoon'
  | 'modern'
  | 'colorful'
  | 'temple'
  | 'bollywood'
  | 'garden'
  | 'palace'
  | 'neon'
  | 'classic'; // alias for backwards compatibility

export interface DiwaliDesign {
  id: DesignThemeId;
  name: string;
  tagline: string;
  badge: string;
  thumbnail: string;
  backdrop: string;
  accentColor: string;
  themeColorHex: string;
  glowColor: string;
  defaultMessage: string;
  description: string;
  particles: string[];
  particleType: 'gold' | 'marigold' | 'stars' | 'sparks' | 'bokeh' | 'gulal' | 'lotus' | 'confetti' | 'garden' | 'palace' | 'neon';
  cardGlow: string;
  fontStyle: string;
  taglineHindi: string;
}

export const DIWALI_DESIGNS: DiwaliDesign[] = [
  {
    id: 'royal',
    name: 'Royal Golden Diwali',
    tagline: 'Warm terracotta & gleaming gold altar with rows of sacred illuminated diyas',
    taglineHindi: 'शाही स्वर्ण दीपोत्सव',
    badge: 'Classic Heritage',
    thumbnail: '/assets/images/diwali_festive_backdrop.jpg',
    backdrop: '/assets/images/diwali_festive_backdrop.jpg',
    accentColor: 'from-amber-400 via-yellow-500 to-amber-600',
    themeColorHex: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    cardGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.35)] border-amber-400/50',
    fontStyle: "'Cinzel Decorative', 'Cinzel', serif",
    particles: ['🪔', '✨', '🪙', '🪔', '💫'],
    particleType: 'gold',
    defaultMessage:
      'May this Diwali illuminate your life with golden happiness, glowing prosperity, and supreme good fortune. Wishing you and your family a blessed and Shubh Deepavali!',
    description: 'Rich amber glow with sacred oil lamps, auspicious brass vessels, and golden shimmer.',
  },
  {
    id: 'traditional',
    name: 'Traditional Indian Diwali',
    tagline: 'Auspicious fresh marigold garlands, mango leaf toran and brass puja bell',
    taglineHindi: 'पारंपरिक गेंदा उत्सव',
    badge: 'Auspicious Toran',
    thumbnail: '/assets/images/theme_traditional_marigold.jpg',
    backdrop: '/assets/images/theme_traditional_marigold.jpg',
    accentColor: 'from-orange-500 via-amber-500 to-yellow-400',
    themeColorHex: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.45)',
    cardGlow: 'shadow-[0_0_35px_rgba(234,88,12,0.35)] border-orange-400/50',
    fontStyle: "'Cinzel', serif",
    particles: ['🌼', '🌸', '🔔', '🪔', '🌿'],
    particleType: 'marigold',
    defaultMessage:
      'With the auspicious scent of marigold blossoms and the resonant chime of temple bells, may your home be filled with peace, love, and sweet festive laughter. Happy Diwali!',
    description: 'Warm orange tones, marigold torans, and timeless Indian household warmth.',
  },
  {
    id: 'magical',
    name: 'Magical Night Diwali',
    tagline: 'Varanasi ghats glowing beneath thousands of ascending sky lanterns and fireworks',
    taglineHindi: 'जादुई दीप गंगा रात्रि',
    badge: 'Starlit Skyline',
    thumbnail: '/assets/images/theme_magical_night.jpg',
    backdrop: '/assets/images/theme_magical_night.jpg',
    accentColor: 'from-indigo-400 via-purple-400 to-amber-300',
    themeColorHex: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.45)',
    cardGlow: 'shadow-[0_0_35px_rgba(129,140,248,0.35)] border-indigo-400/50',
    fontStyle: "'Cinzel', serif",
    particles: ['🏮', '⭐', '✨', '🎆', '🌙'],
    particleType: 'stars',
    defaultMessage:
      'Like thousands of sky lanterns rising into the starry heavens, may your aspirations take flight and illuminate the world with brilliance and peace. Wishing you a magical Diwali!',
    description: 'Starry galaxy skies, illuminated waters, and floating glowing lanterns.',
  },
  {
    id: 'cartoon',
    name: 'Cute Cartoon Diwali',
    tagline: 'Adorable animated diya holding festive sparklers with delicious sweets and laughter',
    taglineHindi: 'प्यारा बाल उत्सव',
    badge: 'Kids & Family Fun',
    thumbnail: '/assets/images/theme_cute_cartoon.jpg',
    backdrop: '/assets/images/theme_cute_cartoon.jpg',
    accentColor: 'from-amber-400 via-yellow-400 to-rose-400',
    themeColorHex: '#f59e0b',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    cardGlow: 'shadow-[0_0_35px_rgba(251,191,36,0.35)] border-yellow-300/60',
    fontStyle: "'Outfit', sans-serif",
    particles: ['🍬', '✨', '🥨', '🎉', '🪔'],
    particleType: 'sparks',
    defaultMessage:
      'Munch on delicious laddoos, sparkle with colorful phuljharis, and celebrate with unstoppable joy! Wishing you the sweetest, safest, and most cheerful Diwali ever!',
    description: 'Playful cartoon mascot radiating smiles, festive sweets, and sparklers.',
  },
  {
    id: 'modern',
    name: 'Modern Luxury Diwali',
    tagline: 'Minimalist champagne ivory, geometric brushed gold diya and subtle floral art',
    taglineHindi: 'आधुनिक स्वर्ण विलास',
    badge: 'Refined Elegance',
    thumbnail: '/assets/images/theme_modern_luxury.jpg',
    backdrop: '/assets/images/theme_modern_luxury.jpg',
    accentColor: 'from-amber-200 via-stone-200 to-amber-400',
    themeColorHex: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    cardGlow: 'shadow-[0_0_35px_rgba(212,175,55,0.35)] border-amber-200/50',
    fontStyle: "'Cinzel', serif",
    particles: ['✨', '💫', '🤍', '✦', '✧'],
    particleType: 'bokeh',
    defaultMessage:
      'Wishing you a season of warm refined elegance, serene harmony, and abundant achievements. May the gentle glow of light inspire you every day. Have a magnificent Happy Diwali!',
    description: 'Chic ivory and champagne aesthetic with warm architectural lighting.',
  },
  {
    id: 'colorful',
    name: 'Colorful Festival Diwali',
    tagline: 'Vibrant peacock rangoli crafted with vivid magenta, turquoise, and gold powders',
    taglineHindi: 'रंग-बिरंगी रंगोली',
    badge: 'Vivid Artistry',
    thumbnail: '/assets/images/theme_colorful_festival.jpg',
    backdrop: '/assets/images/theme_colorful_festival.jpg',
    accentColor: 'from-pink-500 via-purple-500 to-emerald-400',
    themeColorHex: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    cardGlow: 'shadow-[0_0_35px_rgba(236,72,153,0.35)] border-pink-400/50',
    fontStyle: "'Cinzel', serif",
    particles: ['🌸', '🦚', '🌺', '✨', '🌼'],
    particleType: 'gulal',
    defaultMessage:
      'May your days be painted with as many radiant colors as a peacock rangoli and your nights brightened with thousands of festive diyas. Wishing you a colorful, joyful Diwali!',
    description: 'Vivid festive celebrations, exquisite rangoli artistry, and multi-colored joy.',
  },
  {
    id: 'temple',
    name: 'Heavenly Divine Diwali',
    tagline: 'Radiant Goddess Lakshmi surrounded by lotuses, chants and sacred temple bells',
    taglineHindi: 'दिव्य मंदिर आशीर्वाद',
    badge: 'Spiritual Sanctum',
    thumbnail: '/assets/images/theme_divine_temple.jpg',
    backdrop: '/assets/images/theme_divine_temple.jpg',
    accentColor: 'from-yellow-300 via-amber-400 to-amber-600',
    themeColorHex: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.5)',
    cardGlow: 'shadow-[0_0_35px_rgba(253,224,71,0.35)] border-yellow-400/50',
    fontStyle: "'Cinzel', serif",
    particles: ['🪷', '🔔', '✨', '🪔', '🕉️'],
    particleType: 'lotus',
    defaultMessage:
      'Om Shreem Mahalakshmiyei Namaha. May the supreme grace of Goddess Lakshmi bestow spiritual wisdom, glowing prosperity, and eternal peace upon your entire household. Shubh Diwali!',
    description: 'Golden sanctum sanctorum glowing with lotus petals and divine tranquility.',
  },
  {
    id: 'bollywood',
    name: 'Bollywood Celebration Diwali',
    tagline: 'Glitz, stage lights, energetic dhol beats and glittering golden confetti showers',
    taglineHindi: 'बॉलीवुड जश्न धमाका',
    badge: 'Blockbuster Dhamaka',
    thumbnail: '/assets/images/theme_bollywood_celebration.jpg',
    backdrop: '/assets/images/theme_bollywood_celebration.jpg',
    accentColor: 'from-rose-500 via-purple-600 to-amber-400',
    themeColorHex: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.45)',
    cardGlow: 'shadow-[0_0_35px_rgba(225,29,72,0.35)] border-rose-400/50',
    fontStyle: "'Cinzel Decorative', 'Cinzel', serif",
    particles: ['🎉', '✨', '🎊', '💃', '🕺'],
    particleType: 'confetti',
    defaultMessage:
      'Dhol beats, sparkling lehengas, midnight sweets, and non-stop celebration! May your Diwali be a blockbuster hit filled with glamour, endless dancing, and pure magic! Happy Diwali!',
    description: 'High energy festival stage with dazzling fireworks and golden confetti.',
  },
  {
    id: 'garden',
    name: 'Dream Garden Diwali',
    tagline: 'Moonlit jasmine blossoms, fairytale lanterns and gentle night breeze in an enchanted glade',
    taglineHindi: 'स्वप्न वाटिका',
    badge: 'Poetic Serenity',
    thumbnail: '/assets/images/theme_dream_garden.jpg',
    backdrop: '/assets/images/theme_dream_garden.jpg',
    accentColor: 'from-emerald-400 via-teal-400 to-amber-300',
    themeColorHex: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    cardGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.35)] border-emerald-400/50',
    fontStyle: "'Cinzel', serif",
    particles: ['🦋', '🌸', '🏮', '🌿', '✨'],
    particleType: 'garden',
    defaultMessage:
      'Under a tranquil moonlit sky, may the sweet fragrance of night-blooming jasmine and the warmth of twinkling garden lanterns bring peace, love, and serene joy to your heart. Happy Diwali!',
    description: 'Fairytale garden pathway strewn with jasmine, lanterns, and serene glow.',
  },
  {
    id: 'palace',
    name: '3D Royal Palace Diwali',
    tagline: 'Grand imperial durbar hall adorned with crystal chandeliers and rows of oil lamps',
    taglineHindi: 'शाही राजमहल दरबार',
    badge: 'Majestic Imperial',
    thumbnail: '/assets/images/theme_royal_palace.jpg',
    backdrop: '/assets/images/theme_royal_palace.jpg',
    accentColor: 'from-amber-400 via-yellow-500 to-amber-600',
    themeColorHex: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    cardGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.35)] border-amber-400/50',
    fontStyle: "'Cinzel Decorative', 'Cinzel', serif",
    particles: ['👑', '✨', '🪔', '🏛️', '💫'],
    particleType: 'palace',
    defaultMessage:
      'May the majestic blessings of Goddess Lakshmi fill your kingdom of life with boundless wealth, royalty, good health, and eternal honor. Wishing you a glorious and Shubh Deepavali!',
    description: 'Imposing gilded arches, crystal chandeliers, and imperial court festivity.',
  },
  {
    id: 'neon',
    name: 'Neon Cyber Diwali',
    tagline: 'Holographic laser rangolis and floating neon diyas in an electrified futuristic city',
    taglineHindi: 'साइबर नियॉन दिवाली',
    badge: 'Futuristic Glow',
    thumbnail: '/assets/images/theme_neon_cyber.jpg',
    backdrop: '/assets/images/theme_neon_cyber.jpg',
    accentColor: 'from-cyan-400 via-fuchsia-500 to-amber-300',
    themeColorHex: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    cardGlow: 'shadow-[0_0_35px_rgba(6,182,212,0.4)] border-cyan-400/50',
    fontStyle: "'Outfit', sans-serif",
    particles: ['⚡', '💠', '✨', '🔷', '🟣'],
    particleType: 'neon',
    defaultMessage:
      'Upgrading your festival to the future! May this Deepavali boost your energy levels, recharge your ambitions, and illuminate your path with next-gen joy and prosperity. Happy Cyber Diwali!',
    description: 'Electrifying neon hues, holographic laser rangolis, and high-tech festive vibes.',
  },
];

export const getThemeById = (id?: string | null): DiwaliDesign => {
  if (!id) return DIWALI_DESIGNS[0];
  const normalized = id.toLowerCase().trim();
  if (normalized === 'classic') return DIWALI_DESIGNS[0]; // alias classic to royal golden
  const found = DIWALI_DESIGNS.find((d) => d.id === normalized);
  return found || DIWALI_DESIGNS[0];
};
