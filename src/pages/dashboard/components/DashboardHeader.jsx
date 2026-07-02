import React from 'react';
import { UserCircle2 } from 'lucide-react'; // أيقونة تناسب الأخصائي

const DashboardHeader = ({ therapistData, isLoading }) => {
  const name = isLoading ? 'جاري التحميل...' : (therapistData?.name || 'أخصائي غير محدد');
  const centerName = isLoading ? '---' : (therapistData?.centerName || 'المركز غير محدد');
  const location = isLoading ? 'جاري التحميل...' : (therapistData?.address || 'العنوان غير متوفر');
  
  // دالة للحصول على تاريخ اليوم بشكل جميل
  const getTodayDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('ar-EG', options);
  };

  return (
    <div className="relative overflow-hidden mb-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl" dir="rtl">
      {/* Background (لون التركواز الأساسي) */}
      <div className="absolute inset-0 bg-[#0D9488] z-0"></div>
      
      {/* تأثير إضاءة بسيط في الخلفية */}
      <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 p-5 md:p-8 flex flex-row flex-wrap md:flex-nowrap justify-between items-center gap-4 md:gap-6 text-white">
        
        {/* الجزء الأيمن: الأيقونة واسم الأخصائي والمركز */}
        <div className="flex flex-row items-center gap-4 flex-1 min-w-[200px]">
          <div className="bg-white/10 p-3 md:p-4 rounded-2xl md:rounded-full border border-white/20 backdrop-blur-sm shrink-0">
            <UserCircle2 className="h-8 w-8 md:h-12 md:w-12 text-white" />
          </div>
          
          <div className="text-right flex flex-col items-start overflow-hidden">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold mb-1 text-white truncate w-full">مرحباً، {name}</h1>
            <div className="flex flex-col text-[10px] sm:text-xs md:text-sm text-teal-50 font-bold opacity-90 w-full">
              <p className="truncate w-full">{centerName}</p>
              <p className="font-mono text-teal-200 truncate w-full mt-0.5">
                {location}
              </p>
            </div>
          </div>
        </div>

        {/* الجزء الأيسر: مربع تاريخ اليوم بدلاً من العام الدراسي */}
        <div className="bg-white/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/20 backdrop-blur-sm text-center shrink-0">
          <span className="text-teal-100 font-bold block text-[10px] md:text-xs mb-0.5 md:mb-1">تاريخ اليوم</span>
          <span className="font-bold text-xs md:text-sm tracking-wide">{getTodayDate()}</span>
        </div>
        
      </div>
    </div>
  );
};

export default DashboardHeader;