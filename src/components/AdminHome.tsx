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
  X,
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

  const getBaseUrl = () => {
    return window.location.origin;
  };

  const createWishUrl = (
    name: string,
    sender?: string,
    messageId?: string,
    customText?: string,
    designId: DesignThemeId = selectedDesignId,
    backendId?: string
  ) => {
    const params = new URLSearchParams();

    params.set('name', name.trim());
    params.set('theme', designId);

    if (backendId) {
      params.set('id', backendId);
    }

    if (sender?.trim()) {
      params.set('from', sender.trim());
    }

    let message = '';

    if (messageId === 'custom') {
      message = customText?.trim() || '';
    } else {
      message =
        PRESET_MESSAGES.find((p) => p.id === messageId)?.text ||
        getThemeById(designId).defaultMessage;
    }

    if (message) {
      params.set('msg', message);
    }

    return `${getBaseUrl()}/wish?${params.toString()}`;
  };

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

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('diwali_wishes_history');
    } catch {
      // ignore
    }
  };

  const handleGenerateSingle = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!recipientName.trim()) {
      setErrorMessage("Please enter the recipient's name.");
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      const url = createWishUrl(
        recipientName,
        senderName,
        selectedMessageId,
        customMessage,
        selectedDesignId
      );

      setGeneratedLink(url);

      saveToHistory(
        recipientName.trim(),
        senderName.trim(),
        url,
        selectedDesignId
      );

      try {
        festiveAudio.playSparklerSound();
      } catch (audioError) {
        console.warn('Audio playback unavailable:', audioError);
      }
    } catch (error) {
      console.error('Link generation failed:', error);
      setErrorMessage('Unable to generate your greeting link. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBatch = async () => {
    if (!batchNamesInput.trim()) {
      setErrorMessage('Please enter at least one recipient name.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      const names = Array.from(
        new Set(
          batchNamesInput
            .split(/[\n,]/)
            .map((name) => name.trim())
            .filter(Boolean)
        )
      );

      const list = names.map((name) => {
        const url = createWishUrl(
          name,
          senderName,
          selectedMessageId,
          customMessage,
          selectedDesignId
        );

        return {
          name,
          url,
          design: selectedDesignId,
          copied: false,
        };
      });

      setBatchGeneratedList(list);

      list.forEach((item) => {
        saveToHistory(
          item.name,
          senderName.trim(),
          item.url,
          item.design
        );
      });

      try {
        festiveAudio.playFireworkSound();
      } catch (audioError) {
        console.warn('Audio playback unavailable:', audioError);
      }
    } catch (error) {
      console.error('Batch generation failed:', error);
      setErrorMessage('Unable to generate links. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, onDone?: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      if (onDone) onDone();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard error:', error);
      setErrorMessage('Unable to copy. Please copy the link manually.');
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
                      <span>Creating Festive Greeting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      <span>{mode === 'single' ? 'Generate Greeting Link' : 'Generate Batch Links'}</span>
                    <
