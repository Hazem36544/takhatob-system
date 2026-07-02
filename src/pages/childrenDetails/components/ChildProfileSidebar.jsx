import React from 'react';
import { UserCircle2, Phone, MapPin, CalendarClock, Activity } from 'lucide-react';

const ChildProfileSidebar = ({ child }) => {
    // حساب نسبة الجلسات
    const progressPercentage = child.sessionsCount > 0 
        ? Math.round((child.usedSessions / child.sessionsCount) * 100) 
        : 0;
    
    // تغيير لون العداد إذا كانت الجلسات المتبقية قليلة (تنبيه)
    const isWarning = child.remainingSessions <= 2;

    return (
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 order-1">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm text-center border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-teal-50 to-transparent pointer-events-none"></div>
                
                <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-inner relative z-10">
                    <UserCircle2 className="h-10 w-10 md:h-12 md:w-12 text-[#0D9488]" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#134E4A] mb-1 line-clamp-1">{child.fullName}</h2>
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#0D9488] mb-6 bg-teal-50 w-max mx-auto px-3 py-1 rounded-full">
                    <Activity className="w-4 h-4" /> {child.diagnosis}
                </div>

                <div className="space-y-3 text-right text-sm text-gray-600 mb-6 font-medium">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span dir="ltr" className="font-bold">{child.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{child.address}</span>
                    </div>
                </div>

                {/* عداد الجلسات */}
                <div className="pt-6 border-t border-gray-100 text-right">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-[#134E4A] flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-[#0D9488]" /> عداد الجلسات (الباقة)
                        </h3>
                        {isWarning && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">قربت تنتهي!</span>}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                        <div className="bg-gray-50 p-2 rounded-xl">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">الإجمالي</p>
                            <p className="font-black text-gray-700 font-mono">{child.sessionsCount}</p>
                        </div>
                        <div className="bg-teal-50 p-2 rounded-xl">
                            <p className="text-[10px] text-teal-600 font-bold mb-1">المُستخدم</p>
                            <p className="font-black text-[#0D9488] font-mono">{child.usedSessions}</p>
                        </div>
                        <div className={`p-2 rounded-xl ${isWarning ? 'bg-red-50' : 'bg-gray-50'}`}>
                            <p className={`text-[10px] font-bold mb-1 ${isWarning ? 'text-red-500' : 'text-gray-400'}`}>المتبقي</p>
                            <p className={`font-black font-mono ${isWarning ? 'text-red-600' : 'text-gray-700'}`}>{child.remainingSessions}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex" dir="rtl">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-[#0D9488]'}`} 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-center mt-2 font-bold text-gray-500 font-mono">{progressPercentage}% مستخدم</p>
                </div>
            </div>
        </div>
    );
};

export default ChildProfileSidebar;