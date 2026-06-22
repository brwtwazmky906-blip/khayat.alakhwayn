/**
 * CategorySection.tsx
 * Featured categories: Jellaba & Kaftan displayed visually.
 */

interface CategorySectionProps {
  onCategoryClick: (category: 'jellaba' | 'kaftan') => void;
}

export default function CategorySection({ onCategoryClick }: CategorySectionProps) {
  const categories = [
    {
      id: 'jellaba' as const,
      name: 'الجلابيات',
      description: 'جلابيات رجالية ونسائية مصنوعة يدوياً من أجود الأقمشة',
      image: '/images/hero-jellaba.jpg',
      count: 'تشكيلة واسعة',
      emoji: '👘',
    },
    {
      id: 'kaftan' as const,
      name: 'القفاطن',
      description: 'قفاطن فاخرة بتطريز ذهبي أصيل، مثالية للأعراس والمناسبات',
      image: '/images/hero-kaftan.jpg',
      count: 'حصري ومميز',
      emoji: '✨',
    },
  ];

  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium mb-2" style={{ color: '#BA8B2A' }}>
            ✦ تشكيلاتنا المميزة ✦
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#1C2B45' }}>
            فئات المنتجات
          </h2>
          <div className="section-divider max-w-xs mx-auto">
            <div style={{ height: '1px', background: 'linear-gradient(to left, transparent, #BA8B2A, transparent)', flex: 1 }} />
            <span style={{ color: '#BA8B2A' }}>✦</span>
            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #BA8B2A, transparent)', flex: 1 }} />
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ height: '380px', boxShadow: '0 8px 32px rgba(28,43,69,0.15)' }}
              onClick={() => onCategoryClick(cat.id)}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(28,43,69,0.9) 0%, rgba(28,43,69,0.4) 50%, transparent 100%)',
                }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: '#BA8B2A' }}
              />

              {/* Content */}
              <div className="absolute bottom-0 right-0 left-0 p-6">
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                  style={{ backgroundColor: 'rgba(186, 139, 42, 0.25)', color: '#BA8B2A', border: '1px solid rgba(186,139,42,0.4)' }}
                >
                  {cat.count}
                </div>
                <h3
                  className="text-2xl lg:text-3xl font-bold mb-2"
                  style={{ color: '#FAF6EE' }}
                >
                  {cat.name}
                </h3>
                <p
                  className="text-sm mb-4 opacity-85"
                  style={{ color: '#FAF6EE' }}
                >
                  {cat.description}
                </p>
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 group-hover:gap-3"
                  style={{ backgroundColor: '#BA8B2A', color: '#1C2B45' }}
                >
                  تسوق الآن
                  <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="mt-10 rounded-2xl p-6 grid grid-cols-3 gap-4 text-center"
          style={{ backgroundColor: '#1C2B45' }}
        >
          {[
            { value: '+500', label: 'زبون راضٍ' },
            { value: '+15', label: 'سنة خبرة' },
            { value: '100%', label: 'تفصيل يدوي' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#BA8B2A' }}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm" style={{ color: '#FAF6EE', opacity: 0.8 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
