import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; 

// استيراد المكونات الفرعية
import AccountHeader from './components/AccountHeader';
import ProfileCard from './components/ProfileCard';
import BasicInfo from './components/BasicInfo';
import SecurityBanner from './components/SecurityBanner';

const TakhatobAccount = () => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [therapistData, setTherapistData] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { logout } = useAuth();

    // Effect for Animation
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setIsPageLoaded(true), 50);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    // محاكاة جلب البيانات الوهمية
    useEffect(() => {
        const fetchFakeData = () => {
            setTimeout(() => {
                setTherapistData({
                    name: 'أ/ الاء بليغ',
                    username: 'alaa.baligh',
                    address: 'سوهاج - شارع 15',
                    contactNumber: '010 1234 5678',
                    email: 'alaa@takhatob.com',
                    centerName: 'مركز نُطق للتخاطب وتنمية المهارات'
                });
                setLoading(false);
            }, 800);
        };

        fetchFakeData();
    }, []);

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
                        <ProfileCard 
                            displayName={therapistData?.name} 
                            displayAddress={therapistData?.address} 
                            centerName={therapistData?.centerName}
                            onLogout={handleLogout} 
                        />

                        <BasicInfo 
                            displayUsername={therapistData?.username} 
                            displayPhone={therapistData?.contactNumber} 
                            displayEmail={therapistData?.email} 
                        />
                    </div>

                    <SecurityBanner />

                </div>
            </div>
        </div>
    );
};

export default TakhatobAccount;