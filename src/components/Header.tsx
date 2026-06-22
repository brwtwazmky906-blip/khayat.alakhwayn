/**
 * Header.tsx
 * 
 * Store header with logo (secret admin trigger: 7 clicks in 3 seconds),
 * navigation, and cart icon with live item count.
 */

import { useState, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onAdminTrigger: () => void;
  currentSection: string;
  onNavClick: (section: string) => void;
}

export default function Header({ onAdminTrigger, currentSection, onNavClick }: HeaderProps) {
  const { cartCount, setIsCartOpen, isAdminLoggedIn } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Secret admin trigger: 7 clicks in 3 seconds on the logo
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = useCallback(() => {
    clickCountRef.current += 1;
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    if (clickCountRef.current >= 7) {
      clickCountRef.current = 0;
      onAdminTrigger();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 3000);
    }
  }, [onAdminTrigger]);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'المنتجات' },
    { id: 'tailoring', label: 'التفصيل حسب الطلب' },
    { id: 'contact', label: 'التواصل' },
  ];

  return (
    <header
      className="sticky top-0 z-30 shadow-lg"
      style={{ backgroundColor: '#1C2B45' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo - Secret admin trigger */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
            onClick={handleLogoClick}
            title="خياط الإخوان"
          >
            {/* Moroccan star icon */}
            <div
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #BA8B2A, #6E1E22)' }}
            >
              <span className="text-white text-lg lg:text-xl font-bold">خ</span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-base lg:text-lg leading-tight"
                style={{ color: '#BA8B2A', fontFamily: 'Tajawal, sans-serif' }}
              >
                خياط الإخوان
              </span>
              <span
                className="text-xs leading-tight hidden sm:block"
                style={{ color: '#FAF6EE', opacity: 0.7 }}
              >
                khayat.alakhwayn
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavClick(link.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: currentSection === link.id ? '#BA8B2A' : '#FAF6EE',
                  backgroundColor: currentSection === link.id ? 'rgba(186, 139, 42, 0.1)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
            {isAdminLoggedIn && (
              <button
                onClick={() => onNavClick('admin')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: currentSection === 'admin' ? '#BA8B2A' : '#FAF6EE',
                  backgroundColor: currentSection === 'admin' ? 'rgba(186, 139, 42, 0.1)' : 'transparent',
                }}
              >
                لوحة التحكم
              </button>
            )}
          </nav>

          {/* Right side: Cart + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg transition-colors duration-200"
              style={{ color: '#FAF6EE' }}
              aria-label="سلة المشتريات"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a1.5 1.5 0 003 0m5 0a1.5 1.5 0 003 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -left-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs font-bold cart-badge-pulse"
                  style={{ backgroundColor: '#BA8B2A', color: '#1C2B45' }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: '#FAF6EE' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t py-3 pb-4"
            style={{ borderColor: 'rgba(186, 139, 42, 0.3)' }}
          >
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { onNavClick(link.id); setMobileMenuOpen(false); }}
                className="block w-full text-right px-4 py-3 text-sm font-medium rounded-lg mb-1"
                style={{
                  color: currentSection === link.id ? '#BA8B2A' : '#FAF6EE',
                  backgroundColor: currentSection === link.id ? 'rgba(186, 139, 42, 0.1)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
            {isAdminLoggedIn && (
              <button
                onClick={() => { onNavClick('admin'); setMobileMenuOpen(false); }}
                className="block w-full text-right px-4 py-3 text-sm font-medium rounded-lg"
                style={{ color: '#BA8B2A' }}
              >
                ⚙️ لوحة التحكم
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
