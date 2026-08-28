import React, { useState } from 'react';
import { X, CalendarPlus, Check, Clock, User, Phone } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const NewReservationModal: React.FC = () => {
  const { 
    isReservationModalOpen, 
    setIsReservationModalOpen, 
    services, 
    barbers, 
    createReservation 
  } = useBarbershop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceName, setServiceName] = useState(services[0]?.name || "Gentleman's Cut");
  const [barberName, setBarberName] = useState(barbers[0]?.name || 'Budi Santoso');
  const [date, setDate] = useState('2023-10-11');
  const [time, setTime] = useState('15:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReservationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    const matchedService = services.find((s) => s.name === serviceName);

    await createReservation({
      customerName,
      customerPhone: customerPhone || '+62 812-0000-0000',
      customerCategory: 'Online Booking',
      serviceName,
      servicePrice: matchedService ? matchedService.price : 75000,
      serviceDuration: matchedService ? matchedService.durationMinutes : 45,
      barberName,
      date,
      time,
      status: 'Dikonfirmasi',
      notes
    });

    setIsSubmitting(false);
    setIsReservationModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1B3022] text-[#C5A059] rounded-lg">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B3022] font-serif-display">Reservasi Baru</h3>
              <p className="text-xs text-gray-500">Jadwalkan pemesanan kursi pelanggan</p>
            </div>
          </div>
          <button 
            onClick={() => setIsReservationModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Nama Lengkap Pelanggan *</label>
            <input
              type="text"
              placeholder="Contoh: Bpk. Kurnia"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">No WhatsApp / HP</label>
            <input
              type="tel"
              placeholder="+62 812-xxxx-xxxx"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Jam Slot (WIB)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Pilihan Layanan</label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Pilihan Barber</label>
              <select
                value={barberName}
                onChange={(e) => setBarberName(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Catatan khusus dari pelanggan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsReservationModalOpen(false)}
              className="w-1/3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim()}
              className="w-2/3 py-2 bg-[#1B3022] hover:bg-[#2D5A27] disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4 text-[#C5A059]" />
              <span>Simpan Jadwal Reservasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
