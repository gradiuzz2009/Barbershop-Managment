export type QueueStatus = 'Tiba' | 'Tunggu' | 'Proses' | 'Selesai' | 'Batal';
export type ReservationStatus = 'Diminta' | 'Dikonfirmasi' | 'Tunggu' | 'Proses' | 'Selesai' | 'Dibatalkan';
export type ChairStatus = 'Tersedia' | 'Proses' | 'Overtime' | 'Istirahat';
export type CustomerType = 'Walk-in' | 'Booking App' | 'VIP' | 'Reguler';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
}

export interface BarberStaff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  assignedChair?: number;
  rating: number;
  completedToday: number;
  status: 'Aktif' | 'Istirahat' | 'Cuti';
  specialties: string[];
}

export interface QueueTicket {
  id: string;
  ticketNumber: string; // e.g. "A-042", "B-012", "W-091"
  customerName: string;
  customerPhone?: string;
  customerType: CustomerType;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberId?: string;
  barberName?: string;
  chairNumber?: number;
  status: QueueStatus;
  waitingTimeMinutes: number;
  estimatedTime: string;
  startTime?: string;
  isOvertime?: boolean;
  overtimeMinutes?: number;
  createdAt: string;
  notes?: string;
}

export interface ChairStation {
  chairNumber: number;
  barberId: string;
  barberName: string;
  barberRole: string;
  status: ChairStatus;
  currentTicketId?: string;
  currentTicketNumber?: string;
  currentCustomer?: string;
  currentService?: string;
  serviceDurationMinutes?: number;
  elapsedMinutes?: number;
  startedAt?: string;
  isOvertime?: boolean;
  overtimeMinutes?: number;
  nextTickets: QueueTicket[];
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCategory?: string; // e.g., "Member - Gold", "Online Booking"
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  ticketId?: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  amount: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit/Kredit' | 'Transfer';
  date: string;
  time: string;
  rating?: number;
  notes?: string;
}

export interface CustomerFeedback {
  id: string;
  customerName: string;
  barberName: string;
  serviceName: string;
  rating: number; // 1-5
  comment: string;
  source: 'Google Forms' | 'Kiosk' | 'In-App';
  formSubmissionId?: string;
  createdAt: string;
}

export interface GoogleFormConfig {
  formUrl: string;
  formTitle: string;
  embedHtml?: string;
  lastSyncedAt?: string;
  autoSync: boolean;
}

export type InventoryCategory = 
  | 'Pomade & Clay' 
  | 'Beard & Mustache' 
  | 'Hair Care & Tonic' 
  | 'Shaving & Razor' 
  | 'Accessories & Tools';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string; // e.g. "POM-MAT-01"
  category: InventoryCategory;
  stockLevel: number;
  minStockLevel: number;
  unitPrice: number; // Harga Jual e.g. 120000
  costPrice: number; // Harga Modal e.g. 75000
  unit: string; // "jar", "botol", "pcs", "tube", "box"
  supplier: string; // e.g. "PT Barbersupply Nusantara"
  lastRestocked: string; // e.g. "2023-10-08"
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export type StockMovementType = 'Restock' | 'Penjualan' | 'Penyesuaian' | 'Rusak/Kadaluarsa';

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: StockMovementType;
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  date: string; // e.g. "11 Okt 2023 10:30 WIB"
  notes?: string;
  performedBy: string; // e.g. "Admin Ahmad"
}

export interface ShopSettings {
  shopName: string;
  branchName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  chairCount: number;
  dailyRevenueTarget: number;
  googleForms: GoogleFormConfig;
}
