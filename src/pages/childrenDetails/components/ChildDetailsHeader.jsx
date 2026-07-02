import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Printer, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChildDetailsHeader = ({ childName }) => {
    const navigate = useNavigate();

    const handleFakeExport = (type) => {
        toast.success(`جاري تجهيز ملف الـ ${type} للطباعة...`);
    };

    return (
        <div className="bg-[#0D9488] text-white p-4 md:p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md shrink-0 cursor-pointer outline-none"
                >
                    <ChevronRight className="h-5 w-5 text-white" />
                </button>
                <div className="text-right">
                    <h1 className="text-xl md:text-2xl font-bold mb-1">ملف الطفل الموحد</h1>
                    <p className="text-teal-100 text-xs md:text-sm font-medium">
                        إدارة وتقييم حالة: <span className="text-white font-bold">{childName}</span>
                    </p>
                </div>
            </div>

            {/* أزرار التصدير (PDF / Excel / طباعة) */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar relative z-10">
                <button onClick={() => handleFakeExport('طباعة')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer border-none outline-none">
                    <Printer className="w-4 h-4" /> <span className="whitespace-nowrap">طباعة</span>
                </button>
                <button onClick={() => handleFakeExport('PDF')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer border-none outline-none">
                    <Download className="w-4 h-4" /> <span className="whitespace-nowrap">PDF</span>
                </button>
                <button onClick={() => handleFakeExport('Excel')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer border-none outline-none">
                    <FileSpreadsheet className="w-4 h-4" /> <span className="whitespace-nowrap">Excel</span>
                </button>
            </div>
        </div>
    );
};

export default ChildDetailsHeader;