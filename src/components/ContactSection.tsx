/**
 * ContactSection.tsx
 * Store contact information, map placeholder, and social links.
 */

import { useStore } from '../context/StoreContext';

export default function ContactSection() {
  const { contactInfo } = useStore();

  const contactItems = [
    {
      icon: '📍',
      label: 'العنوان',
      value: `${contactInfo.address}، ${contactInfo.city}`,
    },
    {
      icon: '📞',
      label: 'الهاتف',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
    },
    {
      icon: '💬',
      label: 'واتساب',
      value: contactInfo.phone,
      href: `https://wa.me/${contactInfo.whatsappNumber}`,
    },
    {
      icon: '📧',
      label: 'البريد الإلكتروني',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
  ];

  return (
    <section id="contact-section" className="py-16 px-4" style={{ backgroundColor: '#1C2B45' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium mb-2" style={{ color: '#BA8B2A' }}>
            ✦ نحن هنا لخدمتكم ✦
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#FAF6EE' }}>
            تواصل معنا
          </h2>
          <div className="flex justify-center items-center gap-3">
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, #BA8B2A, transparent)' }} />
            <span style={{ color: '#BA8B2A' }}>✦</span>
            <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, #BA8B2A, transparent)' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'rgba(250, 246, 238, 0.05)', border: '1px solid rgba(186,139,42,0.2)' }}
            >
              <h3 className="text-xl font-bold mb-6" style={{ color: '#BA8B2A' }}>
                معلومات التواصل
              </h3>
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{ color: '#BA8B2A' }}>
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-sm font-medium hover:underline transition-colors"
                          style={{ color: '#FAF6EE' }}
                          dir="ltr"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium" style={{ color: '#FAF6EE' }}>
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'rgba(250, 246, 238, 0.05)', border: '1px solid rgba(186,139,42,0.2)' }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#BA8B2A' }}>
                تابعونا على السوشيال ميديا
              </h3>
              <div className="flex gap-4">
                <a
                  href={`https://instagram.com/${contactInfo.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'rgba(186,139,42,0.15)', color: '#BA8B2A', border: '1px solid rgba(186,139,42,0.3)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  انستغرام
                </a>
                <a
                  href={`https://facebook.com/${contactInfo.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: 'rgba(186,139,42,0.15)', color: '#BA8B2A', border: '1px solid rgba(186,139,42,0.3)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  فيسبوك
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن منتجاتكم.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              تواصل معنا على واتساب
            </a>
          </div>

          {/* Map placeholder */}
          <div className="space-y-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ height: '320px', border: '1px solid rgba(186,139,42,0.2)' }}
            >
              <a
                href={contactInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative"
                style={{ backgroundColor: 'rgba(47, 77, 62, 0.3)' }}
              >
                {/* Map background pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(186,139,42,0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(186,139,42,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                    backgroundColor: '#1a3a2a',
                  }}
                />
                {/* Roads */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
                  <line x1="0" y1="160" x2="400" y2="160" stroke="rgba(186,139,42,0.3)" strokeWidth="8" />
                  <line x1="200" y1="0" x2="200" y2="320" stroke="rgba(186,139,42,0.3)" strokeWidth="6" />
                  <line x1="0" y1="80" x2="400" y2="220" stroke="rgba(186,139,42,0.15)" strokeWidth="4" />
                </svg>
                {/* Pin */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl mb-3"
                    style={{ backgroundColor: '#6E1E22', border: '4px solid #BA8B2A' }}
                  >
                    📍
                  </div>
                  <div
                    className="px-4 py-2 rounded-xl text-center"
                    style={{ backgroundColor: 'rgba(28,43,69,0.9)' }}
                  >
                    <p className="font-bold text-sm" style={{ color: '#FAF6EE' }}>
                      خياط الإخوان
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#BA8B2A' }}>
                      حي مغوغة الكبرى، طنجة
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#FAF6EE', opacity: 0.7 }}>
                      انقر لفتح الخريطة →
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* Opening hours */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'rgba(250, 246, 238, 0.05)', border: '1px solid rgba(186,139,42,0.2)' }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#BA8B2A' }}>
                🕐 أوقات العمل
              </h3>
              <div className="space-y-2">
                {[
                  { day: 'الإثنين – الجمعة', time: '9:00 ص – 8:00 م' },
                  { day: 'السبت', time: '9:00 ص – 6:00 م' },
                  { day: 'الأحد', time: 'مغلق' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#FAF6EE', opacity: 0.85 }}>{item.day}</span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: item.time === 'مغلق' ? '#6E1E22' : '#BA8B2A' }}
                      dir="ltr"
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
