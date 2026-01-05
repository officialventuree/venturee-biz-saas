import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FaChartBar, FaShoppingCart, FaBox, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

// Import Company-specific pages
import CompanyOverview from './company/CompanyOverview';
import POSSystem from './company/POSSystem';
import InventoryManagement from './company/InventoryManagement';
import LaundryServices from './company/LaundryServices';
import ServicesModule from './company/ServicesModule';

const CompanyDashboard = () => {
  const navigation = [
    { name: 'Overview', path: '/dashboard/company', icon: <FaChartBar /> },
    { name: 'POS System', path: '/dashboard/company/pos', icon: <FaShoppingCart /> },
    { name: 'Inventory', path: '/dashboard/company/inventory', icon: <FaBox /> },
    { name: 'Laundry', path: '/dashboard/company/laundry', icon: <FaMoneyBillWave /> },
    { name: 'Services', path: '/dashboard/company/services', icon: <FaUsers /> },
  ];

  return (
    <DashboardLayout 
      navigation={navigation}
      title="Company Dashboard"
      subtitle="Manage your business operations"
    >
      <Routes>
        <Route path="/" element={<CompanyOverview />} />
        <Route path="/pos" element={<POSSystem />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/laundry" element={<LaundryServices />} />
        <Route path="/services" element={<ServicesModule />} />
      </Routes>
    </DashboardLayout>
  );
};

export default CompanyDashboard;