import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flower2 } from 'lucide-react';
import { getLiveStats, incrementFlowerCount } from '../lib/supabase';

/**
 * Custom Authentic Indian Marigold (गेंदा) Petal Shapes
 */
const marigoldPetal1 = confetti.shapeFromPath({
  path: 'M12 0 C18 4, 22 12, 18 20 C14 26, 8 26, 4 20 C0 12, 6 4, 12 0 Z'
});

const marigoldPetal2 = confetti.shapeFromPath({
  path: 'M10 2 C14 1, 18 5, 19 10 C20 15, 17 19, 13 20 C9 21, 4 18, 3 13 C2 8, 6 3, 10 2 Z'
});

/**
 * Triggers a traditional Indian wedding Marigold Flower Shower (पुष्प वर्षा)
 */
export function triggerFlowerShower() {
  // Sacred Temple Bell / Auspicious Chime sound effect
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Auspicious Bell
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2);
    }
  } catch {
    // audio fallback
  }

  // Pure Marigold Palette: Golden Yellow, Saffron Orange, and Turmeric Gold ONLY
  const marigoldColors = [
    '#F59E0B', // Radiant Marigold
    '#EAA315', // Auspicious Turmeric Gold
    '#D97706', // Deep Marigold Saffron
    '#FBBF24', // Golden Genda Yellow
    '#EA580C', // Festive Royal Saffron
    '#FDE047', // Sunlit Yellow Petal
  ];

  // 1. Center grand marigold cascade
  confetti({
    particleCount: 55,
    spread: 100,
    origin: { y: 0.15 },
    colors: marigoldColors,
    shapes: [marigoldPetal1, marigoldPetal2],
    scalar: 1.6,
    gravity: 0.55,
    drift: 0,
    ticks: 240
  });

  // 2. Left side marigold shower
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 75,
      origin: { x: 0.1, y: 0.25 },
      colors: marigoldColors,
      shapes: [marigoldPetal1, marigoldPetal2],
      scalar: 1.7,
      gravity: 0.65,
      ticks: 260
    });
  }, 120);

  // 3. Right side marigold shower
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 75,
      origin: { x: 0.9, y: 0.25 },
      colors: marigoldColors,
      shapes: [marigoldPetal1, marigoldPetal2],
      scalar: 1.7,
      gravity: 0.65,
      ticks: 260
    });
  }, 240);
}

/**
 * Floating Quick Action Button for Flower Shower (पुष्प वर्षा)
 */
export default function FloatingFlowerShower({ lang }) {
  const [showerCount, setShowerCount] = useState(168);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    // Load live counter from Supabase (or localStorage fallback)
    getLiveStats().then((stats) => {
      if (stats && stats.flower_count) {
        setShowerCount(stats.flower_count);
      }
    });
  }, []);

  const handleClick = async () => {
    triggerFlowerShower();
    setIsBouncing(true);

    // Optimistically increment UI count
    setShowerCount((prev) => prev + 1);

    // Persist to Supabase
    try {
      const serverCount = await incrementFlowerCount();
      if (serverCount) setShowerCount(serverCount);
    } catch {
      // ignore
    }

    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-5 z-40">
      <button
        onClick={handleClick}
        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-medium text-xs sm:text-sm shadow-xl hover:shadow-gold-glow border-2 border-[#D4AF37] transition-all transform hover:-translate-y-1 active:translate-y-0 ${
          isBouncing ? 'scale-110' : ''
        }`}
        title={lang === 'hi' ? 'पुष्प वर्षा करें' : 'Shower Flowers'}
      >
        <Flower2 className="w-5 h-5 text-[#FEF08A] group-hover:rotate-45 transition-transform animate-pulse" />
        <span className="font-serif tracking-wide font-bold">
          {lang === 'hi' ? 'पुष्प वर्षा' : 'Flower Shower'}
        </span>
        <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#FEF3C7] border border-white/20">
          {showerCount}
        </span>
      </button>
    </div>
  );
}
