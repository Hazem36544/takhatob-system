import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCircle2, Phone, MapPin, CalendarClock, Activity, Wallet, Plus, Edit2, X, UploadCloud, Loader2, CalendarDays } from 'lucide-react';
import { supabase } from '../../../supabase';
import { toast } from 'react-hot-toast';

const ChildProfileSidebar = ({ child, onUpdate, onTogglePayment }) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const progressPercentage = child.sessionsCount > 0 ? Math.round((child.usedSessions / child.sessionsCount) * 100) : 0;
    const isWarning = child.remainingSessions <= 2;

    const handleFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `child_${child.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `patients/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            await onUpdate('avatar_url', publicUrl);
            setShowImageModal(false);
            toast.success('تم تحديث صورة الطفل بنجاح');
        } catch (error) { toast.error('حدث خطأ أثناء رفع الصورة'); } finally { setIsUploading(false); }
    };

    const renderModal = () => {
        if (!showImageModal) return null;
        return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative">
                    <button onClick={() => !isUploading && setShowImageModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-rose-500 transition-colors outline-none cursor-pointer border-none bg-transparent" disabled={isUploading}><X size={20} /></button>
                    <div className="flex flex-col items-center mb-2"><div className="w-16 h-16 bg-teal-50 text-[#0D9488] rounded-2xl flex items-center justify-center mb-4"><UploadCloud size={32} /></div><h3 className="text-xl font-bold text-[#134E4A] mb-1">صورة الطفل</h3><p className="text-sm text-gray-500 text-center mb-6">اختر صورة ليتم عرضها في الملف الموحد</p></div>
                    <div className="relative"><input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" /><div className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${isUploading ? 'border-teal-300 bg-teal-50' : 'border-gray-300 hover:border-[#0D9488] hover:bg-teal-50/50'}`}>{isUploading ? <><Loader2 className="w-8 h-8 text-[#0D9488] animate-spin mb-2" /><span className="text-sm font-bold text-teal-700">جاري الرفع...</span></> : <><span className="bg-[#0D9488] text-white px-6 py-2 rounded-lg font-bold text-sm mb-2 shadow-sm">تصفح الملفات</span><span className="text-xs text-gray-400 font-medium">أو اسحب الصورة هنا</span></>}</div></div>
                </div>
            </div>, document.body 
        );
    };

    return (
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 order-1">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm text-center border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-teal-50 to-transparent pointer-events-none"></div>
                <div className="relative w-24 h-24 mx-auto mb-4 z-10"><div className="w-full h-full bg-teal-50 rounded-3xl flex items-center justify-center border border-teal-100 shadow-inner overflow-hidden">{child.avatar_url ? <img src={child.avatar_url} alt={child.fullName} className="w-full h-full object-cover" /> : <UserCircle2 className="h-12 w-12 text-[#0D9488]" />}</div><button onClick={() => setShowImageModal(true)} className="absolute -bottom-2 -left-2 bg-white hover:bg-teal-50 text-[#0D9488] p-2 rounded-xl shadow-lg border border-teal-100 transition-all cursor-pointer outline-none flex items-center justify-center group">{child.avatar_url ? <Edit2 size={16} className="group-hover:scale-110" /> : <Plus size={18} strokeWidth={3} className="group-hover:scale-110" />}</button></div>
                <h2 className="text-xl md:text-2xl font-bold text-[#134E4A] mb-1 line-clamp-1">{child.fullName}</h2>
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#0D9488] mb-6 bg-teal-50 w-max mx-auto px-3 py-1 rounded-full"><Activity className="w-4 h-4" /> {child.diagnosis}</div>

                <div className="space-y-3 text-right text-sm text-gray-600 mb-6 font-medium">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"><Phone className="w-4 h-4 text-gray-400 shrink-0" /><span dir="ltr" className="font-bold">{child.phone}</span></div>
                    
                    {/* التعديل هنا: إضافة حقل المواعيد المجدولة */}
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{child.schedule}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /><span className="truncate">{child.address}</span></div>
                    
                    <div className="flex items-center justify-between bg-teal-50/70 p-3 rounded-xl border border-teal-100/50 mt-2">
                        <div className="flex items-center gap-3 text-[#0D9488]">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm"><Wallet className="w-4 h-4" /></div>
                            <span className="font-bold">سعر الجلسات</span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="font-black text-[#134E4A] text-lg bg-white px-3 py-1 rounded-lg shadow-sm border border-teal-50">
                                {child.packagePrice}
                            </span>
                            <button 
                                onClick={onTogglePayment} 
                                className={`text-[10px] px-2 py-1 rounded-md font-bold cursor-pointer transition-all border-none outline-none shadow-sm hover:opacity-80 active:scale-95 ${child.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}
                                title="اضغط لتغيير حالة الدفع"
                            >
                                {child.paymentStatus === 'paid' ? '✔ تم الدفع' : '✖ لم يتم الدفع'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 text-right">
                    <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-[#134E4A] flex items-center gap-2"><CalendarClock className="w-4 h-4 text-[#0D9488]" /> عداد الجلسات</h3>{isWarning && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">قربت تنتهي!</span>}</div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                        <div className="bg-gray-50 p-2 rounded-xl"><p className="text-[10px] text-gray-400 font-bold mb-1">الإجمالي</p><p className="font-black text-gray-700 font-mono">{child.sessionsCount}</p></div>
                        <div className="bg-teal-50 p-2 rounded-xl"><p className="text-[10px] text-teal-600 font-bold mb-1">المُستخدم</p><p className="font-black text-[#0D9488] font-mono">{child.usedSessions}</p></div>
                        <div className={`p-2 rounded-xl ${isWarning ? 'bg-red-50' : 'bg-gray-50'}`}><p className={`text-[10px] font-bold mb-1 ${isWarning ? 'text-red-500' : 'text-gray-400'}`}>المتبقي</p><p className={`font-black font-mono ${isWarning ? 'text-red-600' : 'text-gray-700'}`}>{child.remainingSessions}</p></div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex" dir="rtl"><div className={`h-2.5 rounded-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-[#0D9488]'}`} style={{ width: `${progressPercentage}%` }}></div></div><p className="text-xs text-center mt-2 font-bold text-gray-500 font-mono">{progressPercentage}% مستخدم</p>
                </div>
            </div>
            {renderModal()}
        </div>
    );
};

export default ChildProfileSidebar;