import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Eye,
  Users,
  User,
  QrCode,
  Flame,
  CheckCircle2,
  Trash2,
  Loader2,
} from 'lucide-react';
import { FestiveToran } from './FestiveToran';
import { DesignSelector } from './DesignSelector';
import { DiwaliFunZone } from './games/DiwaliFunZone';
import { AboutDiwali } from './AboutDiwali';
import { DesignThemeId, DIWALI_DESIGNS, getThemeById } from '../types/theme';
import { festiveAudio } from '../utils/audio';

interface SavedWish {
  id: string;
  name: string;
  sender?: string;
  design?: DesignThemeId;
  url: string;
  createdAt: number;
}

interface AdminHomeProps {
  onPreviewCard: (name: string, sender?: string, message?: string, design?: DesignThemeId) => void;
}

const PRESET_MESSAGES = [
  {
    id: 'classic',
    title: 'Traditional Blessing (Classic)',
    text: 'May this Diwali bring happiness, prosperity, success and endless blessings into your life. May your home shine with love, laughter and positivity. Wishing you and your family a very Happy Diwali!',
  },
  {
    id: 'prosperity',
    title: 'Wealth & Prosperity (Lakshmi Blessings)',
    text: 'On this auspicious festival of lights, may Goddess Lakshmi bless you with abundance, good health, and glorious achievements. Have a blessed and prosperous Happy Diwali!',
  },
  {
    id: 'family',
    title: 'Warmth, Family & Joy',
    text: 'May the divine glow of diyas fill your home with warmth, love, and sweet festive moments with family. Wishing you a sparkling and joyous Diwali celebration!',
  },
  {
    id: 'spiritual',
    title: 'Peace & Inner Light',
    text: 'Lead from darkness to light, ignorance to knowledge. May the sacred flame of Deepavali ignite inner peace, clarity, and boundless divine grace. Happy Diwali!',
  },
];

