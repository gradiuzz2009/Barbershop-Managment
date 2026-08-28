import React, { useState } from 'react';
import { 
  Scissors, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Check, 
  QrCode, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const KioskModeView: React.FC = () => {
  const { services, barbers, addQueueTicket, createReservation, setActiveView } = useBarbershop();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [bookingType, setBookingType] = useState<'walk-in' | 'booking'>('walk-in');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'srv-1');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || 'barber-1');
  const [selectedDate, setSelectedDate] = useState('2023-10-11');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState<{ number: string; type: string } | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) || barbers[0];

  const handleFinishBooking = async () => {
    if (!customerName.trim()) return;

    if (bookingType === 'walk-in') {
      const ticketNum = `W-${Math.floor(100 + Math.random() * 899)}`;
      await addQueueTicket({
        ticketNumber: ticketNum,
        customerName,
        customerPhone: customerPhone || '+62 812-9988-7766',
        customerType: 'Walk-in',
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.durationMinutes,
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        status: 'Tiba',
        waitingTimeMinutes: 15,
        estimatedTime: 'Est. 15 mnt',
      });
      setGeneratedTicket({ number: ticketNum, type: 'Walk-in Kios' });
    } else {
      const ticketNum = `B-${Math.floor(100 + Math.random() * 899)}`;
      await createReservation({
        customerName,
        customerPhone: customerPhone || '+62 812-9988-7766',
        customerCategory: 'Online Booking',
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.durationMinutes,
        barberName: selectedBarber.name,
        date: selectedDate,
        time: selectedTime,
        status: 'Dikonfirmasi',
        notes: 'Pemesanan mandiri via Kios Tamu'
      });
      setGeneratedTicket({ number: ticketNum, type: 'Reservasi Online' });
    }

    setStep(5);
  };

  const handleReset = () => {
    setStep(1);
    setCustomerName('');
    setCustomerPhone('');
    setGeneratedTicket(null);
  };

  return (
    <div id="kiosk-mode-view" className="max-w-2xl mx-auto pb-16 space-y-6">
      {/* Kiosk Header */}
      <div className="bg-[#1B3022] text-[#FDFBF7] p-6 rounded-2xl border-2 border-[#C5A059]/40 shadow-xl text-center space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 px-3 py-1 rounded-full text-xs font-bold text-[#C5A059] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Self-Service Kiosk • Pelanggan Mandiri</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white font-serif-display tracking-tight">
          Pemesanan & Antrean Barbershop
        </h2>
        <p className="text-xs md:text-sm text-[#E4E2E1]/80 max-w-md mx-auto">
          Pilih layanan terbaik dan dapatkan tiket antrean digital dalam beberapa sentuhan mudah.
        </p>

        {/* Mode Toggle (Walk-in Antrean vs Jadwalkan Reservasi) */}
        {step < 5 && (
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setBookingType('walk-in')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                bookingType === 'walk-in'
                  ? 'bg-[#C5A059] text-[#1B3022] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ⚡ Antrean Langsung (Walk-in)
            </button>
            <button
              onClick={() => setBookingType('booking')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                bookingType === 'booking'
                  ? 'bg-[#C5A059] text-[#1B3022] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📅 Reservasi Jadwal
            </button>
          </div>
        )}
      </div>

      {/* Step Progress Pills */}
      {step < 5 && (
        <div className="flex justify-between items-center px-4">
          {[
            { num: 1, label: 'Layanan' },
            { num: 2, label: 'Jadwal' },
            { num: 3, label: 'Barber' },
            { num: 4, label: 'Kontak' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.num 
                  ? 'bg-[#1B3022] text-[#C5A059] ring-2 ring-[#C5A059]' 
                  : step > s.num 
                  ? 'bg-[#2D5A27] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-[#1B3022]' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Layanan */}
      {step === 1 && (
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#E5E1D8]">
            <h3 className="text-lg font-bold text-[#1B3022] font-serif-display">Pilih Layanan Barbershop</h3>
            <p className="text-xs text-gray-500">Pilih salah satu perawatan rambut & brewok</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedServiceId === service.id
                    ? 'border-[#1B3022] bg-[#FDFBF7] ring-2 ring-[#1B3022]/10 shadow-xs'
                    : 'border-[#E5E1D8] hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#1B3022]">{service.name}</h4>
                    {service.popular && (
                      <span className="bg-[#C5A059]/20 text-[#1B3022] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Favorit
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <span className="font-bold text-sm text-[#2D5A27]">
                    Rp {service.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.durationMinutes} mnt</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs"
            >
              <span>Lanjut ke Jadwal</span>
              <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Jadwal */}
      {step === 2 && (
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#E5E1D8]">
            <h3 className="text-lg font-bold text-[#1B3022] font-serif-display">Pilih Waktu & Tanggal</h3>
            <p className="text-xs text-gray-500">Sesuaikan jadwal kedatangan Anda</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Pilih Tanggal</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2.5 rounded-lg text-xs font-bold text-[#1B3022]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Pilih Jam Kedatangan</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {['09:30', '10:15', '11:00', '13:00', '14:00', '15:15', '16:30', '18:00', '19:15', '20:00'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedTime === t
                        ? 'bg-[#1B3022] text-[#C5A059] border-[#1B3022]'
                        : 'bg-[#F7F4EF] text-gray-700 border-[#E5E1D8] hover:bg-gray-200'
                    }`}
                  >
                    {t} WIB
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs"
            >
              <span>Lanjut ke Barber</span>
              <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Barber */}
      {step === 3 && (
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#E5E1D8]">
            <h3 className="text-lg font-bold text-[#1B3022] font-serif-display">Pilih Barber Pilihan Anda</h3>
            <p className="text-xs text-gray-500">Staf barber profesional siap melayani</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                onClick={() => setSelectedBarberId(barber.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  selectedBarberId === barber.id
                    ? 'border-[#1B3022] bg-[#FDFBF7] ring-2 ring-[#1B3022]/10 shadow-xs'
                    : 'border-[#E5E1D8] hover:border-gray-300 bg-white'
                }`}
              >
                <img 
                  src={barber.avatar} 
                  alt={barber.name} 
                  className="w-12 h-12 rounded-full object-cover border border-[#C5A059]" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-[#1B3022]">{barber.name}</h4>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      ★ {barber.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">{barber.role}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{barber.specialties.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs"
            >
              <span>Lanjut ke Kontak</span>
              <ChevronRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Kontak & Konfirmasi */}
      {step === 4 && (
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#E5E1D8]">
            <h3 className="text-lg font-bold text-[#1B3022] font-serif-display">Konfirmasi & Kontak</h3>
            <p className="text-xs text-gray-500">Masukkan nama dan kontak WhatsApp untuk nomor antrean</p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-lg p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Layanan:</span>
              <span className="font-bold text-[#1B3022]">{selectedService.name} (Rp {selectedService.price.toLocaleString('id-ID')})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Barber:</span>
              <span className="font-semibold text-gray-800">{selectedBarber.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jadwal / Waktu:</span>
              <span className="font-semibold text-gray-800">{selectedDate} • {selectedTime} WIB</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nama Lengkap Anda *</label>
              <input
                type="text"
                placeholder="Contoh: Bpk. Aditya"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2.5 rounded-lg text-xs font-medium text-[#1B3022]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nomor WhatsApp / HP</label>
              <input
                type="tel"
                placeholder="+62 812-xxxx-xxxx"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2.5 rounded-lg text-xs font-medium text-[#1B3022]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              onClick={handleFinishBooking}
              disabled={!customerName.trim()}
              className="bg-[#2D5A27] hover:bg-[#2D5A27]/90 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Dapatkan Tiket Antrean</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Digital Ticket Confirmation */}
      {step === 5 && generatedTicket && (
        <div className="bg-white border-2 border-[#1B3022] rounded-2xl p-6 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              TIKET ANTREAN DIGITAL
            </span>
            <h3 className="text-4xl font-black text-[#1B3022] font-serif-display mt-1">
              {generatedTicket.number}
            </h3>
            <p className="text-xs font-bold text-[#C5A059] uppercase mt-0.5">
              {generatedTicket.type} • {customerName}
            </p>
          </div>

          {/* QR Code Simulation Box */}
          <div className="bg-[#F7F4EF] p-4 rounded-xl inline-block border border-[#E5E1D8]">
            <div className="w-36 h-36 bg-white border border-gray-300 p-2 rounded-lg mx-auto flex items-center justify-center">
              <QrCode className="w-28 h-28 text-[#1B3022]" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-medium">
              Tunjukkan QR Code ini kepada Staf Barbershop saat dipanggil.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-3 rounded-lg border border-[#E5E1D8] text-xs text-left max-w-sm mx-auto space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Layanan:</span>
              <span className="font-bold text-[#1B3022]">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Barber:</span>
              <span className="font-semibold text-gray-800">{selectedBarber.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimasi Tunggu:</span>
              <span className="font-bold text-[#2D5A27]">10-15 Menit</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={handleReset}
              className="bg-[#1B3022] text-[#C5A059] px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Pesan Antrean Lain
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-xs font-bold"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
