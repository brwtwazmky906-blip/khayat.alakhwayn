/**
 * TailoringForm.tsx
 * 
 * Custom tailoring request form.
 * 
 * KEY TECHNICAL DETAILS (Section 6.3):
 * 
 * 1. tailoringFieldsConfig: A static config object that maps each item type
 *    ('جلابة' | 'قفطان') to its specific measurement fields.
 *    Fields are derived from this config using .map() — never from dynamic strings.
 * 
 * 2. The measurements section uses key={formData.itemType + formData.gender}
 *    to force React to remount the fields cleanly when the type changes,
 *    preventing any stale text or state issues.
 * 
 * 3. All form fields are fully controlled (value + onChange) with explicit
 *    initial values set in the useState() call.
 */

import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { generateId, resizeAndConvertToBase64 } from '../utils/imageUtils';
import type { TailoringOrder } from '../context/StoreContext';

// ==================== FIELDS CONFIG ====================
/**
 * tailoringFieldsConfig
 * Maps each item type to its measurement fields.
 * Used with .map() to render inputs — labels come from here, not from state.
 */
const tailoringFieldsConfig = {
  'جلابة': {
    measurements: [
      { key: 'height', label: 'الطول الكامل (سم)', placeholder: 'مثال: 170' },
      { key: 'chest', label: 'محيط الصدر (سم)', placeholder: 'مثال: 100' },
      { key: 'waist', label: 'محيط الخصر (سم)', placeholder: 'مثال: 90' },
      { key: 'hips', label: 'محيط الأرداف (سم)', placeholder: 'مثال: 100' },
      { key: 'sleeveLength', label: 'طول الكم (سم)', placeholder: 'مثال: 60' },
    ],
    fabricOptions: ['صوف', 'قطن', 'كتان', 'تيسو مغربي', 'أخرى'],
    occasions: ['يومي', 'عمل', 'عيد', 'حفل خاص', 'زيارة', 'أخرى'],
  },
  'قفطان': {
    measurements: [
      { key: 'height', label: 'الطول الكامل (سم)', placeholder: 'مثال: 165' },
      { key: 'chest', label: 'محيط الصدر (سم)', placeholder: 'مثال: 95' },
      { key: 'waist', label: 'محيط الخصر (سم)', placeholder: 'مثال: 80' },
      { key: 'hips', label: 'محيط الأرداف (سم)', placeholder: 'مثال: 100' },
      { key: 'sleeveLength', label: 'طول الكم (سم)', placeholder: 'مثال: 55' },
    ],
    fabricOptions: ['حرير طبيعي', 'قطيفة', 'تيسو مغربي', 'شيفون', 'ديباج', 'أخرى'],
    occasions: ['عرس', 'خطبة', 'عيد', 'حفل راقٍ', 'سهرة', 'أخرى'],
  },
} as const;

type ItemType = 'جلابة' | 'قفطان';

// Color swatches for color selection
const COLOR_SWATCHES = [
  { color: '#FFFFFF', name: 'أبيض' },
  { color: '#F5F0E8', name: 'كريمي' },
  { color: '#1C2B45', name: 'كحلي' },
  { color: '#2F4D3E', name: 'أخضر زمردي' },
  { color: '#6E1E22', name: 'عنابي' },
  { color: '#BA8B2A', name: 'ذهبي' },
  { color: '#8B0000', name: 'أحمر داكن' },
  { color: '#4B0082', name: 'بنفسجي' },
  { color: '#2C4A7C', name: 'أزرق ملكي' },
  { color: '#556B2F', name: 'أخضر زيتوني' },
  { color: '#D2691E', name: 'بني' },
  { color: '#2A211B', name: 'أسود بني' },
];

const BUDGET_RANGES = [
  'أقل من 300 د.م',
  '300 - 500 د.م',
  '500 - 1000 د.م',
  '1000 - 2000 د.م',
  '2000 - 5000 د.م',
  'أكثر من 5000 د.م',
];

