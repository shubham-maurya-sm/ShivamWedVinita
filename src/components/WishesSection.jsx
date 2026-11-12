import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageSquareHeart, Send, Sparkles, Heart, Smile } from 'lucide-react';
import { fetchWishes, submitWish } from '../lib/supabase';

// Helper blessing message templates
const quickTemplates = {
  hi: [

    "शिवम और विनीता को शुभ विवाह की हार्दिक शुभकामनाएं! आपकी जोड़ी सदा सलामत रहे।",
    "सदा सुहागन रहो! ईश्वर आप दोनों के जीवन में अपार खुशियां, प्रेम और समृद्धि प्रदान करे।",
    "शिवम और विनीता को दांपत्य जीवन की अनंत मंगलकामनाएं! खुशहाल रहे आपका संसार।",
    "दो दिलों का पावन संगम, ईश्वर का आशीर्वाद आप दोनों पर सदैव बना रहे। बहुत-बहुत बधाई!",
    "नए सफर की शुरुआत पर हार्दिक बधाई। प्रेम और विश्वास का यह बंधन अटूट रहे।"
  ],
  en: [
    "Wishing Shivam & Vinita a lifetime of love, laughter, and endless happiness together!",
    "May your married life be filled with boundless joy, peace, and eternal companionship. Heartiest congratulations!",
    "Sending our warmest blessings and love to the newlyweds! Have a wonderful married life.",
    "Congratulations on your wedding! May the years ahead be filled with lasting joy and harmony."
  ]
  
};

const relationshipOptions = [
  { value: "पारिवारिक सदस्य", labelHi: "पारिवारिक सदस्य", labelEn: "Family Member" },
  { value: "मौसा जी एवं मौसी जी", labelHi: "मौसा जी एवं मौसी जी", labelEn: "Uncle & Aunt (Mausa & Mausi)" },
  { value: "मौसा / मौसी", labelHi: "मौसा / मौसी", labelEn: "Mausa / Mausi" },
  { value: "चाचा जी एवं चाची जी", labelHi: "चाचा जी एवं चाची जी", labelEn: "Uncle & Aunt (Chacha & Chachi)" },
  { value: "चाचा / चाची", labelHi: "चाचा / चाची", labelEn: "Uncle / Aunt" },
  { value: "छोटा भाई (अनुज)", labelHi: "छोटा भाई (अनुज)", labelEn: "Younger Brother" },
  { value: "बड़ा भाई (अग्रज)", labelHi: "बड़ा भाई (अग्रज)", labelEn: "Elder Brother" },
  { value: "छोटी बहन (अनुजा)", labelHi: "छोटी बहन (अनुजा)", labelEn: "Younger Sister" },
  { value: "बड़ी बहन", labelHi: "बड़ी बहन", labelEn: "Elder Sister" },
  { value: "फूफा जी एवं फुआ जी", labelHi: "फूफा जी एवं फुआ जी", labelEn: "Uncle & Aunt (Phupha & Phua)" },
  { value: "फुआ / फूफा", labelHi: "फुआ / फूफा", labelEn: "Aunt & Uncle" },
  { value: "मामा / मामी", labelHi: "मामा / मामी", labelEn: "Maternal Uncle & Aunt" },
  { value: "भाई / भाभी", labelHi: "भाई / भाभी", labelEn: "Brother / Sister-in-law" },
  { value: "बहन / जीजाजी", labelHi: "बहन / जीजाजी", labelEn: "Sister / Brother-in-law" },
  { value: "मित्र / सहेली", labelHi: "मित्र / सहेली", labelEn: "Friend" },
  { value: "सहकर्मी", labelHi: "सहकर्मी", labelEn: "Colleague" },
  { value: "शुभचिंतक", labelHi: "शुभचिंतक", labelEn: "Well Wisher" }
];

// Helper to strictly show pure Hindi or English without awkward mixed parentheses
const getLocalizedRelationship = (item, lang) => {
  const rel = item.relationship || item.relation || '';
  if (lang === 'hi') {
    if (item.relationshipHi) return item.relationshipHi;
    const clean = rel.replace(/\s*\([A-Za-z\s/&,-]+\)/g, '').trim();
    const match = relationshipOptions.find(o => o.value === rel || o.labelHi === clean || o.labelEn === rel);
    return match ? match.labelHi : (clean || 'शुभचिंतक');
  } else {
    if (item.relationshipEn) return item.relationshipEn;
    const enMatch = rel.match(/\(([A-Za-z\s/&,-]+)\)/);
    if (enMatch) return enMatch[1].trim();
    const match = relationshipOptions.find(o => o.value === rel || o.labelHi === rel || o.labelEn === rel);
    return match ? match.labelEn : (rel || 'Well Wisher');
  }
};

