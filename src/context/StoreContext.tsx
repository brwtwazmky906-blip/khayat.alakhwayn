/**
 * StoreContext.tsx
 * 
 * Central state management for Khayat Al-Akhwayn store.
 * All data (products, cart, hero slides, tailoring orders, contact info)
 * is stored in localStorage to persist after page refresh.
 * 
 * Admin changes update localStorage immediately so they appear
 * dynamically on the customer-facing storefront.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ==================== TYPES ====================

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: 'jellaba' | 'kaftan';
  gender: 'men' | 'women' | 'children';
  price: number;
  originalPrice?: number;
  description: string;
  image: string; // Base64 or URL
  badge?: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface HeroSlide {
  id: string;
  image: string; // Base64 or URL
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface TailoringOrder {
  id: string;
  createdAt: string;
  status: 'new' | 'processing' | 'completed';
  // Customer info
  fullName: string;
  phone: string;
  contactMethod: 'call' | 'whatsapp';
  // Item details
  itemType: 'جلابة' | 'قفطان';
  gender: 'رجالي' | 'نسائي' | 'أطفال';
  occasion: string;
  fabric: string;
  fabricOther?: string;
  colors: string;
  embroidery?: string;
  // Measurements
  usePredefinedSize: boolean;
  predefinedSize?: string;
  measurements: {
    height?: string;
    chest?: string;
    waist?: string;
    hips?: string;
    sleeveLength?: string;
  };
  // Logistics
  budget: string;
  deliveryDate: string;
  referenceImageBase64?: string;
  notes?: string;
}

export interface ContactInfo {
  whatsappNumber: string; // International format e.g. 212612345678
  phone: string;
  address: string;
  city: string;
  instagram: string;
  facebook: string;
  email: string;
  mapUrl: string;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/images/hero-jellaba.jpg',
    title: 'جلابيات مغربية فاخرة',
    subtitle: 'مصنوعة يدوياً بحرفية أصيلة في قلب طنجة',
    ctaText: 'اكتشف الجلابيات',
  },
  {
    id: 'slide-2',
    image: '/images/hero-kaftan.jpg',
    title: 'قفاطن مغربية راقية',
    subtitle: 'فن التطريز والخياطة الموروث جيلاً عن جيل',
    ctaText: 'اكتشف القفاطن',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Jellaba Classique Homme',
    nameAr: 'جلابة كلاسيكية رجالية',
    category: 'jellaba',
    gender: 'men',
    price: 450,
    originalPrice: 550,
    description: 'جلابة رجالية كلاسيكية من القماش الصوفي الفاخر، مع تطريز ذهبي دقيق على الصدر والأكمام. مثالية للمناسبات والعيد.',
    image: '/images/product-jellaba-men.jpg',
    badge: 'الأكثر مبيعاً',
    inStock: true,
  },
  {
    id: 'p2',
    name: 'Kaftan Femme Luxe',
    nameAr: 'قفطان نسائي فاخر',
    category: 'kaftan',
    gender: 'women',
    price: 850,
    originalPrice: 1100,
    description: 'قفطان نسائي من الحرير الطبيعي مزين بتطريز الصقلي الذهبي، مثالي للأعراس والحفلات الراقية.',
    image: '/images/product-kaftan-women.jpg',
    badge: 'جديد',
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Jellaba Femme Brodée',
    nameAr: 'جلابة نسائية مطرزة',
    category: 'jellaba',
    gender: 'women',
    price: 380,
    description: 'جلابة نسائية أنيقة بتطريز مغربي أصيل، مناسبة للاستخدام اليومي والمناسبات العائلية.',
    image: '/images/product-jellaba-women.jpg',
    inStock: true,
  },
  {
    id: 'p4',
    name: 'Kaftan Mariée Royale',
    nameAr: 'قفطان العروس الملكي',
    category: 'kaftan',
    gender: 'women',
    price: 2200,
    description: 'قفطان عروس ملكي بتطريز يدوي كامل من الخيوط الذهبية والفضية، مع حجارة سوروفسكي. قطعة فنية استثنائية.',
    image: '/images/product-kaftan-bridal.jpg',
    badge: 'حصري',
    inStock: true,
  },
];

const DEFAULT_CONTACT: ContactInfo = {
  whatsappNumber: '212600000000',
  phone: '+212 6 00 00 00 00',
  address: 'حي مغوغة الكبرى',
  city: 'طنجة، المغرب',
  instagram: 'khayat.alakhwayn',
  facebook: 'khayat.alakhwayn',
  email: 'khayat.alakhwayn@gmail.com',
  mapUrl: 'https://www.google.com/maps/search/مغوغة+الكبرى+طنجة+المغرب',
};

// ==================== STORAGE HELPERS ====================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    console.warn(`Failed to load ${key} from localStorage`);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save ${key} to localStorage (storage may be full)`);
  }
}

// ==================== CONTEXT ====================

interface StoreContextType {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Hero slides
  heroSlides: HeroSlide[];
  setHeroSlides: (slides: HeroSlide[]) => void;

  // Tailoring orders
  tailoringOrders: TailoringOrder[];
  addTailoringOrder: (order: TailoringOrder) => void;
  updateOrderStatus: (id: string, status: TailoringOrder['status']) => void;
  deleteOrder: (id: string) => void;

  // Contact info
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;

  // Cart drawer
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Admin
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (v: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Load all state from localStorage with defaults
  const [products, setProductsState] = useState<Product[]>(() =>
    loadFromStorage('kaa_products', DEFAULT_PRODUCTS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('kaa_cart', [])
  );
  const [heroSlides, setHeroSlidesState] = useState<HeroSlide[]>(() =>
    loadFromStorage('kaa_hero_slides', DEFAULT_HERO_SLIDES)
  );
  const [tailoringOrders, setTailoringOrders] = useState<TailoringOrder[]>(() =>
    loadFromStorage('kaa_tailoring_orders', [])
  );
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(() =>
    loadFromStorage('kaa_contact_info', DEFAULT_CONTACT)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() =>
    sessionStorage.getItem('kaa_admin') === 'true'
  );

  // Persist all changes to localStorage
  useEffect(() => { saveToStorage('kaa_products', products); }, [products]);
  useEffect(() => { saveToStorage('kaa_cart', cart); }, [cart]);
  useEffect(() => { saveToStorage('kaa_hero_slides', heroSlides); }, [heroSlides]);
  useEffect(() => { saveToStorage('kaa_tailoring_orders', tailoringOrders); }, [tailoringOrders]);
  useEffect(() => { saveToStorage('kaa_contact_info', contactInfo); }, [contactInfo]);
  useEffect(() => {
    if (isAdminLoggedIn) {
      sessionStorage.setItem('kaa_admin', 'true');
    } else {
      sessionStorage.removeItem('kaa_admin');
    }
  }, [isAdminLoggedIn]);

  // Product actions
  const setProducts = useCallback((p: Product[]) => setProductsState(p), []);
  const addProduct = useCallback((product: Product) => {
    setProductsState(prev => [...prev, product]);
  }, []);
  const updateProduct = useCallback((product: Product) => {
    setProductsState(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProductsState(prev => prev.filter(p => p.id !== id));
  }, []);

  // Cart actions
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);
  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);
  const updateCartQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  // Computed cart values
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Hero slides
  const setHeroSlides = useCallback((slides: HeroSlide[]) => setHeroSlidesState(slides), []);

  // Tailoring orders
  const addTailoringOrder = useCallback((order: TailoringOrder) => {
    setTailoringOrders(prev => [order, ...prev]);
  }, []);
  const updateOrderStatus = useCallback((id: string, status: TailoringOrder['status']) => {
    setTailoringOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);
  const deleteOrder = useCallback((id: string) => {
    setTailoringOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  // Contact info
  const setContactInfo = useCallback((info: ContactInfo) => setContactInfoState(info), []);

  return (
    <StoreContext.Provider value={{
      products, setProducts, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      heroSlides, setHeroSlides,
      tailoringOrders, addTailoringOrder, updateOrderStatus, deleteOrder,
      contactInfo, setContactInfo,
      isCartOpen, setIsCartOpen,
      isAdminLoggedIn, setIsAdminLoggedIn,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
