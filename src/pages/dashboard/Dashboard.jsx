import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import StatCard from './components/StatCard';
import { Users, CalendarClock, BellRing, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    // بيانات وهمية (Fake Data) للداشبورد
    const [dashboardData, setDashboardData] = useState({
        totalChildren: 0,
        todaySessions: 0,
        alerts: 0,
        therapistData: null
    });

    useEffect(() => {
        // محاكاة تحميل البيانات من السيرفر
        const fetchFakeData = () => {
            setTimeout(() => {
                setDashboardData({
                    totalChildren: 45, // عدد الأطفال
                    todaySessions: 8,  // جلسات اليوم
                    alerts: 3,         // التنبيهات (باقات قربت تخلص)
                    therapistData: {
                        name: 'أ/ الاء بليغ ',
                        centerName: 'مركز نُطق للتخاطب وتنمية المهارات',
                        address: 'سوهاج - شارع 15'
                    }
                });
                setLoading(false);
                setIsPageLoaded(true);
            }, 800); // تأخير 800 ملي ثانية لمحاكاة التحميل
        };

        fetchFakeData();
    }, []);

    // الكروت الإحصائية الثلاثة التي طلبتها
    const stats = [
        { 
            id: 1, 
            title: 'إجمالي الأطفال', 
            value: dashboardData.totalChildren,
            badge: (
                <span className="inline-block text-[10px] md:text-[11px] font-bold text-teal-700 bg-teal-100/60 border border-teal-200 px-3 py-1.5 rounded-xl">
                    حالات نشطة
                </span>
            ), 
            icon: Users, 
            color: 'bg-[#0D9488]', // اللون التركواز
            link: '/search' 
        },
        { 
            id: 2, 
            title: 'جلسات اليوم', 
            value: dashboardData.todaySessions, 
            badge: (
                <span className="inline-block text-[10px] md:text-[11px] font-bold text-indigo-700 bg-indigo-100/60 border border-indigo-200 px-3 py-1.5 rounded-xl">
                    مجدولة اليوم
                </span>
            ),
            icon: CalendarClock, 
            color: 'bg-indigo-600' 
        },
        { 
            id: 3, 
            title: 'التنبيهات', 
            value: dashboardData.alerts, 
            badge: (
                <span className="inline-block text-[10px] md:text-[11px] font-bold text-rose-700 bg-rose-100/60 border border-rose-200 px-3 py-1.5 rounded-xl">
                    باقات قاربت على الانتهاء
                </span>
            ),
            icon: BellRing, 
            color: 'bg-rose-500' 
        },
    ];

    return (
        // التعديل هنا: استخدام bg-transparent ليأخذ لون الخلفية من TakhatobLayout
        <div className="w-full font-sans bg-transparent" dir="rtl" style={{ minHeight: '100vh' }}>
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10">

                    {/* تمرير بيانات الأخصائي للـ Header */}
                    <DashboardHeader therapistData={dashboardData.therapistData} isLoading={loading} />

                    {/* شبكة الكروت */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-2">
                        {stats.map(stat => {
                            const CardComponent = (
                                <StatCard
                                    title={stat.title}
                                    value={loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /> : stat.value}
                                    badge={stat.badge}
                                    icon={stat.icon}
                                    colorClass={stat.color}
                                />
                            );

                            return stat.link ? (
                                <Link 
                                    to={stat.link} 
                                    key={stat.id} 
                                    className="block outline-none h-full"
                                >
                                    {CardComponent}
                                </Link>
                            ) : (
                                <div key={stat.id} className="block h-full cursor-default">
                                    {CardComponent}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;