import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Compact Navbar Music Toggle Button (takes zero bottom screen real-estate)
 */
export function NavAudioButton({ isPlaying, toggleMusic, lang }) {
  return (
    <button
      onClick={toggleMusic}
      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-serif font-semibold transition-all shadow-sm ${
        isPlaying
          ? 'bg-[#9B111E] text-[#FEF3C7] border-[#D4AF37] animate-pulse'
          : 'bg-white text-[#7A0A15] border-[#D4AF37]/60 hover:bg-[#FAF7F0]'
      }`}
      title={isPlaying ? (lang === 'hi' ? 'संगीत बंद करें' : 'Mute Music') : (lang === 'hi' ? 'मंगल धुन सुनें' : 'Play Music')}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#FEF08A]" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'मंगल धुन चालू' : 'Music On'}</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'मंगल धुन' : 'Play Music'}</span>
        </>
      )}
    </button>
  );
}

export default NavAudioButton;
