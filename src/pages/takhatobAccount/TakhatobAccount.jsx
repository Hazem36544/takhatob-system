import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; 
import { supabase } from '../../supabase'; // استدعاء قاعدة البيانات

// استيراد المكونات الفرعية
import AccountHeader from './components/AccountHeader';
import ProfileCard from './components/ProfileCard';
import BasicInfo from './components/BasicInfo';
import SecurityBanner from './components/SecurityBanner';

const TakhatobAccount = () => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [therapistData, setTherapistData] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                // جلب بيانات البروفايل من Supabase
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    setTherapistData({
                        doctor_name: data.doctor_name,
                        phone: data.phone,
                        address: data.address,
                        clinic_name: data.clinic_name,
                        avatar_url: data.avatar_url,
                        email: user.email
                    });
                } else {
                    // لو أول مرة يفتح الحساب ومفيش صف في الداتا بيز، بننشئه
                    await supabase.from('profiles').insert([{ id: user.id }]);
                    setTherapistData({ email: user.email });
                }
            } catch (error) {
                console.error(error);
                toast.error("حدث خطأ في تحميل البيانات");
            } finally {
                setLoading(false);
                setTimeout(() => setIsPageLoaded(true), 50);
            }
        };

        fetchProfile();
    }, [user]);

    // الدالة السحرية اللي بتحدث أي حقل في الداتا بيز
    const handleUpdateProfile = async (column, value) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ [column]: value })
                .eq('id', user.id);

            if (error) throw error;
            
            // تحديث الواجهة فوراً
            setTherapistData(prev => ({ ...prev, [column]: value }));
            toast.success("تم تحديث البيانات بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#0D9488] animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full font-sans bg-transparent" dir="rtl" style={{ minHeight: '100vh' }}>
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                <div className="max-w-7xl mx-auto w-full pb-10">
                
                    <AccountHeader />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* هنحدث ده في الخطوة الجاية */}
                        <ProfileCard 
                            displayName={therapistData?.doctor_name} 
                            displayAddress={therapistData?.address} 
                            centerName={therapistData?.clinic_name}
                            avatarUrl={therapistData?.avatar_url}
                            onLogout={handleLogout} 
                            onUpdate={handleUpdateProfile} 
                        />

                        <BasicInfo 
                            displayUsername={therapistData?.doctor_name} 
                            displayPhone={therapistData?.phone} 
                            displayEmail={therapistData?.email} 
                            onUpdate={handleUpdateProfile} 
                        />
                    </div>

                    <SecurityBanner />

                </div>
            </div>
        </div>
    );
};

export default TakhatobAccount;