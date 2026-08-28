import React, { useState } from 'react';
import { X, Clock, AlertTriangle, Check, ArrowRight, MessageSquare, Bell } from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const LateAdjustmentModal: React.FC = () => {
  const { 
    isLateModalOpen, 
    setIsLateModalOpen, 
    chairs, 
    applyAutoSuggestLate 
  } = useBarbershop();

  const [selectedChair, setSelectedChair] = useState<number>(2);
  const [addedMinutes, setAddedMinutes] = useState<number>(10);
  const [sendNotification, setSendNotification] = useState<boolean>(true);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isLateModalOpen) return null;

  const targetChair = chairs.find((c) => c.chairNumber === selectedChair) || chairs[0];

  const handleApply = async () => {
    await applyAutoSuggestLate(selectedChair, addedMinutes);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsLateModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B3022] font-serif-display">Atasi Keterlambatan Layanan</h3>
              <p className="text-xs text-gray-500">Auto-Suggest Late & Penyesuaian Antrean Cerdas</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLateModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {appliedSuccess ? (
          <div className="py-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-emerald-900 text-sm">Jadwal Antrean Berhasil Disesuaikan!</h4>
            <p className="text-xs text-emerald-700">
              Estimasi waktu pelanggan berikutnya pada Kursi {selectedChair} telah dimundurkan +{addedMinutes} menit.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Deteksi Overtime Otomatis:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Stasiun <strong>Kursi 2 ({targetChair?.barberName})</strong> membutuhkan waktu ekstra untuk proses pewarnaan/styling detail.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Pilih Stasiun Kursi</label>
              <select
                value={selectedChair}
                onChange={(e) => setSelectedChair(Number(e.target.value))}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
              >
                {chairs.map((c) => (
                  <option key={c.chairNumber} value={c.chairNumber}>
                    Kursi {c.chairNumber} - {c.barberName} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Tambahkan Waktu Estimasi (+Menit)</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAddedMinutes(m)}
                    className={`py-2 rounded text-xs font-bold border transition-all ${
                      addedMinutes === m
                        ? 'bg-[#1B3022] text-[#C5A059] border-[#1B3022]'
                        : 'bg-[#F7F4EF] text-gray-700 border-[#E5E1D8]'
                    }`}
                  >
                    +{m} mnt
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sendNotifCheckbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 text-[#1B3022] rounded"
              />
              <label htmlFor="sendNotifCheckbox" className="text-xs text-gray-700 font-medium cursor-pointer">
                Kirim notifikasi estimasi otomatis ke WhatsApp pelanggan berikutnya
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsLateModalOpen(false)}
                className="w-1/3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="w-2/3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan Penyesuaian</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
