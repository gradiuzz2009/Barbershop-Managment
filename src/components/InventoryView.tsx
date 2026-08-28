import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  History, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Edit3, 
  Trash2, 
  SlidersHorizontal,
  X, 
  PlusCircle, 
  MinusCircle, 
  FileSpreadsheet, 
  ExternalLink,
  Tag,
  DollarSign,
  AlertCircle,
  Truck,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  ShoppingBag
} from 'lucide-react';
import { useBarbershop } from '../context/BarbershopContext';
import { InventoryItem, InventoryCategory, StockMovement, StockMovementType } from '../types';

export const InventoryView: React.FC = () => {
  const { 
    inventory, 
    stockMovements, 
    lowStockItems, 
    addInventoryItem, 
    updateInventoryItem, 
    adjustStock, 
    deleteInventoryItem,
    user
  } = useBarbershop();

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'safe' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'lowest_stock' | 'highest_stock' | 'name_asc' | 'price_desc' | 'recent'>('lowest_stock');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<InventoryItem | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Pomade & Clay' as InventoryCategory,
    stockLevel: 10,
    minStockLevel: 5,
    unitPrice: 100000,
    costPrice: 60000,
    unit: 'jar (100g)',
    supplier: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1597854710119-a5a84396ee76?w=300&auto=format&fit=crop&q=80'
  });

  // Form state for Adjust Stock
  const [adjustFormData, setAdjustFormData] = useState({
    type: 'Restock' as StockMovementType,
    quantity: 10,
    notes: ''
  });

  // Categories list
  const categories: string[] = [
    'Semua',
    'Pomade & Clay',
    'Beard & Mustache',
    'Hair Care & Tonic',
    'Shaving & Razor',
    'Accessories & Tools'
  ];

  // Image presets for quick picking
  const imagePresets = [
    { label: 'Pomade Jar', url: 'https://images.unsplash.com/photo-1597854710119-a5a84396ee76?w=300&auto=format&fit=crop&q=80' },
    { label: 'Beard Oil Dropper', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80' },
    { label: 'Aftershave Bottle', url: 'https://images.unsplash.com/photo-1608248597359-543160a0f288?w=300&auto=format&fit=crop&q=80' },
    { label: 'Spray Texture', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' },
    { label: 'Shampoo Bottle', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80' },
    { label: 'Vintage Tin Can', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80' },
    { label: 'Razor & Blades', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80' },
    { label: 'Wood Comb', url: 'https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?w=300&auto=format&fit=crop&q=80' },
  ];

  // Filtered and Sorted Inventory
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        // Search
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.supplier.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Category filter
        if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (statusFilter === 'low' && item.stockLevel > item.minStockLevel) {
          return false;
        }
        if (statusFilter === 'safe' && item.stockLevel <= item.minStockLevel) {
          return false;
        }
        if (statusFilter === 'out' && item.stockLevel > 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'lowest_stock') return a.stockLevel - b.stockLevel;
        if (sortBy === 'highest_stock') return b.stockLevel - a.stockLevel;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'price_desc') return b.unitPrice - a.unitPrice;
        if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [inventory, searchQuery, selectedCategory, statusFilter, sortBy]);

  // Aggregate Metrics
  const totalStockUnits = useMemo(() => inventory.reduce((acc, i) => acc + i.stockLevel, 0), [inventory]);
  const totalRetailValuation = useMemo(() => inventory.reduce((acc, i) => acc + (i.stockLevel * i.unitPrice), 0), [inventory]);
  const totalCostValuation = useMemo(() => inventory.reduce((acc, i) => acc + (i.stockLevel * i.costPrice), 0), [inventory]);

  // Open Edit Modal
  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      stockLevel: item.stockLevel,
      minStockLevel: item.minStockLevel,
      unitPrice: item.unitPrice,
      costPrice: item.costPrice,
      unit: item.unit,
      supplier: item.supplier,
      description: item.description,
      imageUrl: item.imageUrl || imagePresets[0].url
    });
    setIsAddModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Pomade & Clay',
      stockLevel: 10,
      minStockLevel: 5,
      unitPrice: 120000,
      costPrice: 70000,
      unit: 'jar (100g)',
      supplier: 'PT Dapper Grooming Indonesia',
      description: '',
      imageUrl: imagePresets[0].url
    });
    setIsAddModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      await updateInventoryItem(editingItem.id, {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        stockLevel: Number(formData.stockLevel),
        minStockLevel: Number(formData.minStockLevel),
        unitPrice: Number(formData.unitPrice),
        costPrice: Number(formData.costPrice),
        unit: formData.unit,
        supplier: formData.supplier,
        description: formData.description,
        imageUrl: formData.imageUrl
      });
    } else {
      await addInventoryItem({
        name: formData.name,
        sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
        category: formData.category,
        stockLevel: Number(formData.stockLevel),
        minStockLevel: Number(formData.minStockLevel),
        unitPrice: Number(formData.unitPrice),
        costPrice: Number(formData.costPrice),
        unit: formData.unit || 'pcs',
        supplier: formData.supplier || 'Supplier Umum',
        lastRestocked: new Date().toISOString().split('T')[0],
        description: formData.description || 'Produk perawatan grooming barbershop berkualitas.',
        imageUrl: formData.imageUrl
      });
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  // Quick Stock Adjustment (+1 / -1 / +10)
  const handleQuickAdjust = async (item: InventoryItem, delta: number) => {
    const type: StockMovementType = delta > 0 ? 'Restock' : 'Penjualan';
    const notes = delta > 0 ? `Restock cepat +${delta} unit via tombol cepat` : `Penjualan cepat 1 unit`;
    await adjustStock(item.id, delta, type, notes);
  };

  // Open Custom Adjust Modal
  const handleOpenAdjustModal = (item: InventoryItem) => {
    setAdjustingItem(item);
    setAdjustFormData({
      type: 'Restock',
      quantity: 10,
      notes: ''
    });
  };

  // Save Custom Adjust
  const handleSaveAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    const qty = Number(adjustFormData.quantity);
    let delta = qty;
    if (adjustFormData.type === 'Penjualan' || adjustFormData.type === 'Rusak/Kadaluarsa') {
      delta = -Math.abs(qty);
    } else if (adjustFormData.type === 'Restock') {
      delta = Math.abs(qty);
    } else if (adjustFormData.type === 'Penyesuaian') {
      delta = qty;
    }

    await adjustStock(
      adjustingItem.id, 
      delta, 
      adjustFormData.type, 
      adjustFormData.notes || `${adjustFormData.type} manual sebesar ${delta} ${adjustingItem.unit}`
    );

    setAdjustingItem(null);
  };

  return (
    <div id="inventory-view" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E5E1D8] p-5 md:p-6 rounded-lg shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#1B3022] text-[#C5A059] flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1B3022] font-serif-display">
                Manajemen Inventaris & Grooming
              </h2>
              <p className="text-xs md:text-sm text-[#2D2D2D]/70 font-medium">
                Kontrol stok produk pomade, beard oil, tonic, ambang batas reorder, dan riwayat audit.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-stock-history"
            onClick={() => setIsHistoryModalOpen(true)}
            className="bg-[#F7F4EF] hover:bg-[#EAE7E7] text-[#1B3022] border border-[#E5E1D8] px-3.5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <History className="w-4 h-4 text-[#C5A059]" />
            <span>Riwayat Audit Stok</span>
          </button>

          <button
            id="btn-add-product"
            onClick={handleOpenAdd}
            className="bg-[#1B3022] hover:bg-[#1B3022]/90 text-[#FDFBF7] px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-xs pressed-effect"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>+ Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Products */}
        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#2D2D2D]/70 font-medium mb-1">
            <span>Total Varian Produk</span>
            <Package className="w-4 h-4 text-[#1B3022]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3022] font-serif-display">
            {inventory.length} <span className="text-xs font-sans font-normal text-[#2D2D2D]/60">Varian</span>
          </div>
          <p className="text-[11px] text-[#2D5A27] mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Siap dijual di kasir & stasiun
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'low' ? 'all' : 'low')}
          className={`border p-4 rounded-lg shadow-2xs cursor-pointer transition-all ${
            lowStockItems.length > 0
              ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
              : 'bg-white border-[#E5E1D8]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-900 font-medium mb-1">
            <span className="font-bold">Alert Stok Menipis</span>
            {lowStockItems.length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </div>
          <div className="text-2xl font-bold text-amber-950 font-serif-display flex items-baseline gap-1.5">
            {lowStockItems.length}
            <span className="text-xs font-sans font-normal text-amber-800">Produk</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {lowStockItems.length > 0 ? 'Klik untuk filter butuh restock' : 'Semua stok dalam batas aman'}
          </p>
        </div>

        {/* Total Physical Stock Units */}
        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#2D2D2D]/70 font-medium mb-1">
            <span>Total Unit Fisik</span>
            <Layers className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3022] font-serif-display">
            {totalStockUnits} <span className="text-xs font-sans font-normal text-[#2D2D2D]/60">Unit</span>
          </div>
          <p className="text-[11px] text-[#2D2D2D]/60 mt-1 font-medium">
            Tersimpan di gudang & etalase toko
          </p>
        </div>

        {/* Total Asset Valuation */}
        <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#2D2D2D]/70 font-medium mb-1">
            <span>Nilai Aset Retail</span>
            <DollarSign className="w-4 h-4 text-[#2D5A27]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3022] font-serif-display">
            Rp {(totalRetailValuation / 1000).toLocaleString('id-ID')}k
          </div>
          <p className="text-[11px] text-[#2D2D2D]/60 mt-1 font-medium">
            Modal: Rp {(totalCostValuation / 1000).toLocaleString('id-ID')}k
          </p>
        </div>
      </div>

      {/* Prominent Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 bg-white p-4 rounded-r-lg border border-[#E5E1D8] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>Peringatan Ambang Batas Stok Menipis ({lowStockItems.length} Produk)</span>
                  <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Segera Reorder
                  </span>
                </h3>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Produk-produk berikut telah menyentuh atau berada di bawah kuota minimum stok aman toko.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lowStockItems.map((item) => (
                    <div 
                      key={item.id}
                      className="inline-flex items-center gap-2 bg-white border border-amber-300 px-2.5 py-1 rounded text-xs text-amber-950 shadow-2xs"
                    >
                      <span className="font-semibold">{item.name}</span>
                      <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded text-[11px]">
                        Sisa {item.stockLevel} (Min {item.minStockLevel})
                      </span>
                      <button
                        onClick={() => handleQuickAdjust(item, 10)}
                        title="Restock cepat +10 unit"
                        className="text-amber-700 hover:text-amber-950 hover:underline font-bold text-[11px] ml-1 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> +10 Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => setStatusFilter('low')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider transition-colors shadow-2xs"
              >
                Lihat Semua ({lowStockItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white border border-[#E5E1D8] p-4 rounded-lg shadow-2xs space-y-3">
        {/* Row 1: Search & Action Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#2D2D2D]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-inventory"
              type="text"
              placeholder="Cari nama produk, SKU, supplier, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs text-[#2D2D2D] placeholder-[#2D2D2D]/40 focus:outline-hidden focus:border-[#1B3022] font-medium transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Chips */}
            <div className="flex items-center border border-[#E5E1D8] rounded p-0.5 bg-[#FDFBF7] text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-[#1B3022] text-white shadow-2xs'
                    : 'text-[#2D2D2D]/70 hover:text-[#1B3022]'
                }`}
              >
                Semua ({inventory.length})
              </button>
              <button
                onClick={() => setStatusFilter('low')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                  statusFilter === 'low'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Menipis ({lowStockItems.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('safe')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'safe'
                    ? 'bg-[#2D5A27] text-white shadow-2xs'
                    : 'text-[#2D2D2D]/70 hover:text-[#1B3022]'
                }`}
              >
                Aman
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 border border-[#E5E1D8] rounded px-2.5 py-1.5 bg-[#FDFBF7] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
              <select
                id="select-sort-inventory"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-hidden text-xs font-medium text-[#2D2D2D] cursor-pointer"
              >
                <option value="lowest_stock">Urut: Stok Terendah</option>
                <option value="highest_stock">Urut: Stok Terbanyak</option>
                <option value="name_asc">Urut: Nama A-Z</option>
                <option value="price_desc">Urut: Harga Tertinggi</option>
                <option value="recent">Urut: Terbaru</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid / Table) */}
            <div className="flex items-center border border-[#E5E1D8] rounded p-0.5 bg-[#FDFBF7]">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-[#1B3022]' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Tampilan Grid Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-[#1B3022]' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Tampilan Tabel Audit"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D2D2D]/50 mr-1 shrink-0">
            Kategori:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1B3022] text-[#C5A059] shadow-xs'
                    : 'bg-[#F7F4EF] text-[#2D2D2D]/70 hover:bg-[#EAE7E7] hover:text-[#2D2D2D]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Grid View or Table View */}
      {filteredInventory.length === 0 ? (
        <div className="bg-white border border-[#E5E1D8] rounded-lg p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F7F4EF] text-[#C5A059] flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-base font-bold text-[#1B3022] mb-1">
            Tidak ada produk yang cocok
          </h3>
          <p className="text-xs text-[#2D2D2D]/60 max-w-md mx-auto mb-4">
            Coba ubah kata kunci pencarian atau reset filter kategori untuk melihat stok produk lainnya.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setStatusFilter('all');
            }}
            className="bg-[#1B3022] text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-[#1B3022]/90 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInventory.map((item) => {
            const isLowStock = item.stockLevel <= item.minStockLevel;
            const isOutOfStock = item.stockLevel === 0;
            const stockRatio = item.minStockLevel > 0 ? (item.stockLevel / item.minStockLevel) : 1;
            const profitMargin = item.unitPrice > 0 ? Math.round(((item.unitPrice - item.costPrice) / item.unitPrice) * 100) : 0;

            return (
              <div
                key={item.id}
                id={`product-card-${item.id}`}
                className={`bg-white border rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col ${
                  isOutOfStock
                    ? 'border-red-300'
                    : isLowStock
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-[#E5E1D8]'
                }`}
              >
                {/* Card Top: Image & Badges */}
                <div className="relative h-40 bg-[#F7F4EF] overflow-hidden group">
                  <img
                    src={item.imageUrl || imagePresets[0].url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    {isOutOfStock ? (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Habis (0)
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> Menipis ({item.stockLevel})
                      </span>
                    ) : (
                      <span className="bg-[#2D5A27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Aman ({item.stockLevel})
                      </span>
                    )}
                  </div>

                  {/* SKU Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-black/60 text-white/90 backdrop-blur-xs text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                      {item.sku}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end text-white">
                    <span className="text-[11px] font-medium text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-[#C5A059] bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-[#1B3022] text-sm leading-snug line-clamp-1" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#2D2D2D]/70 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#2D2D2D]/60 mt-2">
                      <Truck className="w-3 h-3 text-[#C5A059]" />
                      <span className="truncate">{item.supplier}</span>
                      <span>•</span>
                      <span>{item.unit}</span>
                    </div>
                  </div>

                  {/* Stock Level Bar & Threshold */}
                  <div className="bg-[#F7F4EF] p-2.5 rounded border border-[#E5E1D8]/70 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#1B3022]">
                        Sisa Stok: <strong className="text-sm font-bold">{item.stockLevel}</strong> {item.unit}
                      </span>
                      <span className="text-[11px] text-[#2D2D2D]/60">
                        Min: {item.minStockLevel} {item.unit}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOutOfStock
                            ? 'bg-red-500 w-full'
                            : isLowStock
                            ? 'bg-amber-500'
                            : 'bg-[#2D5A27]'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(10, (item.stockLevel / (item.minStockLevel * 2 || 10)) * 100))}%`
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-[#2D2D2D]/60 pt-0.5">
                      <span>Modal: Rp {item.costPrice.toLocaleString('id-ID')}</span>
                      <span className="text-[#2D5A27] font-semibold">Margin +{profitMargin}%</span>
                    </div>
                  </div>

                  {/* Card Actions: Quick Adjust & Management */}
                  <div className="pt-2 border-t border-[#E5E1D8] flex items-center justify-between gap-2">
                    {/* Quick +/- Stock Adjustment */}
                    <div className="flex items-center gap-1 bg-[#FDFBF7] border border-[#E5E1D8] rounded p-0.5">
                      <button
                        onClick={() => handleQuickAdjust(item, -1)}
                        disabled={item.stockLevel <= 0}
                        title="Kurangi stok 1 unit (Penjualan)"
                        className="p-1 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <span className="px-1.5 text-xs font-bold text-[#1B3022]">
                        {item.stockLevel}
                      </span>
                      <button
                        onClick={() => handleQuickAdjust(item, 1)}
                        title="Tambah stok 1 unit"
                        className="p-1 text-gray-600 hover:text-[#2D5A27] hover:bg-green-50 rounded transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Restock & Edit Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenAdjustModal(item)}
                        className="bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#1B3022] font-bold text-xs px-2.5 py-1.5 rounded transition-colors"
                        title="Sesuaikan atau Restock jumlah banyak"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-[#1B3022] hover:bg-[#F7F4EF] rounded border border-[#E5E1D8]"
                        title="Edit Produk"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW (FOR DENSE AUDIT) */
        <div className="bg-white border border-[#E5E1D8] rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D2D2D]">
              <thead className="bg-[#1B3022] text-[#C5A059] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Produk / SKU</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Stok Fisik</th>
                  <th className="py-3 px-4">Min. Alert</th>
                  <th className="py-3 px-4">Harga Jual</th>
                  <th className="py-3 px-4">Harga Modal</th>
                  <th className="py-3 px-4">Total Aset</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]">
                {filteredInventory.map((item) => {
                  const isLowStock = item.stockLevel <= item.minStockLevel;
                  const isOutOfStock = item.stockLevel === 0;

                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-[#FDFBF7] transition-colors ${
                        isOutOfStock ? 'bg-red-50/40' : isLowStock ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl || imagePresets[0].url}
                            alt={item.name}
                            className="w-10 h-10 rounded object-cover border border-[#E5E1D8] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#1B3022]">{item.name}</p>
                            <p className="text-[10px] text-[#2D2D2D]/60 font-mono">{item.sku} • {item.supplier}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-[#F7F4EF] text-[#2D2D2D] px-2 py-0.5 rounded text-[11px] font-medium border border-[#E5E1D8]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-sm text-[#1B3022]">
                          {item.stockLevel}
                        </span>{' '}
                        <span className="text-[11px] text-[#2D2D2D]/60">{item.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#2D2D2D]/70 font-semibold">
                        {item.minStockLevel} {item.unit}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1B3022]">
                        Rp {item.unitPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-[#2D2D2D]/70">
                        Rp {item.costPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#2D5A27]">
                        Rp {(item.stockLevel * item.unitPrice).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Habis
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Menipis
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickAdjust(item, -1)}
                            disabled={item.stockLevel <= 0}
                            title="Kurang 1"
                            className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item, 1)}
                            title="Tambah 1"
                            className="p-1 rounded hover:bg-gray-100 text-gray-600"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenAdjustModal(item)}
                            className="bg-[#1B3022] text-white px-2 py-1 rounded text-[11px] font-bold hover:bg-[#1B3022]/90"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 text-gray-600 hover:text-[#1B3022]"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* ================= MODAL: TAMBAH / EDIT PRODUK ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl border border-[#E5E1D8] max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#1B3022] text-[#C5A059] p-4 flex justify-between items-center border-b border-[#C5A059]/20">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-bold text-base text-white">
                  {editingItem ? 'Edit Informasi Produk' : 'Tambah Produk Grooming Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Product Name & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Classic Matte Pomade"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Kode SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="POM-MAT-01"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs font-mono focus:outline-hidden focus:border-[#1B3022]"
                  />
                </div>
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Kategori Produk
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                  >
                    <option value="Pomade & Clay">Pomade & Clay</option>
                    <option value="Beard & Mustache">Beard & Mustache</option>
                    <option value="Hair Care & Tonic">Hair Care & Tonic</option>
                    <option value="Shaving & Razor">Shaving & Razor</option>
                    <option value="Accessories & Tools">Accessories & Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Satuan Kemasan (Unit)
                  </label>
                  <input
                    type="text"
                    placeholder="misal: jar (100g), botol, pcs"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                  />
                </div>
              </div>

              {/* Stock Levels: Current & Minimum Threshold */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#F7F4EF] p-3 rounded border border-[#E5E1D8]">
                <div>
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Jumlah Stok Awal / Sekarang
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockLevel}
                    onChange={(e) => setFormData({ ...formData, stockLevel: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 bg-white border border-[#E5E1D8] rounded text-xs font-bold focus:outline-hidden focus:border-[#1B3022]"
                  />
                  <span className="text-[10px] text-[#2D2D2D]/60 mt-0.5 block">
                    Unit fisik yang ada saat ini
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Ambang Batas Minimum (Alert)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2 bg-white border border-amber-300 rounded text-xs font-bold text-amber-950 focus:outline-hidden focus:border-amber-600"
                  />
                  <span className="text-[10px] text-amber-800 mt-0.5 block">
                    Peringatan alert dipicu jika stok ≤ angka ini
                  </span>
                </div>
              </div>

              {/* Pricing: Sell & Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Harga Jual Retail (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    placeholder="125000"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs font-bold text-[#2D5A27] focus:outline-hidden focus:border-[#1B3022]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1B3022] mb-1">
                    Harga Modal / Beli (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="75000"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                  />
                </div>
              </div>

              {/* Supplier & Description */}
              <div>
                <label className="block font-bold text-[#1B3022] mb-1">
                  Nama Supplier / Distributor
                </label>
                <input
                  type="text"
                  placeholder="misal: PT Dapper Grooming Indonesia"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B3022] mb-1">
                  Deskripsi & Cara Pakai
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan aroma, daya hold, hasil akhir, atau petunjuk penggunaan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                />
              </div>

              {/* Image Presets Selector */}
              <div>
                <label className="block font-bold text-[#1B3022] mb-1">
                  Pilih Thumbnail Produk
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {imagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className={`relative h-14 rounded overflow-hidden border-2 transition-all ${
                        formData.imageUrl === preset.url
                          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] truncate px-1 py-0.5 text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#E5E1D8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B3022] hover:bg-[#1B3022]/90 text-[#FDFBF7] rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah ke Inventaris'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SESUAIKAN / RESTOCK STOK ================= */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-[#E5E1D8] overflow-hidden">
            <div className="bg-[#1B3022] text-[#C5A059] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-bold text-base text-white">
                  Restock / Penyesuaian Stok
                </h3>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjust} className="p-5 space-y-4 text-xs">
              {/* Product Info Summary */}
              <div className="flex items-center gap-3 bg-[#F7F4EF] p-3 rounded border border-[#E5E1D8]">
                <img
                  src={adjustingItem.imageUrl || imagePresets[0].url}
                  alt={adjustingItem.name}
                  className="w-12 h-12 rounded object-cover border border-[#E5E1D8]"
                />
                <div>
                  <p className="font-bold text-[#1B3022] text-sm">{adjustingItem.name}</p>
                  <p className="text-[11px] text-[#2D2D2D]/60 font-mono">{adjustingItem.sku}</p>
                  <p className="text-xs font-semibold text-[#2D5A27] mt-0.5">
                    Stok Saat Ini: {adjustingItem.stockLevel} {adjustingItem.unit} (Min {adjustingItem.minStockLevel})
                  </p>
                </div>
              </div>

              {/* Adjustment Type */}
              <div>
                <label className="block font-bold text-[#1B3022] mb-1">
                  Jenis Transaksi Stok
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Restock', label: 'Restock (+ Masuk)', color: 'border-green-500 bg-green-50 text-green-900' },
                    { id: 'Penjualan', label: 'Penjualan (- Keluar)', color: 'border-blue-500 bg-blue-50 text-blue-900' },
                    { id: 'Penyesuaian', label: 'Opname / Koreksi', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                    { id: 'Rusak/Kadaluarsa', label: 'Rusak / Expired (-)', color: 'border-red-500 bg-red-50 text-red-900' },
                  ].map((typeOption) => (
                    <button
                      key={typeOption.id}
                      type="button"
                      onClick={() => setAdjustFormData({ ...adjustFormData, type: typeOption.id as StockMovementType })}
                      className={`p-2.5 rounded border text-center font-bold text-xs transition-all ${
                        adjustFormData.type === typeOption.id
                          ? `${typeOption.color} ring-2 ring-offset-1`
                          : 'border-[#E5E1D8] bg-[#FDFBF7] text-[#2D2D2D]/70 hover:bg-[#F0EDED]'
                      }`}
                    >
                      {typeOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block font-bold text-[#1B3022] mb-1">
                  Jumlah Unit ({adjustingItem.unit})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjustFormData.quantity}
                    onChange={(e) => setAdjustFormData({ ...adjustFormData, quantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-base font-bold text-[#1B3022] focus:outline-hidden focus:border-[#1B3022]"
                  />
                  {/* Quick Pill presets */}
                  <div className="flex gap-1">
                    {[5, 10, 20].map((quickQty) => (
                      <button
                        key={quickQty}
                        type="button"
                        onClick={() => setAdjustFormData({ ...adjustFormData, quantity: quickQty })}
                        className="px-2 py-1.5 bg-[#F7F4EF] hover:bg-[#EAE7E7] rounded border border-[#E5E1D8] font-bold text-xs text-[#1B3022]"
                      >
                        +{quickQty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-[#1B3022] mb-1">
                  Catatan / Nomor Invoice / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="misal: No. PO-2023-99 dari supplier atau opname fisik"
                  value={adjustFormData.notes}
                  onChange={(e) => setAdjustFormData({ ...adjustFormData, notes: e.target.value })}
                  className="w-full p-2 bg-[#FDFBF7] border border-[#E5E1D8] rounded text-xs focus:outline-hidden focus:border-[#1B3022]"
                />
              </div>

              {/* Projected Result */}
              <div className="bg-[#FDFBF7] p-2.5 rounded border border-[#E5E1D8] text-[11px] flex justify-between items-center font-medium text-[#2D2D2D]">
                <span>Estimasi Stok Baru:</span>
                <span className="font-bold text-sm text-[#1B3022]">
                  {adjustFormData.type === 'Restock'
                    ? adjustingItem.stockLevel + adjustFormData.quantity
                    : Math.max(0, adjustingItem.stockLevel - adjustFormData.quantity)}{' '}
                  {adjustingItem.unit}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E5E1D8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B3022] hover:bg-[#1B3022]/90 text-[#FDFBF7] rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Konfirmasi Update Stok</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RIWAYAT AUDIT STOK ================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-[#E5E1D8] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-[#1B3022] text-[#C5A059] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="font-bold text-base text-white leading-tight">
                    Riwayat Audit Pergerakan Stok
                  </h3>
                  <p className="text-[11px] text-[#C5A059]/80">Log aktivitas restock, penjualan produk retail, dan penyesuaian opname.</p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-[#E5E1D8]/60">
              {stockMovements.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs">
                  Belum ada log pergerakan stok tercatat.
                </div>
              ) : (
                stockMovements.map((mov) => (
                  <div key={mov.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mov.type === 'Restock' 
                            ? 'bg-green-100 text-green-900 border border-green-300'
                            : mov.type === 'Penjualan'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : mov.type === 'Rusak/Kadaluarsa'
                            ? 'bg-red-100 text-red-900 border border-red-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {mov.type}
                        </span>
                        <span className="font-bold text-[#1B3022]">{mov.itemName}</span>
                      </div>
                      <p className="text-[11px] text-[#2D2D2D]/80">
                        {mov.notes}
                      </p>
                      <p className="text-[10px] text-[#2D2D2D]/50 font-medium">
                        Waktu: {mov.date} • Operator: {mov.performedBy}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-sm font-bold ${
                        mov.quantity > 0 ? 'text-[#2D5A27]' : 'text-rose-700'
                      }`}>
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} unit
                      </span>
                      <p className="text-[10px] text-[#2D2D2D]/60 mt-0.5">
                        {mov.previousStock} ➔ <strong>{mov.newStock}</strong>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#FDFBF7] border-t border-[#E5E1D8] flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-1.5 bg-[#1B3022] text-white rounded text-xs font-bold uppercase tracking-wider"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI HAPUS ================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl border border-[#E5E1D8] p-5 text-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#1B3022]">
              Hapus Produk dari Inventaris?
            </h3>
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirmItem.name}</strong> ({deleteConfirmItem.sku})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await deleteInventoryItem(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold"
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
