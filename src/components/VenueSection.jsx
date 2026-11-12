import React from 'react';
import { MapPin, Navigation, Phone, Sparkles, Building2, ExternalLink } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { MangalKalash } from './TraditionalMotifs';

export default function VenueSection({ lang }) {
  const { venue, family } = weddingData;

  return (
    <section id="venue" className="py-16 px-4 bg-white relative overflow-hidden">
      {/* Decorative Traditional Rangoli Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#9B111E]/10 text-[#9B111E] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#D4AF37]/40 shadow-sm font-serif">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'hi' ? 'मांगलिक विवाह स्थल' : 'Auspicious Wedding Destination'}</span>
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A0E17]">
            {weddingData.venue.subTitle[lang]}
          </h2>

          <div className="flex items-center justify-center gap-3 my-3 text-[#D4AF37]">
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <MapPin className="w-4 h-4 text-[#9B111E]" />
            <span className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 max-w-lg mx-auto font-serif">
            ॥ अतिथि देवो भव • सपरिवार सादर आमंत्रण ॥<br />
            {venue.note[lang]}
          </p>
        </div>

        {/* Venue Information Card & Map Grid */}
        <div className="relative grid md:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#FFFDF9] via-white to-[#FDFBF7] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/80 shadow-royal overflow-hidden">

          {/* Details Column */}
          <div className="md:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                {lang === 'hi' ? '॥ मुख्य वैवाहिक स्थल ॥' : 'Main Ceremony Venue'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A0E17]">
                {venue.name[lang]}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#9B111E] shrink-0 mt-0.5" />
                <p className="font-semibold text-gray-900 leading-relaxed font-serif text-sm">
                  {venue.address[lang]}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/50 text-xs text-gray-700 shadow-inner">
                <p className="font-serif font-bold text-[#9B111E] mb-1">
                  {lang === 'hi' ? 'मार्ग मार्गदर्शन:' : 'Route Guidance:'}
                </p>
                <p className="leading-relaxed">
                  {lang === 'hi'
                    ? 'मांडा से लालगंज मुख्य मार्ग होते हुए बरकछा कलाँ, मीरजापुर पहुँचें।।'
                    : 'Travel from Manda to Barkachha Kalan, Mirzapur via the main Lalganj route.'}
                </p>
              </div>
            </div>

            {/* Direct Directions Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={venue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9B111E] text-white font-serif font-semibold text-xs sm:text-sm shadow-md hover:bg-[#7A0A15] border border-[#D4AF37] transition-all transform hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4 text-[#F5D77F]" />
                <span>{lang === 'hi' ? 'गूगल मैप्स पर मार्ग देखें' : 'Open in Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/70" />
              </a>
            </div>

            {/* Host Assistance Hotline */}
            <div className="pt-4 border-t border-[#D4AF37]/30">
              <span className="text-[11px] font-serif font-bold text-[#9B111E] uppercase tracking-wider block mb-2">
                {lang === 'hi' ? 'स्थल सहायता संपर्क:' : 'Venue Assistance Contacts:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {family.contacts.map((c, i) => {
                  const nameStr = typeof c.name === 'object' ? (c.name[lang] || c.name.hi) : c.name;
                  const roleStr = typeof c.role === 'object' ? (c.role[lang] || c.role.hi) : c.role;
                  return (
                    <a
                      key={i}
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D4AF37]/70 text-xs font-semibold text-[#7A0A15] hover:bg-[#9B111E] hover:text-white transition-all shadow-sm"
                    >
                      <Phone className="w-3 h-3 text-[#D4AF37]" />
                      <span>{nameStr} ({roleStr.split(' ')[0]}): {c.phone}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Map Column */}
          <div className="md:col-span-7 h-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-inner relative">
            <iframe
              title="Venue Location Map"
              src={venue.mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
