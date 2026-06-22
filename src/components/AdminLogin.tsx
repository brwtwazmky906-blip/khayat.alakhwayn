/**
 * AdminLogin.tsx
 * Login modal for the admin panel.
 * Password: Radwan@Alakhwayn2026
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ADMIN_PASSWORD = 'Radwan@Alakhwayn2026';

export default function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const { setIsAdminLoggedIn } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      onClose();
      onSuccess?.();
    } else {
      setError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(28, 43, 69, 0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl p-8 animate-fadeIn"
        style={{ backgroundColor: '#FAF6EE', boxShadow: '0 20px 60px rgba(28,43,69,0.4)' }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #BA8B2A, #6E1E22)' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#1C2B45' }}>
            لوحة التحكم
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B5E52' }}>
            أدخل كلمة المرور للمتابعة
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="كلمة المرور"
              className="w-full px-4 py-3 rounded-xl border text-sm pr-12"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: error ? '#6E1E22' : 'rgba(186,139,42,0.3)',
                color: '#2A211B',
              }}
              dir="ltr"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#6E1E22' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-base transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#1C2B45', color: '#FAF6EE' }}
          >
            دخول
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm transition-colors"
            style={{ color: '#6B5E52' }}
          >
            إلغاء
          </button>
        </form>
      </div>
    </div>
  );
}