export const AdminHome: React.FC<AdminHomeProps> = ({ onPreviewCard }) => {
  // Read persisted theme from localStorage on initial load
  const [selectedDesignId, setSelectedDesignId] = useState<DesignThemeId>(() => {
    try {
      const savedTheme = localStorage.getItem('diwali_selected_theme');
      if (savedTheme) {
        const matched = DIWALI_DESIGNS.find((d) => d.id === savedTheme);
        if (matched) return matched.id;
      }
    } catch {
      // ignore
    }
    return 'royal';
  });

  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState('classic');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mode: 'single' | 'batch'
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  // Batch names
  const [batchNamesInput, setBatchNamesInput] = useState('');
  const [batchGeneratedList, setBatchGeneratedList] = useState<
    Array<{ name: string; url: string; design: DesignThemeId; copied: boolean }>
  >([]);

  // Local storage history
  const [history, setHistory] = useState<SavedWish[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('diwali_wishes_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save selected theme to localStorage whenever it changes
  const handleSelectDesign = (newDesignId: DesignThemeId) => {
    setSelectedDesignId(newDesignId);
    try {
      localStorage.setItem('diwali_selected_theme', newDesignId);
    } catch {
      // ignore
    }
    // If a link was already generated for current recipient, update it immediately with new theme
    if (recipientName.trim()) {
      const updatedUrl = createWishUrl(recipientName, senderName, selectedMessageId, customMessage, newDesignId);
      setGeneratedLink(updatedUrl);
    }
  };

  const saveToHistory = (name: string, sender: string, url: string, design: DesignThemeId) => {
    const newEntry: SavedWish = {
      id: Date.now().toString(),
      name,
      sender: sender || undefined,
      design,
      url,
      createdAt: Date.now(),
    };
    const updated = [newEntry, ...history.filter((h) => h.name.toLowerCase() !== name.toLowerCase())].slice(0, 15);
    setHistory(updated);
    try {
      localStorage.setItem('diwali_wishes_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const getBaseUrl = () => {
  return `${window.location.origin}/`;
};

  const createWishUrl = (
    name: string,
    sender?: string,
    messageId?: string,
    customText?: string,
    designId: DesignThemeId = selectedDesignId,
    backendId?: string
  ) => {
    const origin = getBaseOrigin();
    const params = new URLSearchParams();
    params.set('name', name.trim());
    params.set('theme', designId);

    if (backendId) {
      params.set('id', backendId);
    }
    if (sender && sender.trim()) {
      params.set('from', sender.trim());
    }
    if (messageId === 'custom' && customText && customText.trim()) {
      params.set('msg', customText.trim());
    } else if (messageId && messageId !== 'classic') {
      const preset = PRESET_MESSAGES.find((p) => p.id === messageId);
      if (preset) {
        params.set('msg', preset.text);
      }
    }
    return `${origin}/wish?${params.toString()}`;
  };

  const handleGenerateSingle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recipientName.trim()) {
      setErrorMessage('Please enter the recipient’s name.');
      return;
    }
    setErrorMessage('');
    setIsGenerating(true);

    const activeTheme = getThemeById(selectedDesignId);
    const chosenMsg =
      selectedMessageId === 'custom' && customMessage.trim()
        ? customMessage.trim()
        : PRESET_MESSAGES.find((p) => p.id === selectedMessageId)?.text || activeTheme.defaultMessage;

    let backendWishId: string | undefined = undefined;

    // Register with backend API
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipientName.trim(),
          sender: senderName.trim() || undefined,
          theme: selectedDesignId,
          message: chosenMsg,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        backendWishId = data.id;
      }
    } catch {
      // Fallback works seamlessly via query parameters
    }

    const url = createWishUrl(recipientName, senderName, selectedMessageId, customMessage, selectedDesignId, backendWishId);
    setGeneratedLink(url);
    saveToHistory(recipientName.trim(), senderName.trim(), url, selectedDesignId);
    setIsGenerating(false);

    festiveAudio.playSparklerSound();
  };

  const handleGenerateBatch = async () => {
    if (!batchNamesInput.trim()) {
      setErrorMessage('Please enter at least one recipient name.');
      return;
    }
    setErrorMessage('');
    setIsGenerating(true);

    const rawNames = batchNamesInput
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const uniqueNames = Array.from(new Set(rawNames));

    const list: Array<{ name: string; url: string; design: DesignThemeId; copied: boolean }> = [];

    for (const name of uniqueNames) {
      let backendWishId: string | undefined = undefined;
      try {
        const response = await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            sender: senderName.trim() || undefined,
            theme: selectedDesignId,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          backendWishId = data.id;
        }
      } catch {
        // ignore
      }

      const url = createWishUrl(name, senderName, selectedMessageId, customMessage, selectedDesignId, backendWishId);
      saveToHistory(name, senderName.trim(), url, selectedDesignId);
      list.push({
        name,
        url,
        design: selectedDesignId,
        copied: false,
      });
    }

    setBatchGeneratedList(list);
    setIsGenerating(false);
    festiveAudio.playFireworkSound();
  };

  const copyToClipboard = async (text: string, onDone?: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      if (onDone) onDone();
    } catch {
      if (onDone) onDone();
    }
  };

  const shareViaWhatsApp = (name: string, url: string, designId: DesignThemeId = selectedDesignId) => {
    const matchedTheme = getThemeById(designId);
    const chosenMsg =
      selectedMessageId === 'custom' && customMessage.trim()
        ? customMessage.trim()
        : PRESET_MESSAGES.find((p) => p.id === selectedMessageId)?.text || matchedTheme.defaultMessage;

    const text = encodeURIComponent(
      `✨ *Happy Diwali, ${name}!* 🪔\n\n"${chosenMsg}"\n\n🌟 *Open your special ${matchedTheme.name} card:*\n👉 ${url}\n\n${
        senderName.trim() ? `With warm blessings,\n- ${senderName.trim()}` : 'Wishing you & your family a joyful Diwali!'
      }`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const activeTheme = getThemeById(selectedDesignId);

  const currentMessageText =
    selectedMessageId === 'custom'
      ? customMessage || 'Custom heartfelt message...'
      : PRESET_MESSAGES.find((p) => p.id === selectedMessageId)?.text || activeTheme.defaultMessage;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start pb-16 z-10">
      <FestiveToran />

      <main className="w-full max-w-5xl px-4 mt-2">
        {/* 1. Header Hero (Home Section) */}
        <section id="home" className="text-center mb-6 pt-2 scroll-mt-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sender Wish Studio · Create & Share Personalised Greetings</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight font-serif gold-shimmer-text drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
          >
            Personalised Diwali Wishes
          </h1>
          <p className="mt-2 text-sm sm:text-base text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
            Choose from 11 distinct Diwali themes, enter the recipient's name, and generate a view-only interactive greeting link.
            Recipients experience an unsealing envelope, glowing diyas, fireworks, and 10 festive games!
          </p>
        </section>

        {/* 2. Choose Your Diwali Theme Section (11 Themes) */}
        <section id="choose-theme" className="festive-card-glass rounded-2xl gold-border-glow shadow-2xl p-5 sm:p-7 backdrop-blur-xl mb-8 scroll-mt-20">
          <DesignSelector
            selectedDesignId={selectedDesignId}
            onSelectDesign={handleSelectDesign}
            onLivePreviewDesign={(id) => {
              handleSelectDesign(id);
              onPreviewCard(
                recipientName.trim() || 'Rahul',
                senderName.trim() || undefined,
                currentMessageText,
                id
              );
            }}
          />
        </section>

        {/* 3. Personalisation Controls & Card Box (Create Wishes Section) */}
        <section id="create-wishes" className="festive-card-glass rounded-2xl gold-border-glow shadow-2xl p-6 sm:p-8 backdrop-blur-xl mb-8 scroll-mt-20">
          {/* Mode Selector Tabs (Single vs Multi-Person Batch) */}
          <div className="flex items-center justify-center mb-6">
            <div className="p-1 rounded-xl bg-purple-950/70 border border-amber-500/30 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'single'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md'
                    : 'text-amber-300 hover:text-amber-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Single Recipient</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('batch')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'batch'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md'
                    : 'text-amber-300 hover:text-amber-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Multi-Person Batch</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-7 space-y-5">
              {mode === 'single' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                    Recipient's Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. Rahul, Sneha, Uncle & Aunty..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0e041c] border border-amber-500/40 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                  />
                  {errorMessage && <p className="text-xs text-rose-400 mt-1 font-medium">{errorMessage}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                    Recipient Names (Comma or New Line separated) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={batchNamesInput}
                    onChange={(e) => {
                      setBatchNamesInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Rahul, Priya, Amit, Uncle & Aunty, Vikram..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0e041c] border border-amber-500/40 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all resize-none"
                  />
                  {errorMessage && <p className="text-xs text-rose-400 mt-1 font-medium">{errorMessage}</p>}
                </div>
              )}

              {/* Sender Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                  Your Name (Sender) <span className="text-amber-400/60 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Ankit, The Sharma Family..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0e041c] border border-amber-500/40 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                />
              </div>

              {/* Message Preset Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                  Select Diwali Message
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_MESSAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedMessageId(preset.id)}
                      className={`p-3 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                        selectedMessageId === preset.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-medium ring-1 ring-amber-400/50'
                          : 'bg-[#0e041c]/70 border-amber-500/20 text-amber-300/80 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Flame
                          className={`w-3.5 h-3.5 ${
                            selectedMessageId === preset.id ? 'text-amber-400' : 'text-amber-600'
                          }`}
                        />
                        <span className="font-semibold text-amber-200">{preset.title}</span>
                      </div>
                      <p className="text-[11px] text-amber-200/60 line-clamp-2 leading-relaxed">{preset.text}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMessageId('custom')}
                    className={`text-xs flex items-center gap-1.5 cursor-pointer ${
                      selectedMessageId === 'custom'
                        ? 'text-amber-300 font-semibold underline'
                        : 'text-amber-400/70 hover:text-amber-300'
                    }`}
                  >
                    <span>Or write a custom personal wish</span>
                  </button>
                  {selectedMessageId === 'custom' && (
                    <textarea
                      rows={3}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Type your heartfelt Diwali wish here..."
                      className="mt-2 w-full px-3.5 py-2.5 rounded-xl bg-[#0e041c] border border-amber-500/40 text-amber-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                    />
                  )}
                </div>
              </div>

              {/* Generate Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={mode === 'single' ? () => handleGenerateSingle() : handleGenerateBatch}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Generating Personalised Link...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-stone-950" />
                      <span>
                        {mode === 'single' ? `Generate ${activeTheme.name} Wish Link ✨` : 'Generate All Wish Links ✨'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Live Card Preview & Share Hub */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full text-left mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Immediate Card Preview
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onPreviewCard(
                      recipientName.trim() || 'Rahul',
                      senderName.trim() || undefined,
                      currentMessageText,
                      selectedDesignId
                    )
                  }
                  className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Screen Preview</span>
                </button>
              </div>

              {/* Dynamic Theme Preview Card that updates IMMEDIATELY when theme or inputs change */}
              <div className="w-full rounded-2xl border border-amber-500/40 shadow-inner relative overflow-hidden flex flex-col items-center text-center">
                {/* Background image preview */}
                <div className="relative w-full h-36 overflow-hidden">
                  <img
                    src={activeTheme.thumbnail}
                    alt={activeTheme.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e041c] via-[#0e041c]/40 to-transparent" />
                  <div className="absolute top-2 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-amber-300 border border-amber-400/30">
                    Theme: {activeTheme.name}
                  </div>
                  <div className="absolute top-2 right-3 text-lg">
                    {activeTheme.particles[0]}
                  </div>
                </div>

                <div className="p-4 w-full bg-[#0e041c] flex flex-col items-center">
                  <div
                    className="text-amber-300 text-lg sm:text-xl font-bold tracking-tight gold-gradient-text"
                    style={{ fontFamily: activeTheme.fontStyle }}
                  >
                    Happy Diwali, {recipientName.trim() || 'Rahul'}! 🪔
                  </div>

                  {senderName.trim() && (
                    <p className="text-[11px] text-amber-300/80 mt-0.5">From {senderName.trim()}</p>
                  )}

                  <p className="text-xs text-amber-100/90 italic font-sans leading-relaxed line-clamp-3 px-2 mt-2">
                    "{currentMessageText}"
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Interactive Diya
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Fireworks
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      10 Games
                    </span>
                  </div>
                </div>
              </div>

              {/* Generated Single Link Box */}
              {generatedLink && mode === 'single' && (
                <div className="w-full mt-5 p-4 rounded-xl bg-purple-950/60 border border-amber-400/50 shadow-xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Link Generated for {recipientName}!
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQR(!showQR)}
                      className="text-[11px] text-amber-400 hover:text-amber-200 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{showQR ? 'Hide QR' : 'Show QR'}</span>
                    </button>
                  </div>

                  {/* URL Text Container */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0214] border border-amber-500/30">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="w-full bg-transparent text-xs text-amber-200 truncate focus:outline-none select-all font-mono"
                    />
                  </div>

                  {/* Actions: Copy Link & WhatsApp Share */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(generatedLink, () => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        })
                      }
                      className="w-full py-2.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => shareViaWhatsApp(recipientName, generatedLink, selectedDesignId)}
                      className="w-full py-2.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  {/* QR Code view */}
                  {showQR && (
                    <div className="pt-2 flex flex-col items-center animate-fadeIn">
                      <div className="p-3 bg-white rounded-xl shadow-lg">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                            generatedLink
                          )}`}
                          alt="Diwali Wish QR Code"
                          className="w-32 h-32"
                        />
                      </div>
                      <span className="text-[11px] text-amber-300/70 mt-1">Scan with phone to open greeting</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Batch Generated Links Table */}
          {mode === 'batch' && batchGeneratedList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-amber-500/20 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-amber-200">
                  Generated Links ({batchGeneratedList.length} Recipients · {activeTheme.name})
                </h3>
                <span className="text-xs text-amber-400/80">1-click WhatsApp or Copy for each</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {batchGeneratedList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-purple-950/40 border border-amber-500/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="truncate min-w-0">
                      <span className="font-semibold text-amber-200">{item.name}</span>
                      <p className="text-[11px] text-amber-400/60 truncate">{item.url}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(item.url, () => {
                            const updated = [...batchGeneratedList];
                            updated[idx].copied = true;
                            setBatchGeneratedList(updated);
                            setTimeout(() => {
                              const reset = [...batchGeneratedList];
                              if (reset[idx]) reset[idx].copied = false;
                              setBatchGeneratedList(reset);
                            }, 2000);
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium cursor-pointer"
                      >
                        {item.copied ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        type="button"
                        onClick={() => shareViaWhatsApp(item.name, item.url, item.design)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Recently Generated History with Design Badges */}
        {history.length > 0 && (
          <div className="mt-10 p-5 rounded-2xl festive-card-glass border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Recently Created Greetings</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('diwali_wishes_history');
                }}
                className="text-[11px] text-amber-400/60 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#0d0319] border border-amber-500/20 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-amber-200 truncate">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 capitalize border border-amber-500/25">
                        {item.design || 'royal'}
                      </span>
                    </div>
                    {item.sender && (
                      <p className="text-[11px] text-amber-300/70">From {item.sender}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-amber-500/10">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(item.url, () => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        })
                      }
                      className="flex-1 py-1 px-2 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] text-center cursor-pointer"
                    >
                      Copy Link
                    </button>
                    <button
                      type="button"
                      onClick={() => shareViaWhatsApp(item.name, item.url, item.design || 'royal')}
                      className="p-1.5 rounded bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 cursor-pointer"
                      title="Share to WhatsApp"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Diwali Fun Zone Section (10 Games) */}
        <div className="mt-12">
          <DiwaliFunZone />
        </div>

        {/* 5. About Diwali Cultural Section */}
        <div className="mt-8">
          <AboutDiwali />
        </div>
      </main>
    </div>
  );
};
