/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarbershopProvider, useBarbershop } from './context/BarbershopContext';
import { Sidebar } from './components/Sidebar';
import { TopAppBar } from './components/TopAppBar';
import { DashboardView } from './components/DashboardView';
import { QueueMonitorView } from './components/QueueMonitorView';
import { ReservationView } from './components/ReservationView';
import { FinanceView } from './components/FinanceView';
import { ReportsView } from './components/ReportsView';
import { KioskModeView } from './components/KioskModeView';
import { SettingsView } from './components/SettingsView';
import { InventoryView } from './components/InventoryView';

import { CheckInModal } from './components/CheckInModal';
import { NewReservationModal } from './components/NewReservationModal';
import { LateAdjustmentModal } from './components/LateAdjustmentModal';
import { GoogleFormsModal } from './components/GoogleFormsModal';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';

const MainLayout: React.FC = () => {
  const { activeView } = useBarbershop();

  return (
    <div className="flex h-screen w-full bg-[#F7F4EF] text-[#2D2D2D] font-sans antialiased overflow-hidden selection:bg-[#C5A059]/30">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopAppBar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {activeView === 'dashboard' && <DashboardView />}
          {(activeView === 'antrean' || (activeView as string) === 'queue') && <QueueMonitorView />}
          {(activeView === 'reservasi' || (activeView as string) === 'reservations') && <ReservationView />}
          {activeView === 'inventaris' && <InventoryView />}
          {(activeView === 'keuangan' || (activeView as string) === 'finance') && <FinanceView />}
          {(activeView === 'laporan' || (activeView as string) === 'reports') && <ReportsView />}
          {(activeView === 'kios' || (activeView as string) === 'kiosk') && <KioskModeView />}
          {activeView === 'pengaturan' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <CheckInModal />
      <NewReservationModal />
      <LateAdjustmentModal />
      <GoogleFormsModal />
      <PaymentModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <BarbershopProvider>
      <MainLayout />
    </BarbershopProvider>
  );
}
