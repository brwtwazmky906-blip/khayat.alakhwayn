/**
 * AdminDashboard.tsx
 * 
 * Full admin control panel integrated into the storefront.
 * Allows admin to manage products (with real image uploads), hero slides,
 * contact info, and view/manage tailoring orders.
 * 
 * All changes are persisted to localStorage immediately and reflected
 * dynamically on the customer-facing storefront without page reload.
 */

import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product, HeroSlide, TailoringOrder } from '../context/StoreContext';
import { generateId, resizeAndConvertToBase64 } from '../utils/imageUtils';

type AdminTab = 'products' | 'hero' | 'orders' | 'contact';

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23FAF6EE'/%3E%3Ctext x='100' y='100' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%23BA8B2A'%3E👘%3C/text%3E%3C/svg%3E";

// ==================== PRODUCT FORM ====================
const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  nameAr: '',
  category: 'jellaba',
  gender: 'men',
  price: 0,
  originalPrice: undefined,
  description: '',
  image: '',
  badge: '',
  inStock: true,
};

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Product, 'id'> & { id?: string };
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [preview, setPreview] = useState(initial.image || '');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  /**
   * handleImageUpload
   * Reads the file, resizes it via canvas, converts to Base64,
   * then stores it in form.image for saving to localStorage.
   * (Section 6.1 implementation)
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await resizeAndConvertToBase64(file);
      setPreview(base64);
      update('image', base64);
    } catch {
      alert('فشل رفع الصورة. يرجى المحاولة بصورة أخرى.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr.trim()) return alert('اسم المنتج بالعربية مطلوب');
    if (!form.price) return alert('السعر مطلوب');
    onSave({
      ...form,
      id: initial.id || generateId('p'),
      image: form.image || PLACEHOLDER_IMG,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Product Image</label>
        <div
          className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-yellow-600 transition-colors"
          onClick={() => imageInputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
          ) : (
            <div className="py-4 text-gray-400">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm">Click to upload product image</p>
            </div>
          )}
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {preview && (
          <button
            type="button"
            onClick={() => { setPreview(''); update('image', ''); }}
            className="text-xs text-red-500 mt-1"
          >
            Remove image
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Arabic Name *</label>
          <input type="text" value={form.nameAr} onChange={e => update('nameAr', e.target.value)}
            placeholder="اسم المنتج بالعربية" className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">English Name</label>
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
            placeholder="Product name in English" className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Category *</label>
          <select value={form.category} onChange={e => update('category', e.target.value as Product['category'])}
            className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="jellaba">Jellaba (جلابة)</option>
            <option value="kaftan">Kaftan (قفطان)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Gender *</label>
          <select value={form.gender} onChange={e => update('gender', e.target.value as Product['gender'])}
            className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="men">Men (رجالي)</option>
            <option value="women">Women (نسائي)</option>
            <option value="children">Children (أطفال)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Price (MAD) *</label>
          <input type="number" value={form.price} onChange={e => update('price', Number(e.target.value))}
            min="0" className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Original Price (MAD)</label>
          <input type="number" value={form.originalPrice || ''} onChange={e => update('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
            min="0" placeholder="Optional" className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Badge</label>
          <input type="text" value={form.badge || ''} onChange={e => update('badge', e.target.value)}
            placeholder="e.g. الأكثر مبيعاً" className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => update('inStock', e.target.checked)}
            className="w-4 h-4" />
          <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Description (Arabic)</label>
        <textarea value={form.description} onChange={e => update('description', e.target.value)}
          rows={3} placeholder="وصف المنتج بالعربية" className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel}
          className="px-6 py-2 rounded-lg border text-sm font-medium text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit"
          className="px-6 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#6E1E22' }}>
          Save Product
        </button>
      </div>
    </form>
  );
}

// ==================== MAIN DASHBOARD ====================

export default function AdminDashboard() {
  const {
    products, addProduct, updateProduct, deleteProduct,
    heroSlides, setHeroSlides,
    tailoringOrders, updateOrderStatus, deleteOrder,
    contactInfo, setContactInfo,
    setIsAdminLoggedIn,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [contactForm, setContactForm] = useState(contactInfo);
  const [contactSaved, setContactSaved] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  // ===== Hero Slides Management =====
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await resizeAndConvertToBase64(file, 1200, 0.75);
      const newSlide: HeroSlide = {
        id: generateId('slide'),
        image: base64,
        title: 'عنوان الشريحة الجديدة',
        subtitle: 'وصف مختصر للشريحة',
        ctaText: 'اكتشف الآن',
      };
      setHeroSlides([...heroSlides, newSlide]);
    } catch {
      alert('Failed to upload image');
    }
    if (heroImageInputRef.current) heroImageInputRef.current.value = '';
  };

  const updateSlide = (id: string, key: keyof HeroSlide, value: string) => {
    setHeroSlides(heroSlides.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const deleteSlide = (id: string) => {
    if (heroSlides.length <= 1) return alert('Cannot delete the last slide');
    if (confirm('Delete this slide?')) setHeroSlides(heroSlides.filter(s => s.id !== id));
  };

  // ===== Contact Info =====
  const saveContactInfo = () => {
    setContactInfo(contactForm);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  };

  // ===== Order status labels =====
  const STATUS_LABELS: Record<TailoringOrder['status'], string> = {
    new: 'جديد',
    processing: 'قيد المعالجة',
    completed: 'مكتمل',
  };
  const STATUS_COLORS: Record<TailoringOrder['status'], string> = {
    new: '#6E1E22',
    processing: '#BA8B2A',
    completed: '#2F4D3E',
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'products', label: 'Products', icon: '👘' },
    { id: 'hero', label: 'Hero & Banners', icon: '🖼️' },
    { id: 'orders', label: 'Tailoring Orders', icon: '📋' },
    { id: 'contact', label: 'Contact & Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F4F6' }}>
      {/* Admin Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #BA8B2A, #6E1E22)' }}
            >
              <span className="text-white text-sm font-bold">خ</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Khayat Al-Akhwayn</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-0 border-t overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
              style={{
                borderBottomColor: activeTab === tab.id ? '#BA8B2A' : 'transparent',
                color: activeTab === tab.id ? '#BA8B2A' : '#6B7280',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Products ({products.length})
              </h2>
              <button
                onClick={() => { setAddingProduct(true); setEditingProduct(null); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                style={{ backgroundColor: '#6E1E22' }}
              >
                + Add Product
              </button>
            </div>

            {/* Add Product Form */}
            {addingProduct && (
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Add New Product</h3>
                <ProductForm
                  initial={EMPTY_PRODUCT}
                  onSave={(p) => { addProduct(p); setAddingProduct(false); }}
                  onCancel={() => setAddingProduct(false)}
                />
              </div>
            )}

            {/* Products List */}
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  {editingProduct?.id === product.id ? (
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Edit Product</h3>
                      <ProductForm
                        initial={editingProduct}
                        onSave={(p) => { updateProduct(p); setEditingProduct(null); }}
                        onCancel={() => setEditingProduct(null)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image || PLACEHOLDER_IMG}
                        alt={product.nameAr}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800">{product.nameAr}</h4>
                        <p className="text-sm text-gray-500">{product.category === 'jellaba' ? 'Jellaba' : 'Kaftan'} · {product.gender}</p>
                        <p className="text-sm font-bold" style={{ color: '#6E1E22' }}>{product.price} MAD</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: product.inStock ? 'rgba(47,77,62,0.1)' : 'rgba(110,30,34,0.1)',
                            color: product.inStock ? '#2F4D3E' : '#6E1E22',
                          }}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${product.nameAr}"?`)) deleteProduct(product.id); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== HERO TAB ===== */}
        {activeTab === 'hero' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Hero Slides ({heroSlides.length})
              </h2>
              <button
                onClick={() => heroImageInputRef.current?.click()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#6E1E22' }}
              >
                + Add Slide
              </button>
              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              {heroSlides.map((slide, idx) => (
                <div key={slide.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex gap-4 flex-col sm:flex-row">
                    {/* Slide image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full sm:w-40 h-32 rounded-xl object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </span>
                    </div>
                    {/* Slide fields */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title (Arabic)</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={e => updateSlide(slide.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle (Arabic)</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={e => updateSlide(slide.id, 'subtitle', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={slide.ctaText}
                          onChange={e => updateSlide(slide.id, 'ctaText', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    {/* Delete button */}
                    <div className="flex items-start">
                      <button
                        onClick={() => deleteSlide(slide.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Tailoring Orders ({tailoringOrders.length})
              </h2>
            </div>

            {tailoringOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500">No tailoring orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tailoringOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className="font-bold text-gray-800">{order.fullName}</h3>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}
                          >
                            {STATUS_LABELS[order.status]}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs">نوع القطعة</span>
                            <p className="font-medium text-gray-800">{order.itemType} ({order.gender})</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">الهاتف</span>
                            <p className="font-medium text-gray-800" dir="ltr">{order.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">المناسبة</span>
                            <p className="font-medium text-gray-800">{order.occasion}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">القماش</span>
                            <p className="font-medium text-gray-800">{order.fabric}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">الألوان</span>
                            <p className="font-medium text-gray-800">{order.colors || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">الميزانية</span>
                            <p className="font-medium text-gray-800">{order.budget}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">تاريخ التسليم</span>
                            <p className="font-medium text-gray-800">
                              {order.deliveryDate
                                ? new Date(order.deliveryDate).toLocaleDateString('ar-MA')
                                : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">المقاس</span>
                            <p className="font-medium text-gray-800">
                              {order.usePredefinedSize
                                ? order.predefinedSize
                                : `ط:${order.measurements?.height || '—'} ص:${order.measurements?.chest || '—'}`
                              }
                            </p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="mt-3 p-3 rounded-lg bg-gray-50 text-sm text-gray-700">
                            <span className="font-medium">ملاحظات: </span>{order.notes}
                          </div>
                        )}
                        {order.referenceImageBase64 && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-500">Reference Image:</span>
                            <img
                              src={order.referenceImageBase64}
                              alt="reference"
                              className="mt-1 w-24 h-24 rounded-lg object-cover border"
                            />
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as TailoringOrder['status'])}
                          className="px-3 py-2 border rounded-lg text-xs font-medium"
                          style={{ borderColor: STATUS_COLORS[order.status], color: STATUS_COLORS[order.status] }}
                        >
                          <option value="new">New</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                        </select>
                        <a
                          href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${order.fullName}، بخصوص طلب ${order.itemType} الخاص بك...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-lg text-xs font-medium text-center text-white"
                          style={{ backgroundColor: '#25D366' }}
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => { if (confirm('Delete this order?')) deleteOrder(order.id); }}
                          className="px-3 py-2 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CONTACT TAB ===== */}
        {activeTab === 'contact' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Contact & Settings</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div
                className="mb-4 p-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
              >
                ⚠️ IMPORTANT: The WhatsApp number below is used for all cart checkout orders. Format: 212XXXXXXXXX (no + or spaces)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number (for cart orders) *
                  </label>
                  <input
                    type="text"
                    value={contactForm.whatsappNumber}
                    onChange={e => setContactForm(prev => ({ ...prev, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="212612345678"
                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-400 mt-1">Example: 212612345678 (Country code + number, digits only)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Phone</label>
                  <input type="text" value={contactForm.phone}
                    onChange={e => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+212 6 XX XX XX XX" className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={contactForm.email}
                    onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address (Arabic)</label>
                  <input type="text" value={contactForm.address}
                    onChange={e => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City (Arabic)</label>
                  <input type="text" value={contactForm.city}
                    onChange={e => setContactForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle</label>
                  <input type="text" value={contactForm.instagram}
                    onChange={e => setContactForm(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Handle</label>
                  <input type="text" value={contactForm.facebook}
                    onChange={e => setContactForm(prev => ({ ...prev, facebook: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                  <input type="url" value={contactForm.mapUrl}
                    onChange={e => setContactForm(prev => ({ ...prev, mapUrl: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm" dir="ltr" />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={saveContactInfo}
                  className="px-6 py-2.5 rounded-xl font-medium text-sm text-white transition-all"
                  style={{ backgroundColor: '#6E1E22' }}
                >
                  Save Settings
                </button>
                {contactSaved && (
                  <span className="text-sm font-medium text-green-600">✅ Saved successfully!</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
