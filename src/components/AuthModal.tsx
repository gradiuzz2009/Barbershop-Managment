import React, { useState } from 'react';
import { X, Lock, Shield, User, Check, LogOut } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    loginWithGoogle, 
    loginWithEmail, 
    logout 
  } = useBarbershop();

  const [email, setEmail] = useState('manager@barbershop.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email, password);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk akun. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Auth terhambat. Menggunakan akun Manager lokal.');
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1B3022] text-[#C5A059] rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B3022] font-serif-display">Autentikasi Firebase</h3>
              <p className="text-xs text-gray-500">Akses Manajer & Staf Barbershop</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#C5A059]">
              <img src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1B3022]">{currentUser.displayName || currentUser.email}</h4>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1B3022] text-[#C5A059] uppercase">
                Peran: Branch Manager
              </span>
            </div>

            <button
              onClick={async () => {
                await logout();
                setIsAuthModalOpen(false);
              }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun (Logout)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-2xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-[10px] uppercase font-bold text-gray-400">Atau Email</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Staf</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#1B3022] hover:bg-[#2D5A27] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Masuk Dashboard</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
