import React from 'react';

/**
 * Traditional Hindu Auspicious Toran (आम के पल्लव एवं गेंदा पुष्प की वंदनवार)
 * Hanging gracefully at the top of the wedding page
 */
export function TraditionalToran() {
  return (
    <div className="w-full overflow-hidden pointer-events-none select-none z-30 relative -mb-4">
      <svg
        viewBox="0 0 1200 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-10 sm:h-14 object-cover"
        preserveAspectRatio="none"
      >
        {/* Top Sacred Golden Thread */}
        <line x1="0" y1="4" x2="1200" y2="4" stroke="#9B111E" strokeWidth="4" />
        <line x1="0" y1="7" x2="1200" y2="7" stroke="#D4AF37" strokeWidth="2" />

        {/* Repeating Toran Pattern: Mango Leaves & Marigold Garlands */}
        {Array.from({ length: 24 }).map((_, i) => {
          const cx = i * 50 + 25;
          return (
            <g key={i}>
              {/* Mango Leaf (आम का पत्ता) */}
              <path
                d={`M${cx} 6 C${cx - 10} 18, ${cx - 8} 36, ${cx} 48 C${cx + 8} 36, ${cx + 10} 18, ${cx} 6 Z`}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth="1"
              />
              <path
                d={`M${cx} 8 L${cx} 42`}
                stroke="#81C784"
                strokeWidth="1"
                strokeOpacity="0.8"
              />

              {/* Hanging Auspicious Marigold (गेंदा फूल) */}
              <circle cx={cx} cy="48" r="9" fill="#EAA315" />
              <circle cx={cx} cy="48" r="7" fill="#F59E0B" />
              <circle cx={cx} cy="48" r="4.5" fill="#DC2626" />
              <circle cx={cx} cy="48" r="2" fill="#FEF08A" />

              {/* Little Golden Bell / Bead */}
              <circle cx={cx} cy="58" r="2.5" fill="#D4AF37" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Auspicious Sacred Mangal Kalash (मंगल कलश)
 */
export function MangalKalash({ className = "w-12 h-12" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Coconut (श्रीफल) */}
      <circle cx="50" cy="30" r="18" fill="#78350F" />
      <path d="M42 20 Q50 10 58 20" stroke="#B45309" strokeWidth="2" fill="none" />
      <circle cx="50" cy="24" r="2" fill="#FEF3C7" />

      {/* Mango leaves emerging from pot */}
      <path d="M30 38 Q20 22 36 24 Q36 34 35 38 Z" fill="#2E7D32" />
      <path d="M70 38 Q80 22 64 24 Q64 34 65 38 Z" fill="#2E7D32" />
      <path d="M42 36 Q40 18 48 20 Z" fill="#388E3C" />
      <path d="M58 36 Q60 18 52 20 Z" fill="#388E3C" />

      {/* Kalash Body */}
      <ellipse cx="50" cy="42" rx="20" ry="6" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="1.5" />
      <path
        d="M32 44 Q22 60 30 78 Q38 88 50 88 Q62 88 70 78 Q78 60 68 44 Z"
        fill="url(#kalashGold)"
        stroke="#9B111E"
        strokeWidth="2"
      />

      {/* Base */}
      <path d="M36 88 L64 88 L68 94 L32 94 Z" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="1.5" />

      {/* Auspicious Sacred Swastika on Kalash */}
      <circle cx="50" cy="64" r="12" fill="#9B111E" />
      <path
        d="M45 64 H55 M50 59 V69 M45 59 H47 M53 69 H55 M55 59 V61 M45 67 V69"
        stroke="#FEF3C7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="kalashGold" x1="20" y1="40" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5D77F" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Traditional Royal Bride Crest (सौभाग्यवती वधू)
 */
export function RoyalBrideCrest({ className = "w-28 h-28" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="url(#brideAura)" stroke="#D4AF37" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="50" stroke="#9B111E" strokeWidth="1" strokeDasharray="3 3" />

      <path
        d="M26 84 C24 45, 40 22, 60 22 C80 22, 96 45, 94 84 C84 80, 72 82, 60 85 C48 82, 36 80, 26 84 Z"
        fill="#9B111E"
        stroke="#D4AF37"
        strokeWidth="2"
      />

      <path
        d="M28 80 C26 48, 42 26, 60 26 C78 26, 94 48, 92 80"
        stroke="#F5D77F"
        strokeWidth="2"
        strokeDasharray="4 2"
        fill="none"
      />

      <path
        d="M45 50 C45 40, 52 35, 60 35 C68 35, 75 40, 75 50 C75 66, 60 74, 60 74 C60 74, 45 66, 45 50 Z"
        fill="#FDF0E2"
        stroke="#C4845A"
        strokeWidth="1"
      />

      <line x1="60" y1="26" x2="60" y2="40" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="60" cy="42" r="3.5" fill="#DC2626" stroke="#D4AF37" strokeWidth="1.5" />
      <circle cx="60" cy="47" r="1.5" fill="#9B111E" />
      <path d="M51 52 Q55 55 58 52" stroke="#4A0E17" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M62 52 Q65 55 69 52" stroke="#4A0E17" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="59" r="4.5" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M52 59 Q46 56 44 50" stroke="#D4AF37" strokeWidth="1" strokeDasharray="1 1" fill="none" />
      <circle cx="56" cy="63.5" r="1" fill="#DC2626" />

      <path d="M40 54 L38 58 L42 58 Z" fill="#D4AF37" />
      <circle cx="40" cy="61" r="1.5" fill="#DC2626" />
      <path d="M80 54 L78 58 L82 58 Z" fill="#D4AF37" />
      <circle cx="80" cy="61" r="1.5" fill="#DC2626" />
      <path d="M48 94 Q60 88 72 94 Q60 102 48 94 Z" fill="#EAA315" stroke="#D4AF37" strokeWidth="1" />

      <defs>
        <radialGradient id="brideAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FEE2E2" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * Traditional Royal Groom Crest (वर श्रेष्ठ)
 */
export function RoyalGroomCrest({ className = "w-28 h-28" }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="url(#groomAura)" stroke="#D4AF37" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="50" stroke="#9B111E" strokeWidth="1" strokeDasharray="3 3" />

      <path
        d="M60 8 Q65 14 62 26 Q57 16 60 8 Z"
        fill="#EAA315"
        stroke="#B45309"
        strokeWidth="1"
      />
      <circle cx="60" cy="27" r="3.5" fill="#DC2626" stroke="#D4AF37" strokeWidth="1.5" />

      <path
        d="M32 46 C32 30, 44 26, 60 26 C76 26, 88 30, 88 46 C84 48, 72 45, 60 48 C48 45, 36 48, 32 46 Z"
        fill="#9B111E"
        stroke="#D4AF37"
        strokeWidth="2"
      />

      <path d="M35 38 Q60 30 85 38" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M34 43 Q60 35 86 43" stroke="#F5D77F" strokeWidth="1.5" fill="none" />
      <path d="M84 44 Q92 56 88 74 Q83 60 82 48 Z" fill="#9B111E" stroke="#D4AF37" strokeWidth="1" />

      <path
        d="M46 48 C46 42, 52 40, 60 40 C68 40, 74 42, 74 48 C74 65, 60 74, 60 74 C60 74, 46 65, 46 48 Z"
        fill="#FDF0E2"
        stroke="#C4845A"
        strokeWidth="1"
      />

      <path d="M58 44 Q60 43 62 44 V52 H58 Z" fill="#D4AF37" />
      <circle cx="60" cy="50" r="1.2" fill="#DC2626" />
      <path d="M51 55 Q55 58 58 55" stroke="#4A0E17" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M62 55 Q65 58 69 55" stroke="#4A0E17" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M56 64 Q60 67 64 64" stroke="#7A0A15" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      <path d="M42 78 Q60 94 78 78" stroke="#FEF3C7" strokeWidth="3" strokeDasharray="3 3" fill="none" />
      <circle cx="60" cy="87" r="3.5" fill="#15803D" stroke="#D4AF37" strokeWidth="1.5" />

      <defs>
        <radialGradient id="groomAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * Sacred Gathbandhan & Agni Phere
 */
export function SacredGathbandhan() {
  return (
    <div className="flex flex-col items-center justify-center my-4 py-2 relative">
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-100 via-amber-100 to-rose-100 border-2 border-[#D4AF37] shadow-sm">
        <span className="text-xl">🪷</span>
        <span className="font-serif text-xs sm:text-sm font-bold text-[#9B111E] tracking-wider uppercase">
          ॥ पवित्र गठबंधन एवं सप्तपदी ॥
        </span>
        <span className="text-xl">🔥</span>
      </div>
      <p className="text-[11px] font-serif text-[#9A7B1C] italic mt-1 font-medium">
        "यदेतद्धृदयं तव तदस्तु हृदयं मम" (दो शरीरों का एक पवित्र आत्मिक मिलन)
      </p>
    </div>
  );
}

/**
 * Ritual 1: Tilak Ceremony Artwork (अक्षत-चंदन एवं तिलक थाल)
 */
export function TilakThaliIcon({ className = "w-14 h-14" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Golden Brass Puja Thali */}
      <circle cx="50" cy="50" r="44" fill="#FEF3C7" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" stroke="#9A7B1C" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Roli Kumkum Katori */}
      <circle cx="38" cy="40" r="12" fill="#9B111E" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="38" cy="40" r="8" fill="#DC2626" />

      {/* Chandan / Akshat (Rice grains) Katori */}
      <circle cx="62" cy="40" r="12" fill="#FEF08A" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="62" cy="40" r="8" fill="#FDE047" />
      <circle cx="60" cy="38" r="1" fill="#78350F" />
      <circle cx="64" cy="41" r="1" fill="#78350F" />
      <circle cx="61" cy="43" r="1" fill="#78350F" />

      {/* Auspicious Diya (दीपक) */}
      <path d="M42 66 Q50 74 58 66 Q54 62 50 62 Q46 62 42 66 Z" fill="#B45309" stroke="#92400E" strokeWidth="1" />
      <path d="M50 61 Q48 54 50 50 Q52 54 50 61 Z" fill="#EAA315" />
      <circle cx="50" cy="55" r="2" fill="#FEF08A" />

      {/* Little Marigold flower on thali */}
      <circle cx="50" cy="32" r="5" fill="#F59E0B" />
      <circle cx="50" cy="32" r="2.5" fill="#DC2626" />
    </svg>
  );
}

/**
 * Ritual 2: Mandap & Haldi Artwork (पवित्र हल्दी पात्र एवं दूब-अक्षत)
 */
export function HaldiPotIcon({ className = "w-14 h-14" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Auspicious Aura */}
      <circle cx="50" cy="50" r="44" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />

      {/* Traditional Green Banana Leaves at base */}
      <path d="M20 70 Q35 60 50 72 Q35 80 20 70 Z" fill="#15803D" />
      <path d="M80 70 Q65 60 50 72 Q65 80 80 70 Z" fill="#15803D" />

      {/* Golden Brass Haldi Bowl (हल्दी कटोरी) */}
      <path
        d="M26 44 C26 70, 74 70, 74 44 Z"
        fill="url(#haldiGold)"
        stroke="#CA8A04"
        strokeWidth="2.5"
      />
      <ellipse cx="50" cy="44" rx="24" ry="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />

      {/* Radiant Yellow Haldi Paste */}
      <ellipse cx="50" cy="44" rx="20" ry="5.5" fill="#EAB308" />
      <circle cx="50" cy="43" r="3" fill="#FDE047" />

      {/* Sacred Durva Grass / Grass tuft in Haldi */}
      <path d="M48 42 Q42 28 38 22" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 42 Q50 24 52 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 42 Q58 28 62 22" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />

      {/* Yellow Marigold blossoms next to bowl */}
      <circle cx="30" cy="68" r="6" fill="#F59E0B" />
      <circle cx="30" cy="68" r="3" fill="#DC2626" />
      <circle cx="70" cy="68" r="6" fill="#F59E0B" />
      <circle cx="70" cy="68" r="3" fill="#DC2626" />

      <defs>
        <linearGradient id="haldiGold" x1="26" y1="44" x2="74" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#A16207" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Ritual 3: Mehendi & Sangeet Artwork (शहनाई, ढोलक एवं मेंहदी)
 */
export function MehendiSangeetIcon({ className = "w-14 h-14" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />

      {/* Traditional Indian Dholak (ढोलक) */}
      <path
        d="M26 36 Q50 30 74 36 L70 64 Q50 70 30 64 Z"
        fill="#92400E"
        stroke="#78350F"
        strokeWidth="2"
      />
      {/* Dholak Left rim */}
      <ellipse cx="28" cy="50" rx="5" ry="14" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
      {/* Dholak Right rim */}
      <ellipse cx="72" cy="50" rx="5" ry="14" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
      {/* Dholak ropes / W-lacing */}
      <path d="M33 37 L50 67 L67 37" stroke="#FEF3C7" strokeWidth="1.5" fill="none" />
      <path d="M33 63 L50 33 L67 63" stroke="#FEF3C7" strokeWidth="1.5" fill="none" />

      {/* Mehendi Cone (मेहंदी कोन) overlapping */}
      <path
        d="M60 20 L78 28 L40 76 Z"
        fill="#047857"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="76" r="2.5" fill="#78350F" />

      {/* Musical notes & Paisley swirl */}
      <path d="M22 28 Q26 22 30 26" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="26" r="2.5" fill="#047857" />
    </svg>
  );
}

/**
 * Ritual 4: Vivah & Mandap Artwork (पवित्र विवाह मंडप, अग्नि कुंड एवं जयमाला)
 */
export function VivahMandapIcon({ className = "w-14 h-14" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#FEF2F2" stroke="#9B111E" strokeWidth="2.5" />

      {/* Sacred Mandap Pillars & Arch */}
      <path d="M22 80 V32 Q50 18 78 32 V80" stroke="#9B111E" strokeWidth="2.5" fill="none" />
      <path d="M18 32 H82" stroke="#D4AF37" strokeWidth="2" />

      {/* Marigold Toran hanging under Mandap dome */}
      <path d="M24 36 Q36 44 50 36 Q64 44 76 36" stroke="#F59E0B" strokeWidth="2" fill="none" />

      {/* Sacred Havan / Agni Kund (हवन कुंड) */}
      <polygon points="34,80 66,80 62,64 38,64" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      <polygon points="38,64 62,64 58,56 42,56" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />

      {/* Holy Fire Flames (पवित्र अग्नि ज्वाला) */}
      <path
        d="M50 38 Q42 48 50 56 Q58 48 50 38 Z"
        fill="#DC2626"
      />
      <path
        d="M50 44 Q46 50 50 56 Q54 50 50 44 Z"
        fill="#FBBF24"
      />

      {/* Varmala (जयमाला) loops */}
      <ellipse cx="50" cy="74" rx="20" ry="5" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" fill="none" />
    </svg>
  );
}
