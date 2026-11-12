import React, { useState, useEffect } from 'react';
import RoyalEnvelope from './components/RoyalEnvelope';
import PetalCanvas from './components/PetalCanvas';
import { useAudio } from './hooks/useAudio';
import QuickNavbar from './components/QuickNavbar';
import HeroSection from './components/HeroSection';
import CoupleSection from './components/CoupleSection';
import CeremoniesSection from './components/CeremoniesSection';
import VenueSection from './components/VenueSection';
import FamilySection from './components/FamilySection';
import WishesSection from './components/WishesSection';
import WhatsAppInviteSection from './components/WhatsAppInviteSection';
import Footer from './components/Footer';
import RsvpModal from './components/RsvpModal';
import FloatingFlowerShower, { triggerFlowerShower } from './components/FlowerShower';
import { TraditionalToran } from './components/TraditionalMotifs';
import AdminDashboard from './components/admin/AdminDashboard';
import LiveWeddingFeed from './components/LiveWeddingFeed';
import { recordVisit, getLocalNotice, fetchLiveNotice, subscribeToNotice } from './lib/supabase';
import { Calendar, MapPin, Heart, MessageSquareHeart, Flower2, MessageCircle } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  // Admin Route state (supports /admin, #admin, or query param)
  const [isAdminView, setIsAdminView] = useState(() => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true')
    );
  });

  // Secret Direct-Link Route for Live Photo & Social Feed (#live, #feed, #gallery, /live, /feed)
  const checkIsFeedView = () => {
    return (
      window.location.hash === '#live' ||
      window.location.hash === '#feed' ||
      window.location.hash === '#gallery' ||
      window.location.pathname.startsWith('/live') ||
      window.location.pathname.startsWith('/feed') ||
      window.location.search.includes('live=true') ||
      window.location.search.includes('feed=true')
    );
  };

  const [isFeedView, setIsFeedView] = useState(checkIsFeedView);

  // Live Announcement Ticker Notice
  const [notice, setNotice] = useState(getLocalNotice());

  // Audio Hook (controls auspicious background music)
  const { isPlaying, playMusic, toggleMusic } = useAudio();

  // Log unique visit anonymously on first load & listen for live announcements
  useEffect(() => {
    recordVisit();

    // Fetch cloud notice from Supabase
    fetchLiveNotice().then((n) => {
      if (n) setNotice(n);
    });

    // Realtime subscription for live notice updates
    const unsubscribeNotice = subscribeToNotice((newNotice) => {
      if (newNotice) setNotice(newNotice);
    });

    const handleRouteChange = () => {
      setIsAdminView(
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      );
      setIsFeedView(checkIsFeedView());
      fetchLiveNotice().then((n) => {
        if (n) setNotice(n);
      });
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      unsubscribeNotice();
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // If in Admin Dashboard view
  if (isAdminView) {
    return (
      <AdminDashboard
        onBackToSite={() => {
          if (window.location.pathname.startsWith('/admin')) {
            window.history.pushState({}, '', '/');
          } else {
            window.location.hash = '';
          }
          setIsAdminView(false);
          setIsFeedView(checkIsFeedView());
          fetchLiveNotice().then((n) => {
            if (n) setNotice(n);
          });
        }}
      />
    );
  }

  // If in Live Social Feed view (Direct link access only)
  if (isFeedView) {
    return (
      <LiveWeddingFeed
        initialLang={lang}
        onBackToInvite={() => {
          if (
            window.location.pathname.startsWith('/live') ||
            window.location.pathname.startsWith('/feed')
          ) {
            window.history.pushState({}, '', '/');
          } else {
            window.location.hash = '';
          }
          setIsFeedView(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#4A0E17] font-sans relative selection:bg-[#9B111E] selection:text-white">
      {/* Live Announcement Banner Ticker */}
      {notice?.enabled && notice?.text && (
        <aside
          role="alert"
          aria-live="polite"
          className="bg-gradient-to-r from-amber-600 via-[#9B111E] to-amber-700 text-white text-xs sm:text-sm font-serif font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2 animate-fade-in"
        >
          <span className="text-sm sm:text-base animate-pulse">📢</span>
          <span className="tracking-wide">{notice.text}</span>
        </aside>
      )}

      {/* 1. Floating Auspicious Flower Petals Canvas */}
      <PetalCanvas />

      {/* 2. Interactive Royal Envelope Opening Experience */}
      {!envelopeOpened && (
        <RoyalEnvelope
          lang={lang}
          onOpen={() => {
            setEnvelopeOpened(true);
            playMusic();
          }}
        />
      )}

      {/* 3. Floating Flower Shower Button (Bottom-Left) */}
      <FloatingFlowerShower lang={lang} />

      {/* 4. Top Sticky Navigation (with Integrated Music Button & Language Switcher) */}
      <QuickNavbar
        lang={lang}
        setLang={setLang}
        onOpenRsvp={() => setIsRsvpOpen(true)}
        isPlaying={isPlaying}
        toggleMusic={toggleMusic}
      />

      {/* 5. Traditional Marigold & Mango Leaves Toran */}
      <TraditionalToran />

      {/* 6. Main Content Flow */}
      <main className="relative z-20">
        <HeroSection
          lang={lang}
          onOpenRsvp={() => setIsRsvpOpen(true)}
        />

        <CoupleSection lang={lang} />

        <CeremoniesSection lang={lang} />

        <VenueSection lang={lang} />

        <FamilySection lang={lang} />

        <WishesSection lang={lang} />

        {/* 7. WhatsApp Invitation Sharing Section */}
        <WhatsAppInviteSection lang={lang} />
      </main>

      {/* 8. Footer */}
      <Footer
        lang={lang}
        onReplayEnvelope={() => {
          setEnvelopeOpened(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 9. Attendance Confirmation Modal */}
      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        lang={lang}
      />

      {/* 10. Mobile Sticky Quick Action Bar (Bottom) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30 bg-white/95 backdrop-blur-md rounded-full border border-[#D4AF37] shadow-xl p-1.5 flex items-center justify-around text-[10px] font-medium text-[#4A0E17]">
        <a href="#events" className="flex flex-col items-center py-1 px-1 hover:text-[#9B111E]">
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'hi' ? 'कार्यक्रम' : 'Events'}</span>
        </a>

        <a href="#venue" className="flex flex-col items-center py-1 px-1 hover:text-[#9B111E]">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{lang === 'hi' ? 'स्थल' : 'Venue'}</span>
        </a>

        <button
          onClick={triggerFlowerShower}
          className="flex flex-col items-center py-1 px-1 text-[#9B111E] font-bold"
          title="पुष्प वर्षा"
        >
          <Flower2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>{lang === 'hi' ? 'पुष्प वर्षा' : 'Flowers'}</span>
        </button>

        <a href="#share-invite" className="flex flex-col items-center py-1 px-1 text-emerald-700 font-bold">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'hi' ? 'व्हाट्सएप' : 'Invite'}</span>
        </a>

        <button
          onClick={() => setIsRsvpOpen(true)}
          className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#9B111E] text-white font-semibold shadow-sm text-[10px]"
        >
          <Heart className="w-2.5 h-2.5 fill-current text-[#F5D77F]" />
          <span>{lang === 'hi' ? 'आगमन' : 'Attend'}</span>
        </button>
      </div>
    </div>
  );
}
