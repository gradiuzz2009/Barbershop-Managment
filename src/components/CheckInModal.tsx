import React, { useState } from 'react';
import { X, UserPlus, Scissors, Clock, User, Phone, Check } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const CheckInModal: React.FC = () => {
  const { 
    isCheckInModalOpen, 
    setIsCheckInModalOpen, 
    services, 
    barbers, 
    chairs,
    addQueueTicket,
    allocateToChair
  } = useBarbershop();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'srv-1');
  const [customerType, setCustomerType] = useState<'Walk-in' | 'Reguler' | 'VIP'>('Walk-in');
  const [assignedChairNumber, setAssignedChairNumber] = useState<number | 'none'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckInModalOpen) return null;

  const matchedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setIsSubmitting(true);
    const prefix = customerType === 'VIP' ? 'VIP' : 'W';
    const ticketNumber = `${prefix}-${Math.floor(100 + Math.random() * 899)}`;

    const newTicketId = await addQueueTicket({
      ticketNumber,
      customerName,
      customerPhone: customerPhone || '+62 812-3344-5566',
      customerType,
      serviceId: matchedService.id,
      serviceName: matchedService.name,
      servicePrice: matchedService.price,
      serviceDuration: matchedService.durationMinutes,
      status: assignedChairNumber !== 'none' ? 'Proses' : 'Tiba',
      waitingTimeMinutes: assignedChairNumber !== 'none' ? 0 : 15,
      estimatedTime: assignedChairNumber !== 'none' ? 'Langsung di kursi' : 'Est. 15 mnt',
      chairNumber: assignedChairNumber !== 'none' ? assignedChairNumber : undefined
    });

    if (assignedChairNumber !== 'none') {
      await allocateToChair(newTicketId, assignedChairNumber);
    }

    setIsSubmitting(false);
    setIsCheckInModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1B3022] text-[#C5A059] rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B3022] font-serif-display">Check-in Antrean Pelanggan</h3>
              <p className="text-xs text-gray-500">Pendaftaran walk-in & tiket antrean langsung</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCheckInModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Customer Type Segment */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Tipe Pelanggan</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Walk-in', 'Reguler', 'VIP'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCustomerType(t)}
                  className={`py-1.5 rounded text-xs font-bold transition-all border ${
                    customerType === t
                      ? 'bg-[#1B3022] text-[#C5A059] border-[#1B3022]'
                      : 'bg-[#F7F4EF] text-gray-700 border-[#E5E1D8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Nama Pelanggan *</label>
            <input
              type="text"
              placeholder="Contoh: Bpk. Bambang"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Nomor WhatsApp / HP</label>
            <input
              type="tel"
              placeholder="+62 812-xxxx-xxxx"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Pilihan Layanan</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - Rp {s.price.toLocaleString('id-ID')} ({s.durationMinutes} mnt)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Alokasikan Langsung ke Kursi?</label>
            <select
              value={assignedChairNumber}
              onChange={(e) => setAssignedChairNumber(e.target.value === 'none' ? 'none' : Number(e.target.value))}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
            >
              <option value="none">Masukkan ke Ruang Tunggu Umum</option>
              {chairs.map((c) => (
                <option key={c.chairNumber} value={c.chairNumber}>
                  Kursi {c.chairNumber} ({c.barberName} - {c.status})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsCheckInModalOpen(false)}
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
              <span>Cetak Tiket & Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
