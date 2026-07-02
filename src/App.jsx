import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { Loader2 } from 'lucide-react'; 
import { Toaster } from 'react-hot-toast'; 

// ✅ التعديل هنا: تم تغيير الاسم ليتطابق مع ما تم استخدامه في الـ Route
import TakhatobLayout from './layouts/TakhatobLayout';

// ✅ التعديل هنا: تم توحيد أسماء المتغيرات لتتطابق مع المكونات
const LoginPage = lazy(() => import('./pages/loginPage/LoginPage'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Children = lazy(() => import('./pages/children/Children'));
const ChildrenDetails = lazy(() => import('./pages/childrenDetails/ChildrenDetails'));
const TakhatobAccount = lazy(() => import('./pages/takhatobAccount/TakhatobAccount'));

// مكون حماية المسارات
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-bold text-[#1e3a8a] bg-[#F3F4F6] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const needsPasswordChange = sessionStorage.getItem('force_change_password') === 'true';

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={
        <div className="h-screen flex flex-col items-center justify-center font-sans bg-[#F3F4F6]" dir="rtl">
          <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
          <span className="font-bold text-[#1e3a8a] text-lg">جاري تحميل الشاشة...</span>
        </div>
      }>
        <Routes>
          <Route 
            path="/" 
            element={(isAuthenticated && !needsPasswordChange) ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          
          <Route element={<ProtectedRoute><TakhatobLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Children />} />
            <Route path="/reports/:id" element={<ChildrenDetails />} />
            <Route path="/account" element={<TakhatobAccount />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: '"Times New Roman", "Traditional Arabic", serif',
            fontWeight: 'bold',
            borderRadius: '9999px', 
            padding: '12px 24px',
            direction: 'rtl',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          },
          success: {
            style: {
              background: '#ECFDF5', 
              color: '#065F46',      
              border: '1px solid #A7F3D0',
            },
            iconTheme: {
              primary: '#10B981',    
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#FEF2F2', 
              color: '#991B1B',
              border: '1px solid #FECACA',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }} 
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;