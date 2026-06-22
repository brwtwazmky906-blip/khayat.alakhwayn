/**
 * CartDrawer.tsx
 * 
 * Sliding cart drawer showing all cart items with quantity controls.
 * 
 * IMPORTANT: The WhatsApp checkout button computes the URL at click-time
 * (not at render-time) to always use the latest cart state.
 * See handleWhatsAppCheckout() for full implementation details.
 */

import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/imageUtils';

export default function CartDrawer() {
  const {
    cart, cartTotal, cartCount,
    isCartOpen, setIsCartOpen,
    removeFromCart, updateCartQuantity, clearCart,
    contactInfo,
  } = useStore();

  /**
   * handleWhatsAppCheckout
   * 
   * CRITICAL: The WhatsApp URL is computed INSIDE this function at click-time,
   * not stored in state or computed at render-time. This avoids stale closure
   * issues where the URL would contain outdated/empty cart data.
   * 
   * Steps:
   * 1. Guard against empty cart
   * 2. Read whatsappNumber from contactInfo (set by admin in settings)
   * 3. Build a readable Arabic message with all items, quantities, and total
   * 4. Encode with encodeURIComponent to handle Arabic text + newlines
   * 5. Open with window.open(_blank) for cross-device compatibility
   */
  function handleWhatsAppCheckout() {
    // Guard: do not open if cart is empty
    if (cart.length === 0) return;

    // Phone number from admin settings (international format, digits only, e.g. 212612345678)
    const storeWhatsAppNumber = contactInfo.whatsappNumber;

    // Build message text from live cart state at click-time
    const itemsText = cart
      .map(item => `• ${item.nameAr} (الكمية: ${item.quantity}) — ${formatPrice(item.price * item.quantity)}`)
      .join('\n');

    const message =
      `مرحباً، أرغب في طلب التالي من متجر خياط الإخوان:\n\n${itemsText}\n\n📦 الإجمالي: ${formatPrice(cartTotal)}\n\nشكراً 🙏`;

    // Encode the message (handles Arabic, spaces, newlines)
    const url = `https://wa.me/${storeWhatsAppNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp (opens app on mobile, WhatsApp Web on desktop)
    window.open(url, '_blank');
  }

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FAF6EE'/%3E%3Ctext x='50' y='60' font-size='40' text-anchor='middle' fill='%23BA8B2A'%3E👘%3C/text%3E%3C/svg%3E";

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay - positioned BEHIND drawer to avoid blocking cart button */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(28, 43, 69, 0.5)', backdropFilter: 'blur(2px)' }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer - slides from left (RTL) */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col animate-slideInRight"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FAF6EE',
          boxShadow: '-8px 0 32px rgba(28,43,69,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 flex-shrink-0"
          style={{ backgroundColor: '#1C2B45' }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: '#BA8B2A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a1.5 1.5 0 003 0m5 0a1.5 1.5 0 003 0" />
            </svg>
            <h2 className="font-bold text-lg" style={{ color: '#FAF6EE' }}>
              سلة المشتريات
            </h2>
            {cartCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#BA8B2A', color: '#1C2B45' }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#FAF6EE' }}
            aria-label="إغلاق السلة"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-medium text-lg mb-2" style={{ color: '#2A211B' }}>سلتك فارغة</p>
              <p className="text-sm" style={{ color: '#6B5E52' }}>
                أضف منتجات من متجرنا لتبدأ تسوقك
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2 rounded-full font-medium text-sm"
                style={{ backgroundColor: '#BA8B2A', color: '#1C2B45' }}
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {/* Product image */}
                  <img
                    src={item.image || PLACEHOLDER}
                    alt={item.nameAr}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm mb-1 truncate" style={{ color: '#2A211B' }}>
                      {item.nameAr}
                    </h4>
                    <p className="text-sm font-bold mb-2" style={{ color: '#6E1E22' }}>
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                        style={{ backgroundColor: '#FAF6EE', border: '1px solid rgba(186,139,42,0.3)', color: '#2A211B' }}
                      >
                        −
                      </button>
                      <span className="font-bold text-sm w-6 text-center" style={{ color: '#2A211B' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                        style={{ backgroundColor: '#BA8B2A', color: '#1C2B45' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded transition-colors"
                      style={{ color: '#6B5E52' }}
                      aria-label="حذف"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <span className="font-bold text-sm" style={{ color: '#2A211B' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and checkout */}
        {cart.length > 0 && (
          <div
            className="flex-shrink-0 p-5 space-y-3"
            style={{ borderTop: '2px solid rgba(186,139,42,0.2)', backgroundColor: '#FFFFFF' }}
          >
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-base" style={{ color: '#6B5E52' }}>المجموع الإجمالي:</span>
              <span className="text-2xl font-bold" style={{ color: '#6E1E22' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>

            {/* WhatsApp checkout button */}
            {/* 
              IMPORTANT: onClick calls handleWhatsAppCheckout which computes the URL
              fresh at click-time. Do NOT replace this with a static href.
            */}
            <button
              onClick={handleWhatsAppCheckout}
              disabled={cart.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              style={{
                backgroundColor: cart.length === 0 ? '#6B5E52' : '#25D366',
                color: '#FFFFFF',
                boxShadow: cart.length > 0 ? '0 4px 15px rgba(37,211,102,0.3)' : 'none',
              }}
            >
              {/* WhatsApp icon */}
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              إتمام الطلب عبر واتساب
            </button>

            {/* Clear cart link */}
            <button
              onClick={clearCart}
              className="w-full text-center text-sm py-1 transition-colors"
              style={{ color: '#6B5E52' }}
            >
              مسح السلة
            </button>
          </div>
        )}
      </div>
    </>
  );
}
