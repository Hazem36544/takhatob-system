import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import StatCard from './components/StatCard';
import { Users, CalendarClock, BellRing, Loader2 } from 'lucide-react';
import { supabase } from '../../supabase'; 
import { useAuth } from '../../context/AuthContext'; 

const Dashboard = () => {
    const { user } = useAuth(); 
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const [dashboardData, setDashboardData] = useState({
        totalChildren: 0,
        todaySessions: 0,
        alerts: 0,
        therapistData: null
    });

    useEffect(() => {
        const fetchRealData = async () => {
            if (!user) return;

            try {
                // 1. جلب بيانات العيادة والأخصائي
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('doctor_name, clinic_name, address, avatar_url')
                    .eq('id', user.id)
                    .maybeSingle();

                // 2. حساب إجمالي عدد الأطفال
                const { count: patientsCount } = await supabase
                    .from('patients')
                    .select('*', { count: 'exact', head: true });

                // 3. حساب جلسات اليوم
                // نظبط التايم زون عشان يجيب تاريخ النهاردة بدقة
                const offset = new Date().getTimezoneOffset() * 60000;
                const todayStr = (new Date(Date.now() - offset)).toISOString().split('T')[0];
                
                const { count: sessionsCount } = await supabase
                    .from('sessions')
                    .select('*', { count: 'exact', head: true })
                    .eq('session_date', todayStr);

                // 4. خوارزمية حساب التنبيهات (باقات قاربت على الانتهاء)
                const { data: packagesData } = await supabase
                    .from('packages')
                    .select('patient_id, total_sessions');
                
                const { data: consumedSessions } = await supabase
                    .from('sessions')
                    .select('patient_id')
                    .in('status', ['completed', 'absent']);

                let alertsCount = 0;
                
                if (packagesData && consumedSessions) {
                    // تجميع عدد الجلسات المستهلكة لكل طفل
                    const consumedMap = {};
                    consumedSessions.forEach(session => {
                        consumedMap[session.patient_id] = (consumedMap[session.patient_id] || 0) + 1;
                    });

                    // مقارنة إجمالي الباقة بالمستهلك
                    packagesData.forEach(pkg => {
                        const consumed = consumedMap[pkg.patient_id] || 0;
                        const remaining = pkg.total_sessions - consumed;
                        // لو باقي جلستين أو أقل (ولسه الباقة مخلصتش تماماً) اعتبره تنبيه
                        if (remaining <= 2 && remaining > 0) {
                            alertsCount++;
                        }
                    });
                }

                // 5. تحديث الواجهة بالبيانات الحقيقية
                setDashboardData({
                    totalChildren: patientsCount || 0,
                    todaySessions: sessionsCount || 0,
                    alerts: alertsCount,
                    therapistData: {
                        name: profileData?.doctor_name || 'أخصائي التخاطب',
                        centerName: profileData?.clinic_name || 'إعدادات العيادة غير مكتملة',
                        address: profileData?.address || '',
                        avatar_url: profileData?.avatar_url || null
                    }
                });

            } catch (error) {
                console.error("خطأ في جلب بيانات الداشبورد:", error);
            } finally {
                setLoading(false);
                setIsPageLoaded(true);
            }
        };

        fetchRealData();
    }, [user]);

    // الكروت الإحصائية
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
            color: 'bg-[#0D9488]', 
            link: '/children' // تم ربط الكارت بصفحة الأطفال
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
            color: 'bg-indigo-600',
            link: '/children' // ممكن نوجهه لصفحة أو تقرير مخصص لجلسات اليوم لاحقاً
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
            color: 'bg-rose-500',
            link: '/children' // توجيه لصفحة الأطفال لمراجعة الباقات
        },
    ];

    return (
        <div className="w-full font-sans bg-transparent" dir="rtl" style={{ minHeight: '100vh' }}>
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10">

                    <DashboardHeader therapistData={dashboardData.therapistData} isLoading={loading} />

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