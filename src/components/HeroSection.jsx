import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { MangalKalash } from './TraditionalMotifs';

export default function HeroSection({ lang, onOpenRsvp }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(weddingData.couple.weddingDateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-6 pb-16 px-4 text-center overflow-hidden">
      {/* Decorative Traditional Mandala Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-200/20 via-[#D4AF37]/10 to-rose-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-20">
        {/* Sacred Invocation Card with Mangal Kalash */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/90 border border-[#D4AF37]/60 shadow-sm mb-5 backdrop-blur-sm">
          <MangalKalash className="w-6 h-6 shrink-0" />
          <p className="font-serif text-[#9B111E] text-xs sm:text-sm tracking-widest font-bold uppercase">
            {weddingData.shlokas.ganesh.sanskrit.split('\n')[0]}
          </p>
          <MangalKalash className="w-6 h-6 shrink-0" />
        </div>

        {/* Shloka 2-liner */}
        <div className="max-w-xl mx-auto mb-6 px-4">
          <p className="font-serif text-xs sm:text-sm text-[#7A0A15] leading-relaxed italic">
            "{weddingData.shlokas.ganesh.sanskrit.split('\n').slice(1).join(' ')}"
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-[#D4AF37]">
            <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
            <Sparkles className="w-3.5 h-3.5 text-[#EAA315]" />
            <span className="h-[1px] w-8 bg-[#D4AF37]"></span>
          </div>
        </div>

        {/* Center Logo with Breathing Gold Halo */}
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#D4AF37] rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="relative p-2 bg-white rounded-full border-4 border-[#D4AF37] shadow-royal">
            <img
              src="/wedding_logo_ds.jpg"
              alt="Shivam & Vinita Wedding Monogram"
              className="w-40 h-40 sm:w-52 sm:h-52 object-contain rounded-full"
            />
          </div>
        </div>

        {/* Grand Wedding Announcement */}
        <div className="space-y-3 mb-8">
          <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#9A7B1C] uppercase font-serif">
            {lang === 'hi' ? '॥ शुभ परिणय ॥' : 'The Sacred Union'}
          </p>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#4A0E17] leading-tight my-2">
            <span className={`${lang === 'hi' ? 'font-devanagari tracking-wide' : 'font-cinzel font-bold'} text-[#7A0A15]`}>
              {weddingData.couple.groom[lang].name}
            </span>
            <span className="inline-block mx-2 sm:mx-3 text-2xl sm:text-4xl text-[#D4AF37] font-serif font-light align-middle">
              {lang === 'hi' ? 'संग' : '&'}
            </span>
            <span className={`${lang === 'hi' ? 'font-devanagari tracking-wide' : 'font-cinzel font-bold'} text-[#7A0A15]`}>
              {weddingData.couple.bride[lang].name}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-700 max-w-lg mx-auto font-serif">
            {weddingData.quotes.milan[lang]}
          </p>
        </div>

        {/* Date & Venue Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D4AF37] text-[#9B111E] font-semibold shadow-sm font-serif">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>{weddingData.couple.weddingDateDisplay[lang]}</span>
          </div>

          <a
            href="#venue"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D4AF37] text-[#4A0E17] hover:text-[#9B111E] font-semibold shadow-sm transition-colors font-serif"
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>{weddingData.venue.name[lang]}, {lang === 'hi' ? 'मांडा खास, प्रयागराज (उ. प्र.)' : 'Manda Khas, Prayagraj (U.P)'}</span>
          </a>
        </div>

        {/* ================= Traditional Creative Muhurat Countdown ================= */}
        <div className="max-w-2xl mx-auto mb-10 relative">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-white to-[#FDFBF7] p-6 sm:p-7 rounded-[32px] border-2 border-[#D4AF37] shadow-royal relative overflow-hidden">
            {/* Header: Auspicious Muhurat Flame Title */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="text-base diya-flame">🪔</span>
              <p className="font-serif text-xs sm:text-sm font-bold text-[#9B111E] tracking-widest uppercase">
                {lang === 'hi' ? '॥ पावन मंगल वेला • शुभ मुहूर्त गणना ॥' : '॥ Auspicious Wedding Muhurat Countdown ॥'}
              </p>
              <span className="text-base diya-flame">🪔</span>
            </div>

            {/* 4 Traditional Sacred Medallions */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {[
                {
                  label: lang === 'hi' ? 'दिन' : 'Days',
                  sub: lang === 'hi' ? 'दिवस' : 'Days',
                  value: timeLeft.days,
                  icon: '☀️'
                },
                {
                  label: lang === 'hi' ? 'घंटे' : 'Hours',
                  sub: lang === 'hi' ? 'प्रहर' : 'Hours',
                  value: timeLeft.hours,
                  icon: '🪔'
                },
                {
                  label: lang === 'hi' ? 'मिनट' : 'Minutes',
                  sub: lang === 'hi' ? 'घटिका' : 'Mins',
                  value: timeLeft.minutes,
                  icon: '🔔'
                },
                {
                  label: lang === 'hi' ? 'सेकंड' : 'Seconds',
                  sub: lang === 'hi' ? 'पल' : 'Secs',
                  value: timeLeft.seconds,
                  icon: '✨'
                },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="relative group bg-gradient-to-b from-[#FAF7F0] via-white to-[#FAF7F0] p-2 sm:p-4 rounded-2xl border border-[#D4AF37] shadow-md text-center transform transition-all hover:-translate-y-0.5"
                >
                  {/* Miniature Diya Icon atop each counter */}
                  <div className="text-xs mb-0.5 opacity-80 group-hover:scale-125 transition-transform">
                    {unit.icon}
                  </div>

                  {/* Auspicious Time Value */}
                  <span className="text-2xl sm:text-4xl font-serif font-black text-[#9B111E] block tracking-tight">
                    {String(unit.value).padStart(2, '0')}
                  </span>

                  {/* Hindi & English Auspicious Time Units */}
                  <div className="mt-1 pt-1 border-t border-[#D4AF37]/30">
                    <span className="text-[11px] sm:text-xs font-serif font-bold text-[#4A0E17] block">
                      {unit.label}
                    </span>
                    <span className="text-[9px] text-[#9A7B1C] font-serif uppercase tracking-wider block">
                      {unit.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-serif text-gray-500 mt-4 italic">
              {lang === 'hi'
                ? 'शुभ लग्न बेला: 02 दिसंबर 2026 (बुधवार) • आपकी उपस्थिति ही हमारा उत्सव है'
                : 'Auspicious Muhurat: December 02, 2026, Wednesday • Eagerly awaiting your arrival'}
            </p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#events"
            className="px-6 py-3 rounded-full bg-[#9B111E] text-white font-serif font-medium text-sm shadow-md hover:bg-[#7A0A15] border border-[#D4AF37] transition-all transform hover:-translate-y-0.5"
          >
            {lang === 'hi' ? 'कार्यक्रम विवरण देखें' : 'View Ceremony Schedule'}
          </a>

          <a
            href="#wishes"
            className="px-6 py-3 rounded-full bg-white text-[#9B111E] font-serif font-medium text-sm shadow-md hover:bg-[#FAF7F0] border border-[#D4AF37] transition-all"
          >
            {lang === 'hi' ? 'वर-वधू को आशीर्वाद दें' : 'Send Blessings'}
          </a>
        </div>

        {/* Down indicator */}
        <div className="pt-10 flex justify-center text-[#D4AF37]">
          <a href="#couple" className="animate-bounce p-2 hover:text-[#9B111E] transition-colors" aria-label="Scroll down">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
