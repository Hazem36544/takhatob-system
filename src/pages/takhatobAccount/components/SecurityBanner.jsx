import React from 'react';
import { ShieldCheck } from 'lucide-react';

const SecurityBanner = () => {
    return (
        <div className="mt-8 bg-teal-50/50 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 border border-teal-100 text-center md:text-right">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0D9488] shadow-sm shrink-0">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h4 className="font-bold text-[#134E4A] mb-1">بياناتك محمية</h4>
                <p className="text-xs text-[#0D9488] font-bold">جميع البيانات مشفرة ومحفوظة وفقاً لأعلى معايير الأمان بنظام إدارة التخاطب.</p>
            </div>
        </div>
    );
};

export default SecurityBanner;