import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChildDetailsHeader = ({ childName, onDeleteChild }) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const confirmDelete = () => {
        if (onDeleteChild) {
            onDeleteChild();
        } else {
            toast.error('عذراً، دالة الحذف غير متصلة.');
        }
        setIsDeleteModalOpen(false);
    };

    // تصميم البوب أب الخاص بتأكيد الحذف
    const renderDeleteModal = () => {
        if (!isDeleteModalOpen) return null;
        
        return createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" dir="rtl">
                <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative text-center">
                    <button 
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer outline-none"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                        <AlertTriangle size={32} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        هل أنت متأكد من حذف ملف <span className="font-bold text-gray-700">{childName}</span> بالكامل؟ 
                        <br/> لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع الجلسات والتقييمات المرتبطة.
                    </p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 rounded-xl transition-colors border-none cursor-pointer outline-none"
                        >
                            إلغاء
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors border-none cursor-pointer outline-none shadow-md"
                        >
                            نعم، احذف
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
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

            {/* زر حذف الطفل فقط */}
            <div className="flex items-center gap-2 w-full sm:w-auto relative z-10">
                <button 
                    onClick={() => setIsDeleteModalOpen(true)} 
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer border-none outline-none shadow-md"
                >
                    <Trash2 className="w-4 h-4" /> <span className="whitespace-nowrap">حذف الطفل</span>
                </button>
            </div>

            {/* استدعاء البوب أب */}
            {renderDeleteModal()}
        </div>
    );
};

export default ChildDetailsHeader;