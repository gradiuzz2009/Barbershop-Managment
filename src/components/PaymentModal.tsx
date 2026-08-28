import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Check, 
  Star, 
  Printer, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    activePaymentItem, 
    completeService,
    addFeedback,
    settings 
  } = useBarbershop();

  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit/Kredit'>('QRIS');
  const [cashGiven, setCashGiven] = useState<number>(100000);
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isPaymentModalOpen || !activePaymentItem) return null;

  const totalAmount = activePaymentItem.amount || 75000;
  const changeAmount = Math.max(0, cashGiven - totalAmount);

  const handleFinishPayment = async () => {
    if (activePaymentItem.chair) {
      await completeService(activePaymentItem.chair.chairNumber, paymentMethod, rating);
    }

    if (rating) {
      await addFeedback({
        customerName: activePaymentItem.name,
        barberName: activePaymentItem.barber,
        serviceName: activePaymentItem.service,
        rating,
        comment: feedbackComment || 'Pelayanan sangat memuaskan dan tepat waktu.',
        source: 'Google Forms',
        formSubmissionId: `GF-${Math.floor(10000 + Math.random() * 90000)}`
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPaymentModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1B3022] text-[#C5A059] rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B3022] font-serif-display">Pembayaran & Kasir</h3>
              <p className="text-xs text-gray-500">Penyelesaian transaksi & survei kepuasan</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPaymentModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-emerald-900 text-base">Pembayaran Berhasil!</h4>
            <p className="text-xs text-emerald-700">
              Transaksi tercatat di kasir, data Firestore diperbarui, dan kursi telah kosong/siap untuk antrean berikutnya.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bill Summary */}
            <div className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Pelanggan:</span>
                <span className="font-bold text-[#1B3022]">{activePaymentItem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Layanan:</span>
                <span className="font-semibold text-gray-800">{activePaymentItem.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Barber:</span>
                <span className="font-semibold text-gray-800">{activePaymentItem.barber}</span>
              </div>
              <div className="pt-2 border-t border-[#E5E1D8] flex justify-between items-center">
                <span className="font-bold text-[#1B3022]">Total Tagihan:</span>
                <span className="text-lg font-black text-[#2D5A27]">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'QRIS', label: 'QRIS', icon: QrCode },
                  { id: 'Tunai', label: 'Tunai (Cash)', icon: Banknote },
                  { id: 'Debit/Kredit', label: 'Kartu', icon: CreditCard }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === m.id
                          ? 'bg-[#1B3022] text-[#C5A059] border-[#1B3022]'
                          : 'bg-[#F7F4EF] text-gray-700 border-[#E5E1D8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Sub-details */}
            {paymentMethod === 'QRIS' && (
              <div className="p-3 bg-[#F7F4EF] border border-[#E5E1D8] rounded-xl text-center space-y-2">
                <div className="w-32 h-32 bg-white p-2 rounded-lg border border-gray-300 mx-auto flex items-center justify-center shadow-xs">
                  <QrCode className="w-24 h-24 text-[#1B3022]" />
                </div>
                <p className="text-[11px] text-gray-600 font-medium">
                  Scan QRIS untuk pembayaran instant (BCA, GoPay, OVO, ShopeePay)
                </p>
              </div>
            )}

            {paymentMethod === 'Tunai' && (
              <div className="space-y-2 bg-[#F7F4EF] p-3 rounded-xl border border-[#E5E1D8] text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Uang Diterima:</span>
                  <input
                    type="number"
                    step="10000"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(Number(e.target.value))}
                    className="w-32 bg-white border border-gray-300 rounded p-1 text-right font-bold text-[#1B3022]"
                  />
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                  <span className="font-bold text-gray-700">Uang Kembalian:</span>
                  <span className="font-black text-[#2D5A27]">
                    Rp {changeAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* Google Forms Rating Input */}
            <div className="p-3 bg-white border border-[#E5E1D8] rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-[#1B3022] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Rating Kepuasan (Google Forms CSAT)</span>
                </span>
                <span className="text-[10px] text-amber-600 font-bold">{rating} / 5 Bintang</span>
              </div>
              
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Ulasan singkat pelanggan..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs text-[#1B3022]"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-1/3 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleFinishPayment}
                className="w-2/3 py-2.5 bg-[#1B3022] hover:bg-[#2D5A27] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4 text-[#C5A059]" />
                <span>Selesaikan & Kosongkan Kursi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
