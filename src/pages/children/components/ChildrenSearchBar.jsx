import React from 'react';
import { Search, UserPlus, X, Users } from 'lucide-react';

const ChildrenSearchBar = ({ totalCount, searchTerm, setSearchTerm, clearSearch, onAddClick }) => {
  return (
    <div className="flex flex-col gap-5 md:gap-6 bg-white p-4 md:p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
      
      {/* صف الإحصائيات وزر الإضافة */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] shadow-sm shrink-0">
             <Users className="w-6 h-6 md:w-7 md:h-7" />
           </div>
           <div>
             <p className="text-[#94A3B8] text-xs font-bold mb-0.5 tracking-widest">إجمالي الأطفال</p>
             <p className="text-2xl md:text-3xl font-black text-[#134E4A] font-mono">{totalCount}</p>
           </div>
         </div>
         
         {/* الزر الجديد على الشمال */}
         <button 
            onClick={onAddClick}
            className="h-12 bg-[#0D9488] hover:bg-teal-700 text-white px-5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer border-none outline-none active:scale-95"
         >
             <UserPlus className="w-5 h-5" />
             <span className="hidden sm:inline">إضافة طفل جديد</span>
         </button>
      </div>

      {/* صف البحث */}
      <div className="relative flex-1 pt-2">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none mt-1" />
        <input
          type="text"
          placeholder="ابحث عن طفل بالاسم أو رقم الهاتف..."
          className="w-full pr-12 pl-12 h-12 md:h-14 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] text-right font-bold text-sm md:text-base shadow-sm transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={clearSearch} className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 p-1.5 hover:bg-gray-200 text-gray-500 rounded-full transition-colors border-none outline-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChildrenSearchBar;