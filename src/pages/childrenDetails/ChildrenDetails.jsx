import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import ChildDetailsHeader from './components/ChildDetailsHeader';
import ChildProfileSidebar from './components/ChildProfileSidebar';
import ChildTabsContent from './components/ChildTabsContent';

const ChildrenDetails = () => {
    const { id } = useParams();
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [childData, setChildData] = useState(null);

    useEffect(() => {
        // داتا وهمية ضخمة ومفصلة لعرضها للعميل
        setTimeout(() => {
            const fakeData = {
                id: id || 'CH-1001',
                fullName: 'أحمد محمود علي',
                age: '5',
                gender: 'Male',
                diagnosis: 'تأخر نمو لغوي مصحوب بتشتت انتباه',
                parentName: 'محمود علي السعيد',
                phone: '01012345678',
                address: 'سوهاج - شارع 15 - بجوار المحطة',
                sessionsCount: 12,
                usedSessions: 4,
                remainingSessions: 8,
                
                caseHistory: {
                    complaint: { title: 'الشكوى الرئيسية', content: 'تأخر في النطق، لا يكون جملاً، ويعتمد على الإشارة.' },
                    developmental: { title: 'التاريخ النمائي', content: 'تأخر في المشي (سنة و 8 أشهر)، الحبو 10 أشهر.' },
                    medical: { title: 'التاريخ الطبي', content: 'حمى شديدة في عمر السنتين، لا يوجد أمراض مزمنة.' },
                    family: { title: 'التاريخ الأسري', content: 'تاريخ عائلي لتأخر الكلام من جهة الأم.' },
                    birth: { title: 'الحمل والولادة', content: 'ولادة قيصرية في الشهر التاسع، وزن طبيعي.' },
                    hearing: { title: 'السمع', content: 'مقياس السمع سليم 100%.' },
                    language: { title: 'اللغة', content: 'استقبالية جيدة، تعبيرية ضعيفة (حصيلة 20 كلمة).' },
                    skills: { title: 'المهارات المعرفية والاجتماعية', content: 'تواصل بصري جيد، ينفذ الأوامر البسيطة.' },
                    behavior: { title: 'السلوك', content: 'عناد وفرط حركة بسيط عند إجباره على الكلام.' },
                    strengthsWeaknesses: { title: 'نقاط القوة والضعف', content: 'القوة: ذاكرة بصرية. الضعف: الانتباه السمعي.' }
                },

                assessments: [
                    { id: 1, name: 'اختبار ستانفورد بينيه (IQ)', date: '2026-06-15', score: '85 (متوسط منخفض)', notes: 'يحتاج لتدخل لزيادة الانتباه التركيزي' },
                    { id: 2, name: 'مقياس بورتيدج (Portage)', date: '2026-06-20', score: 'تأخر سنتين في المجال اللغوي', notes: 'الجانب الحركي سليم' }
                ],

                treatmentPlan: [
                    { id: 1, type: 'long', goal: 'تكوين جملة من 3 كلمات بشكل تلقائي', progress: 40 },
                    { id: 2, type: 'short', goal: 'التعرف على المجموعات الضمنية (الحيوانات والفواكه)', progress: 80 },
                    { id: 3, type: 'short', goal: 'الاستجابة لنداء الاسم في وجود مشتتات', progress: 60 }
                ],

                sessions: [
                    { date: '2026-07-02', goal: 'تنمية مهارة التقليد الصوتي', activities: 'مجسمات الحيوانات', response: 'جيدة مع تشتت مبدئي', homework: 'مراجعة أصوات (القطة، الكلب)', notes: 'يستجيب للتعزيز المادي' },
                    { date: '2026-06-29', goal: 'التعرف على أجزاء الوجه', activities: 'استخدام مرآة وبطاقات', response: 'ممتازة', homework: 'تطبيق اللعبة مع الأم', notes: 'تطور ملحوظ في التركيز' }
                ],

                attachments: [
                    { id: 1, type: 'pdf', name: 'تقرير رسم مخ.pdf', date: '2026-06-10' },
                    { id: 2, type: 'image', name: 'صورة مقياس السمع.jpg', date: '2026-06-12' }
                ]
            };

            setChildData(fakeData);
            setLoading(false);
            setIsPageLoaded(true);
        }, 800);
    }, [id]);

    if (loading || !childData) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader2 className="w-12 h-12 text-[#0D9488] animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full font-sans bg-transparent pb-20" dir="rtl" style={{ minHeight: '100vh' }}>
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                <div className="max-w-7xl mx-auto w-full">
                    
                    <ChildDetailsHeader childName={childData.fullName} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
                        {/* مررنا الداتا هنا عشان العداد يقرأ الأرقام */}
                        <ChildProfileSidebar child={childData} />
                        
                        {/* مررنا الداتا و دالة التحديث عشان الأزرار تعدل في الواجهة */}
                        <ChildTabsContent childData={childData} setChildData={setChildData} />
                    </div>

                </div>
            </div>
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ChildrenDetails;