import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Eye, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function WhatsAppInviteSection({ lang }) {
  const [copied, setCopied] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const websiteUrl = 'https://shivamwedsvinita.vercel.app';

  // Capitalize or format name cleanly
  const formatName = (str) => {
    if (!str) return '';
    return str.trim();
  };

  // Clean, respectful invitation message in Hindi (NO stars on guest name)
  const getHindiMessage = (name) => {
    const clean = formatName(name);
    const greeting = clean ? `आदरणीय ${clean} जी,\n\n` : '';

    return `${greeting}॥ श्री गणेशाय नमः ॥
वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥

॥ मंगलम् भगवान विष्णुः मंगलम् गरूड़ध्वजः।
मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥

*मांगलिक वैवाहिक आमंत्रण*

स्नेही स्वजन,
ईश्वर की असीम अनुकम्पा एवं पूज्य बुजुर्गों के आशीर्वाद से हमारे सुपुत्र
*चिरंजीवी शिवम मौर्य*
(सुपुत्र: श्रीमती बैजंती देवी एवं श्री सुरेश चंद्र मौर्य, मांडा खास, प्रयागराज (उ. प्र.))
संग
*आयुष्मती विनीता मौर्या*
(सुपुत्री: श्रीमती संगीता देवी एवं स्मृतिशेष श्री संतोष कुमार मौर्य, बरकछा कला, मिर्जापुर (उ. प्र.))

के पावन वैवाहिक परिणय की मांगलिक बेला पर आप सपरिवार सादर आमंत्रित हैं।

━━━━━━━━━━━━━━━━━━━━
📅 *शुभ विवाह दिनांक:* 02 दिसंबर 2026 (बुधवार)
📍 *स्थल:* बरकछा कलाँ, मिर्ज़ापुर (उ. प्र.)
━━━━━━━━━━━━━━━━━━━━

✨ *मांगलिक वैवाहिक कार्यक्रम:*
- 30 नवंबर: माटी पूजन (मटिमंगरा) (दिन में - वर पक्ष निवास)
- 1 दिसंबर: सिलमयान (सिलबट्टा पूजन) (दोपहर)
- 1 दिसंबर: हल्दी, मेहन्दी एवं संगीत (सायं काल से रात्रि तक)
- 2 दिसंबर: बारात प्रस्थान एवं शुभ विवाह (रात्रि में - बरकछा कलाँ, मिर्ज़ापुर)

"मिलन है दो परिवारों का, रस्म है खुशी मनाने का,
हमें तो इंतजार है, शादी में आपके आने का ॥"

💌 *डिजिटल निमंत्रण पत्र एवं संपूर्ण विवरण:*
${websiteUrl}

निवेदक:
श्रीमती बैजंती देवी एवं श्री सुरेश चंद्र मौर्य
एवं समस्त मौर्य परिवार, मांडा खास, प्रयागराज (उ. प्र.)
📞 संपर्क सूत्र: +91 9833920747, +91 8115374248, +91 9451567239`;
  };

  // Clean, respectful invitation message in English (NO stars on guest name)
  const getEnglishMessage = (name) => {
    const clean = formatName(name);
    const greeting = clean ? `Dear ${clean},\n\n` : '';

    return `${greeting}॥ Shri Ganeshaya Namah ॥
Vakratunda Mahakaya Suryakoti Samaprabha ।
Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada ॥

Mangalam Bhagwan Vishnuh Mangalam Garudadhwajah ।
Mangalam Pundarikakshah Mangalaya Tano Harih ॥

*Sacred Wedding Invitation*

Dear Family & Friends,
With the divine grace of Almighty God and blessings of our beloved elders, we cordially invite you with family to grace the auspicious wedding celebration of our beloved son
*Chiranjeevi Shivam Maurya*
(S/o Smt. Baijanti Devi & Shri Suresh Chandra Maurya, Manda Khas, Prayagraj)
with
*Ayushmati Vinita Maurya*
(D/o Smt. Sangeeta Devi & Late Shri Santosh Kumar Maurya, Barkachha Kala, Mirzapur)

━━━━━━━━━━━━━━━━━━━━
📅 *Wedding Date:* December 02, 2026 (Wednesday)
📍 *Venue:* Barkachha Kala, Mirzapur (U.P.)
━━━━━━━━━━━━━━━━━━━━

✨ *Auspicious Ceremony Schedule:*
- Nov 30 (Mon): Mati Pujan (Matimangra) (Daytime - Groom's Residence)
- Dec 01 (Tue): Silmayan Ceremony (Afternoon)
- Dec 01 (Tue): Haldi, Mehendi & Sangeet (Evening onwards)
- Dec 02 (Wed): Baraat Prasthan & Shubh Vivah (Night - Barkachha Kala, Mirzapur)

"Two souls unite in sacred bonds of love, culture, and togetherness..."

💌 *View Digital Invitation, Venue Route & Event Details:*
${websiteUrl}

Warmly Invited By:
Smt. Baijanti Devi & Shri Suresh Chandra Maurya
& The Entire Maurya Family, Manda Khas, Prayagraj (U.P.)
📞 Host Contacts: +91 9833920747, +91 8115374248, +91 9451567239`;
  };

  const currentMessage = lang === 'hi' ? getHindiMessage(guestName) : getEnglishMessage(guestName);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(currentMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="share-invite" className="py-12 px-4 bg-gradient-to-b from-white to-[#FAF7F0] relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF7F0] rounded-3xl p-5 sm:p-7 border border-[#D4AF37]/80 shadow-royal">
          {/* Simple, Clean Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A0E17]">
                {lang === 'hi' ? 'व्हाट्सएप पर निमंत्रण भेजें' : 'Share Invitation on WhatsApp'}
              </h3>
            </div>

            <span className="text-[10px] font-serif font-bold px-2.5 py-1 rounded-full bg-amber-50 text-[#9B111E] border border-amber-200 uppercase shrink-0">
              {lang === 'hi' ? 'हिन्दी' : 'English'}
            </span>
          </div>

          {/* Clean Guest Name Input */}
          <div className="mb-4">
            <div className="relative flex items-center">
              <Users className="w-4 h-4 text-[#D4AF37] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={lang === 'hi' ? 'अतिथि का नाम लिखें (वैकल्पिक)...' : 'Guest name (optional)...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none bg-white font-sans transition-all shadow-inner"
              />
            </div>
            {guestName.trim() && (
              <p className="text-[11px] text-[#9B111E] font-serif mt-1.5 pl-1">
                {lang === 'hi' ? `अभिवादन: आदरणीय ${guestName.trim()} जी,` : `Greeting: Dear ${guestName.trim()},`}
              </p>
            )}
          </div>

          {/* Collapsible Message Preview */}
          <div className="mb-5">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-serif font-semibold text-[#9B111E] hover:text-[#7A0A15] flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{showPreview ? (lang === 'hi' ? 'पूर्वावलोकन छिपाएं' : 'Hide Preview') : (lang === 'hi' ? 'संदेश देखें (Preview Message)' : 'Preview Message')}</span>
              {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPreview && (
              <div className="mt-2.5 p-4 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/30 text-xs text-gray-800 font-sans whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto animate-fade-in shadow-inner">
                {currentMessage}
              </div>
            )}
          </div>

          {/* Action Buttons: Simple & Direct */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4 text-[#FEF3C7]" />
              <span>{lang === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Send on WhatsApp'}</span>
            </button>

            <button
              onClick={handleCopyMessage}
              className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-white text-[#4A0E17] font-serif font-semibold text-xs border border-[#D4AF37] hover:bg-[#FAF7F0] shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}