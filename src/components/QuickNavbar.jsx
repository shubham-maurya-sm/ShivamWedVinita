import React from 'react';
import { Languages, Calendar, MapPin, Heart, Users, MessageSquareHeart, MessageCircle } from 'lucide-react';
import { NavAudioButton } from './AudioPlayer';

export default function QuickNavbar({ lang, setLang, onOpenRsvp, isPlaying, toggleMusic }) {
  const toggleLang = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const navLinks = [
    { href: '#couple', label: lang === 'hi' ? 'वर-वधू' : 'Couple', icon: Heart },
    { href: '#events', label: lang === 'hi' ? 'कार्यक्रम' : 'Events', icon: Calendar },
    { href: '#venue', label: lang === 'hi' ? 'स्थल' : 'Venue', icon: MapPin },
    { href: '#family', label: lang === 'hi' ? 'परिवार' : 'Family', icon: Users },
    { href: '#wishes', label: lang === 'hi' ? 'आशीर्वाद' : 'Wishes', icon: MessageSquareHeart },
    { href: '#share-invite', label: lang === 'hi' ? 'व्हाट्सएप निमंत्रण' : 'WhatsApp Invite', icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Brand / Couple Monogram */}
        <a href="#hero" className="flex items-center gap-2 group">
          <img
            src="/wedding_logo_ds.jpg"
            alt="DS Logo"
            className="w-9 h-9 object-contain rounded-full border border-[#D4AF37] group-hover:scale-105 transition-transform"
          />
          <div className="hidden sm:block">
            <span className="font-serif font-bold text-sm text-[#4A0E17] tracking-wider block leading-tight">
              शिवम <span className="text-[#9B111E] font-normal">&</span> विनीता
            </span>
            <span className="text-[10px] text-[#9A7B1C] uppercase tracking-widest block font-serif font-semibold">
              02 Dec 2026
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-wider font-serif font-semibold text-[#4A0E17] hover:text-[#9B111E] transition-colors flex items-center gap-1.5"
            >
              <item.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Integrated Music Button (Top Header - Takes zero bottom space) */}
          <NavAudioButton
            isPlaying={isPlaying}
            toggleMusic={toggleMusic}
            lang={lang}
          />

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#D4AF37] bg-white text-xs font-serif font-semibold text-[#7A0A15] hover:bg-[#FAF7F0] shadow-sm transition-all"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Attendance Confirmation Button */}
          {/* <button
            onClick={onOpenRsvp}
            className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#9B111E] text-white text-xs font-serif font-semibold hover:bg-[#7A0A15] shadow-sm hover:shadow-gold-sm transition-all border border-[#D4AF37]/50"
          >
            {lang === 'hi' ? 'आने की सूचना दें' : 'Confirm Attendance'}
          </button> */}
        </div>
      </div>
    </header>
  );
}
