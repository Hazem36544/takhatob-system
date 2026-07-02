import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 🌟 استدعاء الـ Portal لحل مشكلة الشاشة
import { FileText, ClipboardList, TrendingUp, Calendar, Paperclip, ChevronDown, Plus, Edit, X, Save, File, Image, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 🌟 المكون المحدث للـ Modal باستخدام createPortal
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
            <div className="bg-white w-full max-w-lg md:max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                <div className="bg-[#0D9488] p-5 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors border-none cursor-pointer text-white flex-shrink-0">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

const ChildTabsContent = ({ childData, setChildData }) => {
    const [activeTab, setActiveTab] = useState('history');
    const [openAccordion, setOpenAccordion] = useState('complaint');

    // States للتحكم في النوافذ المنبثقة
    const [isSessionModalOpen, setSessionModalOpen] = useState(false);
    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isAssessmentModalOpen, setAssessmentModalOpen] = useState(false);
    
    // 🌟 States خاصة بتعديل الـ Case History
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [historyFormData, setHistoryFormData] = useState(childData.caseHistory);

    // لضمان تحديث الفورم لو الداتا اتغيرت
    useEffect(() => {
        setHistoryFormData(childData.caseHistory);
    }, [childData.caseHistory]);

    const toggleAccordion = (id) => setOpenAccordion(openAccordion === id ? null : id);

    // 🌟 دالة حفظ تعديلات الـ Case History
    const handleSaveHistory = (e) => {
        e.preventDefault();
        setChildData(prev => ({
            ...prev,
            caseHistory: historyFormData
        }));
        toast.success("تم تحديث تاريخ دراسة الحالة بنجاح!");
        setHistoryModalOpen(false);
    };

    // دالة إضافة جلسة
    const handleAddFakeSession = (e) => {
        e.preventDefault();
        if (childData.remainingSessions <= 0) {
            toast.error("لقد انتهت باقة الجلسات الخاصة بهذا الطفل!");
            return;
        }
        
        const newSession = {
            date: new Date().toISOString().split('T')[0],
            goal: e.target.goal.value,
            activities: e.target.activities.value,
            response: e.target.response.value,
            homework: 'لم يحدد', notes: 'تمت الإضافة من النظام'
        };

        setChildData(prev => ({
            ...prev,
            sessions: [newSession, ...prev.sessions],
            usedSessions: prev.usedSessions + 1,
            remainingSessions: prev.remainingSessions - 1
        }));
        
        toast.success("تم تسجيل الجلسة وتحديث العداد بنجاح!");
        setSessionModalOpen(false);
    };

    // دالة إضافة هدف
    const handleAddFakeGoal = (e) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            type: e.target.type.value,
            goal: e.target.goalText.value,
            progress: 0
        };
        setChildData(prev => ({ ...prev, treatmentPlan: [...prev.treatmentPlan, newGoal] }));
        toast.success("تمت إضافة الهدف للخطة العلاجية!");
        setGoalModalOpen(false);
    };

    const tabs = [
        { id: 'history', label: 'الحالة (History)', icon: FileText },
        { id: 'assessment', label: 'التقييمات', icon: ClipboardList },
        { id: 'plan', label: 'الخطة العلاجية', icon: TrendingUp },
        { id: 'sessions', label: 'سجل الجلسات', icon: Calendar },
        { id: 'attachments', label: 'المرفقات', icon: Paperclip },
    ];

    return (
        <div className="lg:col-span-8 space-y-6 order-2 relative">
            
            {/* شريط التبويبات */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar flex gap-2 w-full" style={{ scrollSnapType: 'x mandatory' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border-none outline-none cursor-pointer shrink-0 ${activeTab === tab.id ? 'bg-[#0D9488] text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* المحتوى */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 min-h-[50vh]">
                
                {/* 1. التاريخ الطبي */}
                {activeTab === 'history' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#134E4A]">تاريخ دراسة الحالة</h3>
                            <button onClick={() => setHistoryModalOpen(true)} className="text-xs font-bold bg-teal-50 text-[#0D9488] px-4 py-2 rounded-xl hover:bg-teal-100 border-none cursor-pointer flex items-center gap-2"><Edit className="w-3 h-3"/> تعديل السجل</button>
                        </div>
                        {Object.entries(childData.caseHistory).map(([key, data]) => (
                            <div key={key} className="border border-gray-100 rounded-2xl overflow-hidden">
                                <button onClick={() => toggleAccordion(key)} className="w-full bg-gray-50 p-4 flex justify-between items-center font-bold text-[#134E4A] text-sm border-none outline-none cursor-pointer">
                                    {data.title} <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openAccordion === key ? 'rotate-180' : ''}`} />
                                </button>
                                {openAccordion === key && <div className="p-4 text-sm font-medium text-gray-600 bg-white leading-relaxed border-t border-gray-100">{data.content}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. التقييمات والاختبارات */}
                {activeTab === 'assessment' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#134E4A]">التقييمات والاختبارات</h3>
                            <button onClick={() => setAssessmentModalOpen(true)} className="text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 flex items-center gap-2 border-none cursor-pointer"><Plus className="w-4 h-4"/> إضافة تقييم</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {childData.assessments.map(ass => (
                                <div key={ass.id} className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-indigo-900">{ass.name}</h4>
                                        <span className="text-xs font-mono text-indigo-400">{ass.date}</span>
                                    </div>
                                    <p className="text-lg font-black text-indigo-600 mb-2" dir="ltr">{ass.score}</p>
                                    <p className="text-xs text-indigo-500 font-medium bg-white p-2 rounded-lg border border-indigo-50">{ass.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. الخطة العلاجية */}
                {activeTab === 'plan' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#134E4A]">الخطة العلاجية (الأهداف)</h3>
                            <button onClick={() => setGoalModalOpen(true)} className="text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 flex items-center gap-2 border-none cursor-pointer"><Plus className="w-4 h-4"/> إضافة هدف</button>
                        </div>
                        <div className="space-y-4">
                            {childData.treatmentPlan.map(plan => (
                                <div key={plan.id} className="border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${plan.type === 'long' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {plan.type === 'long' ? 'طويل المدى' : 'قصير المدى'}
                                            </span>
                                            <h4 className="font-bold text-gray-800 text-sm">{plan.goal}</h4>
                                        </div>
                                        <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2 py-1 rounded-lg">{plan.progress}% منجز</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5" dir="rtl">
                                        <div className="bg-[#0D9488] h-1.5 rounded-full" style={{ width: `${plan.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. سجل الجلسات */}
                {activeTab === 'sessions' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#134E4A]">سجل الجلسات</h3>
                            <button onClick={() => setSessionModalOpen(true)} className="hidden sm:flex text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 items-center gap-2 border-none cursor-pointer shadow-sm"><Plus className="w-4 h-4"/> إضافة جلسة</button>
                        </div>
                        {childData.sessions.map((session, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-500 font-mono shadow-sm">{session.date}</span>
                                    <span className="text-xs font-bold text-[#0D9488] flex items-center gap-1"><CheckCircle className="w-3 h-3"/> حاضر</span>
                                </div>
                                <h4 className="font-bold text-[#134E4A] mb-2 text-sm">الهدف: {session.goal}</h4>
                                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100"><span className="font-bold text-teal-700">الأنشطة:</span> {session.activities}</p>
                                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100"><span className="font-bold text-teal-700">الاستجابة:</span> {session.response}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 5. المرفقات */}
                {activeTab === 'attachments' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#134E4A]">المرفقات والملفات</h3>
                            <button onClick={() => toast("سيتم فتح نافذة اختيار الملف")} className="text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 flex items-center gap-2 border-none cursor-pointer"><Plus className="w-4 h-4"/> رفع ملف</button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {childData.attachments.map(file => (
                                <div key={file.id} className="border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-teal-300 hover:shadow-md transition-all cursor-pointer bg-gray-50">
                                    {file.type === 'pdf' ? <File className="w-10 h-10 text-red-400 mb-2" /> : <Image className="w-10 h-10 text-blue-400 mb-2" />}
                                    <p className="text-xs font-bold text-gray-700 line-clamp-1">{file.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-1 font-mono">{file.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>

            {/* الزر العائم للموبايل (لو التبويب هو الجلسات) */}
            {activeTab === 'sessions' && (
                <button onClick={() => setSessionModalOpen(true)} className="sm:hidden fixed bottom-6 left-6 w-14 h-14 bg-[#0D9488] text-white rounded-full flex items-center justify-center shadow-2xl border-none outline-none z-50">
                    <Plus className="w-6 h-6" />
                </button>
            )}

            {/* النوافذ المنبثقة (Modals) */}
            
            {/* 🌟 مودال تعديل الـ Case History 🌟 */}
            <ModalWrapper isOpen={isHistoryModalOpen} onClose={() => setHistoryModalOpen(false)} title="تعديل تاريخ دراسة الحالة">
                <form onSubmit={handleSaveHistory} className="space-y-4 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(historyFormData).map(([key, data]) => (
                            <div key={key} className={key === 'complaint' || key === 'strengthsWeaknesses' ? 'md:col-span-2' : ''}>
                                <label className="text-xs font-bold text-gray-700 block mb-1">{data.title}</label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setHistoryFormData(prev => ({
                                        ...prev,
                                        [key]: { ...prev[key], content: e.target.value }
                                    }))}
                                    className="w-full h-24 border border-gray-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-teal-500 outline-none text-sm font-bold resize-none shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-100 flex gap-4">
                         <button type="button" onClick={() => setHistoryModalOpen(false)} className="flex-1 bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer">إلغاء</button>
                         <button type="submit" className="flex-[2] bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all border-none cursor-pointer shadow-md flex items-center justify-center gap-2"><Save className="w-5 h-5"/> حفظ التعديلات</button>
                    </div>
                </form>
            </ModalWrapper>

            {/* مودال إضافة جلسة */}
            <ModalWrapper isOpen={isSessionModalOpen} onClose={() => setSessionModalOpen(false)} title="تسجيل جلسة جديدة">
                <form onSubmit={handleAddFakeSession} className="space-y-4 text-right">
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">الهدف من الجلسة</label><input name="goal" required className="w-full h-10 border border-gray-200 rounded-lg px-3 bg-white focus:ring-2 focus:ring-teal-500 outline-none text-sm font-bold shadow-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">الأنشطة المستخدمة</label><textarea name="activities" required className="w-full h-20 border border-gray-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-teal-500 outline-none text-sm font-bold resize-none shadow-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">استجابة الطفل</label><input name="response" required className="w-full h-10 border border-gray-200 rounded-lg px-3 bg-white focus:ring-2 focus:ring-teal-500 outline-none text-sm font-bold shadow-sm" /></div>
                    <button type="submit" className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all border-none cursor-pointer mt-4 shadow-md"><Save className="w-4 h-4 inline-block mr-2"/> حفظ الجلسة واستهلاك من الباقة</button>
                </form>
            </ModalWrapper>

            {/* مودال إضافة هدف للخطة */}
            <ModalWrapper isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)} title="إضافة هدف للخطة">
                <form onSubmit={handleAddFakeGoal} className="space-y-4 text-right">
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">نوع الهدف</label><select name="type" className="w-full h-10 border border-gray-200 rounded-lg px-3 bg-white outline-none text-sm font-bold shadow-sm"><option value="short">قصير المدى</option><option value="long">طويل المدى</option></select></div>
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">الهدف</label><input name="goalText" required className="w-full h-10 border border-gray-200 rounded-lg px-3 bg-white outline-none text-sm font-bold shadow-sm" placeholder="مثال: نطق حرف الراء بوضوح" /></div>
                    <button type="submit" className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all border-none cursor-pointer mt-4 shadow-md"><Save className="w-4 h-4 inline-block mr-2"/> حفظ الهدف</button>
                </form>
            </ModalWrapper>

            {/* مودال تقييم وهمي */}
            <ModalWrapper isOpen={isAssessmentModalOpen} onClose={() => setAssessmentModalOpen(false)} title="إضافة تقييم جديد">
                <div className="text-center p-6">
                    <ClipboardList className="w-12 h-12 text-teal-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-600 mb-4">هذه النافذة ستسمح برفع وتوثيق درجات اختبارات مثل (IQ, VB-MAPP, Portage) لاحقاً.</p>
                    <button onClick={() => setAssessmentModalOpen(false)} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold border-none cursor-pointer">إغلاق</button>
                </div>
            </ModalWrapper>

        </div>
    );
};

export default ChildTabsContent;