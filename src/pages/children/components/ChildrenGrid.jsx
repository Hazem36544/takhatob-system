import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Search, X, UserCircle2, Activity, CalendarClock, ChevronDown } from 'lucide-react';

const ChildrenGrid = ({ childrenData, filteredChildren, visibleCount, searchTerm, clearSearch, handleLoadMore }) => {
  const navigate = useNavigate();

  if (childrenData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
         <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30 text-[#0D9488]" />
         <p className="font-bold text-lg text-gray-600">لا يوجد أطفال مسجلين</p>
         <p className="text-sm font-bold text-gray-400 mt-2">لم يتم إضافة أي أطفال إلى قاعدة بيانات المركز بعد.</p>
      </div>
    );
  }

  if (filteredChildren.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-rose-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Search className="w-10 h-10 text-rose-400" />
          </div>
          <p className="font-black text-2xl text-gray-800 mb-2">عذراً، لا توجد نتائج!</p>
          <p className="text-sm font-bold text-gray-500 mb-8 max-w-md text-center">لم نتمكن من العثور على أي طفل يطابق بحثك "{searchTerm}".</p>
          <button onClick={clearSearch} className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold flex items-center gap-2 transition-all outline-none cursor-pointer">
             <X className="w-5 h-5 text-gray-400" /> مسح البحث
          </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.slice(0, visibleCount).map((child) => (
            <div
              key={child.id}
              onClick={() => navigate(`/reports/${child.id}`, { state: { child } })}
              className="group bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-teal-200 transition-all duration-300 rounded-[2rem] p-6 cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-teal-50 rounded-br-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform opacity-50 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                   <span className="text-[10px] font-bold text-gray-500 font-mono">ID: {child.id}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 relative z-10 mb-6 flex-1">
                 <div className="flex items-center gap-3 bg-teal-50/50 p-3 rounded-xl border border-teal-50">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                       <UserCircle2 className="w-5 h-5 text-[#0D9488]" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-[#64748B]">اسم الطفل</span>
                       <span className="text-sm font-bold text-[#134E4A] line-clamp-1">{child.fullName}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                       <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-[#64748B]">التشخيص</span>
                       <span className="text-sm font-bold text-indigo-900">{child.diagnosis || 'غير محدد'}</span>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                     <CalendarClock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-gray-500">الجلسات المتبقية</span>
                     <span className="text-sm font-black text-gray-800 font-mono">{child.remainingSessions || 0} من {child.sessionsCount || 0}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/reports/${child.id}`, { state: { child } }); }}
                  className="text-white bg-[#0D9488] font-bold rounded-xl text-xs px-4 h-9 flex items-center justify-center outline-none border-none hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  التفاصيل
                </button>
              </div>
            </div>
        ))}
      </div>

      {visibleCount < filteredChildren.length && (
        <div className="flex justify-center mt-8 animate-in fade-in">
          <button onClick={handleLoadMore} className="px-8 py-3.5 bg-white border-2 border-teal-100 text-[#0D9488] rounded-2xl font-bold shadow-sm hover:bg-teal-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none">
            <ChevronDown className="w-5 h-5" /> عرض المزيد
          </button>
        </div>
      )}
    </>
  );
};

export default ChildrenGrid;