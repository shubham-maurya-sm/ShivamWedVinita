import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Image as ImageIcon,
  Send,
  X,
  Sparkles,
  ArrowLeft,
  Check,
  Smile,
  RefreshCw,
  Clock,
  Tag,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  fetchWeddingPosts,
  createWeddingPost,
  uploadWeddingImage,
  addPostComment,
  likeWeddingPost,
  subscribeToWeddingFeed
} from '../lib/supabase';
import { compressImage } from '../utils/imageCompressor';

const CEREMONY_TAGS = [
  { id: 'all', hi: 'सभी पोस्ट (All)', en: 'All Posts' },
  { id: 'general', hi: '✨ सामान्य / बधाई', en: '✨ General Wishes' },
  { id: 'tilak', hi: '👑 तिलक समारोह', en: '👑 Tilak' },
  { id: 'haldi', hi: '💛 हल्दी उत्सव', en: '💛 Haldi Ceremony' },
  { id: 'mehendi', hi: '💚 मेहंदी और संगीत', en: '💚 Mehendi & Sangeet' },
  { id: 'vivah', hi: '🌺 शुभ विवाह व जयमाला', en: '🌺 Wedding & Jaimala' },
  { id: 'bidai', hi: '💐 विदाई एवं आशीर्वाद', en: '💐 Bidai' }
];

