import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, LogOut, UserCircle2, Edit2, CheckCircle2, Plus, X, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabase';
import { toast } from 'react-hot-toast';

// مكون التعديل بعد التحسين (الأيقونة ظاهرة دائماً وبدون لخبطة في المسافات)
const InlineEdit = ({ value, placeholder, onSave, textClass, icon: Icon }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [temp, setTemp] = useState(value || '');

    useEffect(() => setTemp(value || ''), [value]);

    const handleSave = () => {
        if (temp !== value && temp.trim() !== '') onSave(temp);
        setIsEditing(false);
    };

    return isEditing ? (
        <div className="flex items-center justify-center gap-2 w-full max-w-[250px] mx-auto animate-in fade-in zoom-in-95 duration-200">
            <input 
                className="w-full text-center border-b-2 border-[#0D9488] bg-transparent px-2 py-1 text-sm font-bold text-[#134E4A] focus:outline-none m-0"
                value={temp}
                onChange={e => setTemp(e.target.value)}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <button onClick={handleSave} className="text-[#0D9488] hover:bg-teal-50 p-1.5 rounded-full cursor-pointer border-none outline-none shrink-0 transition-colors">
                <CheckCircle2 size={18}/>
            </button>
        </div>
    ) : (
        <div className="flex items-center justify-center gap-2 w-full group">
            {Icon && <Icon size={16} className="text-[#0D9488] shrink-0" />}
            
            <span 
                className={`${textClass} truncate max-w-[200px] cursor-pointer`}
                onClick={() => setIsEditing(true)}
                title="اضغط للتعديل"
            >
                {value || placeholder}
            </span>

            <button 
                onClick={() => setIsEditing(true)} 
                className="text-gray-400 hover:text-[#0D9488] bg-transparent hover:bg-gray-50 p-1.5 rounded-full cursor-pointer border-none outline-none transition-colors shrink-0 flex items-center justify-center"
                title="تعديل"
            >
                <Edit2 size={14} />
            </button>
        </div>
    );
};

const ProfileCard = ({ displayName, displayAddress, centerName, avatarUrl, onLogout, onUpdate }) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            setIsUploading(true);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `therapists/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await onUpdate('avatar_url', publicUrl);
            setShowImageModal(false);
            toast.success('تم تحديث الصورة بنجاح');

        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('حدث خطأ أثناء رفع الصورة');
        } finally {
            setIsUploading(false);
        }
    };

    const renderModal = () => {
        if (!showImageModal) return null;
        
        return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative">
                    <button 
                        onClick={() => !isUploading && setShowImageModal(false)}
                        className="absolute top-4 left-4 text-gray-400 hover:text-rose-500 transition-colors outline-none cursor-pointer border-none bg-transparent"
                        disabled={isUploading}
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex flex-col items-center mb-2">
                        <div className="w-16 h-16 bg-teal-50 text-[#0D9488] rounded-2xl flex items-center justify-center mb-4">
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-[#134E4A] mb-1">رفع صورة شخصية</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">اختر صورة من جهازك ليتم عرضها في ملفك الشخصي</p>
                    </div>

                    <div className="relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                        />
                        <div className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all
                            ${isUploading ? 'border-teal-300 bg-teal-50' : 'border-gray-300 hover:border-[#0D9488] hover:bg-teal-50/50'}`}>
                            
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-8 h-8 text-[#0D9488] animate-spin mb-2" />
                                    <span className="text-sm font-bold text-teal-700">جاري الرفع...</span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-[#0D9488] text-white px-6 py-2 rounded-lg font-bold text-sm mb-2 shadow-sm">
                                        تصفح الملفات
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">أو اسحب وأفلت الصورة هنا</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>,
            document.body 
        );
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#0D9488]/5 to-transparent skew-y-3 transform -translate-y-12"></div>
            
            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-[#F0FDFA] border-4 border-white shadow-xl flex items-center justify-center text-[#0D9488] relative z-10 overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="الأخصائي" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle2 size={64} strokeWidth={1.2} />
                    )}
                </div>
                
                <button 
                    onClick={() => setShowImageModal(true)}
                    className="absolute bottom-1 left-1 bg-white hover:bg-teal-50 text-[#0D9488] p-2 rounded-full shadow-lg border border-teal-100 z-20 transition-all cursor-pointer outline-none flex items-center justify-center group"
                    title={avatarUrl ? "تعديل الصورة" : "إضافة صورة"}
                >
                    {avatarUrl ? <Edit2 size={16} className="group-hover:scale-110 transition-transform" /> : <Plus size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />}
                </button>
            </div>

            <h2 className="text-2xl font-extrabold text-[#134E4A] mb-4">{displayName || 'أخصائي التخاطب'}</h2>

            <div className="w-full mb-4 flex flex-col items-center">
                <InlineEdit 
                    value={centerName} 
                    placeholder="اسم المركز" 
                    onSave={(val) => onUpdate('clinic_name', val)}
                    textClass="text-[#0D9488] font-bold bg-teal-50 px-4 py-1.5 rounded-full text-xs"
                />
            </div>

            <div className="w-full mb-8 flex flex-col items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <InlineEdit 
                    value={displayAddress} 
                    placeholder="العنوان" 
                    onSave={(val) => onUpdate('address', val)}
                    textClass="text-[#64748B] text-sm font-bold"
                    icon={MapPin}
                />
            </div>

            <div className="mt-auto w-full pt-6 border-t border-gray-100">
                <button 
                    onClick={onLogout}
                    className="w-full py-4 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-bold flex items-center justify-center gap-2 group outline-none border-none cursor-pointer"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>

            {renderModal()}
        </div>
    );
};

export default ProfileCard;