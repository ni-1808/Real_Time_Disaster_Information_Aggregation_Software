import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import AlertNotification from './components/AlertNotification';
import Dashboard from './pages/Dashboard';
import DisasterInsights from './pages/DisasterInsights';
import SurvivalTips from './pages/SurvivalTips';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ReportDisaster from './pages/ReportDisaster';

import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavigationBar />
          <AlertNotification />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<DisasterInsights />} />
            <Route path="/tips" element={<SurvivalTips />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/report" element={<ReportDisaster />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;