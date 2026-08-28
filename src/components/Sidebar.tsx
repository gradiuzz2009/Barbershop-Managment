import React from 'react';
import { 
  LayoutDashboard, 
  ListOrdered, 
  CalendarCheck, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Smartphone,
  Scissors,
  UserCheck,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeView, setActiveView, user, logout, setIsAuthModalOpen, lowStockItems } = useBarbershop();

  const handleNav = (view: any) => {
    setActiveView(view);
    if (setMobileOpen) setMobileOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'antrean', label: 'Antrean', icon: ListOrdered },
    { id: 'reservasi', label: 'Reservasi', icon: CalendarCheck },
    { id: 'inventaris', label: 'Inventaris & Retail', icon: Package, badge: lowStockItems.length > 0 ? lowStockItems.length : undefined },
    { id: 'keuangan', label: 'Keuangan', icon: CreditCard },
    { id: 'laporan', label: 'Laporan', icon: BarChart3 },
    { id: 'kios', label: 'Mode Kios / Tamu', icon: Smartphone },
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <nav 
        id="desktop-sidebar"
        className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r-2 border-[#C5A059]/20 bg-[#1B3022] text-[#C5A059] flex-col py-8 z-50 shadow-2xl select-none"
      >
        {/* Profile / Header */}
        <div className="px-6 mb-8 flex flex-col items-center">
          <div className="relative mb-4 group cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>
            <img 
              alt="Barber Admin Profile" 
              className="w-20 h-20 rounded-full border-2 border-[#C5A059] object-cover shadow-lg group-hover:brightness-110 transition-all"
              src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuBXGIVq_rb1pgrYmcLm6w4sZhkqoJK8Y6_xc9kh_fLIa0Szc6dotmOTpPnBx8ynv4Mm6tAdjvp3-vjx70KJibE0yZ1vBYj9b8HMtejdBoiH_ZpE3chKH42RU0tAiJLC8tfHLiMfqMMWykmeotDJlO5JWHcooYXvl5GSWOhQp7DIgF7bwiDPVWpZxlVDmCTs86QQjAll4IT9-aIhd_LSKENz0D4oa-y2SQL3wqFW69j5jM77BBZr09VGQQ"} 
            />
            <div className="absolute -bottom-1 -right-1 bg-[#2D5A27] w-5 h-5 rounded-full border-2 border-[#1B3022] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75"></span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#FDFBF7] text-center tracking-tight font-serif-display">
            Barbershop Manager
          </h1>
          <p className="text-xs text-[#C5A059]/80 text-center mt-1 font-medium tracking-wide uppercase">
            Cabang Pusat • {user ? (user.displayName || 'Admin') : 'Administrator'}
          </p>
        </div>

        {/* Main Navigation */}
        <ul className="flex flex-col flex-grow space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded text-sm transition-all duration-200 text-left ${
                    isActive
                      ? 'text-[#C5A059] font-bold bg-white/10 border-l-4 border-[#C5A059] shadow-sm'
                      : 'text-[#E4E2E1]/70 hover:text-[#FDFBF7] hover:bg-white/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#C5A059]' : 'text-[#E4E2E1]/60'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs animate-pulse flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer Navigation */}
        <ul className="flex flex-col mt-auto border-t border-[#C5A059]/20 pt-4 px-3 space-y-1">
          <li>
            <button
              id="nav-btn-pengaturan"
              onClick={() => handleNav('pengaturan')}
              className={`w-full flex items-center gap-3 py-2.5 px-4 rounded text-sm transition-colors ${
                activeView === 'pengaturan'
                  ? 'text-[#C5A059] font-bold bg-white/10 border-l-4 border-[#C5A059]'
                  : 'text-[#E4E2E1]/70 hover:text-[#FDFBF7] hover:bg-white/5 font-medium'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </button>
          </li>
          <li>
            <button
              id="nav-btn-keluar"
              onClick={() => {
                if (user) {
                  logout();
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="w-full flex items-center gap-3 py-2.5 px-4 rounded text-sm text-[#E4E2E1]/70 hover:text-rose-300 hover:bg-rose-950/30 transition-colors font-medium text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>{user ? 'Keluar' : 'Masuk Google'}</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#1B3022] text-[#C5A059] h-full flex flex-col py-6 px-4 z-10 border-r-2 border-[#C5A059]/30">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#C5A059]/20">
              <img 
                alt="Profile" 
                className="w-12 h-12 rounded-full border border-[#C5A059] object-cover"
                src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuBXGIVq_rb1pgrYmcLm6w4sZhkqoJK8Y6_xc9kh_fLIa0Szc6dotmOTpPnBx8ynv4Mm6tAdjvp3-vjx70KJibE0yZ1vBYj9b8HMtejdBoiH_ZpE3chKH42RU0tAiJLC8tfHLiMfqMMWykmeotDJlO5JWHcooYXvl5GSWOhQp7DIgF7bwiDPVWpZxlVDmCTs86QQjAll4IT9-aIhd_LSKENz0D4oa-y2SQL3wqFW69j5jM77BBZr09VGQQ"}
              />
              <div>
                <h2 className="text-base font-bold text-white leading-tight">Barbershop Manager</h2>
                <p className="text-xs text-[#C5A059]/80">Cabang Pusat</p>
              </div>
            </div>

            <ul className="flex flex-col gap-1.5 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded text-sm text-left ${
                        isActive
                          ? 'text-[#C5A059] font-bold bg-white/10 border-l-4 border-[#C5A059]'
                          : 'text-[#E4E2E1]/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-[#C5A059]/20 flex flex-col gap-2">
              <button
                onClick={() => handleNav('pengaturan')}
                className="flex items-center gap-3 py-2 px-3 text-sm text-[#E4E2E1]/70 hover:text-white"
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan</span>
              </button>
              <button
                onClick={() => {
                  if (user) logout();
                  else setIsAuthModalOpen(true);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className="flex items-center gap-3 py-2 px-3 text-sm text-[#E4E2E1]/70 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>{user ? 'Keluar' : 'Masuk Google'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
