/**
 * HeroSlider.tsx
 * 
 * Auto-rotating hero image slider. Shows one slide at a time and transitions
 * every 4.5 seconds using setInterval in useEffect.
 * 
 * Features:
 * - Dot navigation for manual slide selection (pauses auto-rotation temporarily)
 * - Smooth fade transition between slides
 * - Fully responsive, fixed height to prevent flicker/jumps
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';

interface HeroSliderProps {
  onShopClick: () => void;
  onTailoringClick?: () => void;
}

export default function HeroSlider({ onShopClick, onTailoringClick }: HeroSliderProps) {
  const { heroSlides } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-rotate slides every 4.5 seconds
  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 4500);
  }, []); // eslint-disable-line

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (heroSlides.length > 1) startAutoRotate();
    return () => stopAutoRotate();
  }, [heroSlides.length, startAutoRotate, stopAutoRotate]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);

    // Pause auto-rotate for 6 seconds after manual interaction
    stopAutoRotate();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      if (heroSlides.length > 1) startAutoRotate();
    }, 6000);
  }, [isTransitioning, heroSlides.length, startAutoRotate, stopAutoRotate]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  if (!heroSlides.length) return null;

  const slide = heroSlides[currentIndex] || heroSlides[0];

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '520px', height: '65vh', maxHeight: '750px' }}
    >
      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${slide.image})`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />

      {/* Gradient overlay - luxurious maroon-to-gold */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(110,30,34,0.82) 0%, rgba(28,43,69,0.75) 50%, rgba(186,139,42,0.5) 100%)',
        }}
      />

      {/* Moroccan geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0L37.5 15L52.5 7.5L45 22.5L60 30L45 37.5L52.5 52.5L37.5 45L30 60L22.5 45L7.5 52.5L15 37.5L0 30L15 22.5L7.5 7.5L22.5 15Z' fill='%23BA8B2A' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}
      >
        {/* Brand name */}
        <div
          className="mb-4 inline-block px-4 py-1 rounded-full text-sm font-medium tracking-widest uppercase"
          style={{
            backgroundColor: 'rgba(186, 139, 42, 0.2)',
            border: '1px solid rgba(186, 139, 42, 0.5)',
            color: '#BA8B2A',
          }}
        >
          ✦ خياط الإخوان ✦
        </div>

        {/* Main title */}
        <h1
          className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{ color: '#FAF6EE', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg lg:text-xl mb-8 max-w-xl opacity-90"
          style={{ color: '#FAF6EE' }}
        >
          {slide.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={onShopClick}
            className="px-8 py-3 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: '#BA8B2A',
              color: '#1C2B45',
              boxShadow: '0 4px 15px rgba(186, 139, 42, 0.4)',
            }}
          >
            {slide.ctaText} →
          </button>
          <button
            onClick={() => onTailoringClick?.()}
            className="px-8 py-3 rounded-full font-medium text-base transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              color: '#FAF6EE',
              border: '2px solid rgba(250, 246, 238, 0.6)',
            }}
          >
            طلب تفصيل خاص
          </button>
        </div>
      </div>

      {/* Slide dots navigation */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="rounded-full transition-all duration-300"
              style={{
                width: currentIndex === idx ? '28px' : '10px',
                height: '10px',
                backgroundColor: currentIndex === idx ? '#BA8B2A' : 'rgba(250, 246, 238, 0.5)',
              }}
              aria-label={`الشريحة ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex flex-col items-center gap-1 opacity-70">
        <span className="text-xs" style={{ color: '#FAF6EE' }}>مرر للأسفل</span>
        <svg className="w-4 h-4 animate-bounce" style={{ color: '#BA8B2A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
