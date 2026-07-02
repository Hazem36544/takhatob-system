import React, { useState } from 'react';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddChildModal = ({ isOpen, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', dob: '', parentName: '', phone: '', address: '',
    diagnosis: '', school: '', doctor: '', startDate: '', 
    sessionsCount: '', price: '', schedule: '', notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.parentName) {
        toast.error("يرجى إدخال اسم الطفل واسم ولي الأمر على الأقل");
        return;
    }

    setLoading(true);
    // محاكاة طلب السيرفر
    setTimeout(() => {
        onAdd(formData);
        setLoading(false);
        setFormData({
            fullName: '', dob: '', parentName: '', phone: '', address: '',
            diagnosis: '', school: '', doctor: '', startDate: '', 
            sessionsCount: '', price: '', schedule: '', notes: ''
        });
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" dir="rtl">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0D9488] p-5 md:p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6" />
            <h2 className="text-xl font-bold">تسجيل طفل جديد</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 border-none outline-none cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-6 md:p-8 bg-white overflow-y-auto custom-scrollbar flex-1">
          <form id="addChildForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">اسم الطفل</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="الاسم رباعي" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>

            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">تاريخ الميلاد</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>
            
            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">اسم ولي الأمر</label>
              <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="الاسم بالكامل" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>

            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">رقم الهاتف</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01xxxxxxxxx" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>
            
            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">التشخيص</label>
              <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="مثال: تأخر نمو لغوي، توحد..." className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>

            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">المدرسة / الحضانة</label>
              <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="اسم المدرسة أو الحضانة" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>
            
            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">الطبيب المحول (إن وجد)</label>
              <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} placeholder="اسم الطبيب" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>

            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">تاريخ بداية الجلسات</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>
            
            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">عدد الجلسات (الباقة)</label>
              <input type="number" name="sessionsCount" value={formData.sessionsCount} onChange={handleChange} placeholder="مثال: 12" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>

            <div>
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">سعر الباقة</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="بالجنيه" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">مواعيد الحضور</label>
              <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} placeholder="مثال: الأحد والثلاثاء 4:00 عصراً" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">العنوان التفصيلي</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="المحافظة - المنطقة - الشارع" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm" />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">ملاحظات إضافية</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="أي ملاحظات حول حالة الطفل أو سلوكه..." className="w-full h-24 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold transition-all shadow-sm text-sm resize-none"></textarea>
            </div>

          </form>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold cursor-pointer hover:bg-gray-100 transition-all">إلغاء</button>
          <button type="submit" form="addChildForm" disabled={loading} className="flex-[2] h-12 rounded-2xl bg-[#0D9488] text-white font-bold border-none cursor-pointer hover:bg-teal-700 flex items-center justify-center gap-2 transition-all">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> حفظ البيانات وإنشاء الملف</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddChildModal;