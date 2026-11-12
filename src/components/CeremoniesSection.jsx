import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Plus } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { TilakThaliIcon, HaldiPotIcon, MehendiSangeetIcon, VivahMandapIcon } from './TraditionalMotifs';

const ritualIcons = {
  tilak: TilakThaliIcon,
  haldi: HaldiPotIcon,
  mehendi: MehendiSangeetIcon,
  vivah: VivahMandapIcon,
};

const ritualMantras = {
  tilak: {
    hi: "॥ माटी पूजन • मटिमंगरा ॥",
    en: "Sacred Earth Ritual & Matimangra"
  },
  haldi: {
    hi: "॥ पावन मण्डप प्रतिष्ठा • हरिद्रा लेपन ॥",
    en: "Sacred Canopy & Turmeric Ritual"
  },
  mehendi: {
    hi: "॥ सगुन की मेंहदी • संगीत एवं उल्लास ॥",
    en: "Henna Blessings & Melodious Celebrations"
  },
  vivah: {
    hi: "॥ पाणिग्रहण संस्कार • सप्तपदी एवं महाप्रीतिभोज ॥",
    en: "Sacred Vivah, Seven Vows & Grand Feast"
  }
};

export default function CeremoniesSection({ lang }) {
  const generateGoogleCalLink = (event) => {
    const title = encodeURIComponent(`${event.title[lang]} - Shivam & Vinita Wedding`);
    const details = encodeURIComponent(
      `${event.tagline[lang]}\nShivam & Vinita Wedding Celebration.\nVenue: ${event.location[lang]}`
    );
    const location = encodeURIComponent(event.location[lang]);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${event.calStart}/${event.calEnd}&details=${details}&location=${location}`;
  };

  return (
    <section id="events" className="py-16 px-4 bg-gradient-to-b from-[#FAF7F0] via-white to-[#FAF7F0] relative overflow-hidden">
      {/* Decorative Traditional Rangoli Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#D4AF37]/15 text-[#9A7B1C] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D4AF37]/40 shadow-sm font-serif">
            <Sparkles className="w-3.5 h-3.5 text-[#EAA315]" />
            <span>{lang === 'hi' ? 'वैवाहिक मांगलिक अनुष्ठान' : 'Sacred Wedding Ceremonies'}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#EAA315]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A0E17]">
            {lang === 'hi' ? '॥ वैवाहिक कार्यक्रम ॥' : 'Ceremony Itinerary'}
          </h2>

          <div className="flex items-center justify-center gap-3 my-3 text-[#D4AF37]">
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <Calendar className="w-4 h-4 text-[#9B111E]" />
            <span className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 max-w-lg mx-auto font-serif">
            {lang === 'hi'
              ? 'प्रत्येक मांगलिक अनुष्ठान में आपकी गरिमामयी उपस्थिति हमारे उत्सव को पावन बनाएगी।'
              : 'Your gracious presence at each sacred ritual will bless this auspicious union.'}
          </p>
        </div>

        {/* Ceremonies Grid with Smooth Elegant Borders (No Harsh Ugly Corners) */}
        <div className="grid md:grid-cols-2 gap-7">
          {weddingData.events.map((event, index) => {
            const RitualIcon = ritualIcons[event.id] || Sparkles;

            return (
              <div
                key={event.id}
                className="relative bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF7F0] rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/70 shadow-royal hover:shadow-gold-glow hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Ritual Sub-banner */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-serif font-bold text-[#9A7B1C] tracking-widest uppercase bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200">
                      {lang === 'hi' ? `मांगलिक रस्म ०${index + 1}` : `Ritual 0${index + 1}`}
                    </span>
                    <span className="text-xs font-serif text-[#9B111E] font-bold">
                      {ritualMantras[event.id][lang]}
                    </span>
                  </div>

                  {/* Header: Traditional Ritual Artwork & Title */}
                  <div className="flex items-center gap-4 my-3">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/80 flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300">
                      <RitualIcon className="w-12 h-12" />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#4A0E17] leading-tight">
                        {event.title[lang]}
                      </h3>
                      <p className="text-xs text-gray-600 italic font-serif mt-1">
                        {event.tagline[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Event Meta Details Card */}
                  <div className="space-y-2.5 text-xs sm:text-sm my-4 bg-[#FAF7F0] p-4 rounded-2xl border border-[#D4AF37]/30 shadow-inner">
                    <div className="flex items-center gap-2.5 text-gray-900 font-bold font-serif">
                      <Calendar className="w-4 h-4 text-[#9B111E] shrink-0" />
                      <span>{event.date[lang]}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-800">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="font-medium">{event.time[lang]}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-800">
                      <MapPin className="w-4 h-4 text-[#9B111E] shrink-0" />
                      <span className="font-medium">{event.location[lang]}</span>
                    </div>
                  </div>
                </div>

                {/* Clean Bottom Action Bar (Removed repetitive text) */}
                <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-end">
                  <a
                    href={generateGoogleCalLink(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#D4AF37] text-xs font-serif font-semibold text-[#7A0A15] hover:bg-[#9B111E] hover:text-white hover:border-[#9B111E] transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'गूगल कैलेंडर में जोड़ें' : 'Add to Google Calendar'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
