import React, { useState, useEffect } from 'react';
import { AdminHome } from './components/AdminHome';
import { DesignCard } from './components/DesignCard';
import { Navbar } from './components/Navbar';
import { DiwaliFunZone } from './components/games/DiwaliFunZone';
import { DesignThemeId, DIWALI_DESIGNS, getThemeById } from './types/theme';

export default function App() {
  const [view, setView] = useState<'home' | 'card'>('home');
  const [isRecipient, setIsRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState('Rahul');
  const [senderName, setSenderName] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [designId, setDesignId] = useState<DesignThemeId>('royal');
  const [showFunZone, setShowFunZone] = useState(false);
  const [isLoadingWish, setIsLoadingWish] = useState(false);

  // Initialize and parse route on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseRoute = async () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const isWishPath = pathname.startsWith('/wish') || params.has('id') || params.has('name');

      if (isWishPath) {
        setIsRecipient(true);
        setView('card');

        const wishId = params.get('id');
        const nameParam = params.get('name');
        const themeParam = params.get('theme') || params.get('design');
        const fromParam = params.get('from');
        const msgParam = params.get('msg');

        // If backend wish ID is provided, fetch exact record
        if (wishId) {
          setIsLoadingWish(true);
          try {
            const res = await fetch(`/api/wishes/${encodeURIComponent(wishId)}`, {
              headers: { 'X-Recipient-View': 'true' },
            });
            if (res.ok) {
              const data = await res.json();
              setRecipientName(data.name || nameParam || 'Friend');
              setSenderName(data.sender || fromParam || undefined);
              setMessage(data.message || msgParam || undefined);
              setDesignId(getThemeById(data.theme).id);
              setIsLoadingWish(false);
              return;
            }
          } catch {
            // fallback to URL parameters below
          }
          setIsLoadingWish(false);
        }

        // Direct URL parameter fallback
        if (nameParam && nameParam.trim()) {
          setRecipientName(nameParam.trim());
        }
        if (fromParam && fromParam.trim()) {
          setSenderName(fromParam.trim());
        }
        if (msgParam && msgParam.trim()) {
          setMessage(msgParam.trim());
        }
        if (themeParam) {
          setDesignId(getThemeById(themeParam).id);
        }
      } else {
        // Sender mode
        setIsRecipient(false);
        setView('home');
      }
    };

    parseRoute();

    const handlePopState = () => parseRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sender triggered preview
  const handlePreviewCard = (
    name: string,
    sender?: string,
    msgText?: string,
    theme: DesignThemeId = 'royal'
  ) => {
    setRecipientName(name || 'Rahul');
    setSenderName(sender);
    setMessage(msgText);
    setDesignId(getThemeById(theme).id);
    setIsRecipient(false); // sender preview
    setView('card');
    setShowFunZone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToStudio = () => {
    if (isRecipient) return; // Recipient is view-only, cannot navigate to studio
    setView('home');
    setShowFunZone(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090212] text-[#fbf5e8] flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Sticky Festive Navigation Header */}
      <Navbar
        onOpenPreview={() => handlePreviewCard(recipientName, senderName, message, designId)}
        onGoHome={handleReturnToStudio}
        isCardView={view === 'card'}
        isRecipient={isRecipient}
      />

      {/* Main Body View (Studio or Card) */}
      <div className="flex-1">
        {view === 'home' && !isRecipient ? (
          <AdminHome onPreviewCard={handlePreviewCard} />
        ) : (
          <div className="flex flex-col items-center">
            {/* The Full Theme Greeting Card with Envelope Reveal & Theme Ambient FX */}
            <DesignCard
              recipientName={recipientName}
              senderName={senderName}
              customMessage={message}
              designId={designId}
              isRecipient={isRecipient}
              onOpenGames={() => {
                setShowFunZone(true);
              }}
              onBackToStudio={!isRecipient ? handleReturnToStudio : undefined}
            />

            {/* Embedded 10 Games Fun Zone automatically below greeting */}
            <div className="w-full max-w-5xl px-4 mt-6 mb-16">
              <DiwaliFunZone
                titlePrefix={`Dear ${recipientName},`}
                onBackToGreeting={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-amber-500/20 bg-[#06010c] text-center text-xs text-amber-300/70 relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🪔</span>
            <span className="font-serif font-bold text-amber-200">Personalised Happy Diwali Wishes</span>
          </div>

          <p className="text-[11px] text-amber-400/60 font-serif">
            May millions of sacred diyas illuminate your home with peace, health & prosperity.
          </p>

          <div className="text-[11px] text-amber-300/80">
            Shubh Deepavali ✨ 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
