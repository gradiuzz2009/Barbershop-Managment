import React, { useState } from 'react';
import { 
  Calendar, 
  CalendarPlus, 
  Search, 
  Filter, 
  Download, 
  Check, 
  X, 
  Clock, 
  Scissors, 
  User, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { ReservationStatus } from '../types';

export const ReservationView: React.FC = () => {
  const { 
    reservations, 
    services, 
    barbers, 
    updateReservationStatus, 
    deleteReservation,
    createReservation,
    setIsReservationModalOpen
  } = useBarbershop();

  const [activeTab, setActiveTab] = useState<'Semua' | 'Diminta' | 'Dikonfirmasi' | 'Dibatalkan'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarberFilter, setSelectedBarberFilter] = useState('Semua');
  const [selectedDate, setSelectedDate] = useState('2023-10-11');

  // Inline Quick Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newDate, setNewDate] = useState('2023-10-11');
  const [newTime, setNewTime] = useState('14:30');
  const [newService, setNewService] = useState(services[0]?.name || "Gentleman's Cut");
  const [newBarber, setNewBarber] = useState(barbers[0]?.name || 'Budi Santoso');
  const [newNotes, setNewNotes] = useState('');
  const [wizardSuccess, setWizardSuccess] = useState(false);

  // Filtered reservations
  const filtered = reservations.filter((r) => {
    if (activeTab !== 'Semua' && r.status !== activeTab) return false;
    if (selectedBarberFilter !== 'Semua' && r.barberName !== selectedBarberFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countSemua = reservations.length;
  const countDiminta = reservations.filter((r) => r.status === 'Diminta').length;
  const countDikonfirmasi = reservations.filter((r) => r.status === 'Dikonfirmasi' || r.status === 'Tunggu' || r.status === 'Proses').length;
  const countDibatalkan = reservations.filter((r) => r.status === 'Dibatalkan').length;

  const handleCreateFromWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const matchedService = services.find((s) => s.name === newService);
    await createReservation({
      customerName: newCustName,
      customerPhone: newCustPhone || '+62 812-0000-0000',
      customerCategory: 'Online Booking',
      serviceName: newService,
      servicePrice: matchedService ? matchedService.price : 75000,
      serviceDuration: matchedService ? matchedService.durationMinutes : 45,
      barberName: newBarber,
      date: newDate,
      time: newTime,
      status: 'Dikonfirmasi',
      notes: newNotes
    });

    setWizardSuccess(true);
    setNewCustName('');
    setNewCustPhone('');
    setNewNotes('');
    setTimeout(() => {
      setWizardSuccess(false);
      setWizardStep(1);
    }, 2500);
  };

  const handleDownloadCSV = () => {
    const headers = 'ID,Pelanggan,Telepon,Layanan,Harga,Barber,Tanggal,Waktu,Status\n';
    const rows = reservations.map(r => 
      `"${r.id}","${r.customerName}","${r.customerPhone}","${r.serviceName}",${r.servicePrice},"${r.barberName}","${r.date}","${r.time}","${r.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservasi-barbershop-${selectedDate}.csv`;
    a.click();
  };

  return (
    <div id="reservation-view" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="bg-white border border-[#E5E1D8] p-5 rounded-lg shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
            Manajemen Reservasi
          </h2>
          <p className="text-xs text-[#2D2D2D]/70 mt-1">
            Kelola jadwal booking masuk, ketersediaan kalender slot, dan status konfirmasi pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-download-reservations-csv"
            onClick={handleDownloadCSV}
            className="bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
            title="Ekspor CSV"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Unduh Jadwal</span>
          </button>
          <button
            id="btn-new-reservation-cta"
            onClick={() => setIsReservationModalOpen(true)}
            className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-[#FDFBF7] px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-xs"
          >
            <CalendarPlus className="w-4 h-4 text-[#C5A059]" />
            <span>+ Buat Reservasi</span>
          </button>
        </div>
      </div>

      {/* Interactive Calendar Availability Heatmap & Wizard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Availability Heatmap (1 Col) */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-bold text-sm text-[#1B3022]">Oktober 2023</h3>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 rounded hover:bg-gray-100 text-gray-600"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-500 pb-1">
            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {/* Days placeholder */}
            {[28, 29, 30].map(d => (
              <div key={d} className="p-2 text-gray-300 text-[11px]">{d}</div>
            ))}
            
            {/* Real October days with heatmap color */}
            {[
              { day: 1, status: 'tersedia' },
              { day: 2, status: 'tersedia' },
              { day: 3, status: 'tersedia' },
              { day: 4, status: 'penuh' },
              { day: 5, status: 'tersedia' },
              { day: 6, status: 'hampir' },
              { day: 7, status: 'penuh' },
              { day: 8, status: 'penuh' },
              { day: 9, status: 'tersedia' },
              { day: 10, status: 'hampir' },
              { day: 11, status: 'selected' }, // Today selected
              { day: 12, status: 'tersedia' },
              { day: 13, status: 'hampir' },
              { day: 14, status: 'penuh' },
              { day: 15, status: 'penuh' },
              { day: 16, status: 'tersedia' },
              { day: 17, status: 'tersedia' },
              { day: 18, status: 'hampir' },
              { day: 19, status: 'tersedia' },
              { day: 20, status: 'tersedia' },
              { day: 21, status: 'penuh' },
              { day: 22, status: 'tersedia' },
              { day: 23, status: 'tersedia' },
              { day: 24, status: 'tersedia' },
              { day: 25, status: 'hampir' },
              { day: 26, status: 'tersedia' },
              { day: 27, status: 'tersedia' },
              { day: 28, status: 'penuh' }
            ].map(({ day, status }) => {
              let bg = 'hover:bg-gray-100 text-[#2D2D2D]';
              let badge = 'bg-[#2D5A27]';

              if (status === 'selected') {
                bg = 'bg-[#1B3022] text-[#C5A059] font-bold shadow-xs';
                badge = 'bg-[#C5A059]';
              } else if (status === 'penuh') {
                badge = 'bg-rose-500';
              } else if (status === 'hampir') {
                badge = 'bg-amber-500';
              }

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`2023-10-${String(day).padStart(2, '0')}`)}
                  className={`p-2 rounded flex flex-col items-center justify-center transition-all ${bg}`}
                >
                  <span>{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${badge}`}></span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-[#E5E1D8] flex items-center justify-around text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2D5A27]"></span> Tersedia
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Hampir Penuh
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Penuh
            </span>
          </div>
        </div>

        {/* Step Wizard: Buat Reservasi Cepat (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
            <div>
              <h3 className="text-base font-bold text-[#1B3022] font-serif-display">
                Buat Reservasi Baru
              </h3>
              <p className="text-xs text-[#2D2D2D]/60">Langkah terpadu penjadwalan pelanggan</p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setWizardStep(1)}
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  wizardStep === 1 ? 'bg-[#1B3022] text-[#C5A059]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                1
              </button>
              <span className="text-gray-300">—</span>
              <button 
                onClick={() => setWizardStep(2)}
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  wizardStep === 2 ? 'bg-[#1B3022] text-[#C5A059]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                2
              </button>
              <span className="text-gray-300">—</span>
              <button 
                onClick={() => setWizardStep(3)}
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  wizardStep === 3 ? 'bg-[#1B3022] text-[#C5A059]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                3
              </button>
            </div>
          </div>

          {wizardSuccess ? (
            <div className="py-8 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-emerald-900 text-sm">Reservasi Berhasil Disimpan!</h4>
              <p className="text-xs text-emerald-700">Data telah masuk ke jadwal dan tersinkronisasi di Firestore.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateFromWizard} className="space-y-4">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wider block">
                    Langkah 1: Pilih Tanggal & Waktu Pelayanan
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Tanggal</label>
                      <input 
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Waktu Slot (WIB)</label>
                      <input 
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="bg-[#1B3022] text-[#C5A059] px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                    >
                      Lanjut ke Layanan →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wider block">
                    Langkah 2: Pilih Layanan & Barber
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Pilihan Layanan</label>
                      <select
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} - Rp {s.price.toLocaleString('id-ID')} ({s.durationMinutes}m)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Pilihan Barber</label>
                      <select
                        value={newBarber}
                        onChange={(e) => setNewBarber(e.target.value)}
                        className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                      >
                        {barbers.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="text-xs text-gray-500 hover:text-[#1B3022]"
                    >
                      ← Kembali
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="bg-[#1B3022] text-[#C5A059] px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                    >
                      Lanjut ke Data Kontak →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wider block">
                    Langkah 3: Informasi Kontak Pelanggan
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">Nama Lengkap Pelanggan *</label>
                      <input 
                        type="text"
                        placeholder="Contoh: Bpk. Kurniawan"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">No. WhatsApp / HP</label>
                      <input 
                        type="tel"
                        placeholder="+62 812-xxxx-xxxx"
                        value={newCustPhone}
                        onChange={(e) => setNewCustPhone(e.target.value)}
                        className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Catatan Tambahan (Opsional)</label>
                    <input 
                      type="text"
                      placeholder="Contoh: Minta skin fade tipis rapi"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                    />
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="text-xs text-gray-500 hover:text-[#1B3022]"
                    >
                      ← Kembali
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1B3022] hover:bg-[#2D5A27] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Simpan & Jadwalkan Reservasi
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Reservations Table Section */}
      <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
        {/* Table Filters & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-[#E5E1D8]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setActiveTab('Semua')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'Semua'
                  ? 'bg-[#1B3022] text-[#C5A059] shadow-xs'
                  : 'bg-[#F7F4EF] text-[#2D2D2D]/70 hover:bg-gray-200'
              }`}
            >
              Semua ({countSemua})
            </button>
            <button
              onClick={() => setActiveTab('Diminta')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'Diminta'
                  ? 'bg-purple-900 text-purple-200 shadow-xs'
                  : 'bg-[#F7F4EF] text-[#2D2D2D]/70 hover:bg-gray-200'
              }`}
            >
              Diminta ({countDiminta})
            </button>
            <button
              onClick={() => setActiveTab('Dikonfirmasi')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'Dikonfirmasi'
                  ? 'bg-[#2D5A27] text-white shadow-xs'
                  : 'bg-[#F7F4EF] text-[#2D2D2D]/70 hover:bg-gray-200'
              }`}
            >
              Dikonfirmasi ({countDikonfirmasi})
            </button>
            <button
              onClick={() => setActiveTab('Dibatalkan')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'Dibatalkan'
                  ? 'bg-rose-900 text-rose-200 shadow-xs'
                  : 'bg-[#F7F4EF] text-[#2D2D2D]/70 hover:bg-gray-200'
              }`}
            >
              Dibatalkan ({countDibatalkan})
            </button>
          </div>

          {/* Search & Barber Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Cari nama, hp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] pl-8 pr-3 py-1.5 rounded text-xs font-medium text-[#1B3022]"
              />
            </div>
            <select
              value={selectedBarberFilter}
              onChange={(e) => setSelectedBarberFilter(e.target.value)}
              className="bg-[#F7F4EF] border border-[#E5E1D8] px-2.5 py-1.5 rounded text-xs font-semibold text-[#1B3022]"
            >
              <option value="Semua">Semua Barber</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E1D8] bg-[#F7F4EF]/70 text-[#2D2D2D]/70 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Jadwal</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">Layanan</th>
                <th className="py-3 px-3">Barber</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Catatan</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]">
              {filtered.map((res) => {
                let statusBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                if (res.status === 'Dikonfirmasi') statusBadgeClass = 'bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/30';
                if (res.status === 'Proses') statusBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
                if (res.status === 'Dibatalkan') statusBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300';
                if (res.status === 'Diminta') statusBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';

                return (
                  <tr key={res.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1B3022]">{res.time} WIB</div>
                      <div className="text-[10px] text-gray-500">{res.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#2D2D2D]">{res.customerName}</div>
                      <div className="text-[10px] text-gray-500">{res.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#2D2D2D]">{res.serviceName}</div>
                      <div className="text-[10px] text-gray-500">Rp {res.servicePrice.toLocaleString('id-ID')} • {res.serviceDuration}m</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1B3022]">
                      {res.barberName}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClass}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-gray-500 max-w-xs truncate">
                      {res.notes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'Diminta' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Dikonfirmasi')}
                            className="bg-[#2D5A27] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-[#2D5A27]/90"
                            title="Konfirmasi Booking"
                          >
                            Setujui
                          </button>
                        )}
                        {res.status !== 'Dibatalkan' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Dibatalkan', 'Dibatalkan oleh staf')}
                            className="bg-gray-100 hover:bg-rose-100 text-rose-800 px-2 py-1 rounded text-[10px] font-bold"
                            title="Batalkan Booking"
                          >
                            Batal
                          </button>
                        )}
                        <button
                          onClick={() => deleteReservation(res.id)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                          title="Hapus Data"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
