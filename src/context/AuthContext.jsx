import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. التهيئة المتزامنة: نقرأ التوكن وبيانات المدرسة
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('wesal_school_user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = sessionStorage.getItem('wesal_school_token');
    return !!token; 
  });

  // حالة التحميل للتأكد من فحص التوكن قبل عرض أي صفحة محمية
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // ✅ 2. التعديل الجذري: تطابق ترتيب المتغيرات (userData الأول ثم token)
  const login = (userData, token) => {
    // حفظ التوكن في مفتاح المدرسة المعزول
    if (token) sessionStorage.setItem('wesal_school_token', token);
    
    // حفظ بيانات المدرسة
    if (userData) {
      sessionStorage.setItem('wesal_school_user_data', JSON.stringify(userData));
      if (userData.role) {
        sessionStorage.setItem('wesal_school_user_role', userData.role);
      }
    }
    
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  // 3. دالة تسجيل الخروج (التنظيف الذكي الشامل لبيانات المدرسة فقط)
  const logout = () => {
    sessionStorage.removeItem('wesal_school_token');
    sessionStorage.removeItem('wesal_school_user_role');
    sessionStorage.removeItem('wesal_school_user_data');
    sessionStorage.removeItem('force_change_password');
    sessionStorage.removeItem('school_isLoggedIn'); // مسح المتغير القديم احتياطياً

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    // ✅ توفير user في الـ Provider
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook مخصص لتسهيل الاستخدام
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};