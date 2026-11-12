import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Heart,
  MessageSquareHeart,
  Flower2,
  Download,
  Phone,
  MessageCircle,
  Trash2,
  Plus,
  Search,
  Sparkles,
  Lock,
  Unlock,
  LogOut,
  ArrowLeft,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Share2,
  Calendar,
  Send,
  Smartphone,
  Monitor,
  Globe,
  Wifi,
  Activity,
  RotateCcw,
  TrendingUp,
  Radio,
  Edit2,
  Save,
  X,
  Camera,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import {
  fetchAdminRsvps,
  deleteAdminRsvp,
  updateAdminRsvp,
  fetchAdminWishes,
  deleteAdminWish,
  updateAdminWish,
  submitWish,
  getLiveStats,
  fetchRecentVisits,
  submitRsvp,
  getLocalNotice,
  saveNotice,
  fetchLiveNotice,
  resetVisitCount,
  setFlowerCount,
  fetchWeddingPosts,
  adminTogglePostApproval,
  adminDeletePost,
  adminDeleteComment
} from '../../lib/supabase';

const VALID_PINS = ['admin2002'];

export default function AdminDashboard({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ds_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rsvps' | 'wishes' | 'whatsapp' | 'settings'
  const [lang, setLang] = useState('hi');

  // Live Data States
  const [stats, setStats] = useState({ flower_count: 0, total_visits: 0 });
  const [rsvps, setRsvps] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [visits, setVisits] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [copiedFeedLink, setCopiedFeedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Search
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState('all'); // 'all' | 'attending' | 'not_attending'
  const [wishSearch, setWishSearch] = useState('');

  // Manual RSVP Modal / Form
  const [showAddRsvp, setShowAddRsvp] = useState(false);
  const [editingRsvp, setEditingRsvp] = useState(null);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    guestCount: 2,
    attending: true,
    message: ''
  });

  // Wishes CRUD state
  const [showAddWish, setShowAddWish] = useState(false);
  const [editingWish, setEditingWish] = useState(null);
  const [newWishForm, setNewWishForm] = useState({
    name: '',
    relation: 'शुभचिंतक',
    message: ''
  });

  // WhatsApp Generator
  const [waGuestName, setWaGuestName] = useState('');
  const [waRelation, setWaRelation] = useState('आदरणीय स्वजन');

  // Live Notice Ticker
  const [notice, setNotice] = useState(getLocalNotice());
  const [noticeSaved, setNoticeSaved] = useState(false);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (VALID_PINS.includes(pinInput.trim())) {
      sessionStorage.setItem('ds_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('गलत पासवर्ड! कृपया सही एडमिन PIN/पासवर्ड दर्ज करें।');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ds_admin_auth');
    setIsAuthenticated(false);
  };

  // Load live data from Supabase & storage
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [liveStats, rsvpList, wishList, visitLogs, liveNotice, postList] = await Promise.all([
        getLiveStats(),
        fetchAdminRsvps(),
        fetchAdminWishes(),
        fetchRecentVisits(),
        fetchLiveNotice(),
        fetchWeddingPosts(true)
      ]);
      setStats(liveStats);
      setRsvps(rsvpList);
      setWishes(wishList);
      setVisits(visitLogs);
      setFeedPosts(postList || []);
      if (liveNotice) setNotice(liveNotice);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset visit count to zero
  const handleResetVisits = async () => {
    if (window.confirm('क्या आप विज़िटर्स काउंट और विज़िट हिस्ट्री को 0 (शून्य) करना चाहते हैं?')) {
      await resetVisitCount();
      setStats((prev) => ({ ...prev, total_visits: 0 }));
      setVisits([]);
      alert('विज़िटर्स काउंट सफलतापूर्वक 0 कर दिया गया है!');
    }
  };

  // Analytics Intelligence aggregation for graphs & charts
  const visitorAnalytics = useMemo(() => {
    let rawLocal = [];
    try {
      const stored = localStorage.getItem('ds_detailed_visitors');
      if (stored) rawLocal = JSON.parse(stored);
    } catch {}

    // Combine Supabase cloud visits with local logs, deduplicating by visitorId/id
    const visitMap = new Map();
    rawLocal.forEach((v) => {
      const key = v.visitorId || v.id || `${v.deviceType}_${v.created_at}`;
      visitMap.set(key, v);
    });
    visits.forEach((v) => {
      const key = v.visitorId || v.id || `${v.deviceType}_${v.visited_at || v.created_at}`;
      visitMap.set(key, v);
    });

    const allVisits = Array.from(visitMap.values());
    const total = allVisits.length || 1;

    let android = 0, iphone = 0, desktop = 0, tablet = 0;
    let whatsapp = 0, direct = 0, google = 0, social = 0;
    let fourG = 0, fiveG = 0, wifi = 0;
    let india = 0, abroad = 0;

    allVisits.forEach((v) => {
      const str = `${v.deviceType || v.device_type || ''} ${v.browser || ''} ${v.os || ''}`.toLowerCase();
      if (str.includes('iphone') || str.includes('ios')) iphone++;
      else if (str.includes('android')) android++;
      else if (str.includes('tablet') || str.includes('ipad')) tablet++;
      else desktop++;

      const ref = `${v.referrer || ''} ${v.browser || ''}`.toLowerCase();
      if (ref.includes('whatsapp')) whatsapp++;
      else if (ref.includes('google')) google++;
      else if (ref.includes('instagram') || ref.includes('facebook') || ref.includes('social')) social++;
      else direct++;

      const net = `${v.network || ''} ${v.browser || ''} ${v.fullBrowser || ''}`.toLowerCase();
      if (net.includes('5g')) fiveG++;
      else if (net.includes('4g')) fourG++;
      else wifi++;

      const tz = `${v.timezone || ''} ${v.screen || ''} ${v.screen_resolution || ''}`.toLowerCase();
      if (tz.includes('kolkata') || tz.includes('calcutta') || tz.includes('india') || !v.timezone) india++;
      else abroad++;
    });

    return {
      allVisits,
      totalCount: allVisits.length,
      devices: {
        android: { count: android, pct: Math.round((android / total) * 100) || 0 },
        iphone: { count: iphone, pct: Math.round((iphone / total) * 100) || 0 },
        desktop: { count: desktop, pct: Math.round((desktop / total) * 100) || 0 },
        tablet: { count: tablet, pct: Math.round((tablet / total) * 100) || 0 },
      },
      sources: {
        whatsapp: { count: whatsapp, pct: Math.round((whatsapp / total) * 100) || 0 },
        direct: { count: direct, pct: Math.round((direct / total) * 100) || 0 },
        google: { count: google, pct: Math.round((google / total) * 100) || 0 },
        social: { count: social, pct: Math.round((social / total) * 100) || 0 },
      },
      network: {
        fourG,
        fiveG,
        wifi
      },
      regions: {
        india,
        abroad
      }
    };
  }, [visits]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Derived RSVP calculations
  const rsvpMetrics = useMemo(() => {
    const totalEntries = rsvps.length;
    const attendingList = rsvps.filter((r) => r.attending);
    const confirmedHeadcount = attendingList.reduce(
      (sum, r) => sum + (parseInt(r.guest_count, 10) || 1),
      0
    );
    const notAttendingCount = rsvps.filter((r) => !r.attending).length;

    return {
      totalEntries,
      attendingEntries: attendingList.length,
      confirmedHeadcount,
      notAttendingCount
    };
  }, [rsvps]);

  // Filtered RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchSearch =
        !rsvpSearch ||
        r.name?.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
        r.phone?.includes(rsvpSearch);

      const matchFilter =
        rsvpFilter === 'all' ||
        (rsvpFilter === 'attending' && r.attending) ||
        (rsvpFilter === 'not_attending' && !r.attending);

      return matchSearch && matchFilter;
    });
  }, [rsvps, rsvpSearch, rsvpFilter]);

  // Filtered Wishes
  const filteredWishes = useMemo(() => {
    return wishes.filter((w) => {
      return (
        !wishSearch ||
        w.name?.toLowerCase().includes(wishSearch.toLowerCase()) ||
        w.message?.toLowerCase().includes(wishSearch.toLowerCase())
      );
    });
  }, [wishes, wishSearch]);

  // Handle Delete RSVP
  const handleDeleteRsvp = async (id, name) => {
    if (window.confirm(`क्या आप "${name}" का RSVP हटाना चाहते हैं?`)) {
      const res = await deleteAdminRsvp(id);
      if (res && res.success === false) {
        alert('हटाने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
        return;
      }
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Handle Delete Wish
  const handleDeleteWish = async (id, name) => {
    if (window.confirm(`क्या आप "${name}" का शुभकामना संदेश हटाना चाहते हैं?`)) {
      const res = await deleteAdminWish(id);
      if (res && res.success === false) {
        alert('हटाने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
        return;
      }
      setWishes((prev) => prev.filter((w) => w.id !== id));
    }
  };

  // Feed Moderation Handlers
  const handleToggleFeedPost = async (id, currentApproved) => {
    setFeedPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_approved: !currentApproved } : p))
    );
    await adminTogglePostApproval(id, currentApproved);
  };

  const handleDeleteFeedPost = async (id) => {
    if (window.confirm('क्या आप इस पोस्ट को स्थायी रूप से हटाना चाहते हैं?')) {
      setFeedPosts((prev) => prev.filter((p) => p.id !== id));
      await adminDeletePost(id);
    }
  };

  const handleDeleteFeedComment = async (commentId, postId) => {
    if (window.confirm('क्या आप इस टिप्पणी (comment) को हटाना चाहते हैं?')) {
      setFeedPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) }
            : p
        )
      );
      await adminDeleteComment(commentId);
    }
  };

  const handleCopyFeedLink = () => {
    const feedUrl = `${window.location.origin}/#live`;
    navigator.clipboard.writeText(feedUrl);
    setCopiedFeedLink(true);
    setTimeout(() => setCopiedFeedLink(false), 2500);
  };

  // Handle Manual RSVP add
  const handleAddManualRsvp = async (e) => {
    e.preventDefault();
    if (!manualForm.name) return;
    const res = await submitRsvp({
      name: manualForm.name,
      phone: manualForm.phone,
      attending: manualForm.attending,
      guestCount: manualForm.guestCount,
      message: manualForm.message ? `[फोन पर दर्ज] ${manualForm.message}` : '[फोन पर दर्ज]'
    });
    if (res && res.success === false) {
      alert('RSVP जोड़ने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
      return;
    }
    setShowAddRsvp(false);
    setManualForm({ name: '', phone: '', guestCount: 2, attending: true, message: '' });
    loadData();
  };

  // Handle Update RSVP (Full CRUD Update)
  const handleUpdateRsvp = async (e) => {
    e.preventDefault();
    if (!editingRsvp) return;
    const payload = {
      name: editingRsvp.name,
      phone: editingRsvp.phone,
      attending: editingRsvp.attending,
      guest_count: parseInt(editingRsvp.guest_count, 10) || 1,
      message: editingRsvp.message
    };
    const res = await updateAdminRsvp(editingRsvp.id, payload);
    if (res && res.success === false) {
      alert('अपडेट करने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
      return;
    }
    setRsvps((prev) =>
      prev.map((r) => (r.id === editingRsvp.id ? { ...r, ...payload } : r))
    );
    setEditingRsvp(null);
  };

  // Handle Add Wish (Full CRUD Create)
  const handleAddWish = async (e) => {
    e.preventDefault();
    if (!newWishForm.name || !newWishForm.message) return;
    const res = await submitWish(newWishForm);
    if (res && res.success === false) {
      alert('संदेश जोड़ने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
      return;
    }
    if (res.success && res.data) {
      setWishes((prev) => [res.data, ...prev]);
    }
    setShowAddWish(false);
    setNewWishForm({ name: '', relation: 'शुभचिंतक', message: '' });
  };

  // Handle Update Wish (Full CRUD Update)
  const handleUpdateWish = async (e) => {
    e.preventDefault();
    if (!editingWish) return;
    const payload = {
      name: editingWish.name,
      relation: editingWish.relation,
      message: editingWish.message,
      name_en: editingWish.name_en || null,
      message_en: editingWish.message_en || null
    };
    const res = await updateAdminWish(editingWish.id, payload);
    if (res && res.success === false) {
      alert('अपडेट करने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
      return;
    }
    setWishes((prev) =>
      prev.map((w) => (w.id === editingWish.id ? { ...w, ...payload } : w))
    );
    setEditingWish(null);
  };

  // Handle Flower Count Reset or Custom Value
  const handleResetFlowers = async () => {
    const val = window.prompt('पुष्प वर्षा (Flower count) की संख्या सेट करें (उदा. 0 या कोई अन्य संख्या):', '0');
    if (val !== null) {
      const num = parseInt(val, 10) || 0;
      await setFlowerCount(num);
      setStats((prev) => ({ ...prev, flower_count: num }));
      alert(`पुष्प वर्षा संख्या को ${num} पर सेट कर दिया गया है!`);
    }
  };

  // CSV Export for Banquet / Halwai Catering
  const handleExportCsv = () => {
    if (rsvps.length === 0) {
      alert('डाउनलोड के लिए कोई RSVP डाटा उपलब्ध नहीं है।');
      return;
    }

    const headers = ['Guest Name', 'Phone Number', 'Attending', 'Guest Headcount', 'Special Message', 'Submission Date'];
    const rows = rsvps.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      r.attending ? 'Yes (Confirmed)' : 'No',
      r.guest_count || 1,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.created_at || Date.now()).toLocaleString('en-IN')}"`
    ]);

    // UTF-8 BOM for perfect Hindi characters in MS Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Deepa_Sumit_Wedding_Guests_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save Announcement Ticker
  const handleSaveNotice = async (e) => {
    e.preventDefault();
    const res = await saveNotice(notice);
    if (res && res.success === false) {
      alert('घोषणा सुरक्षित करने में समस्या आई: ' + (res.error?.message || 'सर्वर से संपर्क नहीं हो सका'));
      return;
    }
    setNoticeSaved(true);
    setTimeout(() => setNoticeSaved(false), 2500);
  };

  // Pre-filled WhatsApp message for invite generator
  const getPersonalizedWaText = () => {
    const salutation = waGuestName ? `${waRelation} ${waGuestName} जी` : 'आदरणीय स्वजन';
    return `॥ श्री गणेशाय नमः ॥

${salutation},
सादर प्रणाम।

ईश्वर की असीम अनुकम्पा से हमारी सुपुत्री *आयुष्मती दीपा साहू* संग *चिरंजीवी सुमित प्रसाद* के पावन शुभ विवाह (25 जनवरी 2027, उत्सव बैंक्वेट हॉल, घाघरा) की मांगलिक बेला पर आप सपरिवार सादर आमंत्रित हैं।

💌 संपूर्ण वैवाहिक कार्यक्रम, लग्न पत्रिका एवं स्थल मानचित्र देखने हेतु कृपया यह डिजिटल निमंत्रण पत्र खोलें:
👉 https://deepasumit.in

दर्शनाभिलाषी:
श्रीमती सुनिता देवी एवं श्री दिलीप साहू
एवं समस्त साहू परिवार, देवाकी (घाघरा)
📞 9304845132, 6204177370`;
  };

  // 1. PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4A0E17] via-[#2A050B] to-[#1A0307] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border-2 border-[#D4AF37] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#9B111E] to-[#D4AF37]"></div>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF7F0] border-2 border-[#D4AF37] flex items-center justify-center text-[#9B111E] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#4A0E17] mb-1">
            साहू परिवार एडमिन पोर्टल
          </h2>
          <p className="text-xs text-gray-600 font-serif mb-6">
            दीपा संग सुमित विवाह • प्रबंधन नियंत्रण कक्ष
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                autoFocus
                placeholder="सुरक्षा पासवर्ड दर्ज करें..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#9B111E] focus:ring-2 focus:ring-[#D4AF37]/40 outline-none font-mono"
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#9B111E] to-[#7A0A15] text-white font-serif font-bold text-sm hover:from-[#7A0A15] hover:to-[#5A0710] shadow-md transition-all active:scale-95"
            >
              प्रवेश करें (Login to Dashboard)
            </button>
          </form>

          <button
            onClick={onBackToSite}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#9B111E] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वेबसाइट पर वापस जाएं</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Main Dashboard Interface
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-gray-900 pb-20">
      {/* Top Admin Header Bar */}
      <header className="bg-gradient-to-r from-[#4A0E17] via-[#5C101D] to-[#4A0E17] text-[#FAF7F0] border-b-2 border-[#D4AF37] sticky top-0 z-40 shadow-lg px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-white p-0.5 shrink-0">
              <img src="/wedding_logo_ds.jpg" alt="Logo" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-[#F5D77F] leading-tight">
                दीप-सुमित विवाह एडमिन पोर्टल
              </h1>
              <span className="text-[10px] text-gray-300 font-mono block">
                deepasumit.in • Live Management Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              title="डेटा रीफ्रेश करें"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5D77F] border border-[#D4AF37]/40 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#C29D26] text-[#4A0E17] text-xs font-serif font-bold shadow-sm transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">वेबसाइट देखें</span>
            </button>

            <button
              onClick={handleLogout}
              title="लॉगआउट"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-serif">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>📊 अवलोकन (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('rsvps')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'rsvps'
                ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>💌 अतिथि व RSVP ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'wishes'
                ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>💬 शुभकामनाएं ({wishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>📢 व्हाट्सएप इनवाइट</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>📸 लाइव सोशल फीड ({feedPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#D4AF37] text-[#4A0E17] font-bold shadow-sm'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>⚙️ लाइव सूचना व सेटिंग्स</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif font-bold text-gray-500 uppercase">
                      🌸 पुष्प वर्षा
                    </span>
                    <Flower2 className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#4A0E17] font-mono">
                    {stats.flower_count?.toLocaleString('en-IN') || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-500">कुल वर्षा</span>
                  <button
                    onClick={handleResetFlowers}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors"
                    title="पुष्प वर्षा काउंट सेट / रीसेट करें"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>सेट करें</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-serif font-bold text-gray-500 uppercase">
                      👥 कुल विज़िट्स
                    </span>
                    <Users className="w-5 h-5 text-[#9B111E]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#4A0E17] font-mono">
                    {stats.total_visits?.toLocaleString('en-IN') || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-500">डिवाइस विज़िट्स</span>
                  <button
                    onClick={handleResetVisits}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 transition-colors"
                    title="विज़िटर्स काउंट 0 करें"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>0 करें (Reset)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-gray-500 uppercase">
                    🍽️ अपेक्षित मेहमान
                  </span>
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono">
                  {rsvpMetrics.confirmedHeadcount}
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  भोजन व्यवस्था हेतु कुल हेडकाउंट
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-gray-500 uppercase">
                    💬 कुल शुभकामनाएं
                  </span>
                  <MessageSquareHeart className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#4A0E17] font-mono">
                  {wishes.length}
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">प्राप्त स्नेहिल संदेश</span>
              </div>
            </div>

            {/* Event Countdown & Banquet Info Card */}
            <div className="bg-gradient-to-r from-[#FFF8E7] via-white to-[#FFF8E7] p-6 rounded-3xl border-2 border-[#D4AF37] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-serif font-bold text-[#9B111E] uppercase tracking-wider block mb-1">
                  📅 मुख्य वैवाहिक दिवस
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#4A0E17]">
                  25 जनवरी 2027 (सोमवार) • उत्सव बैंक्वेट हॉल, घाघरा
                </h3>
                <p className="text-xs text-gray-600 font-serif mt-1">
                  तिलक: 20 जनवरी (चंदवा) • मण्डप: 23 जनवरी • मेहन्दी: 24 जनवरी • शुभ विवाह: 25 जनवरी
                </p>
              </div>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#9B111E] text-white text-xs font-serif font-bold hover:bg-[#7A0A15] shadow-md transition-all shrink-0 active:scale-95"
              >
                <Download className="w-4 h-4 text-[#F5D77F]" />
                <span>कैटरिंग हेतु Excel (CSV) डाउनलोड</span>
              </button>
            </div>

            {/* VISUAL ANALYTICS & INTELLIGENCE GRAPHS */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* Graph 1: Device Breakdown */}
              <div className="bg-white p-5 rounded-3xl border border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <h5 className="font-serif font-bold text-xs text-[#4A0E17] flex items-center gap-1.5 uppercase tracking-wider">
                      <Smartphone className="w-4 h-4 text-[#9B111E]" />
                      <span>डिवाइस प्रकार (Device Distribution)</span>
                    </h5>
                    <span className="text-[10px] text-gray-500 font-mono">100% Total</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          🤖 Android फोन
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          {visitorAnalytics.devices.android.pct}% ({visitorAnalytics.devices.android.count})
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.devices.android.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          🍎 Apple iPhone (iOS)
                        </span>
                        <span className="font-mono font-bold text-purple-700">
                          {visitorAnalytics.devices.iphone.pct}% ({visitorAnalytics.devices.iphone.count})
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.devices.iphone.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          💻 Desktop / Laptop (PC)
                        </span>
                        <span className="font-mono font-bold text-amber-700">
                          {visitorAnalytics.devices.desktop.pct}% ({visitorAnalytics.devices.desktop.count})
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.devices.desktop.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          📱 Tablet / iPad
                        </span>
                        <span className="font-mono font-bold text-blue-700">
                          {visitorAnalytics.devices.tablet.pct}% ({visitorAnalytics.devices.tablet.count})
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.devices.tablet.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 italic mt-3 pt-2 border-t border-gray-100">
                  💡 अधिकांश मेहमान मोबाइल फोन से निमंत्रण पत्र देख रहे हैं।
                </p>
              </div>

              {/* Graph 2: Traffic Sources (WhatsApp vs Direct vs Google) */}
              <div className="bg-white p-5 rounded-3xl border border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <h5 className="font-serif font-bold text-xs text-[#4A0E17] flex items-center gap-1.5 uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>ट्रैफ़िक स्रोत (Traffic Source)</span>
                    </h5>
                    <span className="text-[10px] text-gray-500 font-mono">Channels</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          💬 व्हाट्सएप निमंत्रण लिंक
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          {visitorAnalytics.sources.whatsapp.pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.sources.whatsapp.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          🔗 डायरेक्ट लिंक (Direct Link)
                        </span>
                        <span className="font-mono font-bold text-[#9B111E]">
                          {visitorAnalytics.sources.direct.pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#9B111E] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.sources.direct.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          🔍 Google Search
                        </span>
                        <span className="font-mono font-bold text-blue-700">
                          {visitorAnalytics.sources.google.pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.sources.google.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-medium text-gray-700 flex items-center gap-1">
                          📸 Instagram / सोशल
                        </span>
                        <span className="font-mono font-bold text-pink-700">
                          {visitorAnalytics.sources.social.pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(visitorAnalytics.sources.social.pct, 4)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 italic mt-3 pt-2 border-t border-gray-100">
                  💡 व्हाट्सएप पर भेजे गए निमंत्रण से सबसे अधिक विज़िटर्स जुड़े हैं।
                </p>
              </div>

              {/* Graph 3: Network & Geography Intelligence */}
              <div className="bg-white p-5 rounded-3xl border border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <h5 className="font-serif font-bold text-xs text-[#4A0E17] flex items-center gap-1.5 uppercase tracking-wider">
                      <Wifi className="w-4 h-4 text-blue-600" />
                      <span>नेटवर्क व क्षेत्र (Network & Region)</span>
                    </h5>
                    <span className="text-[10px] text-gray-500 font-mono">Signals</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#D4AF37]/20">
                      <span className="text-[11px] text-gray-700 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-emerald-600" />
                        <span>5G / हाई-स्पीड नेटवर्क</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-700 text-xs">
                        {visitorAnalytics.network.fiveG} विज़िट्स
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#D4AF37]/20">
                      <span className="text-[11px] text-gray-700 flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-blue-600" />
                        <span>4G / WiFi नेटवर्क</span>
                      </span>
                      <span className="font-mono font-bold text-blue-700 text-xs">
                        {visitorAnalytics.network.fourG + visitorAnalytics.network.wifi} विज़िट्स
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#D4AF37]/20">
                      <span className="text-[11px] text-gray-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-purple-600" />
                        <span>भारत (Asia/Kolkata)</span>
                      </span>
                      <span className="font-mono font-bold text-purple-700 text-xs">
                        {visitorAnalytics.regions.india} विज़िट्स
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                  <span>विदेशी (NRI) विज़िटर्स:</span>
                  <span className="font-bold text-[#9B111E]">
                    {visitorAnalytics.regions.abroad} विज़िट
                  </span>
                </div>
              </div>
            </div>

            {/* Deep Visitor Inspector Table */}
            <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/50 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-base font-serif font-bold text-[#4A0E17] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#9B111E]" />
                    <span>विस्तृत विज़िटर इंटेलिजेंस तालिका (Deep Visitor Inspector)</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 font-serif">
                    ब्राउज़र से स्वचालित रूप से दर्ज डिवाइस, नेटवर्क, स्क्रीन रिज़ॉल्यूशन एवं विज़िट समय
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-gray-500 bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  कुल लॉग्स: {visitorAnalytics.allVisits.length}
                </span>
              </div>

              {visitorAnalytics.allVisits.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  वर्तमान में कोई विज़िट रिकॉर्ड नहीं है। (काउंट 0 है)
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF7F0] text-[#4A0E17] font-serif border-b border-[#D4AF37]/30">
                      <tr>
                        <th className="p-3">डिवाइस एवं ओएस (Device & OS)</th>
                        <th className="p-3">ब्राउज़र एवं ऐप (In-App)</th>
                        <th className="p-3">ट्रैफ़िक स्रोत (Source)</th>
                        <th className="p-3">नेटवर्क (Speed)</th>
                        <th className="p-3">स्क्रीन रिज़ॉल्यूशन</th>
                        <th className="p-3">समय व क्षेत्र</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {visitorAnalytics.allVisits.slice(0, 20).map((v, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 font-semibold text-[#4A0E17] flex items-center gap-1.5">
                            {v.deviceType?.includes('iPhone') ? (
                              <span className="text-purple-600">🍎</span>
                            ) : v.deviceType?.includes('Android') ? (
                              <span className="text-emerald-600">🤖</span>
                            ) : (
                              <span className="text-amber-600">💻</span>
                            )}
                            <span>{v.deviceType || 'Mobile'} ({v.os || 'Android'})</span>
                          </td>

                          <td className="p-3">
                            {v.browser?.includes('WhatsApp') ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                                <MessageCircle className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp In-App</span>
                              </span>
                            ) : (
                              <span className="text-gray-700">{v.browser || 'Chrome'}</span>
                            )}
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-[10px]">
                              {v.referrer || 'Direct Link'}
                            </span>
                          </td>

                          <td className="p-3 font-mono font-bold text-[10px] text-blue-700">
                            {v.network || '4G/WiFi'}
                          </td>

                          <td className="p-3 font-mono text-[10px] text-gray-500">
                            {v.screen || '390x844 (Mobile)'}
                          </td>

                          <td className="p-3 font-mono text-[10px] text-gray-500">
                            {new Date(v.created_at || Date.now()).toLocaleTimeString('hi-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}{' '}
                            <span className="text-[9px] text-gray-400 block">{v.timezone || 'Asia/Kolkata'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: RSVPS ===================== */}
        {activeTab === 'rsvps' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top Bar: Search, Filters, Add RSVP, Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="अतिथि का नाम या फोन नंबर खोजें..."
                  value={rsvpSearch}
                  onChange={(e) => setRsvpSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#9B111E] outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setRsvpFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    rsvpFilter === 'all'
                      ? 'bg-[#4A0E17] text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  सभी ({rsvps.length})
                </button>
                <button
                  onClick={() => setRsvpFilter('attending')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    rsvpFilter === 'attending'
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  आ रहे हैं ({rsvpMetrics.attendingEntries})
                </button>
                <button
                  onClick={() => setRsvpFilter('not_attending')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    rsvpFilter === 'not_attending'
                      ? 'bg-rose-700 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  असमर्थ ({rsvpMetrics.notAttendingCount})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddRsvp(!showAddRsvp)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>ऑफलाइन जोड़ें</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#9B111E] text-white text-xs font-semibold hover:bg-[#7A0A15] shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Excel CSV</span>
                </button>
              </div>
            </div>

            {/* Manual Offline RSVP Form (Collapsible) */}
            {showAddRsvp && (
              <form
                onSubmit={handleAddManualRsvp}
                className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-[#D4AF37] shadow-md grid sm:grid-cols-4 gap-3 animate-fade-in"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    अतिथि का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री अजय कुमार"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    फोन नंबर
                  </label>
                  <input
                    type="tel"
                    placeholder="10 अंकों का मोबाइल..."
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    कुल सदस्य (Headcount)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={manualForm.guestCount}
                    onChange={(e) => setManualForm({ ...manualForm, guestCount: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#9B111E] text-white text-xs font-bold hover:bg-[#7A0A15]"
                  >
                    सहेजें (Save RSVP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRsvp(false)}
                    className="py-2 px-3 rounded-xl bg-gray-200 text-gray-700 text-xs font-semibold"
                  >
                    रद्द
                  </button>
                </div>
              </form>
            )}

            {/* RSVP Table */}
            <div className="bg-white rounded-3xl border border-[#D4AF37]/50 shadow-sm overflow-hidden">
              {filteredRsvps.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  कोई RSVP प्रविष्टि नहीं मिली।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF7F0] text-[#4A0E17] font-serif border-b border-[#D4AF37]/30">
                      <tr>
                        <th className="p-3">अतिथि का नाम</th>
                        <th className="p-3">फोन नंबर</th>
                        <th className="p-3">स्थिति</th>
                        <th className="p-3">सदस्य संख्या</th>
                        <th className="p-3">विशेष संदेश / टिप्पणी</th>
                        <th className="p-3">दर्ज तिथि</th>
                        <th className="p-3 text-right">कार्य (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-[#FFFDF9] transition-colors">
                          <td className="p-3 font-semibold text-[#4A0E17]">{r.name}</td>
                          <td className="p-3 font-mono">
                            {r.phone ? (
                              <div className="flex items-center gap-1.5">
                                <span>{r.phone}</span>
                                <a
                                  href={`tel:${r.phone}`}
                                  title="कॉल करें"
                                  className="p-1 rounded-md bg-rose-50 text-[#9B111E] hover:bg-rose-100"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                <a
                                  href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(
                                    `नमस्ते ${r.name} जी, दीपा संग सुमित के शुभ विवाह में आपके आगमन की स्वीकृति हेतु साहू परिवार की ओर से कोटि-कोटि धन्यवाद!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="व्हाट्सएप भेजें"
                                  className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {r.attending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>आ रहे हैं (हाँ)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-semibold">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>असमर्थ</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold font-mono text-[#9B111E]">
                            {r.attending ? `${r.guest_count || 1} सदस्य` : '0'}
                          </td>
                          <td className="p-3 max-w-xs text-gray-600 italic">
                            {r.message || '—'}
                          </td>
                          <td className="p-3 font-mono text-[10px] text-gray-400">
                            {new Date(r.created_at || Date.now()).toLocaleDateString('hi-IN')}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => setEditingRsvp({ ...r })}
                              title="एडिट करें (Edit RSVP)"
                              className="p-1.5 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition-colors mr-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRsvp(r.id, r.name)}
                              title="डिलीट करें"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* EDIT RSVP MODAL (Full CRUD Update) */}
            {editingRsvp && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 max-w-md w-full shadow-2xl animate-fade-in relative">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <h4 className="font-serif font-bold text-base text-[#4A0E17] flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>अतिथि RSVP संपादित करें (Edit RSVP)</span>
                    </h4>
                    <button
                      onClick={() => setEditingRsvp(null)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateRsvp} className="space-y-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">अतिथि का नाम *</label>
                      <input
                        type="text"
                        required
                        value={editingRsvp.name}
                        onChange={(e) => setEditingRsvp({ ...editingRsvp, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#9B111E]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">फ़ोन नंबर</label>
                      <input
                        type="tel"
                        value={editingRsvp.phone || ''}
                        onChange={(e) => setEditingRsvp({ ...editingRsvp, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#9B111E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">उपस्थिति (Status)</label>
                        <select
                          value={editingRsvp.attending ? 'true' : 'false'}
                          onChange={(e) => setEditingRsvp({ ...editingRsvp, attending: e.target.value === 'true' })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none bg-white"
                        >
                          <option value="true">✓ आ रहे हैं (Attending)</option>
                          <option value="false">✗ असमर्थ (Not Attending)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">सदस्य संख्या (Headcount)</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={editingRsvp.guest_count || 1}
                          onChange={(e) => setEditingRsvp({ ...editingRsvp, guest_count: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">टिप्पणी / संदेश</label>
                      <textarea
                        rows="2"
                        value={editingRsvp.message || ''}
                        onChange={(e) => setEditingRsvp({ ...editingRsvp, message: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none resize-none"
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#9B111E] text-white font-bold hover:bg-[#7A0A15] shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5 text-[#F5D77F]" />
                        <span>अपडेट करें (Save Changes)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingRsvp(null)}
                        className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                      >
                        रद्द
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: WISHES ===================== */}
        {activeTab === 'wishes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="शुभकामना या नाम खोजें..."
                  value={wishSearch}
                  onChange={(e) => setWishSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 justify-between">
                <span className="text-xs font-serif text-gray-600">
                  कुल संदेश: <strong>{wishes.length}</strong>
                </span>

                <button
                  onClick={() => setShowAddWish(!showAddWish)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>नई शुभकामना जोड़ें</span>
                </button>
              </div>
            </div>

            {/* CREATE WISH FORM (Full CRUD Create) */}
            {showAddWish && (
              <form
                onSubmit={handleAddWish}
                className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-purple-300 shadow-md grid sm:grid-cols-2 gap-3 animate-fade-in"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    शुभचिंतक का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री अजय कुमार"
                    value={newWishForm.name}
                    onChange={(e) => setNewWishForm({ ...newWishForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    रिश्ता / संबंध
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. मामा जी / मित्र / पारिवारिक सदस्य"
                    value={newWishForm.relation}
                    onChange={(e) => setNewWishForm({ ...newWishForm, relation: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    आशीर्वाद संदेश *
                  </label>
                  <textarea
                    rows="2"
                    required
                    placeholder="वर-वधू के लिए मंगलकामनाएं..."
                    value={newWishForm.message}
                    onChange={(e) => setNewWishForm({ ...newWishForm, message: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 outline-none resize-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm"
                  >
                    सहेजें (Publish Wish)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddWish(false)}
                    className="py-2 px-3 rounded-xl bg-gray-200 text-gray-700 font-semibold text-xs"
                  >
                    रद्द
                  </button>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-white p-5 rounded-2xl border border-[#D4AF37]/50 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h5 className="font-serif font-bold text-sm text-[#4A0E17]">
                          {w.name}
                        </h5>
                        <span className="text-[10px] text-gray-500">
                          {w.relation || 'शुभचिंतक'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingWish({ ...w })}
                          title="संपादित करें (Edit Wish)"
                          className="text-gray-400 hover:text-amber-700 hover:bg-amber-50 p-1 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWish(w.id, w.name)}
                          title="हटाएं"
                          className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 italic font-serif leading-relaxed bg-[#FAF7F0] p-3 rounded-xl border border-[#D4AF37]/20">
                      "{w.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                    <span>
                      {new Date(w.created_at || Date.now())
                        .toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })
                        .replace(/अक्तूबर/g, 'अक्टूबर')}
                    </span>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `नमस्ते ${w.name} जी, दीपा संग सुमित के शुभ विवाह पर आपके स्नेहिल शुभकामना संदेश के लिए कोटि-कोटि धन्यवाद! — साहू परिवार`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>धन्यवाद भेजें</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* EDIT WISH MODAL (Full CRUD Update) */}
            {editingWish && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 max-w-md w-full shadow-2xl animate-fade-in relative">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <h4 className="font-serif font-bold text-base text-[#4A0E17] flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>शुभकामना संदेश संपादित करें (Edit Wish)</span>
                    </h4>
                    <button
                      onClick={() => setEditingWish(null)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateWish} className="space-y-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">शुभचिंतक का नाम *</label>
                      <input
                        type="text"
                        required
                        value={editingWish.name}
                        onChange={(e) => setEditingWish({ ...editingWish, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#9B111E]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">रिश्ता / संबंध</label>
                      <input
                        type="text"
                        value={editingWish.relation || ''}
                        onChange={(e) => setEditingWish({ ...editingWish, relation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#9B111E]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">शुभकामना संदेश *</label>
                      <textarea
                        rows="3"
                        required
                        value={editingWish.message}
                        onChange={(e) => setEditingWish({ ...editingWish, message: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none resize-none"
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5 text-[#F5D77F]" />
                        <span>सुरक्षित करें (Update Wish)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingWish(null)}
                        className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                      >
                        रद्द
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: WHATSAPP INVITE HUB ===================== */}
        {activeTab === 'whatsapp' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-royal animate-fade-in space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>व्यक्तिगत व्हाट्सएप निमंत्रण जनरेटर</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A0E17]">
                रिश्तेदार के नाम सहित विशेष निमंत्रण पत्र तैयार करें
              </h3>
              <p className="text-xs text-gray-600 font-serif mt-1">
                यहाँ नाम और रिश्ता लिखकर एक क्लिक में व्हाट्सएप पर खोलें और सीधे भेजें।
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  रिश्तेदार / अतिथि का नाम *
                </label>
                <input
                  type="text"
                  placeholder="उदा. आनन्द प्रसाद चौधरी"
                  value={waGuestName}
                  onChange={(e) => setWaGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  संबोधन / रिश्ता
                </label>
                <select
                  value={waRelation}
                  onChange={(e) => setWaRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] text-xs outline-none bg-white"
                >
                  <option value="आदरणीय फूफा जी">आदरणीय फूफा जी</option>
                  <option value="आदरणीय मामा जी">आदरणीय मामा जी</option>
                  <option value="आदरणीय मौसा जी">आदरणीय मौसा जी</option>
                  <option value="आदरणीय चाचा जी">आदरणीय चाचा जी</option>
                  <option value="प्रिय भैया">प्रिय भैया</option>
                  <option value="प्रिय दीदी">प्रिय दीदी</option>
                  <option value="प्रिय मित्र">प्रिय मित्र</option>
                  <option value="आदरणीय स्वजन">आदरणीय स्वजन (सामान्य)</option>
                </select>
              </div>
            </div>

            {/* Live Message Preview */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                संदेश पूर्वावलोकन (Preview)
              </label>
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#D4AF37]/40 text-xs text-gray-800 font-sans whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {getPersonalizedWaText()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(getPersonalizedWaText())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>व्हाट्सएप पर भेजें (Open in WhatsApp)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getPersonalizedWaText());
                  alert('संदेश क्लिपबोर्ड पर कॉपी हो गया!');
                }}
                className="py-3 px-4 rounded-2xl bg-[#FAF7F0] hover:bg-amber-100 text-[#4A0E17] border border-[#D4AF37] font-semibold text-xs transition-colors"
              >
                कॉपी करें
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: SETTINGS & TICKER ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37] shadow-royal animate-fade-in space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>लाइव साइट घोषणा टिकर (Live Announcement Banner)</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A0E17]">
                वेबसाइट के शीर्ष पर तुरंत सूचना प्रसारित करें
              </h3>
              <p className="text-xs text-gray-600 font-serif mt-1">
                यदि शादी के दिन बारात के समय, रूट, पार्किंग या मौसम से जुड़ी कोई तात्कालिक सूचना सभी मेहमानों को देनी हो, तो यहाँ से प्रसारित करें।
              </p>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F0] border border-[#D4AF37]/30">
                <input
                  type="checkbox"
                  id="enableTicker"
                  checked={notice.enabled}
                  onChange={(e) => setNotice({ ...notice, enabled: e.target.checked })}
                  className="w-4 h-4 text-[#9B111E] rounded focus:ring-[#9B111E] cursor-pointer"
                />
                <label htmlFor="enableTicker" className="text-xs font-bold text-[#4A0E17] cursor-pointer">
                  वेबसाइट के सबसे ऊपर सूचना पट्टी (Announcement Banner) चालू रखें
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  सूचना का विवरण (Notice Text)
                </label>
                <textarea
                  rows="3"
                  value={notice.text}
                  onChange={(e) => setNotice({ ...notice, text: e.target.value })}
                  placeholder="उदा. ✨ बारात का स्वागत सायं 7:30 बजे उत्सव बैंक्वेट हॉल, चाँदनी चौक पर होगा।"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#9B111E] text-xs outline-none resize-none"
                ></textarea>
              </div>

              {notice.enabled && notice.text && (
                <div>
                  <span className="text-[10px] text-gray-500 font-serif block mb-1">
                    लाइव साइट पर कैसा दिखेगा (Live Preview):
                  </span>
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#9B111E] to-amber-600 text-white text-xs font-serif font-semibold text-center shadow-sm">
                    📢 {notice.text}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-[#9B111E] text-white font-serif font-bold text-xs sm:text-sm hover:bg-[#7A0A15] shadow-md transition-all active:scale-95"
              >
                सेटिंग्स सुरक्षित करें (Save Announcement)
              </button>

              {noticeSaved && (
                <span className="ml-3 text-xs text-emerald-700 font-semibold animate-fade-in">
                  ✓ सेटिंग्स सफलतापूर्वक सुरक्षित हो गई हैं!
                </span>
              )}
            </form>
          </div>
        )}

        {/* ===================== TAB 6: LIVE SOCIAL FEED MODERATION ===================== */}
        {activeTab === 'feed' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Direct Link Banner */}
            <div className="bg-gradient-to-r from-[#800020] via-[#9B111E] to-amber-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-semibold uppercase tracking-wider">
                      DIRECT SECRET LINK
                    </span>
                    <span className="text-xs text-amber-200/80">
                      (मुख्य साइट से छिपा हुआ / Hidden from main nav)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                    📸 लाइव सोशल शादी फीड (Live Photo & Moments Feed)
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
                    यह फीड मुख्य आमंत्रण पर सामान्य अतिथियों को नहीं दिखती। केवल वही मेहमान इसे देख सकते हैं जिनके पास यह डायरेक्ट लिंक या QR कोड होगा। वे तस्वीरें, बधाई संदेश, लाइक और कमेंट कर सकते हैं!
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyFeedLink}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 text-[#4A0E17] font-semibold text-xs sm:text-sm hover:bg-amber-300 shadow flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedFeedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>लिंक कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>डायरेक्ट लिंक कॉपी करें</span>
                      </>
                    )}
                  </button>

                  <a
                    href="#live"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 shadow flex items-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>लाइव फीड खोलें</span>
                  </a>
                </div>
              </div>

              {/* URL preview pill */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 text-xs text-amber-200/90 font-mono">
                <span className="font-semibold text-amber-300 font-sans">गुप्त लिंक:</span>
                <span className="bg-black/30 px-3 py-1 rounded-lg select-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/#live` : 'https://deepasumit.in/#live'}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 font-medium">कुल पोस्ट्स</span>
                <p className="text-xl sm:text-2xl font-bold text-[#4A0E17] mt-0.5">{feedPosts.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 font-medium">अपलोड की गई फोटोज़</span>
                <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-0.5">
                  {feedPosts.filter((p) => Boolean(p.image_url)).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 font-medium">कुल लाइक्स</span>
                <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-0.5">
                  {feedPosts.reduce((acc, p) => acc + (p.likes_count || 0), 0)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-stone-500 font-medium">कुल टिप्पणियां (Comments)</span>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-0.5">
                  {feedPosts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}
                </p>
              </div>
            </div>

            {/* Posts Moderation List */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#4A0E17]">
                    सभी पोस्ट्स व तस्वीरें (Posts Moderation)
                  </h3>
                  <p className="text-xs text-stone-500">
                    यहाँ से आप किसी भी पोस्ट को तुरंत छुपा सकते हैं या स्थायी रूप से हटा सकते हैं।
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center gap-1 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">रिफ्रेश</span>
                </button>
              </div>

              {feedPosts.length === 0 ? (
                <div className="p-12 text-center text-stone-400 text-sm">
                  अभी तक कोई पोस्ट नहीं है।
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {feedPosts.map((post) => (
                    <div key={post.id} className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 hover:bg-stone-50/50 transition-colors">
                      {/* Photo Thumbnail if exists */}
                      {post.image_url ? (
                        <div className="w-full md:w-36 h-36 bg-stone-900 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={post.image_url}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full md:w-36 h-24 md:h-36 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200/60 text-stone-400 text-xs text-center p-2">
                          केवल टेक्स्ट संदेश
                        </div>
                      )}

                      {/* Content details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#4A0E17]">
                              {post.uploader_name}
                            </span>
                            {post.uploader_phone && (
                              <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-mono">
                                📞 {post.uploader_phone}
                              </span>
                            )}
                            <span className="text-xs text-stone-400">
                              • {new Date(post.created_at).toLocaleDateString('hi-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Approval Status Badge */}
                            {post.is_approved !== false ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>सार्वजनिक (Live)</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>छिपा हुआ (Hidden)</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {post.content && (
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-100">
                            {post.content}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                          <span className="flex items-center gap-1 font-medium text-rose-600">
                            ❤️ {post.likes_count || 0} लाइक्स
                          </span>
                          <span className="flex items-center gap-1 font-medium text-indigo-600">
                            💬 {post.comments?.length || 0} टिप्पणियां
                          </span>
                          <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            टैग: {post.event_tag || 'general'}
                          </span>
                        </div>

                        {/* Comments nested list */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="mt-3 pl-3 border-l-2 border-amber-300 space-y-1.5 pt-1">
                            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                              टिप्पणियां (Comments):
                            </span>
                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-center justify-between bg-stone-100/70 p-2 rounded-lg text-xs"
                              >
                                <div>
                                  <span className="font-semibold text-stone-800 mr-2">
                                    {comment.author_name}:
                                  </span>
                                  <span className="text-stone-700">{comment.comment_text}</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteFeedComment(comment.id, post.id)}
                                  title="टिप्पणी हटाएं"
                                  className="text-stone-400 hover:text-red-600 p-1 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Admin Actions */}
                      <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => handleToggleFeedPost(post.id, post.is_approved !== false)}
                          className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            post.is_approved !== false
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.is_approved !== false ? 'छुपाएं (Hide)' : 'स्वीकृत करें (Approve)'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteFeedPost(post.id)}
                          className="w-full px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>हटाएं (Delete)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