const getLocalizedBadge = (item, lang) => {
  const rel = (item.relationship || item.relation || '').toLowerCase();
  if (rel.includes('माता') || rel.includes('पिता') || rel.includes('parent')) {
    return lang === 'hi' ? 'माँ-पापा का आशीष' : "Parents' Blessing";
  }
  if (rel.includes('फूफा') || rel.includes('फुआ')) {
    return lang === 'hi' ? 'फूफा-फुआ का शुभाशीष' : "Elders' Blessing";
  }
  if (rel.includes('मौसा') || rel.includes('मौसी') || rel.includes('mausa') || rel.includes('mausi')) {
    return lang === 'hi' ? 'मौसा-मौसी का शुभाशीष' : "Mausa & Mausi's Blessing";
  }
  if (rel.includes('चाचा') || rel.includes('चाची') || rel.includes('uncle')) {
    return lang === 'hi' ? 'चाचा-चाची का आशीष' : "Uncle & Aunt's Blessing";
  }
  if (rel.includes('भाई') || rel.includes('brother')) {
    return lang === 'hi' ? 'भाई का स्नेह' : "Brother's Love";
  }
  if (rel.includes('बहन') || rel.includes('sister')) {
    return lang === 'hi' ? 'बहनों का स्नेह' : "Sisters' Love";
  }
  return lang === 'hi' ? 'स्नेहिल आशीष' : 'Blessing';
};

// Format wish date dynamically according to its creation timestamp
const formatWishDate = (dateStr, lang) => {
  if (!dateStr) return lang === 'hi' ? 'अक्टूबर 2026' : 'October 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return lang === 'hi' ? 'अक्टूबर 2026' : 'October 2026';
    const formatted = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      month: 'long',
      year: 'numeric'
    });
    if (lang === 'hi') {
      return formatted.replace(/अक्तूबर/g, 'अक्टूबर');
    }
    return formatted;
  } catch {
    return lang === 'hi' ? 'अक्टूबर 2026' : 'October 2026';
  }
};

// Filter out obsolete / merged wishes
const isExcludedWish = (w) => {
  const text = `${w.name || ''} ${w.relation || ''} ${w.relationship || ''} ${w.message || ''}`.toLowerCase();
  return (
    text.includes('प्रदीप प्रसाद एवं श्री अनिल') ||
    text.includes('pradeep prasad and anil')
  );
};

