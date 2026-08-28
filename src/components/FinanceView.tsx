import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Banknote, 
  Receipt, 
  TrendingUp, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { Transaction } from '../types';

export const FinanceView: React.FC = () => {
  const { 
    transactions, 
    services, 
    barbers, 
    completeService,
    activePaymentItem,
    setActivePaymentItem,
    setIsPaymentModalOpen
  } = useBarbershop();

  const [paymentFilter, setPaymentFilter] = useState<'Semua' | 'QRIS' | 'Tunai' | 'Debit/Kredit'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // POS Quick Sale form state
  const [selectedService, setSelectedService] = useState(services[0]?.id || 'srv-1');
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]?.name || 'Budi Santoso');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Tunai' | 'Debit/Kredit'>('QRIS');
  const [cashGiven, setCashGiven] = useState<number>(100000);
  const [receiptModal, setReceiptModal] = useState<Transaction | null>(null);

  const matchedService = services.find((s) => s.id === selectedService) || services[0];
  const servicePrice = matchedService ? matchedService.price : 75000;
  const changeAmount = Math.max(0, cashGiven - servicePrice);

  const totalOmzet = transactions.reduce((acc, t) => acc + t.amount, 0) + 2450000;
  const countQris = transactions.filter((t) => t.paymentMethod === 'QRIS').length + 8;
  const countCash = transactions.filter((t) => t.paymentMethod === 'Tunai').length + 5;
  const countCard = transactions.filter((t) => t.paymentMethod.includes('Debit') || t.paymentMethod.includes('Kredit')).length + 3;

  const filteredTransactions = transactions.filter((t) => {
    if (paymentFilter !== 'Semua' && t.paymentMethod !== paymentFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.customerName.toLowerCase().includes(q) ||
        t.serviceName.toLowerCase().includes(q) ||
        t.barberName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleQuickPOSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setActivePaymentItem({
      amount: servicePrice,
      name: customerName,
      service: matchedService.name,
      barber: selectedBarber
    });
    setIsPaymentModalOpen(true);
    setCustomerName('');
  };

  return (
    <div id="finance-view" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white border border-[#E5E1D8] p-5 rounded-lg shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
            Kasir & Manajemen Keuangan
          </h2>
          <p className="text-xs text-[#2D2D2D]/70 mt-1">
            Pencatatan kas masuk, rekonsiliasi pembayaran digital QRIS/Tunai, dan cetak struk pelanggan.
          </p>
        </div>

        <button
          onClick={() => {
            const csv = 'ID,Pelanggan,Layanan,Barber,Nominal,Metode,Tanggal,Waktu\n' +
              transactions.map(t => `"${t.id}","${t.customerName}","${t.serviceName}","${t.barberName}",${t.amount},"${t.paymentMethod}","${t.date}","${t.time}"`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'laporan-kasir-barbershop.csv';
            a.click();
          }}
          className="bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[#C5A059]" />
          <span>Ekspor Rekap Kasir</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Total Kas Masuk Hari Ini</span>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-1">
            Rp {totalOmzet.toLocaleString('id-ID')}
          </h3>
          <p className="text-[11px] text-[#2D5A27] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target Rp 3.000.000 (81.6%)</span>
          </p>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Pembayaran QRIS / GoPay</span>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-1">
            {countQris} Transaksi
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            62% dari total transaksi non-tunai
          </p>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Pembayaran Tunai (Cash)</span>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-1">
            {countCash} Transaksi
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            Uang fisik di laci kasir aman
          </p>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Rata-rata Keranjang (AOV)</span>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-1">
            Rp 92.500
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            Didorong paket Hair & Beard
          </p>
        </div>
      </div>

      {/* POS Quick Register & Transactions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* POS Direct Settlement Card */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-[#E5E1D8]">
            <h3 className="text-base font-bold text-[#1B3022] font-serif-display flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#C5A059]" />
              <span>Kasir Pembayaran Cepat</span>
            </h3>
            <p className="text-xs text-gray-500">Input pembayaran langsung tanpa antrean kursi</p>
          </div>

          <form onSubmit={handleQuickPOSSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">Nama Pelanggan *</label>
              <input 
                type="text"
                placeholder="Contoh: Bpk. Dharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">Layanan Terpilih</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - Rp {s.price.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">Barber yang Melayani</label>
              <select
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                className="w-full bg-[#F7F4EF] border border-[#E5E1D8] rounded p-2 text-xs font-medium text-[#1B3022]"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.name}>{b.name} ({b.role})</option>
                ))}
              </select>
            </div>

            {/* Total Billing Box */}
            <div className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Subtotal Layanan:</span>
                <span className="text-sm font-black text-[#1B3022]">Rp {servicePrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Pajak & Biaya Admin:</span>
                <span>Rp 0 (Termasuk)</span>
              </div>
              <div className="pt-2 border-t border-[#E5E1D8] flex justify-between items-center">
                <span className="text-xs font-bold text-[#1B3022]">Total Bayar:</span>
                <span className="text-base font-black text-[#2D5A27]">Rp {servicePrice.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B3022] hover:bg-[#2D5A27] text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#C5A059]" />
              <span>Proses Pembayaran Kasir</span>
            </button>
          </form>
        </div>

        {/* Transactions History Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#E5E1D8]">
            <div>
              <h3 className="text-base font-bold text-[#1B3022] font-serif-display">
                Daftar Transaksi Selesai
              </h3>
              <p className="text-xs text-gray-500">Riwayat kas masuk dan metode bayar terverifikasi</p>
            </div>

            {/* Payment Method filter */}
            <div className="flex items-center gap-1.5">
              {(['Semua', 'QRIS', 'Tunai', 'Debit/Kredit'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentFilter(m)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    paymentFilter === m
                      ? 'bg-[#1B3022] text-[#C5A059]'
                      : 'bg-[#F7F4EF] text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E1D8] bg-[#F7F4EF]/70 text-[#2D2D2D]/70 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">No. Transaksi</th>
                  <th className="py-3 px-3">Pelanggan</th>
                  <th className="py-3 px-3">Layanan & Barber</th>
                  <th className="py-3 px-3">Nominal</th>
                  <th className="py-3 px-3">Metode</th>
                  <th className="py-3 px-3 text-right">Struk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#1B3022]">{tx.id}</span>
                      <div className="text-[10px] text-gray-500">{tx.time}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#2D2D2D]">
                      {tx.customerName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#2D2D2D]">{tx.serviceName}</div>
                      <div className="text-[10px] text-gray-500">Oleh {tx.barberName}</div>
                    </td>
                    <td className="py-3 px-3 font-black text-[#2D5A27]">
                      Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B3022]/10 text-[#1B3022] border border-[#1B3022]/20">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setReceiptModal(tx)}
                        className="bg-[#F7F4EF] hover:bg-gray-200 text-[#1B3022] p-1.5 rounded transition-colors"
                        title="Lihat & Cetak Nota"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Receipt Modal Popup */}
      {receiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-[#E5E1D8] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="text-center pb-3 border-b border-dashed border-gray-300">
              <h4 className="font-black text-lg text-[#1B3022] font-serif-display">BARBERSHOP MANAGER</h4>
              <p className="text-xs text-gray-500">Cabang Pusat - Heritage Quality</p>
              <p className="text-[10px] text-gray-400 mt-1">Bukti Pembayaran Sah • {receiptModal.id}</p>
            </div>

            <div className="text-xs space-y-1.5 py-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Pelanggan:</span>
                <span className="font-bold text-[#1B3022]">{receiptModal.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Layanan:</span>
                <span className="font-semibold text-gray-800">{receiptModal.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Barber:</span>
                <span className="font-semibold text-gray-800">{receiptModal.barberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Waktu:</span>
                <span className="text-gray-600">{receiptModal.date} {receiptModal.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Metode Bayar:</span>
                <span className="font-bold text-[#1B3022]">{receiptModal.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between items-center">
              <span className="text-sm font-bold text-[#1B3022]">TOTAL DIBAYAR:</span>
              <span className="text-base font-black text-[#2D5A27]">Rp {receiptModal.amount.toLocaleString('id-ID')}</span>
            </div>

            <div className="bg-[#F7F4EF] p-2.5 rounded text-center text-[10px] text-gray-600">
              Terima kasih atas kunjungan Anda! Silakan scan QR Google Forms untuk ulasan & voucher cukur berikutnya.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReceiptModal(null)}
                className="w-1/2 py-2 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-100 text-gray-700"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setReceiptModal(null);
                }}
                className="w-1/2 py-2 bg-[#1B3022] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
