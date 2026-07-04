import React, { useState, useEffect } from 'react';
import { Hash, Phone, Mail, Edit2, CheckCircle2 } from 'lucide-react';

const EditableRow = ({ icon: Icon, label, value, isLtr, isReadOnly, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');

    useEffect(() => setTempValue(value || ''), [value]);

    const handleSave = () => {
        if (tempValue !== value && tempValue.trim() !== '') {
            onSave(tempValue);
        }
        setIsEditing(false);
    };

    return (
        <div className="bg-[#F8F9FA] p-4 rounded-2xl flex items-center justify-between group hover:border-teal-100 border border-transparent transition-all relative overflow-hidden">
            {/* ضفنا pl-14 عشان نسيب مساحة لزرار الحفظ على الشمال ميعملش تداخل */}
            <div className="flex items-center gap-4 w-full pl-14">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-50 text-[#0D9488] rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#94A3B8] font-bold mb-1">{label}</p>
                    {isEditing ? (
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full bg-white border border-teal-200 rounded-lg px-3 py-1 text-sm md:text-base font-bold text-[#134E4A] focus:outline-none focus:border-[#0D9488] m-0"
                            dir={isLtr ? 'ltr' : 'rtl'}
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                        />
                    ) : (
                        <p className="text-base md:text-lg font-bold text-[#134E4A] tracking-wider truncate" dir={isLtr ? 'ltr' : 'rtl'}>
                            {value || '---'}
                        </p>
                    )}
                </div>
            </div>

            {!isReadOnly && (
                // التعديل هنا: سنطرة الزرار بشكل عمودي دقيق
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    {isEditing ? (
                        <button onClick={handleSave} className="text-teal-600 hover:text-teal-700 bg-teal-50 p-2 rounded-lg cursor-pointer outline-none border-none transition-all">
                            <CheckCircle2 size={20} />
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-teal-600 bg-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer outline-none border border-gray-100 shadow-sm">
                            <Edit2 size={18} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const BasicInfo = ({ displayUsername, displayPhone, displayEmail, onUpdate }) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-8 relative">
            <h3 className="text-xl font-bold text-[#134E4A] border-r-4 border-[#0D9488] pr-3 mb-8">المعلومات الأساسية</h3>
            <div className="space-y-6">
                <EditableRow icon={Hash} label="اسم الأخصائي" value={displayUsername} onSave={(val) => onUpdate('doctor_name', val)} />
                <EditableRow icon={Phone} label="هاتف التواصل" value={displayPhone} isLtr={true} onSave={(val) => onUpdate('phone', val)} />
                <EditableRow icon={Mail} label="البريد الإلكتروني" value={displayEmail} isLtr={true} isReadOnly={true} />
            </div>
        </div>
    );
};

export default BasicInfo;