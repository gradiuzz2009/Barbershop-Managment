import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  Clock, 
  FileText, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, setIsGoogleFormsModalOpen } = useBarbershop();

  const [shopName, setShopName] = useState(settings.shopName);
  const [branchName, setBranchName] = useState(settings.branchName);
  const [openTime, setOpenTime] = useState(settings.openTime);
  const [closeTime, setCloseTime] = useState(settings.closeTime);
  const [chairCount, setChairCount] = useState(settings.chairCount);
  const [dailyTarget, setDailyTarget] = useState(settings.dailyRevenueTarget);
  const [formUrl, setFormUrl] = useState(settings.googleForms.formUrl);
  const [formTitle, setFormTitle] = useState(settings.googleForms.formTitle);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      shopName,
      branchName,
      openTime,
      closeTime,
      chairCount: Number(chairCount),
      dailyRevenueTarget: Number(dailyTarget),
      googleForms: {
        ...settings.googleForms,
        formUrl,
        formTitle
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-view" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-[#E5E1D8] p-5 rounded-lg shadow-2xs flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
            Pengaturan Sistem & Integrasi
          </h2>
          <p className="text-xs text-[#2D2D2D]/70 mt-1">
            Konfigurasi profil barbershop, jam operasional, dan integrasi survei kepuasan Google Forms.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Pengaturan berhasil diperbarui dan disimpan ke Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Profil Barbershop */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E1D8]">
            <Store className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-bold text-sm text-[#1B3022]">Profil Usaha & Cabang</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nama Barbershop</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nama Cabang</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Jumlah Stasiun Kursi</label>
              <input
                type="number"
                min="1"
                max="10"
                value={chairCount}
                onChange={(e) => setChairCount(Number(e.target.value))}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Target Omzet Harian (Rp)</label>
              <input
                type="number"
                step="50000"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Jam Operasional */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E1D8]">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-bold text-sm text-[#1B3022]">Jam Operasional Buka / Tutup</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Jam Buka</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Jam Tutup</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Google Forms Integration */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-bold text-sm text-[#1B3022]">Integrasi Google Forms (Survei Kepuasan)</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsGoogleFormsModalOpen(true)}
              className="text-xs font-bold text-[#1B3022] hover:text-[#C5A059] flex items-center gap-1"
            >
              <span>Uji Form Langsung</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Judul Formulir Google Forms</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Tautan Publik Google Forms (URL)</label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://docs.google.com/forms/d/e/.../viewform"
              className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-semibold text-[#1B3022]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Tautan ini akan digunakan untuk membuat QR Code meja dan notifikasi otomatis saat pembayaran selesai.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#1B3022] hover:bg-[#2D5A27] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4 text-[#C5A059]" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
