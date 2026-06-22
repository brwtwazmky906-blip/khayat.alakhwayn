/**
 * ProductCard.tsx
 * Individual product card with image, name, price, and cart actions.
 */

import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';
import { formatPrice } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsCartOpen } = useStore();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23FAF6EE'/%3E%3Ctext x='200' y='180' font-size='80' text-anchor='middle' fill='%23BA8B2A'%3E👘%3C/text%3E%3Ctext x='200' y='240' font-size='18' text-anchor='middle' fill='%236B5E52' font-family='sans-serif'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E";

  return (
    <div
      className="product-card rounded-2xl overflow-hidden flex flex-col group"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: '1px solid rgba(186, 139, 42, 0.1)',
      }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}>
        <img
          src={imageError ? PLACEHOLDER : product.image}
          alt={product.nameAr}
          onError={() => setImageError(true)}
          className="product-card-img absolute inset-0 w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#6E1E22', color: '#FAF6EE' }}
          >
            {product.badge}
          </div>
        )}

        {/* Category label */}
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'rgba(28, 43, 69, 0.85)',
            color: '#FAF6EE',
          }}
        >
          {product.category === 'jellaba' ? 'جلابة' : 'قفطان'}
          {' · '}
          {product.gender === 'men' ? 'رجالي' : product.gender === 'women' ? 'نسائي' : 'أطفال'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-base mb-1 line-clamp-2"
          style={{ color: '#2A211B' }}
        >
          {product.nameAr}
        </h3>

        <p
          className="text-xs mb-3 line-clamp-2 flex-1"
          style={{ color: '#6B5E52' }}
        >
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold" style={{ color: '#6E1E22' }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span
              className="text-sm line-through"
              style={{ color: '#6B5E52' }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleBuyNow}
            className="w-full py-2 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
            style={{ backgroundColor: '#6E1E22', color: '#FAF6EE' }}
          >
            اشتري الآن
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full py-2 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
            style={{
              backgroundColor: added ? '#2F4D3E' : '#BA8B2A',
              color: '#1C2B45',
            }}
          >
            {added ? '✓ تمت الإضافة' : '+ أضف إلى السلة'}
          </button>
        </div>
      </div>
    </div>
  );
}
