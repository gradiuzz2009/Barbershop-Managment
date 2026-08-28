import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Scissors, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  UserPlus, 
  ArrowRight, 
  Sparkles,
  CreditCard,
  PhoneCall,
  MoveRight
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { ChairStation, QueueTicket } from '../types';

export const QueueMonitorView: React.FC = () => {
  const { 
    chairs, 
    queues, 
    allocateToChair, 
    completeService, 
    applyAutoSuggestLate,
    setIsCheckInModalOpen, 
    setIsLateModalOpen,
    setActivePaymentItem,
    setIsPaymentModalOpen,
    setActiveView
  } = useBarbershop();

  const [selectedChairForAlloc, setSelectedChairForAlloc] = useState<number>(1);

  // Unassigned waiting room tickets
  const waitingRoomTickets = queues.filter(
    (q) => (q.status === 'Tiba' || q.status === 'Tunggu') && !q.chairNumber
  );

  const activeInProcess = queues.filter((q) => q.status === 'Proses');
  const totalWaiting = queues.filter((q) => q.status === 'Tunggu' || q.status === 'Tiba').length;

  const handleCheckoutChair = (chair: ChairStation) => {
    setActivePaymentItem({
      chair,
      amount: chair.currentService?.includes('Full') ? 115000 : (chair.currentService?.includes('Coloring') ? 180000 : 75000),
      name: chair.currentCustomer || 'Pelanggan',
      service: chair.currentService || "Gentleman's Cut",
      barber: chair.barberName
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <div id="queue-monitor-view" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header & Stats Banner */}
      <div className="bg-white border border-[#E5E1D8] p-5 rounded-lg shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
              Monitor Antrean Langsung
            </h2>
            <span className="bg-[#2D5A27]/10 text-[#2D5A27] font-bold text-[10px] px-2 py-0.5 rounded uppercase">
              Realtime Sync
            </span>
          </div>
          <p className="text-xs text-[#2D2D2D]/70 mt-1">
            Status operasional stasiun kerja barber dan antrean ruang tunggu umum secara langsung.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-kiosk-mode-trigger"
            onClick={() => setActiveView('kios')}
            className="bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-[#C5A059]" />
            <span>Mode Kios Tamu</span>
          </button>
          <button
            id="btn-queue-checkin"
            onClick={() => setIsCheckInModalOpen(true)}
            className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-[#FDFBF7] px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-xs pressed-effect"
          >
            <UserPlus className="w-4 h-4 text-[#C5A059]" />
            <span>+ Antrean Baru</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E1D8] p-3.5 rounded-lg flex items-center gap-3">
          <div className="p-2.5 bg-[#1B3022]/10 text-[#1B3022] rounded-md">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#2D2D2D]/60 uppercase font-semibold">Stasiun Sedang Beroperasi</p>
            <p className="text-lg font-bold text-[#1B3022]">{activeInProcess.length} / {chairs.length} Kursi Terisi</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-3.5 rounded-lg flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-900 rounded-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#2D2D2D]/60 uppercase font-semibold">Total Antrean Menunggu</p>
            <p className="text-lg font-bold text-[#1B3022]">{totalWaiting} Orang di Ruang Tunggu</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-3.5 rounded-lg flex items-center gap-3">
          <div className="p-2.5 bg-[#2D5A27]/10 text-[#2D5A27] rounded-md">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#2D2D2D]/60 uppercase font-semibold">Estimasi Waktu Tunggu</p>
            <p className="text-lg font-bold text-[#2D5A27]">15 - 35 Menit</p>
          </div>
        </div>
      </div>

      {/* Main Chair Stations Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1B3022] font-serif-display">
            Stasiun Kerja Kursi Barbershop
          </h3>
          <span className="text-xs text-[#2D2D2D]/60 font-medium">
            5 Stasiun Terpasang
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chairs.map((chair) => {
            const isOvertime = chair.isOvertime || (chair.elapsedMinutes && chair.serviceDurationMinutes && chair.elapsedMinutes > chair.serviceDurationMinutes);
            const nextInChair = queues.filter((q) => q.chairNumber === chair.chairNumber && q.status === 'Tunggu');

            return (
              <div 
                key={chair.chairNumber}
                id={`chair-station-${chair.chairNumber}`}
                className={`bg-white border-2 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isOvertime 
                    ? 'border-amber-500 ring-2 ring-amber-400/20' 
                    : chair.status === 'Proses'
                    ? 'border-[#1B3022]'
                    : 'border-[#E5E1D8]'
                }`}
              >
                {/* Chair Header */}
                <div>
                  <div className="flex justify-between items-start pb-3 border-b border-[#E5E1D8]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1B3022] text-[#C5A059] flex items-center justify-center font-black text-base shadow-xs">
                        K{chair.chairNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1B3022] leading-tight">{chair.barberName}</h4>
                        <p className="text-xs text-[#2D2D2D]/60">{chair.barberRole}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isOvertime 
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : chair.status === 'Proses'
                        ? 'bg-[#2D5A27]/10 text-[#2D5A27]'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {isOvertime ? `Overtime +${chair.overtimeMinutes || 10}m` : chair.status}
                    </span>
                  </div>

                  {/* Active Customer Area */}
                  {chair.status === 'Proses' && chair.currentCustomer ? (
                    <div className="mt-4 bg-[#FDFBF7] border border-[#E5E1D8] rounded-lg p-3.5 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-[#C5A059] uppercase block">
                            Sedang Dilayani
                          </span>
                          <h5 className="font-bold text-sm text-[#1B3022]">
                            {chair.currentTicketNumber} • {chair.currentCustomer}
                          </h5>
                          <p className="text-xs text-[#2D2D2D]/70">{chair.currentService}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#1B3022] bg-[#E5E1D8] px-2 py-0.5 rounded">
                          {chair.serviceDurationMinutes || 45} mnt
                        </span>
                      </div>

                      {/* Timer & Progress */}
                      <div>
                        <div className="flex justify-between text-[10px] text-[#2D2D2D]/60 mb-1">
                          <span>Mulai: {chair.startedAt || '10:15 WIB'}</span>
                          <span className={isOvertime ? 'text-rose-700 font-bold' : ''}>
                            {isOvertime ? `Melewati ${chair.overtimeMinutes || 10} mnt` : 'Berjalan lancar'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isOvertime ? 'bg-amber-600' : 'bg-[#2D5A27]'}`}
                            style={{ width: `${Math.min(100, ((chair.elapsedMinutes || 35) / (chair.serviceDurationMinutes || 45)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Auto-suggest late prompt if overtime */}
                      {isOvertime && (
                        <div className="bg-amber-50 border border-amber-300 rounded p-2.5 text-xs text-amber-900 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="text-[11px]">Saran penyesuaian jadwal antrean (+10m).</span>
                          </div>
                          <button
                            onClick={() => applyAutoSuggestLate(chair.chairNumber, 10)}
                            className="bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"
                          >
                            Terapkan
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 py-8 border-2 border-dashed border-[#E5E1D8] rounded-lg text-center flex flex-col items-center justify-center gap-1 bg-[#FDFBF7]">
                      <Scissors className="w-6 h-6 text-gray-400" />
                      <p className="text-xs font-semibold text-gray-600">Kursi Tersedia</p>
                      <p className="text-[11px] text-gray-400">Siap menerima antrean berikutnya</p>
                    </div>
                  )}

                  {/* Next in Line for This Chair */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-2">
                      Antrean Berikutnya ({nextInChair.length})
                    </p>
                    {nextInChair.length > 0 ? (
                      <div className="space-y-1.5">
                        {nextInChair.map((t) => (
                          <div key={t.id} className="flex justify-between items-center bg-gray-50 border border-[#E5E1D8] p-2 rounded text-xs">
                            <span className="font-semibold text-[#1B3022]">{t.ticketNumber} • {t.customerName}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{t.estimatedTime}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">Belum ada antrean berurutan di kursi ini.</p>
                    )}
                  </div>
                </div>

                {/* Chair Actions */}
                <div className="mt-5 pt-3 border-t border-[#E5E1D8] flex gap-2">
                  {chair.status === 'Proses' && chair.currentCustomer ? (
                    <button
                      id={`btn-complete-chair-${chair.chairNumber}`}
                      onClick={() => handleCheckoutChair(chair)}
                      className="w-full bg-[#1B3022] hover:bg-[#2D5A27] text-white py-2 rounded text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Selesai & Kasir</span>
                    </button>
                  ) : (
                    <button
                      id={`btn-fill-chair-${chair.chairNumber}`}
                      onClick={() => {
                        const firstWaiting = waitingRoomTickets[0];
                        if (firstWaiting) {
                          allocateToChair(firstWaiting.id, chair.chairNumber);
                        } else {
                          setIsCheckInModalOpen(true);
                        }
                      }}
                      className="w-full bg-[#F7F4EF] hover:bg-[#1B3022] hover:text-white text-[#1B3022] border border-[#E5E1D8] py-2 rounded text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{waitingRoomTickets.length > 0 ? 'Panggil Antrean Masuk' : '+ Isi Kursi'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ruang Tunggu Umum (Unassigned Queue Items) */}
      <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#E5E1D8]">
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#1B3022] font-serif-display">
              Ruang Tunggu Umum ({waitingRoomTickets.length} Pelanggan Menanti)
            </h3>
            <p className="text-xs text-[#2D2D2D]/60">
              Pelanggan walk-in atau check-in yang belum dialokasikan ke kursi spesifik
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#2D2D2D]/70">Pilih Kursi Target:</span>
            <select
              value={selectedChairForAlloc}
              onChange={(e) => setSelectedChairForAlloc(Number(e.target.value))}
              className="bg-[#F7F4EF] border border-[#E5E1D8] text-xs font-bold rounded px-2.5 py-1 text-[#1B3022]"
            >
              {chairs.map((c) => (
                <option key={c.chairNumber} value={c.chairNumber}>
                  Kursi {c.chairNumber} ({c.barberName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {waitingRoomTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {waitingRoomTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-lg p-3.5 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-black text-base text-[#1B3022] bg-[#E5E1D8] px-2 py-0.5 rounded">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase bg-[#1B3022] px-2 py-0.5 rounded">
                      {ticket.customerType}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-[#2D2D2D]">{ticket.customerName}</h5>
                  <p className="text-[11px] text-[#2D2D2D]/70">{ticket.serviceName}</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Tunggu ~{ticket.waitingTimeMinutes || 10} mnt • {ticket.estimatedTime}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E5E1D8]">
                  <button
                    id={`btn-allocate-${ticket.id}`}
                    onClick={() => allocateToChair(ticket.id, selectedChairForAlloc)}
                    className="w-full bg-[#1B3022] hover:bg-[#2D5A27] text-white py-1.5 rounded text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Alokasikan K{selectedChairForAlloc}</span>
                    <MoveRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-gray-400 font-medium">
            Tidak ada antrean tertahan di ruang tunggu umum. Semua pelanggan teralokasi dengan rapi.
          </div>
        )}
      </div>
    </div>
  );
};
