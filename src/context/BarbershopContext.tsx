import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  QueueTicket, 
  ChairStation, 
  Reservation, 
  Transaction, 
  CustomerFeedback, 
  ServiceItem, 
  BarberStaff, 
  ShopSettings,
  QueueStatus,
  ReservationStatus,
  InventoryItem,
  StockMovement,
  StockMovementType
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_BARBERS, 
  INITIAL_QUEUES, 
  INITIAL_CHAIRS, 
  INITIAL_RESERVATIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_FEEDBACK, 
  INITIAL_SETTINGS,
  INITIAL_INVENTORY,
  INITIAL_STOCK_MOVEMENTS
} from '../data/initialData';
import { db, auth, googleProvider, collection, doc, setDoc, onSnapshot, User, signInWithPopup, signOut, onAuthStateChanged } from '../firebase';

interface BarbershopContextType {
  // Data
  services: ServiceItem[];
  barbers: BarberStaff[];
  queues: QueueTicket[];
  chairs: ChairStation[];
  reservations: Reservation[];
  transactions: Transaction[];
  feedbacks: CustomerFeedback[];
  settings: ShopSettings;
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  lowStockItems: InventoryItem[];
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  activeView: 'dashboard' | 'antrean' | 'reservasi' | 'keuangan' | 'laporan' | 'kios' | 'pengaturan' | 'inventaris';
  setActiveView: (view: 'dashboard' | 'antrean' | 'reservasi' | 'keuangan' | 'laporan' | 'kios' | 'pengaturan' | 'inventaris') => void;

  // Active Modals & Dialogs
  isCheckInModalOpen: boolean;
  setIsCheckInModalOpen: (open: boolean) => void;
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;
  isLateModalOpen: boolean;
  setIsLateModalOpen: (open: boolean) => void;
  isGoogleFormsModalOpen: boolean;
  setIsGoogleFormsModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  activePaymentItem: { ticket?: QueueTicket; chair?: ChairStation; amount: number; name: string; service: string; barber: string } | null;
  setActivePaymentItem: (item: any) => void;

  // Actions
  addQueueTicket: (ticket: Omit<QueueTicket, 'id' | 'createdAt'>) => Promise<string>;
  allocateToChair: (ticketId: string, chairNumber: number) => Promise<void>;
  completeService: (chairNumber: number, paymentMethod: 'Tunai' | 'QRIS' | 'Debit/Kredit' | 'Transfer', rating?: number) => Promise<void>;
  createReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<string>;
  updateReservationStatus: (reservationId: string, status: ReservationStatus, notes?: string) => Promise<void>;
  deleteReservation: (reservationId: string) => Promise<void>;
  applyAutoSuggestLate: (chairNumber: number, addedMinutes: number) => Promise<void>;
  addFeedback: (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>) => Promise<void>;
  updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
  toggleShopStatus: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  callNextInQueue: () => Promise<void>;

  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => Promise<string>;
  updateInventoryItem: (itemId: string, item: Partial<InventoryItem>) => Promise<void>;
  adjustStock: (itemId: string, changeQty: number, type: StockMovementType, notes?: string) => Promise<void>;
  deleteInventoryItem: (itemId: string) => Promise<void>;
}

const BarbershopContext = createContext<BarbershopContextType | undefined>(undefined);

