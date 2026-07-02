import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

export default function TakhatobLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // التعديل هنا: تغيير bg-[#F8FAFC] إلى bg-[#F0FDFA]
    <div className="flex h-screen bg-[#F0FDFA] overflow-hidden font-sans text-right" dir="rtl">
      
      {/* 📱 Navbar الموبايل */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0D9488] text-white z-40 flex items-center px-4 shadow-md justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border-none outline-none relative cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg tracking-wide">إدارة التخاطب</span>
        </div>
        
        <img 
          src={`${import.meta.env.BASE_URL}logo.png`} 
          alt="شعار النظام" 
          className="w-10 h-10 object-contain drop-shadow-md"
          onError={(e) => { e.target.src = 'https://placehold.co/40x40/png?text=Logo'; }}
        />
      </div>

      {/* 📋 القائمة الجانبية */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* 🌑 Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* 📄 منطقة المحتوى الرئيسي */}
      <div className="flex-1 w-full overflow-y-auto pt-16 md:pt-0 md:pr-32 transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <main className="w-full">
            <Outlet /> 
        </main>
      </div>
      
    </div>
  );
}