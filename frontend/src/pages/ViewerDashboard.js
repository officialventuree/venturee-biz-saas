import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FaChartBar, FaChartLine } from 'react-icons/fa';

// Import Viewer-specific pages
import ViewerOverview from './viewer/ViewerOverview';
import ViewerReports from './viewer/ViewerReports';
import ViewerTrends from './viewer/ViewerTrends';

const ViewerDashboard = () => {
  const navigation = [
    { name: 'Overview', path: '/dashboard/viewer', icon: <FaChartBar /> },
    { name: 'Reports', path: '/dashboard/viewer/reports', icon: <FaChartBar /> },
    { name: 'Trends', path: '/dashboard/viewer/trends', icon: <FaChartLine /> },
  ];

  return (
    <DashboardLayout 
      navigation={navigation}
      title="Viewer Dashboard"
      subtitle="Read-only access to business metrics and reports"
    >
      <Routes>
        <Route path="/" element={<ViewerOverview />} />
        <Route path="/reports" element={<ViewerReports />} />
        <Route path="/trends" element={<ViewerTrends />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ViewerDashboard;