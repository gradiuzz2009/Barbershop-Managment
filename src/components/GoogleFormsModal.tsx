import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  QrCode, 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  Send, 
  RefreshCw, 
  Sparkles,
  MessageSquareQuote
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const GoogleFormsModal: React.FC = () => {
  const { 
    isGoogleFormsModalOpen, 
    setIsGoogleFormsModalOpen, 
    settings, 
    feedbacks, 
    barbers, 
    services,
    addFeedback 
  } = useBarbershop();

  const [activeTab, setActiveTab] = useState<'preview' | 'responses' | 'submit-test'>('preview');
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Test form submission
  const [testName, setTestName] = useState('');
  const [testBarber, setTestBarber] = useState(barbers[0]?.name || 'Budi Santoso');
  const [testService, setTestService] = useState(services[0]?.name || "Gentleman's Cut");
  const [testRating, setTestRating] = useState(5);
  const [testComment, setTestComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isGoogleFormsModalOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(settings.googleForms.formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncResponses = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleSimulateFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    await addFeedback({
      customerName: testName,
      barberName: testBarber,
      serviceName: testService,
      rating: testRating,
      comment: testComment || 'Pelayanan sangat memuaskan, potongan rapi dan bersih!',
      source: 'Google Forms',
      formSubmissionId: `GF-${Math.floor(10000 + Math.random() * 90000)}`
    });

    setSubmitSuccess(true);
    setTestName('');
    setTestComment('');
    setTimeout(() => setSubmitSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1B3022] text-[#C5A059] rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B3022] font-serif-display">
                Integrasi Google Forms (Survei Kepuasan)
              </h3>
              <p className="text-xs text-gray-500">
                Koleksi ulasan digital & sinkronisasi otomatis rating pelanggan
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsGoogleFormsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E5E1D8] pb-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preview' ? 'bg-[#1B3022] text-[#C5A059]' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📋 Formulir Survei
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'responses' ? 'bg-[#1B3022] text-[#C5A059]' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⭐ Respons Masuk ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab('submit-test')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'submit-test' ? 'bg-[#1B3022] text-[#C5A059]' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✍️ Isi / Uji Respons Baru
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Top Link & QR Share Box */}
              <div className="bg-[#FDFBF7] border border-[#E5E1D8] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                    Tautan Survei Google Forms
                  </span>
                  <p className="text-xs font-medium text-gray-700 break-all">
                    {settings.googleForms.formUrl}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Tampilkan QR Code ini di meja kasir atau kirim via WhatsApp nota pembayaran.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="bg-[#1B3022] text-[#FDFBF7] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-[#1B3022]/90"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                  <a
                    href={settings.googleForms.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F7F4EF] border border-[#E5E1D8] text-[#1B3022] p-1.5 rounded hover:bg-gray-200"
                    title="Buka di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Embedded Form Preview Mockup */}
              <div className="border-2 border-[#1B3022]/20 rounded-xl p-5 bg-white space-y-3">
                <div className="text-center pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 bg-purple-700 text-white rounded-lg flex items-center justify-center mx-auto mb-1 font-bold text-xs">
                    GF
                  </div>
                  <h4 className="font-bold text-base text-[#1B3022] font-serif-display">
                    {settings.googleForms.formTitle}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Bantu kami meningkatkan kualitas pelayanan Barbershop Manager
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-bold text-[#1B3022]">1. Berapa rating kepuasan Anda secara keseluruhan? *</p>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="flex flex-col items-center gap-0.5">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                          <span className="text-[10px] text-gray-500">{star}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-bold text-[#1B3022]">2. Siapa nama Barber yang melayani Anda hari ini? *</p>
                    <p className="text-[11px] text-gray-500 mt-1 italic">
                      [ Pilihan: Budi Santoso, Ahmad Rifai, Andi Saputra, Anton, Mas Dimas, Bang Joko ]
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-bold text-[#1B3022]">3. Kritik, saran, atau pujian untuk barbershop kami:</p>
                    <p className="text-[11px] text-gray-400 mt-1 italic">
                      Tulis komentar Anda di sini...
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setActiveTab('submit-test')}
                    className="bg-[#1B3022] text-[#C5A059] px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Simulasi Kirim Jawaban Survei →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs font-bold text-gray-700">Daftar Respons Tersinkronisasi ({feedbacks.length})</span>
                <button
                  onClick={handleSyncResponses}
                  disabled={isSyncing}
                  className="text-xs font-semibold text-[#1B3022] hover:text-[#C5A059] flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Google Forms'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-3 bg-[#FDFBF7] border border-[#E5E1D8] rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#1B3022]">{fb.customerName}</span>
                        <span className="text-gray-500 text-[10px] ml-2">({fb.serviceName} • {fb.barberName})</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{fb.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{fb.comment}"</p>
                    <div className="flex justify-between text-[10px] text-gray-400 pt-1">
                      <span>Sumber: {fb.source} ({fb.formSubmissionId || 'GF-Auto'})</span>
                      <span>{fb.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'submit-test' && (
            <form onSubmit={handleSimulateFormSubmit} className="space-y-3.5">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
                <p className="font-bold">Formulir Simulasi Pengisian Google Forms</p>
                <p className="text-[11px] text-purple-700">
                  Data yang dikirimkan di sini akan langsung masuk ke database Firestore dan memperbarui statistik kepuasan pelanggan secara real-time.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Respons Google Forms berhasil tersimpan & disinkronkan!</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Nama Pelanggan *</label>
                <input
                  type="text"
                  placeholder="Contoh: Bpk. Suryadi"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Barber</label>
                  <select
                    value={testBarber}
                    onChange={(e) => setTestBarber(e.target.value)}
                    className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Layanan</label>
                  <select
                    value={testService}
                    onChange={(e) => setTestService(e.target.value)}
                    className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Rating Skor (1 - 5 Bintang)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestRating(star)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        testRating === star
                          ? 'bg-amber-400 text-amber-950 border-amber-500'
                          : 'bg-[#F7F4EF] text-gray-700 border-[#E5E1D8]'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Komentar / Ulasan Pelanggan</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan pengalaman potong rambut Anda..."
                  value={testComment}
                  onChange={(e) => setTestComment(e.target.value)}
                  className="w-full bg-[#F7F4EF] border border-[#E5E1D8] p-2 rounded text-xs font-medium text-[#1B3022]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!testName.trim()}
                  className="bg-[#1B3022] hover:bg-[#2D5A27] disabled:opacity-50 text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Kirim Respons Survei</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
