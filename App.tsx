import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { ServiceDisplay } from './pages/ServiceDisplay';
import { BookingForm } from './pages/BookingForm';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AIStylist } from './components/AIStylist';

const App: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Main User Routes */}
          <Route path="/" element={<Layout><ServiceDisplay /></Layout>} />
          <Route path="/book-appointment" element={<Layout><BookingForm /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Floating AI Assistant */}
        <div className="fixed bottom-6 right-6 z-50">
           {!isAiOpen && (
            <button 
              onClick={() => setIsAiOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 15.5v.01"></path><path d="M12 12v.01"></path></svg>
              <span className="font-semibold hidden sm:inline">AI Stylist</span>
            </button>
           )}
           {isAiOpen && <AIStylist onClose={() => setIsAiOpen(false)} />}
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;