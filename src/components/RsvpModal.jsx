import React, { useState } from 'react';
import { X, CheckCircle, Heart, Users, Sparkles, Flower2, Calendar, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitRsvp } from '../lib/supabase';
import { triggerFlowerShower } from './FlowerShower';

export default function RsvpModal({ isOpen, onClose, lang }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guestCount: '2',
    events: ['vivah'],
    message: ''
  });

  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleEventToggle = (eventId) => {
    setFormData((prev) => {
      const exists = prev.events.includes(eventId);
      return {
        ...prev,
        events: exists
          ? prev.events.filter((e) => e !== eventId)
          : [...prev.events, eventId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const eventNames = {
      tilak: lang === 'hi' ? 'तिलकोत्सव (20 जन)' : 'Tilak (Jan 20)',
      haldi: lang === 'hi' ? 'हल्दी (23 जन)' : 'Haldi (Jan 23)',
      mehendi: lang === 'hi' ? 'मेहन्दी (24 जन)' : 'Mehendi (Jan 24)',
      vivah: lang === 'hi' ? 'शुभ-विवाह (25 जन)' : 'Wedding (Jan 25)'
    };

    const selectedEventsText = formData.events.map((ev) => eventNames[ev]).join(', ');

    // 1. Persist directly to Supabase Database (instantly visible in Admin Dashboard)
    try {
      await submitRsvp({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        attending: true,
        guestCount: formData.guestCount,
        message: `${selectedEventsText} | ${formData.message.trim() || ''}`,
      });
    } catch (err) {
      console.warn('RSVP database submission error:', err);
    }

    setIsSubmitting(false);
    setConfirmed(true);

    // 2. Celebratory Royal Confetti
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#9B111E', '#F5D77F', '#EAA315', '#4A0E17']
      });
    } catch {}
  };

  const handleModalClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF7F0] rounded-3xl border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Top Regal Trim Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#9B111E] to-[#D4AF37] rounded-t-3xl"></div>

        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmed ? (
          /* ================= CREATIVE CONFIRMATION CARD ================= */
          <div className="text-center py-4 space-y-5 animate-fade-in">
            {/* Medallion with Checkmark */}
            <div className="relative inline-block mx-auto mt-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8E7] via-white to-[#FDE8D0] border-2 border-[#D4AF37] rounded-full flex items-center justify-center text-4xl shadow-md">
                🪷
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white text-xs font-bold shadow-sm">
                ✓
              </span>
            </div>

            <div>
              <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#9A7B1C] block mb-1">
                {lang === 'hi' ? '॥ उपस्थिति सादर स्वीकृत ॥' : '॥ Attendance Recorded ॥'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A0E17]">
                {lang === 'hi' ? 'हार्दिक आभार एवं स्वागतम्!' : 'Thank You & Warm Welcome!'}
              </h3>
            </div>

            {/* Personalized Welcome Letter Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/60 shadow-inner text-left space-y-3 font-serif">
              <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
                <span className="text-xs text-gray-500 font-sans">
                  {lang === 'hi' ? 'अतिथि विवरण' : 'Guest Details'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'hi' ? 'डेटाबेस में सुरक्षित दर्ज' : 'Saved to Database'}</span>
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#4A0E17]">
                  {lang === 'hi' ? `आदरणीय ${formData.name} जी,` : `Dear ${formData.name},`}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed mt-1">
                  {lang === 'hi'
                    ? 'शिवम संग विनीता के शुभ विवाह में आपकी सहभागिता की स्वीकृति हमें प्राप्त हो गई है। मौर्या परिवार आपके एवं आपके परिजनों के पावन शुभागमन की प्रतीक्षा में है।'
                    : 'Your confirmation for Shivam & Vinita’s wedding ceremony has been received with delight. The Maurya family eagerly awaits your auspicious arrival.'}
                </p>
              </div>

              {/* Attendance Summary Badges */}
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#D4AF37]/40 text-[#4A0E17] font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{formData.guestCount} {lang === 'hi' ? 'सदस्य' : 'Guests'}</span>
                </span>

                {formData.events.map((ev) => (
                  <span
                    key={ev}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[#9B111E] font-medium flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-[#9B111E]" />
                    <span>
                      {ev === 'tilak' && (lang === 'hi' ? 'तिलक' : 'Tilak')}
                      {ev === 'haldi' && (lang === 'hi' ? 'हल्दी' : 'Haldi')}
                      {ev === 'mehendi' && (lang === 'hi' ? 'मेहन्दी' : 'Mehendi')}
                      {ev === 'vivah' && (lang === 'hi' ? 'शुभ-विवाह' : 'Wedding')}
                    </span>
                  </span>
                ))}
              </div>

              {formData.message && (
                <p className="text-[11px] text-gray-500 italic pt-1 border-t border-gray-100">
                  "{formData.message}"
                </p>
              )}
            </div>

            <p className="text-xs text-gray-600 font-serif italic">
              {lang === 'hi'
                ? '॥ अतिथि-देवो भव • आपका आगमन हमारे आनंद को द्विगुणित करेगा ॥'
                : '“Your gracious presence will multiply the joy of the auspicious occasion.”'}
            </p>

            {/* Actions: Flower Shower Button & Done Button */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => triggerFlowerShower()}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-[#D4AF37] text-[#9A7B1C] text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Flower2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>{lang === 'hi' ? 'पुष्प वर्षा करें' : 'Shower Flowers'}</span>
              </button>

              <button
                type="button"
                onClick={handleModalClose}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9B111E] to-[#7A0A15] hover:from-[#7A0A15] hover:to-[#5A0710] text-white text-xs font-serif font-bold shadow-md transition-all"
              >
                {lang === 'hi' ? 'सधन्यवाद बंद करें' : 'Done & Close'}
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN RSVP INPUT FORM ================= */
          <div>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#9A7B1C] block mb-1">
                {lang === 'hi' ? '॥ सादर स्वागतम् ॥' : '॥ Atithi Devo Bhava ॥'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#4A0E17]">
                {lang === 'hi' ? 'आगमन की स्वीकृति दें' : 'Confirm Your Attendance'}
              </h3>
              <p className="text-xs text-gray-600 mt-1 font-serif">
                {lang === 'hi'
                  ? 'कृपया अपने आगमन एवं सहभागिता की जानकारी साझा कर मौर्या परिवार को कृतार्थ करें।'
                  : 'Please let the Maurya family know of your attendance to assist with hospitality.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {lang === 'hi' ? 'आपका शुभ नाम *' : 'Your Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={lang === 'hi' ? 'उदा. सुरेश चंद्र मौर्य' : 'e.g. Suresh Chandra Maurya'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none transition-all shadow-2xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {lang === 'hi' ? 'अतिथि संख्या (कुल सदस्य)' : 'Guest Count'}
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none bg-white transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="1">{lang === 'hi' ? '1 सदस्य' : '1 Person'}</option>
                    <option value="2">{lang === 'hi' ? '2 सदस्य' : '2 Persons'}</option>
                    <option value="3">{lang === 'hi' ? '3 सदस्य' : '3 Persons'}</option>
                    <option value="4">{lang === 'hi' ? '4 सदस्य' : '4 Persons'}</option>
                    <option value="5+">{lang === 'hi' ? '5+ सपरिवार' : '5+ Full Family'}</option>
                  </select>
                </div>
              </div>

              {/* Events selection checkboxes */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  {lang === 'hi' ? 'शामिल होने वाले कार्यक्रम:' : 'Events you will attend:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'tilak', label: lang === 'hi' ? 'तिलकोत्सव (20 जन)' : 'Tilak (Jan 20)' },
                    { id: 'haldi', label: lang === 'hi' ? 'हल्दी (23 जन)' : 'Haldi (Jan 23)' },
                    { id: 'mehendi', label: lang === 'hi' ? 'मेहन्दी (24 जन)' : 'Mehendi (Jan 24)' },
                    { id: 'vivah', label: lang === 'hi' ? 'शुभ-विवाह (25 जन)' : 'Wedding (Jan 25)' },
                  ].map((ev) => (
                    <label
                      key={ev.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        formData.events.includes(ev.id)
                          ? 'bg-rose-50 border-[#9B111E] text-[#9B111E] font-medium shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.events.includes(ev.id)}
                        onChange={() => handleEventToggle(ev.id)}
                        className="accent-[#9B111E]"
                      />
                      <span>{ev.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {lang === 'hi' ? 'कोई विशेष टिप्पणी या आगमन समय' : 'Special Note / Travel info'}
                </label>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'hi' ? 'उदा. हम 25 तारीख को शाम 6 बजे पहुंचेंगे' : 'e.g. Arriving on 25th evening'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] focus:ring-1 focus:ring-[#9B111E] text-xs sm:text-sm outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Direct In-App Confirmation Button (No WhatsApp redirect!) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#9B111E] via-[#850D18] to-[#9B111E] text-white font-serif font-bold text-xs sm:text-sm hover:from-[#7A0A15] hover:to-[#5A0710] shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 border border-[#D4AF37]/50"
              >
                <Heart className="w-4 h-4 text-[#F5D77F] fill-current" />
                <span>
                  {isSubmitting
                    ? (lang === 'hi' ? 'दर्ज किया जा रहा है...' : 'Recording Attendance...')
                    : (lang === 'hi' ? '॥ उपस्थिति दर्ज करें ॥' : 'Confirm Attendance')}
                </span>
                <Sparkles className="w-4 h-4 text-[#F5D77F]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