export default function WishesSection({ lang }) {
  const [wishes, setWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    relationship: 'पारिवारिक सदस्य',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    // Fetch live wishes directly from Supabase database
    fetchWishes().then((serverWishes) => {
      if (serverWishes && serverWishes.length > 0) {
        setWishes(serverWishes.filter(w => !isExcludedWish(w)));
      }
      setIsLoading(false);
    });
  }, [lang]);

  const applyTemplate = (tpl) => {
    setForm((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message} ${tpl}` : tpl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setIsSubmitting(true);

    const wishPayload = {
      name: form.name.trim(),
      relation: form.relationship,
      message: form.message.trim(),
    };

    const newWish = {
      id: Date.now(),
      name: form.name.trim(),
      relationship: form.relationship,
      message: form.message.trim(),
      date: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
        month: 'short',
        year: 'numeric'
      }),
      badge: lang === 'hi' ? 'स्नेहिल आशीष' : 'Blessing'
    };

    // Optimistic UI update
    setWishes((prev) => [newWish, ...prev]);
    setForm({ name: '', relationship: 'पारिवारिक सदस्य (Family Member)', message: '' });
    setIsSubmitting(false);
    setSuccessMsg(true);

    // Save to Supabase
    try {
      await submitWish(wishPayload);
    } catch {
      // Handled
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#9B111E', '#EAA315']
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  return (
    <section id="wishes" className="py-16 px-4 bg-[#FAF7F0] relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9B111E]/10 text-[#9B111E] text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'hi' ? 'डिजिटल आशीर्वाद' : 'Digital Ashirwad & Blessings'}</span>
            <MessageSquareHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A0E17]">
            {lang === 'hi' ? 'वर-वधू के लिए शुभकामना संदेश' : 'Wishes for Shivam & Vinita'}
          </h2>

          <div className="flex items-center justify-center gap-3 my-3 text-[#D4AF37]">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <Heart className="w-4 h-4 text-[#9B111E] fill-[#9B111E]" />
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            {lang === 'hi'
              ? 'शिवम और विनीता के मंगल दांपत्य जीवन के लिए अपने पावन आशीष एवं शुभकामनाएं यहां प्रेषित करें।'
              : 'Leave your heartfelt blessings and warm wishes for Shivam & Vinita as they begin this sacred journey.'}
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="md:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#D4AF37] shadow-royal">
            <h3 className="text-lg font-serif font-bold text-[#4A0E17] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{lang === 'hi' ? 'अपना आशीर्वाद संदेश लिखें' : 'Write a Blessing'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {lang === 'hi' ? 'आपका शुभ नाम *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang === 'hi' ? 'उदा. अमित कुमार' : 'e.g. Amit Kumar'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none transition-all"
                />
              </div>

              {/* Relationship Dropdown */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {lang === 'hi' ? 'संबंध / रिश्ता *' : 'Relationship *'}
                </label>
                <select
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none bg-white transition-all cursor-pointer"
                >
                  {relationshipOptions.map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {lang === 'hi' ? opt.labelHi : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Blessing Templates Helper */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">
                    {lang === 'hi' ? 'आशीर्वाद संदेश *' : 'Your Blessing *'}
                  </label>
                  <span className="text-[10px] text-[#9B111E] font-medium flex items-center gap-1">
                    <Smile className="w-3 h-3" />
                    {lang === 'hi' ? 'त्वरित संदेश चुनें' : 'Quick wishes'}
                  </span>
                </div>

                {/* Clickable Helper Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quickTemplates[lang].map((tpl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => applyTemplate(tpl)}
                      className="text-[10px] bg-amber-50 hover:bg-amber-100 text-[#9A7B1C] border border-amber-200 rounded-lg px-2 py-1 text-left line-clamp-1 transition-colors"
                      title={tpl}
                    >
                      + {tpl}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows="3"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={
                    lang === 'hi'
                      ? 'वर-वधू के लिए अपने शुभ विचार लिखें या ऊपर दिए गए संदेश पर क्लिक करें...'
                      : 'Share your warm words for Shivam & Vinita...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#9B111E] text-white font-medium text-xs sm:text-sm hover:bg-[#7A0A15] border border-[#D4AF37] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4 text-[#F5D77F]" />
                <span>{lang === 'hi' ? 'संदेश प्रेषित करें' : 'Post Blessing'}</span>
              </button>

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-center font-medium animate-fade-in">
                  {lang === 'hi'
                    ? '✨ आपका आशीर्वाद संदेश सफलतापूर्वक दर्ज हो गया है! धन्यवाद।'
                    : '✨ Thank you! Your warm blessing has been shared.'}
                </div>
              )}
            </form>
          </div>

          {/* Wishes Display Column */}
          <div className="md:col-span-7 space-y-4 max-h-[520px] overflow-y-auto pr-2">
            {wishes.map((item) => {
              const displayName = lang === 'hi' ? item.name : (item.name_en || item.name);
              const displayRel = getLocalizedRelationship(item, lang);
              const displayBadge = getLocalizedBadge(item, lang);
              const displayMsg = lang === 'hi' ? item.message : (item.message_en || item.message);
              const displayDate = formatWishDate(item.created_at, lang);
              const firstLetter = displayName ? displayName.trim().charAt(0) : '🌸';

              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-sm hover:shadow-gold-sm transition-all relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-xs font-bold text-[#9B111E]">
                        {firstLetter}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#4A0E17] leading-tight">
                          {displayName}
                        </h4>
                        <span className="text-[10px] text-gray-500">{displayRel}</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-50 text-[#9A7B1C] border border-amber-200 font-medium">
                      {displayBadge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 font-serif leading-relaxed italic pl-10">
                    "{displayMsg}"
                  </p>

                  <div className="text-right text-[10px] text-gray-400 mt-2">
                    {displayDate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