export default function LiveWeddingFeed({ onBackToInvite, initialLang = 'hi' }) {
  const [lang, setLang] = useState(initialLang);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');

  // Post composer state
  const [uploaderName, setUploaderName] = useState(() => localStorage.getItem('ds_feed_user_name') || '');
  const [content, setContent] = useState('');
  const [postTag, setPostTag] = useState('general');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Comment state per post: { [postId]: commentText }
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  // Link copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  const fileInputRef = useRef(null);

  // Load posts
  const loadPosts = async () => {
    try {
      const data = await fetchWeddingPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();

    // Subscribe to live feed updates (realtime)
    const unsubscribe = subscribeToWeddingFeed(() => {
      loadPosts();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle file selection & compression
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Fast client-side compression
      const compressed = await compressImage(file, { maxWidth: 1600, quality: 0.82 });
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
      setErrorMsg('');
    } catch (err) {
      console.warn('Compression error, using original file:', err);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Post
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!uploaderName.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }
    if (!content.trim() && !selectedFile) {
      setErrorMsg(lang === 'hi' ? 'कृपया कुछ संदेश लिखें या फोटो चुनें।' : 'Please write a message or attach a photo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      localStorage.setItem('ds_feed_user_name', uploaderName.trim());

      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadWeddingImage(selectedFile);
      }

      const res = await createWeddingPost({
        uploaderName: uploaderName.trim(),
        content: content.trim(),
        imageUrl,
        eventTag: postTag
      });

      if (res.success) {
        setContent('');
        removeSelectedFile();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
        loadPosts();
      } else {
        setErrorMsg(lang === 'hi' ? 'पोस्ट शेयर करने में समस्या आई, कृपया पुनः प्रयास करें।' : 'Failed to publish post, please retry.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'hi' ? 'कुछ गड़बड़ हुई।' : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like a post
  const handleLike = async (post) => {
    // Instant local optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, likes_count: (p.likes_count || 0) + 1, userLiked: true } : p))
    );
    await likeWeddingPost(post.id, post.likes_count || 0);
  };

  // Submit a comment
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const author = uploaderName.trim() || (lang === 'hi' ? 'मेहमान' : 'Guest');
    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await addPostComment({
        postId,
        authorName: author,
        commentText: text
      });

      if (res.success) {
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
        // Expand comments if not already expanded
        setExpandedComments((prev) => ({ ...prev, [postId]: true }));
        loadPosts();
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Copy Feed link
  const handleCopyLink = () => {
    const feedUrl = `${window.location.origin}${window.location.pathname}#live`;
    navigator.clipboard.writeText(feedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Share to WhatsApp
  const handleShareToWhatsApp = (post) => {
    const text = lang === 'hi'
      ? `शिवम और विनिता की शादी का लाइव मोमेंट देखें: "${post.content || 'शादी की खूबसूरत यादें'}" - ${window.location.origin}#live`
      : `Check out this live wedding moment from Shivam & Vinita's wedding: "${post.content || 'Wedding Memories'}" - ${window.location.origin}#live`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filter posts
  const filteredPosts = selectedTag === 'all'
    ? posts
    : posts.filter((p) => p.event_tag === selectedTag);

  // Format relative time
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return lang === 'hi' ? 'अभी' : 'Just now';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return lang === 'hi' ? `${mins} मिनट पहले` : `${mins}m ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return lang === 'hi' ? `${hours} घंटे पहले` : `${hours}h ago`;
    }
    const days = Math.floor(diff / 86400);
    return lang === 'hi' ? `${days} दिन पहले` : `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#4A0E17] font-sans selection:bg-[#9B111E] selection:text-white pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#800020]/95 backdrop-blur-md text-amber-50 border-b border-amber-400/30 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBackToInvite}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'hi' ? 'मुख्य आमंत्रण' : 'Invitation'}</span>
          </button>

          <div className="text-center">
            <h1 className="text-base sm:text-lg font-serif font-bold text-amber-200 flex items-center justify-center gap-1.5">
              <span>दीपा & सुमित</span>
              <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-300/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                LIVE FEED
              </span>
            </h1>
            <p className="text-[11px] text-amber-100/80">
              {lang === 'hi' ? 'शादी की लाइव तस्वीरें व यादें' : 'Live Wedding Moments & Wishes'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title={lang === 'hi' ? 'फीड लिंक कॉपी करें' : 'Copy Feed Link'}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs flex items-center gap-1 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied') : (lang === 'hi' ? 'शेयर' : 'Share')}</span>
            </button>

            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="text-xs font-semibold px-2 py-1 rounded bg-amber-400/20 text-amber-200 hover:bg-amber-400/30"
            >
              {lang === 'hi' ? 'EN' : 'हिं'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container (Facebook-style feed stream) */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* Post Composer Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-200/60 p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-[#9B111E] text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {uploaderName.trim() ? uploaderName.trim()[0].toUpperCase() : '✨'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder={lang === 'hi' ? 'आपका शुभ नाम (जैसे: राहुल, प्रिया चाची)...' : 'Your name (e.g. Rahul, Priya Chachi)...'}
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                className="w-full text-sm font-medium border-b border-amber-200 focus:border-[#9B111E] pb-1 outline-none text-[#4A0E17] placeholder:text-stone-400"
              />
            </div>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-3">
            <textarea
              rows={selectedFile ? 2 : 3}
              placeholder={
                lang === 'hi'
                  ? 'वर-वधू के लिए शुभकामना या इस खास पल की याद लिखें...'
                  : 'Write a blessing for the couple or describe this moment...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 focus:ring-2 focus:ring-[#9B111E]/20 focus:border-[#9B111E] outline-none text-sm text-[#4A0E17] placeholder:text-stone-400 resize-none transition-all"
            />

            {/* Image Preview Box */}
            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden border border-amber-300/80 bg-stone-900 group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-72 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Ceremony Tag Picker */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 shrink-0">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                {lang === 'hi' ? 'उत्सव:' : 'Tag:'}
              </span>
              {CEREMONY_TAGS.filter((t) => t.id !== 'all').map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPostTag(t.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                    postTag === t.id
                      ? 'bg-[#9B111E] text-white border-[#9B111E] font-medium shadow-sm'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-amber-50'
                  }`}
                >
                  {lang === 'hi' ? t.hi : t.en}
                </button>
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-100">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="feed-photo-upload"
                />
                <label
                  htmlFor="feed-photo-upload"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#800020] text-xs font-medium cursor-pointer border border-amber-200/80 transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'hi' ? 'फोटो जोड़ें' : 'Add Photo'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#9B111E] to-[#800020] text-amber-100 hover:text-white font-medium text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'hi' ? 'अपलोड हो रहा है...' : 'Posting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'शेयर करें' : 'Post'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Feed Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
          {CEREMONY_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedTag === tag.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-amber-50'
              }`}
            >
              {lang === 'hi' ? tag.hi : tag.en}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'hi' ? 'शादी की यादें लोड हो रही हैं...' : 'Loading wedding feed...'}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPosts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-amber-200/60 shadow-sm">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif font-bold text-base text-[#4A0E17]">
              {lang === 'hi' ? 'अभी तक कोई पोस्ट नहीं है' : 'No posts in this category yet'}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {lang === 'hi'
                ? 'शादी के इस खूबसूरत उत्सव की पहली तस्वीर या संदेश पोस्ट करके शुरुआत करें!'
                : 'Be the first to share a warm moment or blessing for Shivam & Vinita!'}
            </p>
          </div>
        )}

        {/* Posts Stream */}
        {!loading &&
          filteredPosts.map((post) => {
            const tagObj = CEREMONY_TAGS.find((t) => t.id === post.event_tag);
            const isCommentsOpen = Boolean(expandedComments[post.id]);
            const postComments = post.comments || [];

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-amber-200/70 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-[#9B111E] text-white flex items-center justify-center font-bold text-sm shadow">
                      {post.uploader_name ? post.uploader_name[0].toUpperCase() : 'G'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#4A0E17] leading-tight">
                        {post.uploader_name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {formatTimeAgo(post.created_at)}
                        </span>
                        {tagObj && tagObj.id !== 'general' && (
                          <span className="bg-amber-100 text-[#800020] px-2 py-0.2 rounded-full font-medium text-[10px]">
                            {lang === 'hi' ? tagObj.hi : tagObj.en}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShareToWhatsApp(post)}
                    title={lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}
                    className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Post Content / Text */}
                {post.content && (
                  <div className="px-4 py-3 text-sm text-stone-800 whitespace-pre-line leading-relaxed">
                    {post.content}
                  </div>
                )}

                {/* Attached Photo */}
                {post.image_url && (
                  <div
                    onClick={() => setLightboxImage(post.image_url)}
                    className="relative bg-stone-950 cursor-pointer overflow-hidden group max-h-[500px] flex items-center justify-center"
                  >
                    <img
                      src={post.image_url}
                      alt="Wedding moment"
                      loading="lazy"
                      className="w-full h-auto object-cover max-h-[500px] transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-sm">
                      <Maximize2 className="w-3 h-3" />
                      <span>{lang === 'hi' ? 'बड़ा देखें' : 'View Full'}</span>
                    </div>
                  </div>
                )}

                {/* Like & Comment Counts / Bar */}
                <div className="px-4 py-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-[#9B111E] text-white flex items-center justify-center text-[10px]">
                      ❤️
                    </span>
                    <span className="font-medium text-stone-700">{post.likes_count || 0}</span>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className="hover:underline"
                    >
                      {postComments.length}{' '}
                      {lang === 'hi' ? 'टिप्पणियां' : 'comments'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Like, Comment, WhatsApp */}
                <div className="px-2 py-1.5 grid grid-cols-2 gap-1 border-t border-b border-stone-100 text-xs font-semibold text-stone-600">
                  <button
                    onClick={() => handleLike(post)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-rose-50 hover:text-[#9B111E] transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.userLiked ? 'fill-[#9B111E] text-[#9B111E]' : 'text-stone-500'
                      }`}
                    />
                    <span>{lang === 'hi' ? 'पसंद (Like)' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-stone-500" />
                    <span>{lang === 'hi' ? 'कमेंट करें' : 'Comment'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {isCommentsOpen && (
                  <div className="p-4 bg-stone-50/70 space-y-3">
                    {/* Existing comments */}
                    {postComments.length > 0 ? (
                      <div className="space-y-2">
                        {postComments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-2.5 rounded-xl border border-stone-200/70 text-xs shadow-2xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#4A0E17]">
                                {comment.author_name}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-stone-700 leading-relaxed">
                              {comment.comment_text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-xs text-stone-400 py-1">
                        {lang === 'hi' ? 'पहली टिप्पणी लिखें...' : 'Be the first to comment...'}
                      </p>
                    )}

                    {/* New comment input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder={
                          lang === 'hi' ? 'अपनी टिप्पणी लिखें...' : 'Write a comment...'
                        }
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-full border border-stone-300 focus:border-[#9B111E] focus:outline-none text-xs bg-white text-stone-800 placeholder:text-stone-400 shadow-inner"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={
                          !commentInputs[post.id]?.trim() || submittingComment[post.id]
                        }
                        className="p-2 rounded-full bg-[#9B111E] text-white hover:bg-[#800020] disabled:opacity-40 transition-colors shadow"
                      >
                        {submittingComment[post.id] ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
