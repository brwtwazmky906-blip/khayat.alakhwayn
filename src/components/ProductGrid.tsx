/**
 * ProductGrid.tsx
 * Displays the product grid with category filter tabs.
 */

import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

type FilterCategory = 'all' | 'jellaba' | 'kaftan';
type FilterGender = 'all' | 'men' | 'women' | 'children';

interface ProductGridProps {
  initialCategory?: FilterCategory;
}

export default function ProductGrid({ initialCategory = 'all' }: ProductGridProps) {
  const { products } = useStore();
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>(initialCategory);
  const [genderFilter, setGenderFilter] = useState<FilterGender>('all');

  const filtered = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    return true;
  });

  const categoryTabs: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'jellaba', label: 'الجلابيات' },
    { id: 'kaftan', label: 'القفاطن' },
  ];

  const genderTabs: { id: FilterGender; label: string }[] = [
    { id: 'all', label: 'الجميع' },
    { id: 'men', label: 'رجالي' },
    { id: 'women', label: 'نسائي' },
    { id: 'children', label: 'أطفال' },
  ];

  return (
    <section id="products-section" className="py-16 px-4" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium mb-2" style={{ color: '#BA8B2A' }}>
            ✦ تشكيلتنا الكاملة ✦
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#1C2B45' }}>
            منتجاتنا
          </h2>
          <div className="flex justify-center items-center gap-3 mb-2">
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, #BA8B2A, transparent)' }} />
            <span style={{ color: '#BA8B2A' }}>✦</span>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, #BA8B2A, transparent)' }} />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: categoryFilter === tab.id ? '#6E1E22' : '#FFFFFF',
                color: categoryFilter === tab.id ? '#FAF6EE' : '#2A211B',
                border: `2px solid ${categoryFilter === tab.id ? '#6E1E22' : 'rgba(186,139,42,0.2)'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gender Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {genderTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setGenderFilter(tab.id)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: genderFilter === tab.id ? '#BA8B2A' : 'transparent',
                color: genderFilter === tab.id ? '#1C2B45' : '#6B5E52',
                border: `1px solid ${genderFilter === tab.id ? '#BA8B2A' : 'rgba(107,94,82,0.3)'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ backgroundColor: '#FFFFFF', border: '2px dashed rgba(186,139,42,0.3)' }}
          >
            <div className="text-5xl mb-4">👘</div>
            <p className="text-lg font-medium" style={{ color: '#6B5E52' }}>
              لا توجد منتجات في هذه الفئة
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B5E52', opacity: 0.7 }}>
              جرّب تصفية مختلفة أو تواصل معنا للطلب الخاص
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
