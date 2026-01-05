import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FaChartBar, FaBuilding, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

// Import Admin-specific pages
import AdminOverview from './admin/AdminOverview';
import CompanyRegistration from './admin/CompanyRegistration';
import CompanyStatus from './admin/CompanyStatus';
import PaymentOverview from './admin/PaymentOverview';
import Services from './admin/Services';

const AdminDashboard = () => {
  const navigation = [
    { name: 'Overview', path: '/dashboard/admin', icon: <FaChartBar /> },
    { name: 'Company Registration', path: '/dashboard/admin/company-registration', icon: <FaBuilding /> },
    { name: 'Company Status', path: '/dashboard/admin/company-status', icon: <FaUsers /> },
    { name: 'Payment Overview', path: '/dashboard/admin/payment-overview', icon: <FaMoneyBillWave /> },
    { name: 'Services', path: '/dashboard/admin/services', icon: <FaMoneyBillWave /> },
  ];

  return (
    <DashboardLayout 
      navigation={navigation}
      title="Admin Dashboard"
      subtitle="Platform administration and management"
    >
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route path="/company-status" element={<CompanyStatus />} />
        <Route path="/payment-overview" element={<PaymentOverview />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;