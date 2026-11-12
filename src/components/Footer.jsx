import React from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Footer({ lang, onReplayEnvelope }) {
  return (
    <footer className="bg-[#4A0E17] text-[#FAF7F0] pt-14 pb-24 md:pb-12 px-4 border-t-4 border-[#D4AF37] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        {/* Monogram Seal */}
        <div className="inline-block p-1.5 rounded-full border-2 border-[#D4AF37] bg-white">
          <img
            src="/wedding_logo_ds.jpg"
            alt="Shivam & Vinita"
            className="w-16 h-16 rounded-full object-contain"
          />
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5D77F]">
            शिवम <span className="text-rose-300 font-normal">संग</span> विनीता
          </h3>
          <p className="text-xs text-[#D4AF37] uppercase tracking-widest mt-1">
            02 December 2026 • बरकछा कला, मिर्जापुर (उ. प्र.)
          </p>
        </div>

        {/* Shloka blessing */}
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto italic font-serif leading-relaxed">
          "{weddingData.shlokas.vishnu.sanskrit.split('\n').join(' ')}"
        </p>

        {/* Replay Envelope CTA */}
        <div className="pt-2">
          <button
            onClick={onReplayEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 text-xs text-[#F5D77F] hover:bg-[#D4AF37]/20 transition-all font-serif"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'निमंत्रण पत्र पुनः खोलें' : 'Replay Invitation'}</span>
          </button>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 border-t border-[#D4AF37]/30 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {lang === 'hi'
              ? 'मौर्या परिवार द्वारा सस्नेह आमंत्रण'
              : 'Warmly hosted by the Maurya Family'}
          </p>
          <span className="text-[11px] text-[#D4AF37]/80 tracking-wide font-serif">
            Shivam Weds Vinita • Shivam Vinita • shivamwedsvinita.vercel.app
          </span>
          <div className="flex items-center gap-1.5 text-[#F5D77F]">
            <span>सदा सुमंगलम्</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
