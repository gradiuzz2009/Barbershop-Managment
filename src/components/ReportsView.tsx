import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Award, 
  Download, 
  FileText, 
  CheckCircle2, 
  MessageSquareQuote,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';

export const ReportsView: React.FC = () => {
  const { 
    transactions, 
    barbers, 
    feedbacks, 
    services,
    setIsGoogleFormsModalOpen 
  } = useBarbershop();

  const [period, setPeriod] = useState<'Minggu Ini' | 'Bulan Ini' | 'Kuartal Ini' | 'Tahun Ini'>('Minggu Ini');

  const handleExportFullCSV = () => {
    const header = 'Kategori,Nama Barber,Layanan/Metrik,Jumlah Transaksi,Total Omzet,Rating\n';
    const barberRows = barbers.map(b => 
      `"Kinerja Staf","${b.name}","${b.role}",${b.completedToday},${b.completedToday * 85000},${b.rating}`
    ).join('\n');
    
    const blob = new Blob([header + barberRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-kinerja-barbershop-${period.toLowerCase().replace(' ', '-')}.csv`;
    a.click();
  };

  return (
    <div id="reports-view" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white border border-[#E5E1D8] p-5 rounded-lg shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
            Laporan Keuangan & Kinerja Staf
          </h2>
          <p className="text-xs text-[#2D2D2D]/70 mt-1">
            Analisis metrik omzet, produktivitas barber, dan agregasi hasil survei Google Forms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Filter */}
          <div className="flex bg-[#F7F4EF] p-1 rounded-lg border border-[#E5E1D8]">
            {(['Minggu Ini', 'Bulan Ini', 'Kuartal Ini', 'Tahun Ini'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  period === p
                    ? 'bg-[#1B3022] text-[#C5A059] shadow-xs'
                    : 'text-gray-600 hover:text-[#1B3022]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportFullCSV}
            className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-white px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Ekspor Laporan</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase">Omzet Bersih ({period})</span>
            <div className="p-1.5 bg-[#2D5A27]/10 text-[#2D5A27] rounded">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-2">
            Rp 14.850.000
          </h3>
          <p className="text-[11px] text-[#2D5A27] font-semibold mt-1">
            +14.2% dibanding periode sebelumnya
          </p>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Pelanggan Dilayani</span>
            <div className="p-1.5 bg-[#1B3022]/10 text-[#1B3022] rounded">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-2">
            168 Orang
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            Rata-rata 24 pelanggan / hari
          </p>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase">Kepuasan Pelanggan</span>
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-2">
            4.85 / 5.0
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            Google Forms CSAT Index (97% Puas)
          </p>
        </div>

        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase">Efisiensi Stasiun Kerja</span>
            <div className="p-1.5 bg-blue-100 text-blue-900 rounded">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#1B3022] font-serif-display mt-2">
            84.2%
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            Rerata durasi cukur 38 menit / sesi
          </p>
        </div>
      </div>

      {/* Barber Staff Performance Ranking & Popular Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Barber Staff Performance Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E5E1D8]">
            <div>
              <h3 className="text-base font-bold text-[#1B3022] font-serif-display">
                Peringkat & Kinerja Barber
              </h3>
              <p className="text-xs text-gray-500">Berdasarkan total pelayanan dan ulasan pelanggan</p>
            </div>
            <span className="text-xs font-semibold text-[#C5A059] bg-[#1B3022] px-2.5 py-1 rounded">
              Top Performer
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E1D8] bg-[#F7F4EF]/70 text-[#2D2D2D]/70 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Nama Barber</th>
                  <th className="py-3 px-3">Posisi</th>
                  <th className="py-3 px-3 text-center">Pelayanan Selesai</th>
                  <th className="py-3 px-3 text-center">Rating CSAT</th>
                  <th className="py-3 px-3 text-right">Kontribusi Omzet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]">
                {barbers.map((barber, index) => {
                  const estOmzet = (barber.completedToday + 28) * 82000;
                  return (
                    <tr key={barber.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            index === 0 ? 'bg-amber-400 text-amber-950 font-black' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-bold text-xs text-[#1B3022]">{barber.name}</p>
                            <p className="text-[10px] text-gray-500">{barber.specialties.join(', ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-700">
                        {barber.role}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-[#1B3022]">
                        {barber.completedToday + 28} Orang
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{barber.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#2D5A27]">
                        Rp {estOmzet.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Layanan Terpopuler Distribution */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-[#E5E1D8]">
            <h3 className="text-base font-bold text-[#1B3022] font-serif-display">
              Distribusi Layanan
            </h3>
            <p className="text-xs text-gray-500">Porsi pendapatan per kategori servis</p>
          </div>

          <div className="space-y-3.5">
            {[
              { name: "Gentleman's Cut", percentage: 42, color: 'bg-[#1B3022]', revenue: 'Rp 6.230.000' },
              { name: 'Full Package (Hair & Beard)', percentage: 28, color: 'bg-[#C5A059]', revenue: 'Rp 4.150.000' },
              { name: 'Beard Trim & Line-up', percentage: 18, color: 'bg-[#2D5A27]', revenue: 'Rp 2.670.000' },
              { name: 'Hair Coloring & Spa', percentage: 12, color: 'bg-indigo-700', revenue: 'Rp 1.800.000' }
            ].map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#2D2D2D]">
                  <span>{item.name}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
                <div className="text-right text-[10px] text-gray-500 font-medium">
                  {item.revenue}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F7F4EF] p-3 rounded-lg text-xs text-gray-700 space-y-1">
            <p className="font-bold text-[#1B3022]">💡 Insight Rekomendasi:</p>
            <p className="text-[11px] leading-relaxed">
              Paket <strong>Full Package</strong> menghasilkan margin tertinggi. Staf disarankan menawarkan upgrade servis saat pelanggan memilih Classic Cut.
            </p>
          </div>
        </div>
      </div>

      {/* Google Forms Customer Feedback Feed */}
      <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-900 rounded-lg">
              <MessageSquareQuote className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B3022] font-serif-display">
                Umpan Balik Pelanggan (Google Forms Feed)
              </h3>
              <p className="text-xs text-gray-500">
                Ulasan asli dan masukan kepuasan pelanggan yang tersinkronisasi via Google Forms
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGoogleFormsModalOpen(true)}
            className="bg-[#C5A059] hover:bg-[#C5A059]/90 text-[#1B3022] px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Kelola Google Forms</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-[#FDFBF7] border border-[#E5E1D8] rounded-lg p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#1B3022]">{fb.customerName}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(fb.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 font-medium mb-2">
                  Dilayani oleh <strong className="text-[#1B3022]">{fb.barberName}</strong> • {fb.serviceName}
                </div>
                <p className="text-xs text-[#2D2D2D]/80 italic bg-white p-2.5 rounded border border-[#E5E1D8]/60">
                  "{fb.comment}"
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-400 pt-2 border-t border-[#E5E1D8]">
                <span className="flex items-center gap-1 font-semibold text-[#1B3022]">
                  <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" />
                  <span>{fb.source}</span>
                </span>
                <span>{fb.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
