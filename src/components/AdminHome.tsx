import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  FileText,
  Download,
  AlertCircle,
  ExternalLink,
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

export const PRESET_MESSAGES = [
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGreeting, setCopiedGreeting] = useState(false);
  const [copiedBatchAll, setCopiedBatchAll] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mode: 'single' | 'batch'
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  // Batch names & generated list
  const [batchNamesInput, setBatchNamesInput] = useState('');
  const [batchGeneratedList, setBatchGeneratedList] = useState<
    Array<{ name: string; url: string; design: DesignThemeId; copied: boolean }>
  >([]);

  // Saved greeting history
  const [history, setHistory] = useState<SavedWish[]>([]);
  const recipientInputRef = useRef<HTMLInputElement>(null);

  // Can use native Web Share API
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // Base URL calculation (fully defined, never throws undefined error)
  const getBaseOrigin = (): string => {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return window.location.origin;
    }
    return '';
  };
  const getBaseUrl = getBaseOrigin;

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

  // Save selected theme to localStorage and auto-update generated link if one exists
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
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      sender: sender || undefined,
      design,
      url,
      createdAt: Date.now(),
    };
    const updated = [newEntry, ...history.filter((h) => h.name.toLowerCase() !== name.toLowerCase())].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem('diwali_wishes_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteFromHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('diwali_wishes_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('diwali_wishes_history');
    } catch {
      // ignore
    }
  };

  // Build the complete standalone wish URL with search parameters
  const createWishUrl = (
    name: string,
    sender?: string,
    messageId?: string,
    customText?: string,
    designId: DesignThemeId = selectedDesignId
  ): string => {
    const origin = getBaseUrl();
    const cleanName = name.trim();
    const params = new URLSearchParams();
    params.set('name', cleanName);
    params.set('theme', designId);

    if (sender && sender.trim()) {
      params.set('from', sender.trim());
    }

    if (messageId === 'custom' && customText && customText.trim()) {
      params.set('msg', customText.trim());
    } else if (messageId) {
      const preset = PRESET_MESSAGES.find((p) => p.id === messageId);
      if (preset) {
        params.set('msg', preset.text);
      }
    }

    return `${origin}/wish?${params.toString()}`;
  };

  // Pure frontend instant single wish generator
  const handleGenerateSingle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = recipientName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter the recipient’s name.');
      if (recipientInputRef.current) {
        recipientInputRef.current.focus();
      }
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      const url = createWishUrl(trimmed, senderName, selectedMessageId, customMessage, selectedDesignId);
      setGeneratedLink(url);
      saveToHistory(trimmed, senderName.trim(), url, selectedDesignId);
      setSuccessNotice(`Personalised Diwali link ready for ${trimmed}!`);
      setTimeout(() => setSuccessNotice(''), 4000);
      festiveAudio.playSparklerSound();
    } catch (err) {
      setErrorMessage('An unexpected error occurred while creating the link. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Pure frontend instant batch wish generator
  const handleGenerateBatch = () => {
    if (!batchNamesInput.trim()) {
      setErrorMessage('Please enter at least one recipient name.');
      return;
    }
    setErrorMessage('');
    setIsGenerating(true);

    try {
      const rawNames = batchNamesInput
        .split(/[\n,;]/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const uniqueNames = Array.from(new Set(rawNames));
      if (uniqueNames.length === 0) {
        setErrorMessage('No valid recipient names found.');
        return;
      }

      const list: Array<{ name: string; url: string; design: DesignThemeId; copied: boolean }> = [];

      for (const name of uniqueNames) {
        const url = createWishUrl(name, senderName, selectedMessageId, customMessage, selectedDesignId);
        saveToHistory(name, senderName.trim(), url, selectedDesignId);
        list.push({
          name,
          url,
          design: selectedDesignId,
          copied: false,
        });
      }

      setBatchGeneratedList(list);
      setSuccessNotice(`Generated ${list.length} personalised Diwali wish links!`);
      setTimeout(() => setSuccessNotice(''), 4000);
      festiveAudio.playFireworkSound();
    } catch (err) {
      setErrorMessage('Failed to generate batch links. Please check input format.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Robust clipboard copy with fallback
  const copyToClipboard = async (text: string, onDone?: () => void) => {
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    if (onDone) onDone();
    return success;
  };

  // Generate full text greeting with URL for copy or share
  const buildFullGreetingText = (name: string, url: string, designId: DesignThemeId = selectedDesignId): string => {
    const matchedTheme = getThemeById(designId);
    const chosenMsg =
      selectedMessageId === 'custom' && customMessage.trim()
        ? customMessage.trim()
        : PRESET_MESSAGES.find((p) => p.id === selectedMessageId)?.text || matchedTheme.defaultMessage;

    return `✨ *Happy Diwali, ${name}!* 🪔\n\n"${chosenMsg}"\n\n🌟 *Open your special ${matchedTheme.name} card:*\n👉 ${url}\n\n${
      senderName.trim() ? `With warm festive blessings,\n- ${senderName.trim()}` : 'Wishing you & your family a joyful Deepavali!'
    }`;
  };

  const shareViaWhatsApp = (name: string, url: string, designId: DesignThemeId = selectedDesignId) => {
    const text = encodeURIComponent(buildFullGreetingText(name, url, designId));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Native mobile share via Web Share API
  const handleNativeShare = async (name: string, url: string, designId: DesignThemeId = selectedDesignId) => {
    const fullText = buildFullGreetingText(name, url, designId);
    if (canNativeShare) {
      try {
        await navigator.share({
          title: `Happy Diwali, ${name}! ✨ 🪔`,
          text: fullText,
          url: url,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to whatsapp
      }
    }
    shareViaWhatsApp(name, url, designId);
  };

  // Download QR code image
  const handleDownloadQR = (url: string, name: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `diwali-wish-qr-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.target = '_blank';
    link.click();
  };

  // Copy all batch links at once
  const handleCopyAllBatch = () => {
    if (batchGeneratedList.length === 0) return;
    const allText = batchGeneratedList
      .map((item) => `🪔 ${item.name}:\n${item.url}`)
      .join('\n\n');
    copyToClipboard(allText, () => {
      setCopiedBatchAll(true);
      setTimeout(() => setCopiedBatchAll(false), 2500);
    });
  };

  const activeTheme = getThemeById(selectedDesignId);

  const currentMessageText =
    selectedMessageId === 'custom'
      ? customMessage || 'Custom heartfelt message...'
      : PRESET_MESSAGES.find((p) => p.id === selectedMessageId)?.text || activeTheme.defaultMessage;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start pb-16 z-10 overflow-x-hidden">
      <FestiveToran />

      <main className="w-full max-w-5xl px-4 mt-2">
        {/* 1. Header Hero (Home Section) */}
        <section id="home" className="text-center mb-6 pt-2 scroll-mt-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sender Wish Studio · Instant Link Generation & 10 Festive Games</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight font-serif gold-shimmer-text drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
          >
            Personalised Diwali Wishes
          </h1>
          <p className="mt-2 text-sm sm:text-base text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
            Choose from 11 distinct Diwali themes, enter the recipient's name, and generate an instant personalized link.
            Recipients experience an unsealing royal envelope, glowing diyas, fireworks, and 10 interactive festive games!
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

        {/* 3. Personalize & Generate Greeting Card Section */}
        <section id="generate-section" className="festive-card-glass rounded-2xl gold-border-glow shadow-2xl p-5 sm:p-7 backdrop-blur-xl mb-8 scroll-mt-20">
          {/* Mode switch: Single vs Batch */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-amber-500/20 gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100 flex items-center gap-2">
                <span>Personalize Your Greeting</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 capitalize font-sans">
                  {activeTheme.name}
                </span>
              </h2>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Generate an immediate link ready to copy, share on WhatsApp, or send via mobile.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-amber-500/30 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'single'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-amber-300/80 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Single Wish</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('batch')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'batch'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-amber-300/80 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Batch Wishes</span>
              </button>
            </div>
          </div>

          {/* Form Columns: Inputs & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Inputs */}
            <div className="lg:col-span-7 space-y-5">
              {/* Recipient Name (Single) */}
              {mode === 'single' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                    Recipient Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={recipientInputRef}
                      type="text"
                      value={recipientName}
                      onChange={(e) => {
                        setRecipientName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerateSingle();
                        }
                      }}
                      placeholder="e.g. Rahul, Priya, Vikram & Family..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0e041c] border border-amber-500/40 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                    />
                    <Sparkles className="w-4 h-4 text-amber-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                  {errorMessage && (
                    <p className="text-xs text-rose-400 mt-1.5 font-medium flex items-center gap-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                    Recipient Names (Comma, Semicolon, or New Line separated) <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={batchNamesInput}
                    onChange={(e) => {
                      setBatchNamesInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Rahul, Priya, Uncle & Aunty, Vikram, Sharma Family..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0e041c] border border-amber-500/40 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all resize-none"
                  />
                  {errorMessage && (
                    <p className="text-xs text-rose-400 mt-1.5 font-medium flex items-center gap-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </p>
                  )}
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

              {/* Instant Generate Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={mode === 'single' ? () => handleGenerateSingle() : handleGenerateBatch}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

              {/* Success Notification Banner */}
              {successNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-400/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}
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
              <div className="w-full rounded-2xl border border-amber-500/40 shadow-inner relative overflow-hidden flex flex-col items-center text-center bg-[#0d031c]">
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

              {/* Generated Single Link Box with Multi-Action Send Hub */}
              {generatedLink && mode === 'single' && (
                <div className="w-full mt-5 p-4 rounded-xl bg-purple-950/70 border-2 border-amber-400/60 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Ready to Share for {recipientName}!</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQR(!showQR)}
                      className="text-[11px] text-amber-400 hover:text-amber-200 flex items-center gap-1 font-semibold cursor-pointer px-2 py-0.5 rounded bg-black/40 border border-amber-500/30"
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

                  {/* Actions Grid: Copy Link, Copy Greeting, WhatsApp & Native Share */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. Copy Link */}
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(generatedLink, () => {
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2500);
                        })
                      }
                      className="w-full py-2.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {/* 2. Copy Full Greeting Message */}
                    <button
                      type="button"
                      onClick={() => {
                        const full = buildFullGreetingText(recipientName, generatedLink, selectedDesignId);
                        copyToClipboard(full, () => {
                          setCopiedGreeting(true);
                          setTimeout(() => setCopiedGreeting(false), 2500);
                        });
                      }}
                      className="w-full py-2.5 px-2 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-400/40 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedGreeting ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Greeting Copied!</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5 text-indigo-300" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>

                    {/* 3. Share to WhatsApp */}
                    <button
                      type="button"
                      onClick={() => shareViaWhatsApp(recipientName, generatedLink, selectedDesignId)}
                      className="w-full py-2.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp Share</span>
                    </button>

                    {/* 4. Native Mobile Share / Apps */}
                    <button
                      type="button"
                      onClick={() => handleNativeShare(recipientName, generatedLink, selectedDesignId)}
                      className="w-full py-2.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share via Apps</span>
                    </button>
                  </div>

                  {/* QR Code view */}
                  {showQR && (
                    <div className="pt-2 flex flex-col items-center animate-fadeIn p-3 bg-black/40 rounded-xl border border-amber-500/30">
                      <div className="p-3 bg-white rounded-xl shadow-lg">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                            generatedLink
                          )}`}
                          alt="Diwali Wish QR Code"
                          className="w-36 h-36"
                        />
                      </div>
                      <span className="text-[11px] text-amber-300/80 mt-2">Scan with any phone camera to view</span>
                      <button
                        type="button"
                        onClick={() => handleDownloadQR(generatedLink, recipientName)}
                        className="mt-2 text-[11px] text-amber-400 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download QR Code Image</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Batch Generated Links Table */}
          {mode === 'batch' && batchGeneratedList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-amber-500/20 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                    <span>Generated Batch Links ({batchGeneratedList.length} Recipients)</span>
                    <span className="text-xs text-amber-400 font-normal">· {activeTheme.name}</span>
                  </h3>
                  <p className="text-[11px] text-amber-300/70">1-click WhatsApp or Copy for each recipient</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAllBatch}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedBatchAll ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">All Links Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy All Links</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {batchGeneratedList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-purple-950/40 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="truncate min-w-0 w-full sm:w-auto">
                      <span className="font-semibold text-amber-200 text-sm">{item.name}</span>
                      <p className="text-[11px] text-amber-400/60 truncate font-mono mt-0.5">{item.url}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      {/* Copy Single */}
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

                      {/* WhatsApp */}
                      <button
                        type="button"
                        onClick={() => shareViaWhatsApp(item.name, item.url, item.design)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Preview */}
                      <button
                        type="button"
                        onClick={() =>
                          onPreviewCard(
                            item.name,
                            senderName.trim() || undefined,
                            currentMessageText,
                            item.design
                          )
                        }
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 cursor-pointer"
                        title={`Preview ${item.name}'s Card`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Recently Generated History with Quick Actions */}
        {history.length > 0 && (
          <div className="mt-8 p-5 rounded-2xl festive-card-glass border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Recently Created Greetings ({history.length})</span>
              </h3>
              <button
                type="button"
                onClick={clearAllHistory}
                className="text-[11px] text-amber-400/60 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All History</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#0d0319] border border-amber-500/20 flex flex-col justify-between gap-2.5 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-amber-200 truncate">{item.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 capitalize border border-amber-500/25">
                        {item.design || 'royal'}
                      </span>
                    </div>
                    {item.sender && (
                      <p className="text-[11px] text-amber-300/70 mt-0.5">From {item.sender}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-amber-500/10">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(item.url, () => {
                          setSuccessNotice(`Link copied for ${item.name}!`);
                          setTimeout(() => setSuccessNotice(''), 2500);
                        })
                      }
                      className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium text-center cursor-pointer transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      type="button"
                      onClick={() => shareViaWhatsApp(item.name, item.url, item.design || 'royal')}
                      className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 cursor-pointer"
                      title="Share to WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewCard(
                          item.name,
                          item.sender,
                          undefined,
                          item.design || 'royal'
                        )
                      }
                      className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-amber-300 border border-amber-500/30 cursor-pointer"
                      title="Preview Card"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFromHistory(item.id)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 cursor-pointer transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3 h-3" />
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