interface FormData {
  fullName: string;
  phone: string;
  contactMethod: 'call' | 'whatsapp';
  itemType: ItemType;
  gender: 'رجالي' | 'نسائي' | 'أطفال';
  occasion: string;
  fabric: string;
  fabricOther: string;
  colors: string;
  selectedColors: string[];
  embroidery: string;
  usePredefinedSize: boolean;
  predefinedSize: string;
  measurements: { height: string; chest: string; waist: string; hips: string; sleeveLength: string };
  budget: string;
  deliveryDate: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  phone: '',
  contactMethod: 'whatsapp',
  itemType: 'جلابة',
  gender: 'رجالي',
  occasion: 'يومي',
  fabric: 'صوف',
  fabricOther: '',
  colors: '',
  selectedColors: [],
  embroidery: '',
  usePredefinedSize: false,
  predefinedSize: 'M',
  measurements: { height: '', chest: '', waist: '', hips: '', sleeveLength: '' },
  budget: '300 - 500 د.م',
  deliveryDate: '',
  notes: '',
};

export default function TailoringForm() {
  const { addTailoringOrder } = useStore();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [referenceImageBase64, setReferenceImageBase64] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Generic field updater
  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  // Handle item type change — also reset occasion and fabric to match new config
  const handleTypeChange = (type: ItemType) => {
    const config = tailoringFieldsConfig[type];
    setFormData(prev => ({
      ...prev,
      itemType: type,
      occasion: config.occasions[0],
      fabric: config.fabricOptions[0],
      fabricOther: '',
      measurements: { height: '', chest: '', waist: '', hips: '', sleeveLength: '' },
    }));
  };

  // Color swatch toggle
  const toggleColor = (colorName: string) => {
    setFormData(prev => {
      const selected = prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter(c => c !== colorName)
        : [...prev.selectedColors, colorName];
      return { ...prev, selectedColors: selected, colors: selected.join('، ') };
    });
  };

  // Reference image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await resizeAndConvertToBase64(file, 600, 0.7);
      setReferenceImageBase64(base64);
    } catch {
      console.error('Failed to process reference image');
    }
  };

  // Validate required fields
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.deliveryDate) newErrors.deliveryDate = 'تاريخ التسليم مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order: TailoringOrder = {
      id: generateId('order'),
      createdAt: new Date().toISOString(),
      status: 'new',
      fullName: formData.fullName,
      phone: formData.phone,
      contactMethod: formData.contactMethod,
      itemType: formData.itemType,
      gender: formData.gender,
      occasion: formData.occasion,
      fabric: formData.fabric === 'أخرى' ? formData.fabricOther : formData.fabric,
      colors: formData.colors || formData.selectedColors.join('، '),
      embroidery: formData.embroidery,
      usePredefinedSize: formData.usePredefinedSize,
      predefinedSize: formData.usePredefinedSize ? formData.predefinedSize : undefined,
      measurements: formData.usePredefinedSize ? {} : formData.measurements,
      budget: formData.budget,
      deliveryDate: formData.deliveryDate,
      referenceImageBase64: referenceImageBase64 || undefined,
      notes: formData.notes,
    };

    addTailoringOrder(order);
    setSubmitted(true);
    setFormData(INITIAL_FORM);
    setReferenceImageBase64('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Current config based on selected item type
  const currentConfig = tailoringFieldsConfig[formData.itemType];

  if (submitted) {
    return (
      <div
        className="text-center py-16 px-4 rounded-2xl animate-fadeIn"
        style={{ backgroundColor: '#FFFFFF', border: '2px solid rgba(186,139,42,0.3)' }}
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: '#2F4D3E' }}>
          تم إرسال طلبك بنجاح!
        </h3>
        <p className="text-base mb-2" style={{ color: '#6B5E52' }}>
          سيتواصل معكم فريق خياط الإخوان قريباً على الرقم المُدرج.
        </p>
        <p className="text-sm mb-8" style={{ color: '#6B5E52' }}>
          نشكر ثقتكم ونتطلع لخدمتكم بأفضل حلة تراثية.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 rounded-full font-bold text-base transition-all hover:scale-105"
          style={{ backgroundColor: '#BA8B2A', color: '#1C2B45' }}
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ===== بيانات الزبون ===== */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <h3
          className="text-lg font-bold mb-5 pb-3"
          style={{ color: '#1C2B45', borderBottom: '2px solid rgba(186,139,42,0.2)' }}
        >
          👤 بيانات الزبون
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e => update('fullName', e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{
                backgroundColor: '#FAF6EE',
                borderColor: errors.fullName ? '#6E1E22' : 'rgba(186,139,42,0.3)',
                color: '#2A211B',
              }}
            />
            {errors.fullName && (
              <p className="text-xs mt-1" style={{ color: '#6E1E22' }}>{errors.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              رقم الهاتف / واتساب *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="+212 6XX XXX XXX"
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{
                backgroundColor: '#FAF6EE',
                borderColor: errors.phone ? '#6E1E22' : 'rgba(186,139,42,0.3)',
                color: '#2A211B',
              }}
              dir="ltr"
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: '#6E1E22' }}>{errors.phone}</p>
            )}
          </div>

          {/* Contact Method */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A211B' }}>
              طريقة التواصل المفضلة
            </label>
            <div className="flex gap-4">
              {[
                { value: 'whatsapp', label: '💬 واتساب' },
                { value: 'call', label: '📞 مكالمة هاتفية' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={opt.value}
                    checked={formData.contactMethod === opt.value}
                    onChange={() => update('contactMethod', opt.value as 'call' | 'whatsapp')}
                    style={{ accentColor: '#BA8B2A' }}
                  />
                  <span className="text-sm font-medium" style={{ color: '#2A211B' }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== تفاصيل القطعة ===== */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <h3
          className="text-lg font-bold mb-5 pb-3"
          style={{ color: '#1C2B45', borderBottom: '2px solid rgba(186,139,42,0.2)' }}
        >
          👗 تفاصيل القطعة
        </h3>

        {/* Item Type - controlled with explicit value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              نوع القطعة *
            </label>
            <select
              value={formData.itemType}
              onChange={e => handleTypeChange(e.target.value as ItemType)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
            >
              <option value="جلابة">جلابة</option>
              <option value="قفطان">قفطان</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A211B' }}>
              الفئة *
            </label>
            <div className="flex gap-3 flex-wrap">
              {(['رجالي', 'نسائي', 'أطفال'] as const).map(g => (
                <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={() => update('gender', g)}
                    style={{ accentColor: '#BA8B2A' }}
                  />
                  <span className="text-sm" style={{ color: '#2A211B' }}>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              المناسبة
            </label>
            <select
              value={formData.occasion}
              onChange={e => update('occasion', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
            >
              {currentConfig.occasions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Fabric */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              القماش المفضل
            </label>
            <select
              value={formData.fabric}
              onChange={e => update('fabric', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
            >
              {currentConfig.fabricOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fabric Other */}
        {formData.fabric === 'أخرى' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              حدد نوع القماش
            </label>
            <input
              type="text"
              value={formData.fabricOther}
              onChange={e => update('fabricOther', e.target.value)}
              placeholder="اكتب نوع القماش المطلوب"
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
            />
          </div>
        )}

        {/* Color swatches */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#2A211B' }}>
            اللون / الألوان المفضلة
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COLOR_SWATCHES.map(swatch => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => toggleColor(swatch.name)}
                title={swatch.name}
                className="w-8 h-8 rounded-full transition-all duration-150 hover:scale-110"
                style={{
                  backgroundColor: swatch.color,
                  border: formData.selectedColors.includes(swatch.name)
                    ? '3px solid #BA8B2A'
                    : '2px solid rgba(0,0,0,0.15)',
                  boxShadow: formData.selectedColors.includes(swatch.name)
                    ? '0 0 0 2px rgba(186,139,42,0.3)'
                    : 'none',
                }}
              />
            ))}
          </div>
          <input
            type="text"
            value={formData.colors}
            onChange={e => update('colors', e.target.value)}
            placeholder="أو اكتب الألوان يدوياً (مثال: أبيض وذهبي)"
            className="w-full px-4 py-2.5 rounded-xl border text-sm"
            style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
          />
        </div>

        {/* Embroidery */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
            زخرفة / تطريز خاص (اختياري)
          </label>
          <input
            type="text"
            value={formData.embroidery}
            onChange={e => update('embroidery', e.target.value)}
            placeholder="مثال: تطريز ذهبي على الصدر، أو كتابة اسم"
            className="w-full px-4 py-2.5 rounded-xl border text-sm"
            style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
          />
        </div>
      </div>

      {/* ===== المقاسات ===== */}
      {/* 
        key={formData.itemType + formData.gender} forces React to fully remount
        this section when type/gender changes, ensuring clean state and labels.
        (Section 6.3 fix)
      */}
      <div
        key={formData.itemType + formData.gender}
        className="rounded-2xl p-6 animate-fadeIn"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <h3
          className="text-lg font-bold mb-5 pb-3"
          style={{ color: '#1C2B45', borderBottom: '2px solid rgba(186,139,42,0.2)' }}
        >
          📏 المقاسات — {formData.itemType} ({formData.gender})
        </h3>

        {/* Use predefined size toggle */}
        <div className="mb-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{ backgroundColor: formData.usePredefinedSize ? '#BA8B2A' : '#D1C4B0' }}
              onClick={() => update('usePredefinedSize', !formData.usePredefinedSize)}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                style={{ transform: formData.usePredefinedSize ? 'translateX(-30px)' : 'translateX(-4px)' }}
              />
            </div>
            <span className="text-sm font-medium" style={{ color: '#2A211B' }}>
              لا أعرف مقاساتي بدقة — استخدم مقاساً جاهزاً تقريبياً
            </span>
          </label>
        </div>

        {formData.usePredefinedSize ? (
          /* Predefined size selector */
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2A211B' }}>
              المقاس الجاهز
            </label>
            <div className="flex flex-wrap gap-3">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => update('predefinedSize', size)}
                  className="w-14 h-14 rounded-xl font-bold text-sm transition-all duration-150 hover:scale-105"
                  style={{
                    backgroundColor: formData.predefinedSize === size ? '#6E1E22' : '#FAF6EE',
                    color: formData.predefinedSize === size ? '#FAF6EE' : '#2A211B',
                    border: `2px solid ${formData.predefinedSize === size ? '#6E1E22' : 'rgba(186,139,42,0.3)'}`,
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Detailed measurements from config — labels from tailoringFieldsConfig */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentConfig.measurements.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
                  {field.label}
                </label>
                <input
                  type="number"
                  value={formData.measurements[field.key as keyof typeof formData.measurements]}
                  onChange={e => update('measurements', {
                    ...formData.measurements,
                    [field.key]: e.target.value,
                  })}
                  placeholder={field.placeholder}
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm"
                  style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== اللوجستيات ===== */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <h3
          className="text-lg font-bold mb-5 pb-3"
          style={{ color: '#1C2B45', borderBottom: '2px solid rgba(186,139,42,0.2)' }}
        >
          📋 اللوجستيات
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              الميزانية التقريبية
            </label>
            <select
              value={formData.budget}
              onChange={e => update('budget', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
            >
              {BUDGET_RANGES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Delivery date */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              تاريخ التسليم المطلوب *
            </label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={e => update('deliveryDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{
                backgroundColor: '#FAF6EE',
                borderColor: errors.deliveryDate ? '#6E1E22' : 'rgba(186,139,42,0.3)',
                color: '#2A211B',
              }}
              dir="ltr"
            />
            {errors.deliveryDate && (
              <p className="text-xs mt-1" style={{ color: '#6E1E22' }}>{errors.deliveryDate}</p>
            )}
          </div>

          {/* Reference image upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              صورة مرجعية للتصميم (اختياري)
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors"
              style={{ borderColor: 'rgba(186,139,42,0.4)', backgroundColor: '#FAF6EE' }}
              onClick={() => imageInputRef.current?.click()}
            >
              {referenceImageBase64 ? (
                <div className="flex items-center gap-4">
                  <img
                    src={referenceImageBase64}
                    alt="مرجع"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#2F4D3E' }}>✅ تم رفع الصورة</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setReferenceImageBase64(''); }}
                      className="text-xs mt-1"
                      style={{ color: '#6E1E22' }}
                    >
                      حذف الصورة
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-sm font-medium" style={{ color: '#6B5E52' }}>
                    انقر لرفع صورة مرجعية
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B5E52', opacity: 0.7 }}>
                    JPG, PNG — حتى 5 ميجا
                  </p>
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
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: '#2A211B' }}>
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              value={formData.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="أي تفاصيل إضافية تودّ إضافتها..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border text-sm resize-none"
              style={{ backgroundColor: '#FAF6EE', borderColor: 'rgba(186,139,42,0.3)', color: '#2A211B' }}
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-[1.01] hover:shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #6E1E22, #BA8B2A)',
          color: '#FAF6EE',
          boxShadow: '0 4px 20px rgba(110,30,34,0.35)',
        }}
      >
        ✦ إرسال طلب التفصيل ✦
      </button>
    </form>
  );
}
