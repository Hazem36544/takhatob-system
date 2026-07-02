import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-300 group ${isActive
      ? 'bg-white text-[#0D9488] shadow-lg scale-105'
      : 'text-teal-100 hover:bg-white/10 hover:text-white'
      }`;
  };

  return (
    <div
      // التعديل هنا: إزالة الـ border وإضافة ظل ملون بالتركواز (shadow-teal-900/20)
      className={`fixed top-0 right-0 h-screen w-28 bg-[#0D9488] flex flex-col items-center py-6 z-50 rounded-l-[2rem] shadow-2xl shadow-teal-900/20 font-sans transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      dir="rtl"
    >

      {/* 1. Logo */}
      <div className="mb-8 flex-shrink-0 w-full flex justify-center">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Takhatob Logo"
          className="w-20 h-20 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
          onError={(e) => { e.target.src = 'https://placehold.co/80x80/png?text=Logo'; }}
        />
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex flex-col items-center gap-3 w-full px-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <Link to="/dashboard" className={getLinkClass('/dashboard')} onClick={() => setIsOpen && setIsOpen(false)}>
          <Home className="w-6 h-6 mb-0.5 transition-colors duration-300" />
          <span className="text-[11px] font-bold tracking-wide text-center leading-tight">الرئيسية</span>
        </Link>

        <Link to="/search" className={getLinkClass('/search')} onClick={() => setIsOpen && setIsOpen(false)}>
          <Users className="w-6 h-6 mb-0.5 transition-colors duration-300" />
          <span className="text-[11px] font-bold tracking-wide text-center leading-tight">الأطفال</span>
        </Link>

        <Link to="/account" className={getLinkClass('/account')} onClick={() => setIsOpen && setIsOpen(false)}>
          <User className="w-6 h-6 mb-0.5 transition-colors duration-300" />
          <span className="text-[11px] font-bold tracking-wide text-center leading-tight">الحساب</span>
        </Link>
      </nav>

      {/* 3. Logout Button */}
      <div className="mt-auto pt-4 w-full px-2 pb-2">
        <button
          onClick={logout}
          className="w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl text-red-100 hover:bg-red-500/20 hover:text-white transition-all duration-300 border border-transparent hover:border-red-500/20 outline-none"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-bold">خروج</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;