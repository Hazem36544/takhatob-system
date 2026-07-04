import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Loader2, CalendarDays, Clock, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

const daysOfWeek = [
  { id: 0, name: 'الأحد' }, { id: 1, name: 'الإثنين' }, { id: 2, name: 'الثلاثاء' },
  { id: 3, name: 'الأربعاء' }, { id: 4, name: 'الخميس' }, { id: 5, name: 'الجمعة' }, { id: 6, name: 'السبت' }
];

const AddChildModal = ({ isOpen, onClose, onAdd, editingData }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [sessionTime, setSessionTime] = useState('16:00');
  const [formData, setFormData] = useState({
    fullName: '', dob: '', parentName: '', phone: '', address: '',
    diagnosis: '', school: '', doctor: '', startDate: '', 
    sessionsCount: '', price: '', paymentStatus: 'unpaid', notes: ''
  });

  // ملء البيانات في حالة التعديل
  useEffect(() => {
    if (editingData) {
        setFormData({
            fullName: editingData.fullName || '',
            dob: editingData.dob || '',
            parentName: editingData.parentName || '',
            phone: editingData.phone || '',
            address: editingData.address || '',
            diagnosis: editingData.diagnosis || '',
            school: editingData.school || '',
            doctor: editingData.doctor || '',
            startDate: editingData.package?.start_date || '',
            sessionsCount: editingData.package?.total_sessions || '',
            price: editingData.package?.price || '',
            paymentStatus: editingData.package?.payment_status || 'unpaid',
            notes: editingData.notes || ''
        });

        // استخراج الأيام والوقت من الجدولة المحفوظة في قاعدة البيانات
        if (editingData.package?.schedule && editingData.package.schedule !== 'غير محدد') {
            const scheduleStr = editingData.package.schedule;
            
            // 1. استخراج الوقت
            const timeParts = scheduleStr.split('الساعة ');
            if (timeParts.length > 1) {
                setSessionTime(timeParts[1].trim());
            } else {
                setSessionTime('16:00');
            }

            // 2. استخراج الأيام
            const currentDays = [];
            daysOfWeek.forEach(day => {
                if (scheduleStr.includes(day.name)) {
                    currentDays.push(day.id);
                }
            });
            setSelectedDays(currentDays);
        } else {
            setSelectedDays([]);
            setSessionTime('16:00');
        }

    } else {
        setFormData({
            fullName: '', dob: '', parentName: '', phone: '', address: '',
            diagnosis: '', school: '', doctor: '', startDate: '', 
            sessionsCount: '', price: '', paymentStatus: 'unpaid', notes: ''
        });
        setSelectedDays([]);
        setSessionTime('16:00');
    }
  }, [editingData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (id) => {
    if (selectedDays.includes(id)) setSelectedDays(selectedDays.filter(d => d !== id));
    else setSelectedDays([...selectedDays, id]);
  };

  const generateSessions = (startDate, count, days) => {
    let generated = [];
    let currentDate = new Date(startDate);
    let sessionsAdded = 0;
    let safeLoop = 0; 
    while (sessionsAdded < count && safeLoop < 365) {
        if (days.includes(currentDate.getDay())) {
            generated.push({ date: currentDate.toISOString().split('T')[0], time: sessionTime });
            sessionsAdded++;
        }
        currentDate.setDate(currentDate.getDate() + 1); 
        safeLoop++;
    }
    return generated;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.parentName) {
        toast.error("يرجى إدخال اسم الطفل واسم ولي الأمر على الأقل"); return;
    }

    setLoading(true);
    const finalData = { ...formData };
    
    // توليد الجلسات بناءً على الأيام المختارة
    if (formData.sessionsCount && formData.startDate && selectedDays.length > 0) {
        finalData.generatedSessions = generateSessions(formData.startDate, parseInt(formData.sessionsCount), selectedDays);
        finalData.schedule = `أيام (${selectedDays.map(d => daysOfWeek.find(x => x.id === d).name).join('، ')}) الساعة ${sessionTime}`;
    } else {
        finalData.generatedSessions = [];
        finalData.schedule = null; 
    }

    await onAdd(finalData); 
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" dir="rtl">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        <div className="bg-[#0D9488] p-5 md:p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            {editingData ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            <h2 className="text-xl font-bold">{editingData ? 'تعديل بيانات الطفل' : 'تسجيل طفل جديد'}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 border-none outline-none cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 md:p-8 bg-white overflow-y-auto custom-scrollbar flex-1">
          <form id="childForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">اسم الطفل</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="الاسم رباعي" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">تاريخ الميلاد</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">اسم ولي الأمر</label><input type="text" name="parentName" value={formData.parentName} onChange={handleChange} required placeholder="الاسم بالكامل" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">رقم الهاتف</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01xxxxxxxxx" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">التشخيص</label><input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="مثال: تأخر نمو لغوي، توحد..." className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">المدرسة / الحضانة</label><input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="اسم المدرسة أو الحضانة" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">الطبيب المحول (إن وجد)</label><input type="text" name="doctor" value={formData.doctor} onChange={handleChange} placeholder="اسم الطبيب" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            
            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">سعر الباقة</label><input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="بالجنيه" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
                <div>
                    <label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">حالة الدفع</label>
                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm">
                        <option value="unpaid">لم يتم الدفع</option>
                        <option value="paid">تم الدفع</option>
                    </select>
                </div>
            </div>

            <div className="md:col-span-2 bg-teal-50/50 p-5 rounded-2xl border border-teal-100 space-y-5">
                <div className="flex items-center gap-2 mb-2 text-[#134E4A]">
                    <CalendarDays className="w-5 h-5" />
                    <h3 className="font-bold text-sm">إعدادات الباقة <span className="text-xs text-gray-500 font-normal">(اختر أياماً جديدة فقط إذا أردت إعادة جدولة الجلسات المنتظرة)</span></h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-[#134E4A] mb-1.5 block">تاريخ بداية الجلسات</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full h-11 rounded-xl px-4 bg-white border border-teal-200 focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
                    <div><label className="text-xs font-bold text-[#134E4A] mb-1.5 block">عدد الجلسات (الباقة)</label><input type="number" name="sessionsCount" value={formData.sessionsCount} onChange={handleChange} placeholder="مثال: 12" className="w-full h-11 rounded-xl px-4 bg-white border border-teal-200 focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
                </div>

                <div>
                    <label className="text-xs font-bold text-[#134E4A] mb-2 block">أيام الحضور في الأسبوع</label>
                    <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map(day => (
                            <button key={day.id} type="button" onClick={() => toggleDay(day.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border outline-none ${selectedDays.includes(day.id) ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300 hover:bg-teal-50'}`}>{day.name}</button>
                        ))}
                    </div>
                </div>

                <div><label className="text-xs font-bold text-[#134E4A] mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> موعد الجلسة الثابت</label><input type="time" value={sessionTime} onChange={(e) => setSessionTime(e.target.value)} className="w-full md:w-1/2 h-11 rounded-xl px-4 bg-white border border-teal-200 focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            </div>

            <div className="md:col-span-2"><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">العنوان التفصيلي</label><input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="المحافظة - المنطقة - الشارع" className="w-full h-12 rounded-2xl px-4 bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm" /></div>
            <div className="md:col-span-2"><label className="text-xs md:text-sm font-bold text-[#134E4A] mb-1.5 block">ملاحظات إضافية</label><textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="أي ملاحظات..." className="w-full h-24 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#0D9488] outline-none font-bold shadow-sm text-sm resize-none"></textarea></div>

          </form>
        </div>

        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold cursor-pointer hover:bg-gray-100 transition-all">إلغاء</button>
          <button type="submit" form="childForm" disabled={loading} className="flex-[2] h-12 rounded-2xl bg-[#0D9488] text-white font-bold border-none cursor-pointer hover:bg-teal-700 flex items-center justify-center gap-2 transition-all shadow-md">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> {editingData ? 'حفظ التعديلات' : 'حفظ البيانات وإنشاء الجدول'}</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddChildModal;