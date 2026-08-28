import { 
  ServiceItem, 
  BarberStaff, 
  QueueTicket, 
  ChairStation, 
  Reservation, 
  Transaction, 
  CustomerFeedback, 
  ShopSettings,
  InventoryItem,
  StockMovement
} from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: "Gentleman's Cut",
    category: 'Haircut',
    price: 75000,
    durationMinutes: 45,
    description: 'Potongan rambut klasik dengan pijat kepala ringan dan penataan akhir pomade.',
    popular: true
  },
  {
    id: 'srv-2',
    name: 'Beard Trim & Line-up',
    category: 'Shave & Beard',
    price: 50000,
    durationMinutes: 30,
    description: 'Rapikan brewok dan kumis dengan handuk hangat dan presisi silet.',
    popular: false
  },
  {
    id: 'srv-3',
    name: 'Full Package (Hair & Beard)',
    category: 'Package',
    price: 115000,
    durationMinutes: 75,
    description: 'Paket lengkap potongan rambut dan perawatan brewok untuk tampilan maksimal.',
    popular: true
  },
  {
    id: 'srv-4',
    name: 'Premium Haircut & Wash',
    category: 'Haircut',
    price: 95000,
    durationMinutes: 50,
    description: 'Potongan rambut eksklusif dengan cuci rambut tonik herbal dan pijat relaksasi.',
    popular: true
  },
  {
    id: 'srv-5',
    name: 'Classic Cut',
    category: 'Haircut',
    price: 60000,
    durationMinutes: 35,
    description: 'Potongan rambut reguler standar barbershop dengan styling.',
    popular: false
  },
  {
    id: 'srv-6',
    name: 'Hot Towel Shave',
    category: 'Shave & Beard',
    price: 45000,
    durationMinutes: 25,
    description: 'Cukur bersih tradisional dengan busa hangat dan pisau silet tajam presisi.',
    popular: false
  },
  {
    id: 'srv-7',
    name: 'Kids Haircut',
    category: 'Kids',
    price: 50000,
    durationMinutes: 30,
    description: 'Potongan rambut ramah anak dengan pendekatan sabar dan rapi.',
    popular: false
  },
  {
    id: 'srv-8',
    name: 'Hair Coloring & Highlight',
    category: 'Coloring',
    price: 180000,
    durationMinutes: 90,
    description: 'Pewarnaan rambut profesional premium dengan perlindungan vitamin.',
    popular: false
  }
];

export const INITIAL_BARBERS: BarberStaff[] = [
  {
    id: 'barber-1',
    name: 'Budi Santoso',
    role: 'Senior Barber',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXGIVq_rb1pgrYmcLm6w4sZhkqoJK8Y6_xc9kh_fLIa0Szc6dotmOTpPnBx8ynv4Mm6tAdjvp3-vjx70KJibE0yZ1vBYj9b8HMtejdBoiH_ZpE3chKH42RU0tAiJLC8tfHLiMfqMMWykmeotDJlO5JWHcooYXvl5GSWOhQp7DIgF7bwiDPVWpZxlVDmCTs86QQjAll4IT9-aIhd_LSKENz0D4oa-y2SQL3wqFW69j5jM77BBZr09VGQQ',
    assignedChair: 1,
    rating: 4.9,
    completedToday: 8,
    status: 'Aktif',
    specialties: ['Classic Cut', 'Fade Master', 'Gentleman Cut']
  },
  {
    id: 'barber-2',
    name: 'Andi Saputra',
    role: 'Barber Stylist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQqmFRCzFEoTxFhgplM77e3ZIXrktJy5M6Hv5ku0nxooYvSh3zVjQJbk51MBX1uHdeZIB5luGP_H1-nza77zIRgQjz5Ih2IGXUOvqRtHIeI2dpzGu-ncDdKF8-CvkP0jZpIJ62ON944rrl95oQjbGm185ChsRTE2Vf9zPD3GB-b2D1mnZMX_LXPoLUc7GfiHlo2a975TFlNI3yV-eBc1j6WzS8Z8vdufNWAnr_KoLIUK74hCzyuunmtA',
    assignedChair: 2,
    rating: 4.7,
    completedToday: 6,
    status: 'Aktif',
    specialties: ['Coloring', 'Beard Styling', 'Modern Crop']
  },
  {
    id: 'barber-3',
    name: 'Ahmad Rifai',
    role: 'Master Barber',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rj9SQbWi2xzt4KKQBm5WtlnRoYaOsIuDOzTfwHkQYFKc3ZWBMErwJMKW6_ahHnuXzZzvNIfdl_zc0GP6_3B4ey7xplMUKwm9zInU9hmFnYkhxMKay0PPorIVOzmbs4kepzxZvhObX1BT0uqJNDfea2WhjcncoRRFzzgENh5CdjEKiFS7ZSsjen25BF4kYtKh2Z8JofxZicamc3A8R0jyPK-lHs9BDWmoVDS748KXhC9e_10pSvPjbA',
    assignedChair: 3,
    rating: 5.0,
    completedToday: 9,
    status: 'Aktif',
    specialties: ['Heritage Hot Shave', 'Pompadour', 'Scissor Work']
  },
  {
    id: 'barber-4',
    name: 'Anton',
    role: 'Barber',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedChair: 4,
    rating: 4.8,
    completedToday: 7,
    status: 'Aktif',
    specialties: ['Skin Fade', 'Taper', 'Hair Tattoo']
  },
  {
    id: 'barber-5',
    name: 'Mas Dimas',
    role: 'Senior Barber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedChair: 5,
    rating: 4.9,
    completedToday: 8,
    status: 'Aktif',
    specialties: ['Gentleman Cut', 'Beard Trim']
  },
  {
    id: 'barber-6',
    name: 'Bang Joko',
    role: 'Traditional Shave Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    completedToday: 5,
    status: 'Aktif',
    specialties: ['Hot Towel Shave', 'Kids Haircut']
  }
];

