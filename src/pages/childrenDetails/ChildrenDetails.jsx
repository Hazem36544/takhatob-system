import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../supabase';
import { toast } from 'react-hot-toast';

import ChildDetailsHeader from './components/ChildDetailsHeader';
import ChildProfileSidebar from './components/ChildProfileSidebar';
import ChildTabsContent from './components/ChildTabsContent';

const ChildrenDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [childData, setChildData] = useState(null);

    const fetchChildDetails = async () => {
        try {
            const { data: patient, error: patientError } = await supabase.from('patients').select('*').eq('id', id).single();
            if (patientError) throw patientError;

            const { data: packageData } = await supabase.from('packages').select('*').eq('patient_id', id).order('created_at', { ascending: false }).limit(1).maybeSingle();
            let { data: sessions } = await supabase.from('sessions').select('*').eq('patient_id', id).order('session_date', { ascending: false });

            // --- اللمسة الأخيرة السحرية: الأتمتة (Automation) ---
            // استخراج تاريخ اليوم بدقة
            const offset = new Date().getTimezoneOffset() * 60000;
            const todayStr = (new Date(Date.now() - offset)).toISOString().split('T')[0];

            // فلترة الجلسات اللي تاريخها عدى ولسه متوثقتش
            const pastPendingSessions = sessions?.filter(s => s.session_date < todayStr && (!s.status || s.status === 'pending'));

            if (pastPendingSessions && pastPendingSessions.length > 0) {
                const pastSessionIds = pastPendingSessions.map(s => s.id);
                
                // 1. تحديث حالتها لـ "غياب" في قاعدة البيانات أوتوماتيكياً
                await supabase.from('sessions').update({ status: 'absent' }).in('id', pastSessionIds);
                
                // 2. تحديث البيانات محلياً عشان العداد وسجل الجلسات يقرأها كـ "غياب" فوراً
                sessions = sessions.map(s => pastSessionIds.includes(s.id) ? { ...s, status: 'absent' } : s);
            }
            // ---------------------------------------------------

            const totalSessionsCount = packageData?.total_sessions || 0;
            // العداد بيحسب الحاضر والغايب كجلسات مستهلكة
            const usedSessionsCount = sessions?.filter(s => s.status === 'completed' || s.status === 'absent').length || 0;

            setChildData({
                id: patient.id,
                fullName: patient.full_name,
                diagnosis: patient.diagnosis || 'غير محدد',
                parentName: patient.parent_name,
                phone: patient.phone,
                address: patient.address,
                avatar_url: patient.avatar_url,
                
                packageId: packageData?.id, 
                paymentStatus: packageData?.payment_status || 'unpaid', 
                schedule: packageData?.schedule || 'لم يتم تحديد مواعيد', 
                
                sessionsCount: totalSessionsCount,
                usedSessions: usedSessionsCount,
                remainingSessions: totalSessionsCount - usedSessionsCount,
                packagePrice: packageData?.price ? `${packageData.price} ج.م` : 'غير محدد',
                
                caseHistory: patient.case_history || { complaint: { title: 'الشكوى الرئيسية', content: '' }, developmental: { title: 'التاريخ النمائي', content: '' }, medical: { title: 'التاريخ الطبي', content: '' } },
                assessments: [], treatmentPlan: [], sessions: sessions || [], attachments: []
            });

        } catch (error) {
            toast.error("حدث خطأ أثناء تحميل ملف الطفل");
        } finally { setLoading(false); setIsPageLoaded(true); }
    };

    useEffect(() => { if (id) fetchChildDetails(); }, [id]);

    const handleUpdateChild = async (column, value) => {
        try {
            const { error } = await supabase.from('patients').update({ [column]: value }).eq('id', id);
            if (error) throw error;
            setChildData(prev => ({ ...prev, [column]: value }));
        } catch (error) { toast.error("حدث خطأ أثناء التحديث"); }
    };

    const handleDeleteChild = async () => {
        try {
            const { error } = await supabase.from('patients').delete().eq('id', id);
            if (error) throw error;
            toast.success("تم حذف ملف الطفل بنجاح");
            navigate('/children');
        } catch (error) { toast.error("حدث خطأ أثناء حذف الطفل"); }
    };

    const handleTogglePayment = async () => {
        if (!childData.packageId) return toast.error("لا توجد باقة مسجلة لهذا الطفل");
        const newStatus = childData.paymentStatus === 'paid' ? 'unpaid' : 'paid';
        try {
            const { error } = await supabase.from('packages').update({ payment_status: newStatus }).eq('id', childData.packageId);
            if (error) throw error;
            setChildData(prev => ({ ...prev, paymentStatus: newStatus }));
            toast.success(newStatus === 'paid' ? "تم تأكيد الدفع" : "تم إلغاء الدفع");
        } catch (error) { toast.error("خطأ في تحديث حالة الدفع"); }
    };

    if (loading || !childData) return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 className="w-12 h-12 text-[#0D9488] animate-spin" /></div>;

    return (
        <div className="w-full font-sans bg-transparent pb-20" dir="rtl" style={{ minHeight: '100vh' }}>
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                <div className="max-w-7xl mx-auto w-full">
                    <ChildDetailsHeader childName={childData.fullName} onDeleteChild={handleDeleteChild} />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
                        <ChildProfileSidebar child={childData} onUpdate={handleUpdateChild} onTogglePayment={handleTogglePayment} />
                        <ChildTabsContent childData={childData} setChildData={setChildData} patientId={id} onRefresh={fetchChildDetails} />
                    </div>
                </div>
            </div>
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default ChildrenDetails;