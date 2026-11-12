import React from 'react';
import { Heart, Sparkles, MapPin, Flower2 } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { RoyalBrideCrest, RoyalGroomCrest, SacredGathbandhan } from './TraditionalMotifs';

export default function CoupleSection({ lang }) {
  const { bride, groom } = weddingData.couple;

  return (
    <section id="couple" className="py-16 px-4 bg-gradient-to-b from-[#FAF7F0] via-white to-[#FAF7F0] relative overflow-hidden">
      {/* Decorative Traditional Rangoli & Mandap Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#9B111E]/10 text-[#9B111E] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D4AF37]/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'hi' ? 'वैदिक शुभ परिणय' : 'Sacred Vedic Union'}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A0E17]">
            {lang === 'hi' ? '॥ वर एवं वधू परिचय ॥' : 'The Groom & Bride'}
          </h2>

          <div className="flex items-center justify-center gap-3 my-3 text-[#D4AF37]">
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <Heart className="w-4 h-4 text-[#9B111E] fill-[#9B111E]" />
            <span className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 max-w-xl mx-auto italic font-serif leading-relaxed">
            "{weddingData.shlokas.vishnu.sanskrit.split('\n').join(' ')}"
          </p>
        </div>

        {/* Traditional Royal Couple Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch mb-8">
          {/* ================= Groom Card (वर - Sumit) ================= */}
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-white to-[#FDFBF7] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/80 shadow-royal hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            {/* Top Gold Zari Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#9B111E] to-[#D4AF37]"></div>

            <div>
              {/* Traditional Auspicious Crest & Banner */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#9A7B1C] text-xs font-serif font-bold tracking-widest uppercase">
                  <span>👑</span>
                  <span>{lang === 'hi' ? 'वर (Groom)' : 'The Groom'}</span>
                </span>

                <span className="text-xs font-serif font-semibold text-[#9B111E] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  ॥ आयुष्मान् भव • वर श्रेष्ठ ॥
                </span>
              </div>

              {/* Royal Groom Illustration Crest */}
              <div className="flex justify-center my-3">
                <div className="relative p-1.5 rounded-full bg-gradient-to-b from-[#FAF7F0] to-amber-50 border-2 border-[#D4AF37] shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                  <RoyalGroomCrest className="w-28 h-28 sm:w-32 sm:h-32" />
                </div>
              </div>

              {/* Groom Name & Title */}
              <div className="text-center mb-6">
                <span className="text-xs text-[#9A7B1C] font-semibold tracking-widest uppercase block font-serif">
                  {groom[lang].prefix}
                </span>
                <h3 className={`text-3xl sm:text-4xl ${lang === 'hi' ? 'font-devanagari tracking-wide font-normal' : 'font-cinzel font-bold'} text-[#7A0A15] mt-1`}>
                  {groom[lang].name}
                </h3>
                <span className="inline-block h-0.5 w-16 bg-[#D4AF37] mt-1"></span>
              </div>

              {/* Family Lineage Details */}
             <div className="space-y-3 text-xs sm:text-sm text-gray-800 font-sans">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/40 shadow-inner">
                  <span className="font-semibold text-[#9B111E] block mb-1 font-serif">
                    {lang === 'hi' ? 'सुपौत्र ((Grandson of):' : 'Grandson of:'}
                  </span>
                  <p className="font-medium text-gray-900">{groom[lang].grandParents}</p>
                </div>


                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/40 shadow-inner">
                  <span className="font-semibold text-[#9B111E] block mb-1 font-serif">
                    {lang === 'hi' ? 'सुपुत्र (Son of):' : 'Son of:'}
                  </span>
                  <p className="font-medium text-gray-900">{groom[lang].fatherMother}</p>
                </div>


                <div className="flex items-center gap-2 pt-1 text-gray-700 px-2">
                  <MapPin className="w-4 h-4 text-[#9B111E] shrink-0" />
                  <span className="font-medium">{groom[lang].location}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-[#D4AF37]/50 text-center">
              <span className="text-xs text-[#9B111E] font-serif font-semibold italic">
                {lang === 'hi' ? '👑 गुणवान चिरंजीवी वर • यशस्वी भव 👑' : '👑 Noble Groom • Blessed with Honor 👑'}
              </span>
            </div>
          </div>

          {/* ================= Bride Card (वधू - Deepa) ================= */}
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-white to-[#FDFBF7] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/80 shadow-royal hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            {/* Top Gold Zari Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#9B111E] via-[#D4AF37] to-[#9B111E]"></div>

            <div>
              {/* Traditional Auspicious Crest & Banner */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 border border-rose-300 text-[#9B111E] text-xs font-serif font-bold tracking-widest uppercase">
                  <span>🪷</span>
                  <span>{lang === 'hi' ? 'वधू (Bride)' : 'The Bride'}</span>
                </span>

                <span className="text-xs font-serif font-semibold text-[#9A7B1C] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ॥ सौभाग्यवती भव ॥
                </span>
              </div>

              {/* Royal Bride Illustration Crest */}
              <div className="flex justify-center my-3">
                <div className="relative p-1.5 rounded-full bg-gradient-to-b from-[#FAF7F0] to-rose-50 border-2 border-[#D4AF37] shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                  <RoyalBrideCrest className="w-28 h-28 sm:w-32 sm:h-32" />
                </div>
              </div>

              {/* Bride Name & Title */}
              <div className="text-center mb-6">
                <span className="text-xs text-[#9A7B1C] font-semibold tracking-widest uppercase block font-serif">
                  {bride[lang].prefix}
                </span>
                <h3 className={`text-3xl sm:text-4xl ${lang === 'hi' ? 'font-devanagari tracking-wide font-normal' : 'font-cinzel font-bold'} text-[#7A0A15] mt-1`}>
                  {bride[lang].name}
                </h3>
                <span className="inline-block h-0.5 w-16 bg-[#D4AF37] mt-1"></span>
              </div>

              {/* Family Lineage Details */}
              <div className="space-y-3 text-xs sm:text-sm text-gray-800 font-sans">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/40 shadow-inner">
                  <span className="font-semibold text-[#9B111E] block mb-1 font-serif">
                    {lang === 'hi' ? 'सुपौत्री (Granddaughter of):' : 'Granddaughter of:'}
                  </span>
                  <p className="font-medium text-gray-900">{bride[lang].grandParents}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/40 shadow-inner">
                  <span className="font-semibold text-[#9B111E] block mb-1 font-serif">
                    {lang === 'hi' ? 'सुपुत्री (Daughter of):' : 'Daughter of:'}
                  </span>
                  <p className="font-medium text-gray-900">{bride[lang].fatherMother}</p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-gray-700 px-2">
                  <MapPin className="w-4 h-4 text-[#9B111E] shrink-0" />
                  <span className="font-medium">{bride[lang].location}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-[#D4AF37]/50 text-center">
              <span className="text-xs text-[#9B111E] font-serif font-semibold italic">
                {lang === 'hi' ? '🌸 कुलदीपक लाडली कन्या • सदा सुहागन रहो 🌸' : '🌸 Beloved Daughter • Blessed with Grace 🌸'}
              </span>
            </div>
          </div>
        </div>

        {/* Sacred Gathbandhan & Vows Bridge */}
        <SacredGathbandhan />

        {/* Sisters' Special Affection Note (रूबी, रूची) */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 p-6 rounded-3xl border-2 border-dashed border-[#D4AF37] text-center shadow-sm mt-6">
          <div className="flex items-center justify-center gap-2 mb-2 text-[#9B111E]">
            <Flower2 className="w-4 h-4 text-[#EAA315]" />
            <span className="text-xs font-semibold uppercase tracking-wider font-serif">
              {lang === 'hi' ? 'बहनों का स्नेहिल संदेश (रत्ना और दिव्यांशी)' : "Sisters' Joyous Message (Ratna & Divyanshi)"}
            </span>
            <Flower2 className="w-4 h-4 text-[#EAA315]" />
          </div>

          <p className="font-serif text-base sm:text-lg text-[#7A0A15] font-semibold italic leading-relaxed">
            {weddingData.quotes.sistersPoem[lang]}
          </p>
        </div>
      </div>
    </section>
  );
}