export const BarbershopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'antrean' | 'reservasi' | 'keuangan' | 'laporan' | 'kios' | 'pengaturan' | 'inventaris'>('dashboard');
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [barbers, setBarbers] = useState<BarberStaff[]>(INITIAL_BARBERS);
  const [queues, setQueues] = useState<QueueTicket[]>(() => {
    const saved = localStorage.getItem('bm_queues');
    return saved ? JSON.parse(saved) : INITIAL_QUEUES;
  });
  const [chairs, setChairs] = useState<ChairStation[]>(() => {
    const saved = localStorage.getItem('bm_chairs');
    return saved ? JSON.parse(saved) : INITIAL_CHAIRS;
  });
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('bm_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(() => {
    const saved = localStorage.getItem('bm_feedbacks');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('bm_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('bm_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('bm_stock_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Compute low stock items
  const lowStockItems = inventory.filter((item) => item.stockLevel <= item.minStockLevel);

  // Modals state
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLateModalOpen, setIsLateModalOpen] = useState(false);
  const [isGoogleFormsModalOpen, setIsGoogleFormsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentItem, setActivePaymentItem] = useState<{ ticket?: QueueTicket; chair?: ChairStation; amount: number; name: string; service: string; barber: string } | null>(null);

  // Listen to Auth State
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    } catch {
      // Offline fallback
    }
  }, []);

  // Listen to Firestore real-time collections (with fallback to local storage)
  useEffect(() => {
    try {
      const unsubQueues = onSnapshot(collection(db, 'queues'), (snapshot) => {
        if (!snapshot.empty) {
          const list: QueueTicket[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as QueueTicket));
          setQueues(list);
          localStorage.setItem('bm_queues', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore queues listener offline, using local state:', err);
      });

      const unsubReservations = onSnapshot(collection(db, 'reservations'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Reservation[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as Reservation));
          setReservations(list);
          localStorage.setItem('bm_reservations', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore reservations listener offline, using local state:', err);
      });

      const unsubChairs = onSnapshot(collection(db, 'chairs'), (snapshot) => {
        if (!snapshot.empty) {
          const list: ChairStation[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as ChairStation));
          setChairs(list);
          localStorage.setItem('bm_chairs', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore chairs listener offline, using local state:', err);
      });

      const unsubTransactions = onSnapshot(collection(db, 'transactions'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Transaction[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as Transaction));
          setTransactions(list);
          localStorage.setItem('bm_transactions', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore transactions listener offline, using local state:', err);
      });

      const unsubFeedback = onSnapshot(collection(db, 'feedback'), (snapshot) => {
        if (!snapshot.empty) {
          const list: CustomerFeedback[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as CustomerFeedback));
          setFeedbacks(list);
          localStorage.setItem('bm_feedbacks', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore feedback listener offline, using local state:', err);
      });

      const unsubInventory = onSnapshot(collection(db, 'inventory'), (snapshot) => {
        if (!snapshot.empty) {
          const list: InventoryItem[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as InventoryItem));
          setInventory(list);
          localStorage.setItem('bm_inventory', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore inventory listener offline, using local state:', err);
      });

      const unsubMovements = onSnapshot(collection(db, 'stock_movements'), (snapshot) => {
        if (!snapshot.empty) {
          const list: StockMovement[] = [];
          snapshot.forEach((d) => list.push({ ...d.data() } as StockMovement));
          setStockMovements(list);
          localStorage.setItem('bm_stock_movements', JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore stock_movements listener offline, using local state:', err);
      });

      return () => {
        unsubQueues();
        unsubReservations();
        unsubChairs();
        unsubTransactions();
        unsubFeedback();
        unsubInventory();
        unsubMovements();
      };
    } catch {
      // Local mode
    }
  }, []);

  // Save to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('bm_queues', JSON.stringify(queues));
  }, [queues]);
  useEffect(() => {
    localStorage.setItem('bm_chairs', JSON.stringify(chairs));
  }, [chairs]);
  useEffect(() => {
    localStorage.setItem('bm_reservations', JSON.stringify(reservations));
  }, [reservations]);
  useEffect(() => {
    localStorage.setItem('bm_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('bm_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);
  useEffect(() => {
    localStorage.setItem('bm_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('bm_inventory', JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem('bm_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  // Actions
  const addQueueTicket = async (ticketData: Omit<QueueTicket, 'id' | 'createdAt'>): Promise<string> => {
    const id = `q-${Date.now()}`;
    const newTicket: QueueTicket = {
      ...ticketData,
      id,
      createdAt: new Date().toISOString()
    };

    setQueues((prev) => [newTicket, ...prev]);

    try {
      await setDoc(doc(db, 'queues', id), newTicket);
    } catch (err) {
      console.warn('Firestore write failed, stored locally:', err);
    }

    return id;
  };

  const allocateToChair = async (ticketId: string, chairNumber: number) => {
    const ticket = queues.find((q) => q.id === ticketId);
    if (!ticket) return;

    const targetChair = chairs.find((c) => c.chairNumber === chairNumber);
    if (!targetChair) return;

    // Update ticket
    const updatedQueues = queues.map((q) => {
      if (q.id === ticketId) {
        return {
          ...q,
          status: 'Proses' as QueueStatus,
          chairNumber,
          barberName: targetChair.barberName,
          barberId: targetChair.barberId,
          startTime: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB (Baru saja)`,
          waitingTimeMinutes: 0
        };
      }
      return q;
    });
    setQueues(updatedQueues);

    // Update Chair
    const updatedChairs = chairs.map((c) => {
      if (c.chairNumber === chairNumber) {
        return {
          ...c,
          status: 'Proses' as const,
          currentTicketId: ticket.id,
          currentTicketNumber: ticket.ticketNumber,
          currentCustomer: ticket.customerName,
          currentService: ticket.serviceName,
          serviceDurationMinutes: ticket.serviceDuration,
          elapsedMinutes: 0,
          startedAt: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
          isOvertime: false
        };
      }
      return c;
    });
    setChairs(updatedChairs);

    try {
      await setDoc(doc(db, 'queues', ticketId), {
        ...ticket,
        status: 'Proses',
        chairNumber,
        barberName: targetChair.barberName,
        barberId: targetChair.barberId
      });
      const updatedTarget = updatedChairs.find((c) => c.chairNumber === chairNumber);
      if (updatedTarget) {
        await setDoc(doc(db, 'chairs', `chair-${chairNumber}`), updatedTarget);
      }
    } catch (err) {
      console.warn('Firestore update failed, updated locally:', err);
    }
  };

  const completeService = async (
    chairNumber: number,
    paymentMethod: 'Tunai' | 'QRIS' | 'Debit/Kredit' | 'Transfer',
    rating: number = 5
  ) => {
    const chair = chairs.find((c) => c.chairNumber === chairNumber);
    if (!chair || !chair.currentCustomer) return;

    const customerName = chair.currentCustomer;
    const serviceName = chair.currentService || "Gentleman's Cut";
    const barberName = chair.barberName;
    const matchedService = services.find((s) => s.name.toLowerCase() === serviceName.toLowerCase());
    const amount = matchedService ? matchedService.price : 75000;

    // Create transaction record
    const txId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      customerName,
      serviceName,
      barberName,
      amount,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      time: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      rating
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update queue tickets: mark current ticket as Selesai
    if (chair.currentTicketId) {
      setQueues((prev) =>
        prev.map((q) =>
          q.id === chair.currentTicketId ? { ...q, status: 'Selesai' as QueueStatus } : q
        )
      );
    }

    // Check if chair has next tickets in line
    let nextCurrentTicket: QueueTicket | undefined;
    let remainingNext: QueueTicket[] = [];

    if (chair.nextTickets && chair.nextTickets.length > 0) {
      [nextCurrentTicket, ...remainingNext] = chair.nextTickets;
    }

    // Update chair
    const updatedChairs = chairs.map((c) => {
      if (c.chairNumber === chairNumber) {
        if (nextCurrentTicket) {
          return {
            ...c,
            status: 'Proses' as const,
            currentTicketId: nextCurrentTicket.id,
            currentTicketNumber: nextCurrentTicket.ticketNumber,
            currentCustomer: nextCurrentTicket.customerName,
            currentService: nextCurrentTicket.serviceName,
            serviceDurationMinutes: nextCurrentTicket.serviceDuration,
            elapsedMinutes: 0,
            startedAt: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            isOvertime: false,
            nextTickets: remainingNext
          };
        } else {
          return {
            ...c,
            status: 'Tersedia' as const,
            currentTicketId: undefined,
            currentTicketNumber: undefined,
            currentCustomer: undefined,
            currentService: undefined,
            elapsedMinutes: 0,
            startedAt: undefined,
            isOvertime: false,
            nextTickets: []
          };
        }
      }
      return c;
    });
    setChairs(updatedChairs);

    // Update barber count
    setBarbers((prev) =>
      prev.map((b) =>
        b.name === barberName ? { ...b, completedToday: b.completedToday + 1 } : b
      )
    );

    // Write to Firestore
    try {
      await setDoc(doc(db, 'transactions', txId), newTx);
      const updatedChair = updatedChairs.find((c) => c.chairNumber === chairNumber);
      if (updatedChair) {
        await setDoc(doc(db, 'chairs', `chair-${chairNumber}`), updatedChair);
      }
    } catch (err) {
      console.warn('Firestore completeService sync fallback:', err);
    }
  };

  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt'>): Promise<string> => {
    const id = `res-${Date.now()}`;
    const newRes: Reservation = {
      ...reservationData,
      id,
      createdAt: new Date().toISOString()
    };

    setReservations((prev) => [newRes, ...prev]);

    try {
      await setDoc(doc(db, 'reservations', id), newRes);
    } catch (err) {
      console.warn('Firestore reservation sync fallback:', err);
    }

    return id;
  };

  const updateReservationStatus = async (reservationId: string, status: ReservationStatus, notes?: string) => {
    const updated = reservations.map((r) => {
      if (r.id === reservationId) {
        return {
          ...r,
          status,
          ...(notes ? { notes } : {})
        };
      }
      return r;
    });
    setReservations(updated);

    try {
      const target = updated.find((r) => r.id === reservationId);
      if (target) {
        await setDoc(doc(db, 'reservations', reservationId), target);
      }
    } catch (err) {
      console.warn('Firestore updateReservationStatus error:', err);
    }
  };

  const deleteReservation = async (reservationId: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    try {
      await setDoc(doc(db, 'reservations', reservationId), { deleted: true });
    } catch (err) {
      console.warn('Firestore delete error:', err);
    }
  };

  const applyAutoSuggestLate = async (chairNumber: number, addedMinutes: number) => {
    const updatedChairs = chairs.map((c) => {
      if (c.chairNumber === chairNumber) {
        const updatedNext = c.nextTickets.map((t) => ({
          ...t,
          isOvertime: true,
          overtimeMinutes: addedMinutes,
          estimatedTime: `Est. ${addMinutesToTimeString(t.estimatedTime.replace('Est. ', ''), addedMinutes)}`
        }));
        return {
          ...c,
          isOvertime: true,
          overtimeMinutes: (c.overtimeMinutes || 0) + addedMinutes,
          nextTickets: updatedNext
        };
      }
      return c;
    });
    setChairs(updatedChairs);

    // Also update matching items in general queues
    setQueues((prev) =>
      prev.map((q) => {
        if (q.chairNumber === chairNumber && q.status === 'Tunggu') {
          return {
            ...q,
            isOvertime: true,
            overtimeMinutes: (q.overtimeMinutes || 0) + addedMinutes
          };
        }
        return q;
      })
    );
  };

  const addFeedback = async (feedbackData: Omit<CustomerFeedback, 'id' | 'createdAt'>) => {
    const id = `fb-${Date.now()}`;
    const newFb: CustomerFeedback = {
      ...feedbackData,
      id,
      createdAt: new Date().toLocaleString('id-ID')
    };

    setFeedbacks((prev) => [newFb, ...prev]);

    try {
      await setDoc(doc(db, 'feedback', id), newFb);
    } catch (err) {
      console.warn('Firestore feedback sync error:', err);
    }
  };

  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      await setDoc(doc(db, 'settings', 'shop-config'), merged);
    } catch (err) {
      console.warn('Firestore settings error:', err);
    }
  };

  const toggleShopStatus = async () => {
    const updated = !settings.isOpen;
    await updateSettings({ isOpen: updated });
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      // If popup fails (e.g. in iframe or blocked), set a simulated demo admin profile
      const demoUser = {
        uid: 'admin-123',
        displayName: 'Ahmad Fauzi (Manager)',
        email: 'aliakhmadfauzie@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXGIVq_rb1pgrYmcLm6w4sZhkqoJK8Y6_xc9kh_fLIa0Szc6dotmOTpPnBx8ynv4Mm6tAdjvp3-vjx70KJibE0yZ1vBYj9b8HMtejdBoiH_ZpE3chKH42RU0tAiJLC8tfHLiMfqMMWykmeotDJlO5JWHcooYXvl5GSWOhQp7DIgF7bwiDPVWpZxlVDmCTs86QQjAll4IT9-aIhd_LSKENz0D4oa-y2SQL3wqFW69j5jM77BBZr09VGQQ'
      } as unknown as User;
      setUser(demoUser);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // local fallback
    }
    setUser(null);
  };

  const callNextInQueue = async () => {
    // Find available chair or first chair
    const availableChair = chairs.find((c) => c.status === 'Tersedia') || chairs[0];
    const nextWaiting = queues.find((q) => q.status === 'Tiba' || q.status === 'Tunggu');
    if (nextWaiting && availableChair) {
      await allocateToChair(nextWaiting.id, availableChair.chairNumber);
    }
  };

  // Inventory Management Actions
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt'>): Promise<string> => {
    const id = `inv-${Date.now()}`;
    const newItem: InventoryItem = {
      ...itemData,
      id,
      createdAt: new Date().toISOString()
    };

    setInventory((prev) => [newItem, ...prev]);

    // Record initial stock movement log
    const movId = `mov-${Date.now()}`;
    const movement: StockMovement = {
      id: movId,
      itemId: id,
      itemName: newItem.name,
      type: 'Restock',
      quantity: newItem.stockLevel,
      previousStock: 0,
      newStock: newItem.stockLevel,
      date: `${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      notes: 'Stok awal penambahan produk baru',
      performedBy: user?.displayName || 'Admin Barbershop'
    };
    setStockMovements((prev) => [movement, ...prev]);

    try {
      await setDoc(doc(db, 'inventory', id), newItem);
      await setDoc(doc(db, 'stock_movements', movId), movement);
    } catch (err) {
      console.warn('Firestore inventory write failed, stored locally:', err);
    }

    return id;
  };

  const updateInventoryItem = async (itemId: string, itemData: Partial<InventoryItem>) => {
    const updatedList = inventory.map((item) => {
      if (item.id === itemId) {
        return { ...item, ...itemData };
      }
      return item;
    });
    setInventory(updatedList);

    try {
      const target = updatedList.find((i) => i.id === itemId);
      if (target) {
        await setDoc(doc(db, 'inventory', itemId), target);
      }
    } catch (err) {
      console.warn('Firestore inventory update failed:', err);
    }
  };

  const adjustStock = async (
    itemId: string,
    changeQty: number,
    type: StockMovementType,
    notes?: string
  ) => {
    const targetItem = inventory.find((i) => i.id === itemId);
    if (!targetItem) return;

    const previousStock = targetItem.stockLevel;
    const newStock = Math.max(0, previousStock + changeQty);

    const updatedList = inventory.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          stockLevel: newStock,
          lastRestocked: type === 'Restock' ? new Date().toISOString().split('T')[0] : item.lastRestocked
        };
      }
      return item;
    });
    setInventory(updatedList);

    // Record stock movement audit log
    const movId = `mov-${Date.now()}`;
    const movement: StockMovement = {
      id: movId,
      itemId,
      itemName: targetItem.name,
      type,
      quantity: changeQty,
      previousStock,
      newStock,
      date: `${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      notes: notes || (type === 'Restock' ? `Restock manual +${changeQty} unit` : `Penyesuaian stok ${changeQty} unit`),
      performedBy: user?.displayName || 'Admin Barbershop'
    };
    setStockMovements((prev) => [movement, ...prev]);

    try {
      const updatedItem = updatedList.find((i) => i.id === itemId);
      if (updatedItem) {
        await setDoc(doc(db, 'inventory', itemId), updatedItem);
      }
      await setDoc(doc(db, 'stock_movements', movId), movement);
    } catch (err) {
      console.warn('Firestore stock adjustment sync failed:', err);
    }
  };

  const deleteInventoryItem = async (itemId: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await setDoc(doc(db, 'inventory', itemId), { deleted: true });
    } catch (err) {
      console.warn('Firestore delete inventory failed:', err);
    }
  };

  return (
    <BarbershopContext.Provider
      value={{
        services,
        barbers,
        queues,
        chairs,
        reservations,
        transactions,
        feedbacks,
        settings,
        inventory,
        stockMovements,
        lowStockItems,
        user,
        isAdmin,
        isLoading,
        activeView,
        setActiveView,
        isCheckInModalOpen,
        setIsCheckInModalOpen,
        isReservationModalOpen,
        setIsReservationModalOpen,
        isLateModalOpen,
        setIsLateModalOpen,
        isGoogleFormsModalOpen,
        setIsGoogleFormsModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        activePaymentItem,
        setActivePaymentItem,
        addQueueTicket,
        allocateToChair,
        completeService,
        createReservation,
        updateReservationStatus,
        deleteReservation,
        applyAutoSuggestLate,
        addFeedback,
        updateSettings,
        toggleShopStatus,
        loginWithGoogle,
        logout,
        callNextInQueue,
        addInventoryItem,
        updateInventoryItem,
        adjustStock,
        deleteInventoryItem
      }}
    >
      {children}
    </BarbershopContext.Provider>
  );
};

export const useBarbershop = () => {
  const context = useContext(BarbershopContext);
  if (!context) {
    throw new Error('useBarbershop must be used within a BarbershopProvider');
  }
  return context;
};

// Helper
function addMinutesToTimeString(timeStr: string, minsToAdd: number): string {
  try {
    const parts = timeStr.trim().split(':');
    if (parts.length < 2) return timeStr;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + minsToAdd);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch {
    return timeStr;
  }
}
