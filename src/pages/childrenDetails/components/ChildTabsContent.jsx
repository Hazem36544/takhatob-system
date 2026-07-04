import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, ClipboardList, TrendingUp, Calendar, Paperclip, ChevronDown, Plus, Edit, X, Save, File, Image as ImageIcon, CheckCircle, XCircle, Clock, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { supabase } from '../../../supabase';
import { toast } from 'react-hot-toast';

const ModalWrapper = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in" dir="rtl">
            <div className="bg-white w-full max-w-lg md:max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                <div className="bg-[#0D9488] p-5 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors border-none cursor-pointer text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50">{children}</div>
            </div>
        </div>,
        document.body
    );
};

const InlineHistoryEdit = ({ title, value, onSave, isOpen, onToggle }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');
    useEffect(() => setTempValue(value || ''), [value]);

    const handleSave = () => {
        if (tempValue !== value) onSave(tempValue);
        setIsEditing(false);
    };

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all bg-white mb-4">
            <div className="w-full bg-gray-50/80 hover:bg-teal-50/50 p-4 flex justify-between items-center font-bold text-[#134E4A] text-sm border-none outline-none cursor-pointer transition-colors" onClick={onToggle}>
                <div className="flex items-center gap-2">{title}</div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-white">
                    {isEditing ? (
                        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                            <textarea className="w-full min-h-[100px] border-2 border-teal-100 bg-teal-50/30 p-3 rounded-xl focus:outline-none focus:border-[#0D9488] text-sm font-medium text-[#134E4A] resize-y shadow-inner" value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border-none outline-none">إلغاء</button>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-[#0D9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border-none outline-none shadow-sm"><CheckCircle size={16} /> حفظ</button>
                            </div>
                        </div>
                    ) : (
                        <div className="group relative text-sm font-medium text-gray-600 leading-relaxed cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-all border border-transparent hover:border-teal-100" onClick={() => setIsEditing(true)}>
                            {value ? <span className="whitespace-pre-wrap">{value}</span> : <span className="text-gray-400 italic">لم يتم الإدخال بعد... اضغط هنا للإضافة</span>}
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-lg shadow-sm text-teal-600"><Edit size={16} /></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ChildTabsContent = ({ childData, setChildData, patientId, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('history');
    const [openAccordion, setOpenAccordion] = useState('complaint');
    const [isLoadingTab, setIsLoadingTab] = useState(false);

    const [sessions, setSessions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [attachments, setAttachments] = useState([]);

    const [isSessionModalOpen, setSessionModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null); 
    
    const [isGoalModalOpen, setGoalModalOpen] = useState(false);
    const [isAssessmentModalOpen, setAssessmentModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const caseHistoryFields = [
        { key: 'complaint', title: 'الشكوى الرئيسية' }, { key: 'developmental', title: 'التاريخ النمائي' },
        { key: 'medical', title: 'التاريخ الطبي' }, { key: 'family', title: 'التاريخ الأسري' },
        { key: 'birth', title: 'الحمل والولادة' }, { key: 'hearing', title: 'السمع' },
        { key: 'language', title: 'اللغة' }, { key: 'skills', title: 'المهارات المعرفية والاجتماعية' },
        { key: 'behavior', title: 'السلوك' }, { key: 'strengthsWeaknesses', title: 'نقاط القوة والضعف' }
    ];

    useEffect(() => {
        const fetchTabData = async () => {
            if (!patientId) return;
            setIsLoadingTab(true);
            try {
                if (activeTab === 'sessions') {
                    const { data } = await supabase.from('sessions').select('*').eq('patient_id', patientId).order('session_date', { ascending: false });
                    setSessions(data || []);
                } else if (activeTab === 'plan') {
                    const { data } = await supabase.from('treatment_plan').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
                    setGoals(data || []);
                } else if (activeTab === 'assessment') {
                    const { data } = await supabase.from('assessments').select('*').eq('patient_id', patientId).order('date', { ascending: false });
                    setAssessments(data || []);
                } else if (activeTab === 'attachments') {
                    const { data } = await supabase.from('attachments').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
                    setAttachments(data || []);
                }
            } catch (error) {
                toast.error("خطأ في جلب البيانات");
            } finally {
                setIsLoadingTab(false);
            }
        };
        fetchTabData();
    }, [activeTab, patientId]);

    const handleUpdateHistoryField = async (fieldKey, newContent) => {
        try {
            const currentHistory = childData.caseHistory || {};
            const fieldTitle = caseHistoryFields.find(f => f.key === fieldKey).title;
            const updatedHistory = { ...currentHistory, [fieldKey]: { title: fieldTitle, content: newContent } };
            const { error } = await supabase.from('patients').update({ case_history: updatedHistory }).eq('id', patientId);
            if (error) throw error;
            setChildData(prev => ({ ...prev, caseHistory: updatedHistory }));
            toast.success("تم التحديث بنجاح!");
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
        }
    };

    // ==== وظائف الجلسات المحدثة ====
    const openEditSessionModal = (session) => {
        setEditingSession(session);
        setSessionModalOpen(true);
    };

    const handleSaveSession = async (e) => {
        e.preventDefault();
        const form = e.target;
        const sessionData = {
            goal: form.goal.value,
            activities: form.activities.value,
            response: form.response.value,
            homework: form.homework.value,
            notes: form.notes.value,
            status: form.status.value 
        };

        try {
            if (editingSession) {
                const { error } = await supabase.from('sessions').update(sessionData).eq('id', editingSession.id);
                if (error) throw error;
                toast.success("تم توثيق الجلسة بنجاح!");
            }
            
            setSessionModalOpen(false);
            setEditingSession(null);
            setActiveTab(''); setTimeout(() => setActiveTab('sessions'), 10); 
            onRefresh(); 
        } catch (error) {
            toast.error("حدث خطأ أثناء التسجيل");
        }
    };

    // استخراج تاريخ اليوم بدقة
    const offset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - offset)).toISOString().split('T')[0];
    
    // إخفاء الجلسات اللي تاريخها لسة مجاش
    const visibleSessions = sessions.filter(s => s.session_date <= localISOTime);

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('treatment_plan').insert([{ patient_id: patientId, type: e.target.type.value, goal: e.target.goalText.value, progress: 0 }]);
            if (error) throw error;
            toast.success("تمت إضافة الهدف!");
            setGoalModalOpen(false);
            setActiveTab(''); setTimeout(() => setActiveTab('plan'), 10);
        } catch (error) { toast.error("حدث خطأ"); }
    };

    const handleUpdateProgress = async (id, newProgress) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, progress: newProgress } : g)); 
        await supabase.from('treatment_plan').update({ progress: newProgress }).eq('id', id);
    };

    const handleDeleteGoal = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الهدف؟')) return;
        await supabase.from('treatment_plan').delete().eq('id', id);
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const handleAddAssessment = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await supabase.from('assessments').insert([{ patient_id: patientId, name: form.name.value, date: form.date.value, score: form.score.value, notes: form.notes.value }]);
            toast.success("تمت إضافة التقييم!");
            setAssessmentModalOpen(false);
            setActiveTab(''); setTimeout(() => setActiveTab('assessment'), 10);
        } catch (error) { toast.error("حدث خطأ"); }
    };
    
    const handleDeleteAssessment = async (id) => {
        if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
        await supabase.from('assessments').delete().eq('id', id);
        setAssessments(prev => prev.filter(a => a.id !== id));
    };

    const handleFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `doc_${patientId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `files/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('attachments').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(filePath);
            await supabase.from('attachments').insert([{ patient_id: patientId, name: file.name, type: fileExt, file_url: publicUrl }]);
            toast.success('تم رفع الملف بنجاح');
            setActiveTab(''); setTimeout(() => setActiveTab('attachments'), 10);
        } catch (error) { toast.error('حدث خطأ أثناء رفع الملف'); } finally { setIsUploading(false); }
    };

    const handleDeleteFile = async (id, fileUrl) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
        const filePath = fileUrl.split('/attachments/')[1];
        if(filePath) await supabase.storage.from('attachments').remove([filePath]);
        await supabase.from('attachments').delete().eq('id', id);
        setAttachments(prev => prev.filter(f => f.id !== id));
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
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar flex gap-2 w-full">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border-none outline-none cursor-pointer shrink-0 ${activeTab === tab.id ? 'bg-[#0D9488] text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}>
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 min-h-[50vh]">
                {isLoadingTab ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>
                ) : (
                    <>
                        {activeTab === 'history' && (
                            <div className="animate-in fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#134E4A]">تاريخ دراسة الحالة</h3>
                                </div>
                                {caseHistoryFields.map((field) => {
                                    const fieldData = childData.caseHistory?.[field.key];
                                    return (
                                        <InlineHistoryEdit 
                                            key={field.key} title={field.title} value={fieldData?.content || ''}
                                            isOpen={openAccordion === field.key} onToggle={() => setOpenAccordion(openAccordion === field.key ? null : field.key)}
                                            onSave={(newContent) => handleUpdateHistoryField(field.key, newContent)}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'assessment' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#134E4A]">التقييمات والاختبارات</h3>
                                    <button onClick={() => setAssessmentModalOpen(true)} className="text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 flex items-center gap-2 border-none cursor-pointer"><Plus className="w-4 h-4"/> إضافة تقييم</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {assessments.length === 0 && <p className="text-gray-400 text-sm">لا توجد تقييمات مضافة.</p>}
                                    {assessments.map(ass => (
                                        <div key={ass.id} className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl relative group">
                                            <button onClick={() => handleDeleteAssessment(ass.id)} className="absolute top-3 left-3 text-red-400 hover:text-red-600 bg-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer shadow-sm"><Trash2 className="w-4 h-4"/></button>
                                            <div className="flex justify-between items-start mb-2 pr-8">
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

                        {activeTab === 'plan' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#134E4A]">الخطة العلاجية (الأهداف)</h3>
                                    <button onClick={() => setGoalModalOpen(true)} className="text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 flex items-center gap-2 border-none cursor-pointer"><Plus className="w-4 h-4"/> إضافة هدف</button>
                                </div>
                                <div className="space-y-4">
                                    {goals.length === 0 && <p className="text-gray-400 text-sm">لم يتم إضافة أهداف للخطة.</p>}
                                    {goals.map(plan => (
                                        <div key={plan.id} className="border border-gray-100 p-4 rounded-2xl shadow-sm relative group">
                                            <button onClick={() => handleDeleteGoal(plan.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                                            <div className="flex justify-between items-center mb-3 pr-8">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${plan.type === 'long' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{plan.type === 'long' ? 'طويل المدى' : 'قصير المدى'}</span>
                                                    <h4 className="font-bold text-gray-800 text-sm">{plan.goal}</h4>
                                                </div>
                                                <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2 py-1 rounded-lg">{plan.progress}% منجز</span>
                                            </div>
                                            <input type="range" min="0" max="100" step="10" value={plan.progress} onChange={(e) => handleUpdateProgress(plan.id, e.target.value)} className="w-full accent-teal-600 cursor-pointer" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'sessions' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#134E4A]">سجل الجلسات المجدولة والحضور</h3>
                                    {/* شلنا زرار الإضافة اللي كان هنا زي ما طلبت */}
                                </div>
                                {visibleSessions.length === 0 && <p className="text-gray-400 text-sm font-bold text-center py-6">لا توجد جلسات مجدولة لتاريخ اليوم أو تواريخ سابقة.</p>}
                                {visibleSessions.map((session) => {
                                    const isCompleted = session.status === 'completed';
                                    const isAbsent = session.status === 'absent';
                                    const isPending = session.status === 'pending' || !session.status;
                                    
                                    return (
                                        <div key={session.id} className={`border p-5 rounded-2xl transition-all ${isCompleted ? 'bg-teal-50/20 border-teal-100' : isAbsent ? 'bg-red-50/30 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-gray-600 font-mono shadow-sm border border-gray-100">{session.session_date}</span>
                                                <div className="flex items-center gap-2">
                                                    {isCompleted && <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-1 rounded-lg flex items-center gap-1"><CheckCircle className="w-3 h-3"/> حاضر</span>}
                                                    {isAbsent && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg flex items-center gap-1"><XCircle className="w-3 h-3"/> غائب</span>}
                                                    {isPending && <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg flex items-center gap-1"><Clock className="w-3 h-3"/> منتظر التوثيق</span>}
                                                    
                                                    {/* زرار التوثيق الجديد المميز */}
                                                    <button onClick={() => openEditSessionModal(session)} className="text-xs font-bold bg-[#0D9488] hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg cursor-pointer outline-none flex items-center gap-1.5 shadow-sm transition-colors border-none">
                                                        <Edit className="w-3.5 h-3.5"/> {isPending ? 'توثيق الجلسة' : 'تعديل البيانات'}
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className={`font-bold mb-2 text-sm ${isPending ? 'text-gray-500 italic' : 'text-[#134E4A]'}`}>الهدف: {session.goal}</h4>
                                            
                                            {!isPending && (
                                                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                                                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100"><span className="font-bold text-teal-700">الأنشطة:</span> {session.activities}</p>
                                                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100"><span className="font-bold text-teal-700">الاستجابة:</span> {session.response}</p>
                                                    {session.homework && <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100"><span className="font-bold text-orange-600">الواجب:</span> {session.homework}</p>}
                                                    {session.notes && <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100"><span className="font-bold text-purple-600">ملاحظات:</span> {session.notes}</p>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'attachments' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#134E4A]">المرفقات والملفات</h3>
                                    <div className="relative">
                                        <input type="file" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <button className="text-sm font-bold bg-[#0D9488] text-white px-4 py-2 rounded-xl hover:bg-teal-700 flex items-center gap-2 border-none outline-none">
                                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : <UploadCloud className="w-4 h-4"/>} 
                                            {isUploading ? 'جاري الرفع...' : 'رفع ملف'}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {attachments.length === 0 && <p className="text-gray-400 text-sm col-span-3">لا توجد ملفات.</p>}
                                    {attachments.map(file => (
                                        <div key={file.id} className="relative border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-teal-300 hover:shadow-md transition-all bg-gray-50 group">
                                            <button onClick={() => handleDeleteFile(file.id, file.file_url)} className="absolute top-2 left-2 text-red-400 hover:text-red-600 p-1 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer z-20"><Trash2 className="w-4 h-4"/></button>
                                            <a href={file.file_url} target="_blank" rel="noreferrer" className="w-full flex flex-col items-center text-decoration-none">
                                                {file.type.match(/(jpg|jpeg|png|gif)/i) ? <ImageIcon className="w-10 h-10 text-blue-400 mb-2" /> : <File className="w-10 h-10 text-red-400 mb-2" />}
                                                <p className="text-xs font-bold text-gray-700 line-clamp-1 w-full truncate">{file.name}</p>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ModalWrapper isOpen={isSessionModalOpen} onClose={() => {setSessionModalOpen(false); setEditingSession(null);}} title="توثيق بيانات الجلسة">
                <form key={editingSession ? editingSession.id : 'new'} onSubmit={handleSaveSession} className="space-y-4 text-right">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">حالة الحضور</label>
                        <select name="status" defaultValue={editingSession?.status !== 'pending' ? editingSession?.status : 'completed'} className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none text-sm font-bold shadow-sm bg-white cursor-pointer">
                            <option value="completed">حاضر (تمت الجلسة)</option>
                            <option value="absent">غائب</option>
                        </select>
                    </div>

                    <div><label className="text-xs font-bold text-gray-700 block mb-1">الهدف من الجلسة</label><input name="goal" defaultValue={editingSession?.goal !== 'منتظر تحديد الهدف' ? editingSession?.goal : ''} required className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none text-sm font-bold shadow-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">الأنشطة المستخدمة</label><textarea name="activities" defaultValue={editingSession?.activities !== 'منتظر' ? editingSession?.activities : ''} required className="w-full h-20 border border-gray-200 rounded-lg p-3 outline-none text-sm font-bold resize-none shadow-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-700 block mb-1">استجابة الطفل</label><input name="response" defaultValue={editingSession?.response !== 'منتظر' ? editingSession?.response : ''} required className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none text-sm font-bold shadow-sm" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-700 block mb-1">الواجب المنزلي</label><input name="homework" defaultValue={editingSession?.homework || ''} className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none text-sm font-bold shadow-sm" /></div>
                        <div><label className="text-xs font-bold text-gray-700 block mb-1">ملاحظات إضافية</label><input name="notes" defaultValue={editingSession?.notes && !editingSession.notes.includes('موعد الجلسة المجدول') ? editingSession.notes : ''} className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none text-sm font-bold shadow-sm" /></div>
                    </div>
                    <button type="submit" className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all border-none cursor-pointer mt-4 shadow-md"><Save className="w-4 h-4 inline-block ml-2"/> حفظ وتوثيق الجلسة</button>
                </form>
            </ModalWrapper>

            <ModalWrapper isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)} title="إضافة هدف للخطة">
                <form onSubmit={handleAddGoal} className="space-y-4 text-right">
                    <div><label className="text-xs font-bold block mb-1">نوع الهدف</label><select name="type" className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none shadow-sm"><option value="short">قصير المدى</option><option value="long">طويل المدى</option></select></div>
                    <div><label className="text-xs font-bold block mb-1">الهدف</label><input name="goalText" required className="w-full h-10 border border-gray-200 rounded-lg px-3 outline-none shadow-sm" placeholder="مثال: نطق كلمة..." /></div>
                    <button type="submit" className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all border-none cursor-pointer mt-4 shadow-md"><Save className="w-4 h-4 inline-block ml-2"/> حفظ الهدف</button>
                </form>
            </ModalWrapper>

            <ModalWrapper isOpen={isAssessmentModalOpen} onClose={() => setAssessmentModalOpen(false)} title="إضافة تقييم/اختبار">
                <form onSubmit={handleAddAssessment} className="space-y-4 text-right">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold block mb-1">اسم الاختبار (مثال: IQ)</label><input name="name" required className="w-full h-10 border border-gray-200 rounded-lg px-3 shadow-sm outline-none" /></div>
                        <div><label className="text-xs font-bold block mb-1">التاريخ</label><input type="date" name="date" required className="w-full h-10 border border-gray-200 rounded-lg px-3 shadow-sm outline-none" /></div>
                    </div>
                    <div><label className="text-xs font-bold block mb-1">النتيجة/الدرجة</label><input name="score" required className="w-full h-10 border border-gray-200 rounded-lg px-3 shadow-sm outline-none" /></div>
                    <div><label className="text-xs font-bold block mb-1">ملاحظات</label><textarea name="notes" className="w-full h-20 border border-gray-200 rounded-lg p-3 resize-none shadow-sm outline-none" /></div>
                    <button type="submit" className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all border-none cursor-pointer mt-4 shadow-md"><Save className="w-4 h-4 inline-block ml-2"/> حفظ التقييم</button>
                </form>
            </ModalWrapper>
        </div>
    );
};

export default ChildTabsContent;