import React, { useState } from 'react';
import { 
  UserPlus, 
  CalendarPlus, 
  Megaphone, 
  Clock, 
  TrendingUp, 
  Users, 
  Scissors, 
  Star, 
  ArrowRight,
  Check, 
  ChevronRight,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  Package
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const DashboardView: React.FC = () => {
  const { 
    queues, 
    chairs, 
    reservations, 
    transactions, 
    feedbacks, 
    settings,
    inventory,
    lowStockItems,
    setIsCheckInModalOpen, 
    setIsReservationModalOpen, 
    setIsLateModalOpen,
    setIsGoogleFormsModalOpen,
    setActiveView,
    updateReservationStatus,
    callNextInQueue,
    setActivePaymentItem,
    setIsPaymentModalOpen
  } = useBarbershop();

  const [dateFilter] = useState('11 Oktober 2023');

  // Compute live stats
  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0) + 2450000;
  const activeQueuesCount = queues.filter((q) => q.status === 'Tunggu' || q.status === 'Tiba' || q.status === 'Proses').length;
  const activeBarbersCount = chairs.filter((c) => c.status !== 'Istirahat').length;
  const avgFeedbackRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '4.8';

  const todayReservations = reservations.slice(0, 5);
  const activeChairs = chairs.slice(0, 3);

  const handleCheckoutChair = (chair: any) => {
    setActivePaymentItem({
      chair,
      amount: chair.currentService?.includes('Full') ? 115000 : 75000,
      name: chair.currentCustomer || 'Pelanggan',
      service: chair.currentService || "Gentleman's Cut",
      barber: chair.barberName
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E5E1D8] p-5 rounded-lg shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
              Ringkasan Operasional
            </h2>
            <span className="bg-[#C5A059]/20 text-[#1B3022] font-bold text-[11px] px-2 py-0.5 rounded uppercase">
              Live Realtime
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#2D2D2D]/70 mt-1 font-medium">
            Rabu, {dateFilter} • Sistem antrean cerdas dan manajemen kursi barbershop aktif.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-quick-checkin"
            onClick={() => setIsCheckInModalOpen(true)}
            className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-[#FDFBF7] px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-xs pressed-effect"
          >
            <UserPlus className="w-4 h-4 text-[#C5A059]" />
            <span>Check-in Pelanggan</span>
          </button>
          <button
            id="btn-quick-reservation"
            onClick={() => setIsReservationModalOpen(true)}
            className="bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
          >
            <CalendarPlus className="w-4 h-4 text-[#C5A059]" />
            <span>Reservasi Baru</span>
          </button>
          <button
            id="btn-quick-call-next"
            onClick={callNextInQueue}
            className="bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
            title="Panggil nomor antrean berikutnya ke kursi kosong"
          >
            <Megaphone className="w-4 h-4 text-[#2D5A27]" />
            <span>Panggil Berikutnya</span>
          </button>
          <button
            id="btn-quick-late-mitigation"
            onClick={() => setIsLateModalOpen(true)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
            title="Atasi keterlambatan waktu pelayanan"
          >
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Atasi Keterlambatan</span>
          </button>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue */}
        <div id="metric-card-revenue" className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-wider text-[#2D2D2D]/60 uppercase">Total Pendapatan</span>
            <div className="p-1.5 bg-[#2D5A27]/10 text-[#2D5A27] rounded">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#1B3022] font-serif-display">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold text-[#2D5A27] bg-[#2D5A27]/10 px-1.5 py-0.2 rounded">
                +18.5%
              </span>
              <span className="text-[11px] text-[#2D2D2D]/60">Target: Rp 3.000.000</span>
            </div>
          </div>
          {/* Visual Mini Progress */}
          <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#2D5A27] h-full rounded-full w-[82%]"></div>
          </div>
        </div>

        {/* Metric 2: Live Queue */}
        <div id="metric-card-queues" className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-wider text-[#2D2D2D]/60 uppercase">Total Antrean Hari Ini</span>
            <div className="p-1.5 bg-[#C5A059]/15 text-[#C5A059] rounded">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#1B3022] font-serif-display">
              {queues.length} Pelanggan
            </h3>
            <p className="text-[11px] text-[#2D2D2D]/70 mt-1">
              <span className="font-semibold text-[#2D5A27]">{queues.filter(q => q.status === 'Selesai').length} Selesai</span> •{' '}
              <span className="font-semibold text-blue-700">{queues.filter(q => q.status === 'Proses').length} Proses</span> •{' '}
              <span className="font-semibold text-amber-700">{queues.filter(q => q.status === 'Tunggu' || q.status === 'Tiba').length} Menunggu</span>
            </p>
          </div>
          <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#C5A059] h-full rounded-full w-[65%]"></div>
          </div>
        </div>

        {/* Metric 3: Chair Capacity */}
        <div id="metric-card-chairs" className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-wider text-[#2D2D2D]/60 uppercase">Kapasitas Kursi</span>
            <div className="p-1.5 bg-[#1B3022]/10 text-[#1B3022] rounded">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-[#1B3022] font-serif-display">
              {activeBarbersCount}/5 Barber Aktif
            </h3>
            <p className="text-[11px] text-[#2D2D2D]/70 mt-1">
              80% Utilisasi • 2 Stasiun Terisi Penuh
            </p>
          </div>
          <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#1B3022] h-full rounded-full w-[80%]"></div>
          </div>
        </div>

        {/* Metric 4: Satisfaction Rating via Google Forms */}
        <div id="metric-card-satisfaction" className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-wider text-[#2D2D2D]/60 uppercase">Skor Kepuasan</span>
            <button 
              onClick={() => setIsGoogleFormsModalOpen(true)}
              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded transition-colors"
              title="Kelola Google Forms Feedback"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </button>
          </div>
          <div className="mt-2">
            <div className="flex items-center gap-1.5">
              <h3 className="text-2xl font-black text-[#1B3022] font-serif-display">
                {avgFeedbackRating}
              </h3>
              <span className="text-sm font-semibold text-[#2D2D2D]/50">/ 5.0</span>
            </div>
            <p className="text-[11px] text-[#2D2D2D]/70 mt-1 flex items-center gap-1">
              <span>Berbasis {feedbacks.length + 21} ulasan (Google Forms)</span>
            </p>
          </div>
          <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[96%]"></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left Active Chairs, Right Reservasi & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Reservasi Hari Ini */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E1D8] rounded-lg p-5 shadow-2xs">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E1D8]">
              <div>
                <h3 className="text-lg font-bold text-[#1B3022] font-serif-display">
                  Reservasi Hari Ini ({dateFilter})
                </h3>
                <p className="text-xs text-[#2D2D2D]/60">Daftar pemesanan terjadwal dan status konfirmasi</p>
              </div>
              <button 
                id="btn-see-all-reservations"
                onClick={() => setActiveView('reservasi')}
                className="text-xs font-bold text-[#1B3022] hover:text-[#C5A059] flex items-center gap-1 transition-colors"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E1D8] bg-[#F7F4EF]/70 text-[#2D2D2D]/70 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Pelanggan</th>
                    <th className="py-2.5 px-3">Layanan</th>
                    <th className="py-2.5 px-3">Barber</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8]">
                  {todayReservations.map((res) => {
                    let statusBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                    if (res.status === 'Dikonfirmasi') statusBadgeClass = 'bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/30';
                    if (res.status === 'Proses') statusBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
                    if (res.status === 'Dibatalkan') statusBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300';
                    if (res.status === 'Diminta') statusBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';

                    return (
                      <tr key={res.id} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#1B3022]">
                          {res.time} WIB
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#2D2D2D]">{res.customerName}</div>
                          <div className="text-[10px] text-[#2D2D2D]/50">{res.customerCategory || 'Reguler'}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium">{res.serviceName}</span>
                          <span className="block text-[10px] text-[#2D2D2D]/50">Rp {res.servicePrice.toLocaleString('id-ID')}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-[#2D2D2D]/80">
                          {res.barberName}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {res.status === 'Diminta' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'Dikonfirmasi')}
                              className="bg-[#2D5A27] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-[#2D5A27]/90"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {res.status === 'Dikonfirmasi' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'Proses')}
                              className="bg-[#1B3022] text-[#C5A059] px-2 py-1 rounded text-[10px] font-bold hover:bg-[#1B3022]/90"
                            >
                              Mulai Pelayanan
                            </button>
                          )}
                          {res.status === 'Tunggu' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'Proses')}
                              className="bg-[#1B3022] text-[#C5A059] px-2 py-1 rounded text-[10px] font-bold"
                            >
                              Panggil
                            </button>
                          )}
                          {res.status === 'Proses' && (
                            <span className="text-[11px] font-semibold text-blue-700">Sedang Dicukur</span>
                          )}
                          {res.status === 'Dibatalkan' && (
                            <span className="text-[10px] text-gray-400">Batal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Google Forms Satisfaction Banner */}
          <div className="bg-[#1B3022] text-[#FDFBF7] p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#C5A059]/30">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-[#C5A059]/20 rounded-full text-[#C5A059]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white font-serif-display">
                  Survei Kepuasan Pelanggan (Google Forms)
                </h4>
                <p className="text-xs text-[#E4E2E1]/80 mt-0.5">
                  Kirimkan tautan Google Forms otomatis ke pelanggan setelah selesai potong rambut untuk review & rating instan.
                </p>
              </div>
            </div>
            <button
              id="btn-open-survey-manager"
              onClick={() => setIsGoogleFormsModalOpen(true)}
              className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#1B3022] px-4 py-2 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm active:scale-95"
            >
              Buka Form Survei
            </button>
          </div>
        </div>

        {/* Right Column (1 Col): Live Barber Stations */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E1D8] rounded-lg p-5 shadow-2xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
              <div>
                <h3 className="text-base font-bold text-[#1B3022] font-serif-display">
                  Monitor Stasiun Aktif
                </h3>
                <p className="text-xs text-[#2D2D2D]/60">Status langsung kursi potong</p>
              </div>
              <button 
                onClick={() => setActiveView('antrean')}
                className="text-xs font-bold text-[#1B3022] hover:text-[#C5A059] flex items-center gap-0.5"
              >
                <span>Monitor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Chair Cards */}
            <div className="space-y-3.5 mt-4">
              {activeChairs.map((chair) => {
                const isOvertime = chair.isOvertime || (chair.elapsedMinutes && chair.serviceDurationMinutes && chair.elapsedMinutes > chair.serviceDurationMinutes);
                
                return (
                  <div 
                    key={chair.chairNumber}
                    className={`border rounded-lg p-3.5 transition-all ${
                      isOvertime 
                        ? 'border-amber-400 bg-amber-50/50' 
                        : chair.status === 'Proses' 
                        ? 'border-[#1B3022]/30 bg-[#FDFBF7]'
                        : 'border-[#E5E1D8] bg-gray-50/50 opacity-90'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#1B3022] bg-[#E5E1D8] px-2 py-0.5 rounded">
                          K{chair.chairNumber}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#1B3022] leading-tight">{chair.barberName}</p>
                          <p className="text-[10px] text-[#2D2D2D]/60">{chair.barberRole}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isOvertime 
                          ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse'
                          : chair.status === 'Proses' 
                          ? 'bg-[#2D5A27]/10 text-[#2D5A27]' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {isOvertime ? `Overtime +${chair.overtimeMinutes || 10}m` : chair.status}
                      </span>
                    </div>

                    {chair.status === 'Proses' && chair.currentCustomer ? (
                      <div className="bg-white border border-[#E5E1D8] rounded p-2.5 text-xs space-y-1.5 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#1B3022]">
                            {chair.currentTicketNumber} • {chair.currentCustomer}
                          </span>
                          <span className="text-[10px] text-[#2D2D2D]/60">
                            {chair.startedAt || '15 mnt lalu'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#2D2D2D]/70">{chair.currentService}</p>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className={`h-full ${isOvertime ? 'bg-amber-600' : 'bg-[#1B3022]'}`} 
                            style={{ width: `${Math.min(100, ((chair.elapsedMinutes || 25) / (chair.serviceDurationMinutes || 45)) * 100)}%` }}
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            id={`btn-checkout-k${chair.chairNumber}`}
                            onClick={() => handleCheckoutChair(chair)}
                            className="bg-[#1B3022] hover:bg-[#2D5A27] text-white px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-colors flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3 text-[#C5A059]" />
                            <span>Selesaikan & Kasir</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 text-center text-xs text-gray-400 font-medium">
                        Kursi Kosong • Siap Melayani
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E1D8] text-center">
              <button
                onClick={() => setActiveView('antrean')}
                className="text-xs font-bold text-[#1B3022] hover:underline"
              >
                Lihat Semua 5 Kursi Barbershop →
              </button>
            </div>
          </div>

          {/* Quick Inventory & Grooming Stock Card */}
          <div className="bg-white border border-[#E5E1D8] rounded-lg p-5 shadow-2xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-sm font-bold text-[#1B3022] font-serif-display">
                  Inventaris & Retail
                </h3>
              </div>
              <button
                onClick={() => setActiveView('inventaris')}
                className="text-[11px] font-bold text-[#1B3022] hover:text-[#C5A059] flex items-center gap-0.5"
              >
                <span>Kelola</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Low stock alerts summary */}
            <div className="mt-3 space-y-2.5">
              {lowStockItems.length > 0 ? (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>{lowStockItems.length} Produk Perlu Restock Segera!</span>
                  </div>
                  <div className="space-y-1">
                    {lowStockItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded border border-amber-100">
                        <span className="font-semibold text-amber-950 truncate max-w-[140px]">{item.name}</span>
                        <span className="font-bold text-amber-800 shrink-0">Sisa {item.stockLevel} (Min {item.minStockLevel})</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveView('inventaris')}
                    className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] py-1.5 rounded uppercase tracking-wider transition-colors text-center"
                  >
                    Buka Modul Inventaris
                  </button>
                </div>
              ) : (
                <div className="bg-green-50/60 border border-green-200 p-2.5 rounded text-xs text-[#2D5A27] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2D5A27]"></div>
                  <span className="font-medium text-[11px]">Semua {inventory.length} produk dalam status stok aman.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="bg-[#F7F4EF] p-2 rounded border border-[#E5E1D8]/60">
                  <span className="text-[10px] text-[#2D2D2D]/60 block font-medium">Total Produk</span>
                  <span className="text-sm font-bold text-[#1B3022]">{inventory.length} Varian</span>
                </div>
                <div className="bg-[#F7F4EF] p-2 rounded border border-[#E5E1D8]/60">
                  <span className="text-[10px] text-[#2D2D2D]/60 block font-medium">Stok Fisik</span>
                  <span className="text-sm font-bold text-[#1B3022]">
                    {inventory.reduce((a, b) => a + b.stockLevel, 0)} Unit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
