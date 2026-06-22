/**
 * App.tsx
 * 
 * Main application component for Khayat Al-Akhwayn Store.
 * 
 * Architecture:
 * - StoreProvider wraps everything for global state (cart, products, orders, etc.)
 * - Single-page app with section-based navigation (no React Router needed)
 * - Admin panel triggered by 7 logo clicks in 3 seconds
 * - All data persisted in localStorage
 */

import { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CategorySection from './components/CategorySection';
import ProductGrid from './components/ProductGrid';
import TailoringForm from './components/TailoringForm';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useStore } from './context/StoreContext';

type Section = 'home' | 'products' | 'tailoring' | 'contact' | 'admin';

function AppInner() {
  const { isAdminLoggedIn } = useStore();
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [productFilter, setProductFilter] = useState<'all' | 'jellaba' | 'kaftan'>('all');

  const navigateTo = (section: string) => {
    if (section === 'admin' && !isAdminLoggedIn) return;
    setCurrentSection(section as Section);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      navigateTo('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleCategoryClick = (category: 'jellaba' | 'kaftan') => {
    setProductFilter(category);
    setCurrentSection('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    setCurrentSection('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If admin is logged in and on admin page, show dashboard
  if (currentSection === 'admin' && isAdminLoggedIn) {
    return (
      <>
        <Header
          onAdminTrigger={handleAdminTrigger}
          currentSection={currentSection}
          onNavClick={navigateTo}
        />
        <AdminDashboard />
        <CartDrawer />
        {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF6EE', minHeight: '100vh' }}>
      {/* Sticky Header */}
      <Header
        onAdminTrigger={handleAdminTrigger}
        currentSection={currentSection}
        onNavClick={navigateTo}
      />

      {/* Main Content */}
      <main>
        {currentSection === 'home' && (
          <>
            {/* Hero Slider */}
            <HeroSlider
              onShopClick={handleShopClick}
              onTailoringClick={() => {
                setCurrentSection('tailoring');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Categories */}
            <CategorySection onCategoryClick={handleCategoryClick} />

            {/* Featured Products (show all) */}
            <section id="products-preview">
              <ProductGrid initialCategory="all" />
            </section>

            {/* Tailoring CTA Banner */}
            <section
              className="py-16 px-4 text-center zellige-pattern"
              style={{ backgroundColor: '#6E1E22' }}
            >
              <div className="max-w-3xl mx-auto">
                <p className="text-sm font-medium mb-3" style={{ color: '#BA8B2A' }}>
                  ✦ خدمة حصرية ✦
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#FAF6EE' }}>
                  فصّل قطعتك الخاصة
                </h2>
                <p className="text-base mb-8 opacity-85" style={{ color: '#FAF6EE' }}>
                  لا تجد ما يناسبك؟ نحن نصنع قطعتك على مقاسك بالضبط، من اختيار القماش إلى أدق تفاصيل التطريز.
                </p>
                <button
                  onClick={() => {
                    setCurrentSection('tailoring');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-10 py-4 rounded-full font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{
                    backgroundColor: '#BA8B2A',
                    color: '#1C2B45',
                    boxShadow: '0 4px 20px rgba(186, 139, 42, 0.4)',
                  }}
                >
                  ابدأ طلب التفصيل الآن ✦
                </button>
              </div>
            </section>

            {/* Contact preview */}
            <ContactSection />
          </>
        )}

        {currentSection === 'products' && (
          <div id="products-section">
            <ProductGrid initialCategory={productFilter} />
          </div>
        )}

        {currentSection === 'tailoring' && (
          <section
            id="tailoring-section"
            className="py-16 px-4"
            style={{ backgroundColor: '#FAF6EE' }}
          >
            <div className="max-w-3xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-10">
                <p className="text-sm font-medium mb-2" style={{ color: '#BA8B2A' }}>
                  ✦ خدمة التفصيل الخاص ✦
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#1C2B45' }}>
                  طلب تفصيل حسب الطلب
                </h2>
                <div className="flex justify-center items-center gap-3 mb-4">
                  <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, #BA8B2A, transparent)' }} />
                  <span style={{ color: '#BA8B2A' }}>✦</span>
                  <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, #BA8B2A, transparent)' }} />
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#6B5E52' }}>
                  أخبرنا بتفاصيل قطعتك وسنتولى تنفيذها بأعلى معايير الحرفية المغربية الأصيلة
                </p>
              </div>

              <TailoringForm />
            </div>
          </section>
        )}

        {currentSection === 'contact' && (
          <ContactSection />
        )}
      </main>

      {/* Footer - always visible */}
      {currentSection !== 'admin' && (
        <Footer onNavClick={navigateTo} />
      )}

      {/* Cart Drawer - always accessible */}
      <CartDrawer />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSuccess={() => setCurrentSection('admin')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