export const INITIAL_QUEUES: QueueTicket[] = [
  {
    id: 'q-1',
    ticketNumber: 'A-042',
    customerName: 'Pak Anton',
    customerPhone: '+62 812-3344-5566',
    customerType: 'VIP',
    serviceId: 'srv-4',
    serviceName: 'Premium Haircut & Wash',
    servicePrice: 95000,
    serviceDuration: 50,
    barberId: 'barber-1',
    barberName: 'Budi Santoso',
    chairNumber: 1,
    status: 'Proses',
    waitingTimeMinutes: 0,
    estimatedTime: 'Selesai 10m',
    startTime: '10:15 WIB (15 mnt berlalu)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-2',
    ticketNumber: 'B-012',
    customerName: 'Reza',
    customerPhone: '+62 813-8899-0011',
    customerType: 'Reguler',
    serviceId: 'srv-8',
    serviceName: 'Hair Coloring',
    servicePrice: 180000,
    serviceDuration: 45,
    barberId: 'barber-2',
    barberName: 'Andi Saputra',
    chairNumber: 2,
    status: 'Proses',
    waitingTimeMinutes: 0,
    estimatedTime: 'Selesai 25m',
    startTime: '09:30 WIB (55 mnt berlalu)',
    isOvertime: true,
    overtimeMinutes: 10,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-3',
    ticketNumber: 'A-045',
    customerName: 'Dimas',
    customerPhone: '+62 819-1234-5678',
    customerType: 'Reguler',
    serviceId: 'srv-5',
    serviceName: 'Classic Cut',
    servicePrice: 60000,
    serviceDuration: 35,
    barberId: 'barber-1',
    barberName: 'Budi Santoso',
    chairNumber: 1,
    status: 'Tunggu',
    waitingTimeMinutes: 15,
    estimatedTime: 'Est. 10:45',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-4',
    ticketNumber: 'A-048',
    customerName: 'Rizky',
    customerPhone: '+62 856-7890-1234',
    customerType: 'Reguler',
    serviceId: 'srv-3',
    serviceName: 'Hair & Beard',
    servicePrice: 115000,
    serviceDuration: 60,
    barberId: 'barber-1',
    barberName: 'Budi Santoso',
    chairNumber: 1,
    status: 'Tunggu',
    waitingTimeMinutes: 45,
    estimatedTime: 'Est. 11:15',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-5',
    ticketNumber: 'B-013',
    customerName: 'Fajar',
    customerPhone: '+62 878-9988-7766',
    customerType: 'Reguler',
    serviceId: 'srv-7',
    serviceName: 'Kids Cut',
    servicePrice: 50000,
    serviceDuration: 30,
    barberId: 'barber-2',
    barberName: 'Andi Saputra',
    chairNumber: 2,
    status: 'Tunggu',
    waitingTimeMinutes: 20,
    estimatedTime: 'Est. 10:35',
    isOvertime: true,
    overtimeMinutes: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-6',
    ticketNumber: 'W-091',
    customerName: 'Tamu (Walk-in)',
    customerPhone: '+62 811-2233-4455',
    customerType: 'Walk-in',
    serviceId: 'srv-5',
    serviceName: 'Basic Cut',
    servicePrice: 60000,
    serviceDuration: 30,
    status: 'Tiba',
    waitingTimeMinutes: 12,
    estimatedTime: 'Est. 11:30',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-7',
    ticketNumber: 'W-092',
    customerName: 'Hendro (Booking App)',
    customerPhone: '+62 815-6677-8899',
    customerType: 'Booking App',
    serviceId: 'srv-6',
    serviceName: 'Shave',
    servicePrice: 45000,
    serviceDuration: 25,
    status: 'Tiba',
    waitingTimeMinutes: 8,
    estimatedTime: 'Est. 11:45',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-8',
    ticketNumber: 'W-093',
    customerName: 'Andi Setiawan',
    customerPhone: '+62 821-4455-6677',
    customerType: 'Reguler',
    serviceId: 'srv-1',
    serviceName: "Gentleman's Cut",
    servicePrice: 75000,
    serviceDuration: 45,
    status: 'Tiba',
    waitingTimeMinutes: 12,
    estimatedTime: 'Est. 12:00',
    createdAt: new Date().toISOString()
  },
  {
    id: 'q-9',
    ticketNumber: 'W-094',
    customerName: 'Reza Pahlevi',
    customerPhone: '+62 812-9900-1122',
    customerType: 'VIP',
    serviceId: 'srv-4',
    serviceName: 'Premium Haircut & Wash',
    servicePrice: 95000,
    serviceDuration: 50,
    status: 'Tiba',
    waitingTimeMinutes: 8,
    estimatedTime: 'Est. 12:15',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CHAIRS: ChairStation[] = [
  {
    chairNumber: 1,
    barberId: 'barber-1',
    barberName: 'Budi Santoso',
    barberRole: 'Senior Barber',
    status: 'Proses',
    currentTicketId: 'q-1',
    currentTicketNumber: 'A-042',
    currentCustomer: 'Pak Anton',
    currentService: 'Premium Cut',
    serviceDurationMinutes: 50,
    elapsedMinutes: 15,
    startedAt: '10:15 WIB (15 mnt berlalu)',
    isOvertime: false,
    nextTickets: [
      {
        id: 'q-3',
        ticketNumber: 'A-045',
        customerName: 'Dimas',
        customerType: 'Reguler',
        serviceId: 'srv-5',
        serviceName: 'Classic Cut',
        servicePrice: 60000,
        serviceDuration: 35,
        status: 'Tunggu',
        waitingTimeMinutes: 15,
        estimatedTime: 'Est. 10:45',
        createdAt: new Date().toISOString()
      },
      {
        id: 'q-4',
        ticketNumber: 'A-048',
        customerName: 'Rizky',
        customerType: 'Reguler',
        serviceId: 'srv-3',
        serviceName: 'Hair & Beard',
        servicePrice: 115000,
        serviceDuration: 60,
        status: 'Tunggu',
        waitingTimeMinutes: 45,
        estimatedTime: 'Est. 11:15',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    chairNumber: 2,
    barberId: 'barber-2',
    barberName: 'Andi Saputra',
    barberRole: 'Barber',
    status: 'Overtime',
    currentTicketId: 'q-2',
    currentTicketNumber: 'B-012',
    currentCustomer: 'Reza',
    currentService: 'Coloring',
    serviceDurationMinutes: 45,
    elapsedMinutes: 55,
    startedAt: '09:30 WIB (55 mnt berlalu)',
    isOvertime: true,
    overtimeMinutes: 10,
    nextTickets: [
      {
        id: 'q-5',
        ticketNumber: 'B-013',
        customerName: 'Fajar',
        customerType: 'Reguler',
        serviceId: 'srv-7',
        serviceName: 'Kids Cut',
        servicePrice: 50000,
        serviceDuration: 30,
        status: 'Tunggu',
        waitingTimeMinutes: 20,
        estimatedTime: 'Est. 10:35',
        isOvertime: true,
        overtimeMinutes: 20,
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    chairNumber: 3,
    barberId: 'barber-3',
    barberName: 'Ahmad Rifai',
    barberRole: 'Master Barber',
    status: 'Tersedia',
    nextTickets: []
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    customerName: 'Andi Wijaya',
    customerPhone: '+62 812-3456-7890',
    customerCategory: 'Regular',
    serviceName: 'Premium Haircut',
    servicePrice: 95000,
    serviceDuration: 50,
    barberName: 'Mas Dimas',
    date: '2023-10-11',
    time: '10:00',
    status: 'Tunggu',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-2',
    customerName: 'Reza Rahardian',
    customerPhone: '+62 818-0911-2233',
    customerCategory: 'Member - Gold',
    serviceName: 'Haircut & Beard Trim',
    servicePrice: 115000,
    serviceDuration: 60,
    barberName: 'Mas Dimas',
    date: '2023-10-11',
    time: '11:30',
    status: 'Dikonfirmasi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-3',
    customerName: 'Doni Setiawan',
    customerPhone: '+62 813-7766-5544',
    customerCategory: 'Walk-in',
    serviceName: 'Kids Haircut',
    servicePrice: 50000,
    serviceDuration: 30,
    barberName: 'Bang Joko',
    date: '2023-10-11',
    time: '13:00',
    status: 'Dibatalkan',
    notes: 'Dibatalkan user via WhatsApp',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-4',
    customerName: 'Fauzi Rahman',
    customerPhone: '+62 822-4455-6677',
    customerCategory: 'Online Booking',
    serviceName: 'Hot Towel Shave',
    servicePrice: 45000,
    serviceDuration: 25,
    barberName: 'Bang Joko',
    date: '2023-10-11',
    time: '14:15',
    status: 'Diminta',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-5',
    customerName: 'Bpk. Adityawarman',
    customerPhone: '+62 811-1234-5678',
    customerCategory: 'Executive VIP',
    serviceName: 'Premium Haircut & Wash',
    servicePrice: 95000,
    serviceDuration: 50,
    barberName: 'Hendra',
    date: '2023-10-11',
    time: '14:00',
    status: 'Proses',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-6',
    customerName: 'Sdr. Reza',
    customerPhone: '+62 812-7788-9900',
    customerCategory: 'Regular',
    serviceName: 'Classic Cut',
    servicePrice: 60000,
    serviceDuration: 35,
    barberName: 'Budi',
    date: '2023-10-11',
    time: '14:45',
    status: 'Tunggu',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-7',
    customerName: 'Bpk. Surya',
    customerPhone: '+62 815-3344-5566',
    customerCategory: 'Member - Silver',
    serviceName: 'Haircut & Beard Trim',
    servicePrice: 115000,
    serviceDuration: 60,
    barberName: 'Anton',
    date: '2023-10-11',
    time: '15:30',
    status: 'Tunggu',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    customerName: 'Bpk. Hendra Gunawan',
    serviceName: 'Full Package (Hair & Beard)',
    barberName: 'Ahmad Rifai',
    amount: 115000,
    paymentMethod: 'QRIS',
    date: '2023-10-11',
    time: '09:15 WIB',
    rating: 5
  },
  {
    id: 'tx-102',
    customerName: 'Sdr. Kevin Wijaya',
    serviceName: "Gentleman's Cut",
    barberName: 'Budi Santoso',
    amount: 75000,
    paymentMethod: 'Tunai',
    date: '2023-10-11',
    time: '10:00 WIB',
    rating: 5
  },
  {
    id: 'tx-103',
    customerName: 'Bpk. Prasetyo',
    serviceName: 'Premium Haircut & Wash',
    barberName: 'Mas Dimas',
    amount: 95000,
    paymentMethod: 'Debit/Kredit',
    date: '2023-10-11',
    time: '10:45 WIB',
    rating: 4
  },
  {
    id: 'tx-104',
    customerName: 'Sdr. Daniel Saputra',
    serviceName: 'Hair Coloring & Highlight',
    barberName: 'Andi Saputra',
    amount: 180000,
    paymentMethod: 'QRIS',
    date: '2023-10-11',
    time: '11:30 WIB',
    rating: 5
  },
  {
    id: 'tx-105',
    customerName: 'Ananda Bagas',
    serviceName: 'Kids Haircut',
    barberName: 'Bang Joko',
    amount: 50000,
    paymentMethod: 'Tunai',
    date: '2023-10-11',
    time: '12:15 WIB',
    rating: 5
  }
];

export const INITIAL_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'fb-1',
    customerName: 'Bpk. Hendra Gunawan',
    barberName: 'Ahmad Rifai',
    serviceName: 'Full Package',
    rating: 5,
    comment: 'Pelayanan sangat memuaskan, teknik cukur silet dan handuk hangatnya luar biasa rileks!',
    source: 'Google Forms',
    formSubmissionId: 'GF-90812',
    createdAt: '2023-10-11 09:30'
  },
  {
    id: 'fb-2',
    customerName: 'Sdr. Kevin Wijaya',
    barberName: 'Budi Santoso',
    serviceName: "Gentleman's Cut",
    rating: 5,
    comment: 'Potongan sangat presisi dan rapi sesuai bentuk wajah. Rekomendasi banget.',
    source: 'Google Forms',
    formSubmissionId: 'GF-90813',
    createdAt: '2023-10-11 10:15'
  },
  {
    id: 'fb-3',
    customerName: 'Sdr. Farhan',
    barberName: 'Andi Saputra',
    serviceName: 'Hair Coloring',
    rating: 4.5,
    comment: 'Warna ash grey keluar sempurna tanpa bikin rambut kering.',
    source: 'Google Forms',
    formSubmissionId: 'GF-90814',
    createdAt: '2023-10-10 16:40'
  }
];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'Barbershop Manager',
  branchName: 'Cabang Pusat',
  isOpen: true,
  openTime: '09:00',
  closeTime: '21:00',
  chairCount: 5,
  dailyRevenueTarget: 3000000,
  googleForms: {
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc7z89_barber_survey/viewform',
    formTitle: 'Survei Kepuasan Pelanggan Barbershop',
    embedHtml: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc7z89_barber_survey/viewform?embedded=true" width="100%" height="520" frameborder="0" marginheight="0" marginwidth="0">Memuat…</iframe>',
    lastSyncedAt: 'Hari ini, 14:30 WIB',
    autoSync: true
  }
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Classic Matte Pomade (Water-Based)',
    sku: 'POM-MAT-01',
    category: 'Pomade & Clay',
    stockLevel: 14,
    minStockLevel: 10,
    unitPrice: 125000,
    costPrice: 75000,
    unit: 'jar (100g)',
    supplier: 'PT Dapper Grooming Indonesia',
    lastRestocked: '2023-10-05',
    description: 'Pomade water-based dengan daya rekat tinggi (heavy hold) dan hasil akhir matte natural tanpa kilau berlebih. Mudah dibilas air.',
    imageUrl: 'https://images.unsplash.com/photo-1597854710119-a5a84396ee76?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-01T08:00:00.000Z'
  },
  {
    id: 'inv-2',
    name: 'Moroccan Argan Beard Oil (Cedar & Bergamot)',
    sku: 'BRD-OIL-02',
    category: 'Beard & Mustache',
    stockLevel: 3, // LOW STOCK ALERT!
    minStockLevel: 8,
    unitPrice: 145000,
    costPrice: 85000,
    unit: 'botol pipet (30ml)',
    supplier: 'Sultan Beard Co.',
    lastRestocked: '2023-09-28',
    description: 'Minyak perawatan jenggot premium dengan organic Argan Oil & Jojoba. Melembutkan kumis brewok, mencegah gatal dan ketombe jenggot.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-01T08:00:00.000Z'
  },
  {
    id: 'inv-3',
    name: 'Sandalwood & Menthol Aftershave Tonic',
    sku: 'SHV-TNC-03',
    category: 'Hair Care & Tonic',
    stockLevel: 4, // LOW STOCK ALERT!
    minStockLevel: 6,
    unitPrice: 95000,
    costPrice: 55000,
    unit: 'botol spray (150ml)',
    supplier: 'Heritage Barber Supplies',
    lastRestocked: '2023-10-01',
    description: 'Tonik penyejuk kulit pasca cukur dengan sensasi dingin menthol dan keharuman kayu cendana elegan. Menutup pori dan mencegah iritasi.',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-543160a0f288?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-05T08:00:00.000Z'
  },
  {
    id: 'inv-4',
    name: 'Sea Salt Texture Spray (Volume & Waves)',
    sku: 'STY-SLT-04',
    category: 'Hair Care & Tonic',
    stockLevel: 18,
    minStockLevel: 10,
    unitPrice: 110000,
    costPrice: 65000,
    unit: 'botol spray (200ml)',
    supplier: 'PT Dapper Grooming Indonesia',
    lastRestocked: '2023-10-08',
    description: 'Pre-styling spray dengan garam mineral laut alami untuk memberikan volume instan, tekstur bergelombang, dan daya cengkram ringan.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-10T08:00:00.000Z'
  },
  {
    id: 'inv-5',
    name: 'Activated Charcoal Deep Cleanse Shampoo',
    sku: 'SHP-CHR-05',
    category: 'Hair Care & Tonic',
    stockLevel: 2, // LOW STOCK ALERT!
    minStockLevel: 6,
    unitPrice: 135000,
    costPrice: 80000,
    unit: 'botol pump (250ml)',
    supplier: 'Botanical Grooming Lab',
    lastRestocked: '2023-09-20',
    description: 'Shampo detoksifikasi arang aktif bambu untuk membersihkan residu pomade, minyak berlebih, dan kotoran kulit kepala secara menyeluruh.',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-12T08:00:00.000Z'
  },
  {
    id: 'inv-6',
    name: 'High Shine Oil-Based Heritage Pomade',
    sku: 'POM-OIL-06',
    category: 'Pomade & Clay',
    stockLevel: 22,
    minStockLevel: 10,
    unitPrice: 130000,
    costPrice: 78000,
    unit: 'tin can (100g)',
    supplier: 'Heritage Barber Supplies',
    lastRestocked: '2023-10-09',
    description: 'Pomade minyak tradisional bergaya vintage untuk tatanan rambut pompadour dan slick back klasik dengan kilau berkilau tahan seharian.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-15T08:00:00.000Z'
  },
  {
    id: 'inv-7',
    name: 'Aloe Vera & Tea Tree Clear Shaving Gel',
    sku: 'SHV-GEL-07',
    category: 'Shaving & Razor',
    stockLevel: 1, // CRITICAL LOW STOCK ALERT!
    minStockLevel: 6,
    unitPrice: 85000,
    costPrice: 48000,
    unit: 'tube (150ml)',
    supplier: 'PT Barbersupply Nusantara',
    lastRestocked: '2023-09-15',
    description: 'Gel cukur transparan tanpa busa yang memudahkan melihat garis cukur kumis dan jenggot dengan presisi tinggi tanpa resiko luka gores.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-18T08:00:00.000Z'
  },
  {
    id: 'inv-8',
    name: 'Cedarwood Beard Balm & Conditioner',
    sku: 'BRD-BLM-08',
    category: 'Beard & Mustache',
    stockLevel: 11,
    minStockLevel: 8,
    unitPrice: 120000,
    costPrice: 70000,
    unit: 'tin jar (60g)',
    supplier: 'Sultan Beard Co.',
    lastRestocked: '2023-10-07',
    description: 'Balsam pelembab brewok dengan lilin lebah (beeswax) dan shea butter untuk merapikan helai brewok yang liar serta menjaga kelembapan.',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-543160a0f288?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-22T08:00:00.000Z'
  },
  {
    id: 'inv-9',
    name: 'Platinum Double Edge Razor Blades (Box of 100)',
    sku: 'TL-BLD-09',
    category: 'Shaving & Razor',
    stockLevel: 9,
    minStockLevel: 5,
    unitPrice: 175000,
    costPrice: 110000,
    unit: 'box (100 pcs)',
    supplier: 'PT Barbersupply Nusantara',
    lastRestocked: '2023-10-04',
    description: 'Silet stainless steel berlapis platinum kualitas salon profesional untuk silet cukur lipat (straight razor). Tajam, steril, tahan karat.',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-25T08:00:00.000Z'
  },
  {
    id: 'inv-10',
    name: 'Handcrafted Sandalwood Pocket Comb',
    sku: 'TL-CMB-10',
    category: 'Accessories & Tools',
    stockLevel: 25,
    minStockLevel: 10,
    unitPrice: 65000,
    costPrice: 35000,
    unit: 'pcs',
    supplier: 'Heritage Barber Supplies',
    lastRestocked: '2023-10-09',
    description: 'Sisir saku kayu cendana alami anti-statis. Lembut di kulit kepala dan tidak merusak helai rambut atau jenggot saat penataan.',
    imageUrl: 'https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?w=300&auto=format&fit=crop&q=80',
    createdAt: '2023-09-28T08:00:00.000Z'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    itemId: 'inv-1',
    itemName: 'Classic Matte Pomade (Water-Based)',
    type: 'Penjualan',
    quantity: -1,
    previousStock: 15,
    newStock: 14,
    date: '11 Okt 2023, 10:15 WIB',
    notes: 'Terjual ke pelanggan Pak Anton saat checkout layanan Premium Haircut',
    performedBy: 'Kasir Budi'
  },
  {
    id: 'mov-2',
    itemId: 'inv-2',
    itemName: 'Moroccan Argan Beard Oil (Cedar & Bergamot)',
    type: 'Penjualan',
    quantity: -2,
    previousStock: 5,
    newStock: 3,
    date: '10 Okt 2023, 17:30 WIB',
    notes: 'Terjual retail 2 botol ke member VIP',
    performedBy: 'Admin Ahmad'
  },
  {
    id: 'inv-3',
    itemId: 'inv-3',
    itemName: 'Sandalwood & Menthol Aftershave Tonic',
    type: 'Penyesuaian',
    quantity: -1,
    previousStock: 5,
    newStock: 4,
    date: '10 Okt 2023, 14:00 WIB',
    notes: 'Dipindahkan 1 botol ke Stasiun Kursi 3 untuk pemakaian operasional barber',
    performedBy: 'Master Barber Ahmad Rifai'
  },
  {
    id: 'mov-4',
    itemId: 'inv-4',
    itemName: 'Sea Salt Texture Spray (Volume & Waves)',
    type: 'Restock',
    quantity: 10,
    previousStock: 8,
    newStock: 18,
    date: '08 Okt 2023, 11:00 WIB',
    notes: 'Penerimaan PO #PO-2023-88 dari PT Dapper Grooming Indonesia',
    performedBy: 'Admin Ahmad'
  },
  {
    id: 'mov-5',
    itemId: 'inv-7',
    itemName: 'Aloe Vera & Tea Tree Clear Shaving Gel',
    type: 'Penjualan',
    quantity: -2,
    previousStock: 3,
    newStock: 1,
    date: '09 Okt 2023, 16:45 WIB',
    notes: 'Stok menipis kritis! Perlu segera lakukan PO reorder ke supplier',
    performedBy: 'Kasir Andi'
  }
];
