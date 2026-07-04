import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // استيراد Portal لحل المشكلة
import { UserCircle2, X } from 'lucide-react'; 

const DashboardHeader = ({ therapistData, isLoading }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const name = isLoading ? 'جاري التحميل...' : (therapistData?.name || 'أخصائي غير محدد');
  const centerName = isLoading ? '---' : (therapistData?.centerName || 'المركز غير محدد');
  const location = isLoading ? 'جاري التحميل...' : (therapistData?.address || 'العنوان غير متوفر');
  const avatarUrl = therapistData?.avatar_url; 
  
  const getDayName = () => new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
  const getFullDate = () => new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="relative overflow-hidden mb-6 md:mb-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl" dir="rtl">
        <div className="absolute inset-0 bg-[#0D9488] z-0"></div>
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-4 md:p-8 flex flex-row justify-between items-center gap-2 md:gap-6 text-white">
          
          <div className="flex flex-row items-center gap-3 md:gap-4 flex-1 min-w-[150px] overflow-hidden">
            <div 
              onClick={() => avatarUrl && setIsImageModalOpen(true)}
              className={`bg-white/10 p-1 md:p-2 rounded-xl md:rounded-full border border-white/20 backdrop-blur-sm shrink-0 flex items-center justify-center transition-all ${avatarUrl ? 'cursor-pointer hover:bg-white/20 hover:scale-105 shadow-lg' : ''}`}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="صورة الأخصائي" 
                  className="h-10 w-10 md:h-14 md:w-14 rounded-lg md:rounded-full object-cover border border-white/30"
                />
              ) : (
                <UserCircle2 className="h-8 w-8 md:h-12 md:w-12 text-white m-1 md:m-2" />
              )}
            </div>
            
            <div className="text-right flex flex-col items-start overflow-hidden w-full">
              <h1 className="text-sm sm:text-lg md:text-3xl font-bold mb-1 text-white truncate w-full">مرحباً، {name}</h1>
              <div className="flex flex-col text-[9px] sm:text-xs md:text-sm text-teal-50 font-bold opacity-90 w-full">
                <p className="truncate w-full">{centerName}</p>
                <p className="font-mono text-teal-200 truncate w-full md:mt-0.5">
                  {location}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 backdrop-blur-sm text-center shrink-0">
            <span className="text-teal-100 font-bold block text-[8px] md:text-xs mb-0.5 md:mb-1">تاريخ اليوم</span>
            <div className="font-bold text-[10px] md:text-sm tracking-wide leading-tight md:leading-normal">
              <span className="block md:inline">{getDayName()}</span>
              <span className="hidden md:inline">، </span>
              <span className="block md:inline">{getFullDate()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* البوب أب باستخدام Portal لضمان ملء الشاشة وتخطي مشكلة الـ Transform */}
      {isImageModalOpen && avatarUrl && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
          dir="rtl"
        >
          {/* زر الإغلاق ثابت في أعلى الشاشة ليكون واضحاً دائماً */}
          <button 
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 left-4 md:top-8 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all cursor-pointer outline-none border-none z-50"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <img 
            src={avatarUrl} 
            alt="صورة الأخصائي" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // منع الإغلاق عند الضغط على الصورة نفسها
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default DashboardHeader;