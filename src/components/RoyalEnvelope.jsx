import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MailOpen } from 'lucide-react';
import { MangalKalash } from './TraditionalMotifs';

export default function RoyalEnvelope({ onOpen, lang }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpening(true);

    // Pure Marigold Petal Shower
    const marigoldColors = ['#F59E0B', '#FBBF24', '#EAA315', '#D97706', '#EA580C', '#FEF08A'];
    try {
      confetti({
        particleCount: 65,
        spread: 90,
        origin: { y: 0.55 },
        colors: marigoldColors,
        scalar: 1.5,
        gravity: 0.6,
        ticks: 240
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-1000 ${
      isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Royal Wedding Invitation Cover Card */}
      <div className={`relative w-full max-w-md bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF7F0] rounded-3xl p-6 sm:p-8 text-center border border-[#D4AF37]/80 shadow-2xl transition-all duration-1000 ${
        isOpening ? 'scale-110 -translate-y-8 rotate-1' : 'scale-100'
      }`}>

        {/* Auspicious Ganesh Inscription */}
        <div className="flex items-center justify-center gap-2 mb-4 text-[#9B111E]">
          <MangalKalash className="w-7 h-7 shrink-0" />
          <span className="font-serif text-sm tracking-widest font-bold">
            ॥ श्री गणेशाय नमः ॥
          </span>
          <MangalKalash className="w-7 h-7 shrink-0" />
        </div>

        {/* Prominent DS Monogram Logo */}
        <div className="my-5 flex justify-center">
          <div className="relative p-2 rounded-full border-2 border-[#D4AF37] bg-white shadow-royal">
            <img
              src="/wedding_logo_ds.jpg"
              alt="Shivam & Vinita"
              className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-full"
            />
          </div>
        </div>

        {/* Clean Couple Name */}
        <div className="mb-6 space-y-1">
          <h1 className={`text-3xl sm:text-4xl ${lang === 'hi' ? 'font-devanagari font-normal' : 'font-cinzel font-bold'} text-[#7A0A15]`}>
            {lang === 'hi' ? 'शिवम' : 'Shivam'}
            <span className="text-[#D4AF37] font-serif font-light text-2xl sm:text-3xl mx-2">&</span>
            {lang === 'hi' ? 'विनीता' : 'Vinita'}
          </h1>

          <p className="text-xs sm:text-sm font-serif font-semibold text-[#9A7B1C] tracking-widest">
            {lang === 'hi' ? '०२ दिसंबर २०२६' : 'December 02, 2026'}
          </p>
        </div>

        {/* Clean, Elegant Open Button */}
        <div>
          <button
            onClick={handleOpenInvitation}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#9B111E] hover:bg-[#7A0A15] text-[#FEF3C7] font-serif font-bold text-sm sm:text-base border border-[#D4AF37] shadow-xl hover:shadow-gold-glow transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MailOpen className="w-4 h-4 text-[#FEF08A]" />
            <span>
              {lang === 'hi' ? 'निमंत्रण पत्र खोलें' : 'Open Invitation'}
            </span>
            <Sparkles className="w-4 h-4 text-[#FEF08A] animate-spin" />
          </button>
        </div>
      </div>
    </div>
  );
}
