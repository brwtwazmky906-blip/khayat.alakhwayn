/**
 * Toast.tsx
 * Simple notification toast for add-to-cart confirmations.
 */

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const bgColors = {
    success: '#2F4D3E',
    error: '#6E1E22',
    info: '#1C2B45',
  };

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl toast-enter"
      style={{ backgroundColor: bgColors[type] }}
    >
      <span className="text-lg">
        {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <p className="text-sm font-medium" style={{ color: '#FAF6EE' }}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: '#FAF6EE' }}
      >
        ×
      </button>
    </div>
  );
}
