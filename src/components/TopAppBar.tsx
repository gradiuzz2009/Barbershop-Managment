import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  UserPlus, 
  Bell, 
  User as UserIcon, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Package
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

interface TopAppBarProps {
  onOpenMobileMenu?: () => void;
  title?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onOpenMobileMenu, title }) => {
  const { 
    settings, 
    toggleShopStatus, 
    setIsCheckInModalOpen, 
    setIsGoogleFormsModalOpen, 
    setIsAuthModalOpen,
    setActiveView,
    activeView,
    user,
    queues,
    chairs,
    lowStockItems
  } = useBarbershop();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const overtimeChairs = chairs.filter((c) => c.isOvertime || (c.elapsedMinutes && c.serviceDurationMinutes && c.elapsedMinutes > c.serviceDurationMinutes));
  const waitingCount = queues.filter((q) => q.status === 'Tunggu' || q.status === 'Tiba').length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard Utama',
    antrean: 'Monitor Antrean & Stasiun',
    reservasi: 'Jadwal Reservasi',
    inventaris: 'Inventaris & Retail Grooming',
    keuangan: 'Laporan Keuangan & Kasir',
    laporan: 'Statistik & Analitik Toko',
    kios: 'Mode Kiosk Mandiri',
    pengaturan: 'Pengaturan Barbershop'
  };

  const displayTitle = title || viewTitles[activeView] || 'Barbershop Manager';

  return (
    <header 
      id="top-app-bar"
      className="sticky top-0 z-40 border-b border-[#E5E1D8] bg-[#FDFBF7] flex justify-between items-center h-14 md:h-16 px-4 md:px-8 shadow-xs"
    >
      {/* Left: Mobile Menu & Screen Context */}
      <div className="flex items-center gap-3">
        <button 
          id="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Buka Menu"
          className="md:hidden text-[#1B3022] p-1.5 rounded hover:bg-[#F0EDED] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1B3022] text-base md:text-lg tracking-tight font-serif-display">
            {displayTitle}
          </span>
          <span className="hidden sm:inline-block text-[#2D2D2D]/30 text-xs">•</span>
          <span className="hidden sm:inline-block text-[#2D2D2D]/60 text-xs font-medium">Cabang Pusat</span>
        </div>
      </div>

      {/* Center: Live Store Status */}
      <div className="hidden md:flex items-center gap-4">
        <button 
          id="shop-status-toggle"
          onClick={toggleShopStatus}
          title="Klik untuk mengubah status operasional toko"
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
            settings.isOpen 
              ? 'bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/30 hover:bg-[#2D5A27]/20'
              : 'bg-[#8B0000]/10 text-[#8B0000] border-[#8B0000]/30 hover:bg-[#8B0000]/20'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-[#2D5A27] animate-pulse' : 'bg-[#8B0000]'}`}></span>
          <span>Status: {settings.isOpen ? 'Buka' : 'Tutup'}</span>
        </button>

        {overtimeChairs.length > 0 && (
          <div className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{overtimeChairs.length} Kursi Overtime</span>
          </div>
        )}
      </div>

      {/* Right: Search, Check-In CTA, Forms & User Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Input */}
        <div className="hidden lg:flex items-center border border-[#2D2D2D]/20 rounded px-2.5 py-1 bg-white focus-within:border-[#1B3022] transition-colors shadow-2xs">
          <Search className="w-4 h-4 text-[#2D2D2D]/50 mr-1.5" />
          <input 
            type="text"
            placeholder="Cari pelanggan, tiket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-hidden text-xs py-0.5 w-36 text-[#2D2D2D] placeholder-[#2D2D2D]/40 font-medium"
          />
        </div>

        {/* Google Forms Survey Quick Action */}
        <button
          id="btn-open-google-forms"
          onClick={() => setIsGoogleFormsModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors"
          title="Buka Integrasi Google Forms untuk survei kepuasan pelanggan"
        >
          <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Google Forms</span>
        </button>

        {/* Primary Check-in CTA Button */}
        <button
          id="btn-checkin-header"
          onClick={() => setIsCheckInModalOpen(true)}
          className="bg-[#1B3022] text-white px-3.5 md:px-4 py-1.5 md:py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#1B3022]/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Check-in Pelanggan</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            aria-label="Notifikasi"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-[#1B3022] hover:bg-[#F0EDED] rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {waitingCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#8B0000] border-2 border-[#FDFBF7] rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E1D8] rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8] mb-2">
                <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">Notifikasi Operasional</span>
                <span className="text-[10px] text-[#2D2D2D]/60">{waitingCount} Antrean</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {lowStockItems.length > 0 && (
                  <div 
                    onClick={() => {
                      setActiveView('inventaris');
                      setShowNotifications(false);
                    }}
                    className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2 cursor-pointer hover:bg-amber-100/70 transition-colors"
                  >
                    <Package className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Alert Stok Menipis ({lowStockItems.length})</p>
                      <p className="text-[11px] text-amber-800">
                        {lowStockItems.slice(0, 2).map((i) => i.name).join(', ')}{lowStockItems.length > 2 ? '...' : ''} menyentuh batas minimum.
                      </p>
                    </div>
                  </div>
                )}
                {overtimeChairs.length > 0 && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Peringatan Keterlambatan</p>
                      <p className="text-[11px] text-rose-700">Kursi 2 melewati estimasi (+10 mnt). Gunakan Auto-Suggest Late.</p>
                    </div>
                  </div>
                )}
                <div className="p-2 bg-[#F7F4EF] rounded text-xs text-[#2D2D2D] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Sinkronisasi Database Aktif</p>
                    <p className="text-[11px] text-[#2D2D2D]/70">Firestore & Google Auth tersambung realtime.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Auth Toggle */}
        <button
          id="user-profile-btn"
          aria-label="Profil Akun"
          onClick={() => setIsAuthModalOpen(true)}
          className="p-1 text-[#1B3022] hover:bg-[#F0EDED] rounded-full transition-colors flex items-center gap-1.5"
          title={user ? `Login sebagai: ${user.displayName || user.email}` : 'Masuk dengan Akun Google'}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User Avatar" className="w-7 h-7 rounded-full border border-[#C5A059] object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#1B3022] text-[#C5A059] flex items-center justify-center text-xs font-bold">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
