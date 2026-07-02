import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// استدعاء المكونات الجديدة
import ChildrenHeader from "./components/ChildrenHeader";
import ChildrenSearchBar from "./components/ChildrenSearchBar";
import ChildrenGrid from "./components/ChildrenGrid";
import AddChildModal from "./components/AddChildModal"; // النافذة المنبثقة

const Children = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // التحكم في نافذة الإضافة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // بيانات وهمية ابتدائية
  const [childrenData, setChildrenData] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    // محاكاة جلب البيانات بدون أي سيرفر
    setTimeout(() => {
      const fakeData = [
        { id: 'CH-1001', fullName: 'أحمد محمود علي', diagnosis: 'تأخر نمو لغوي', sessionsCount: 12, remainingSessions: 8 },
        { id: 'CH-1002', fullName: 'سارة خالد سعيد', diagnosis: 'توحد', sessionsCount: 24, remainingSessions: 15 },
        { id: 'CH-1003', fullName: 'عمر ياسر محمد', diagnosis: 'تشتت انتباه', sessionsCount: 8, remainingSessions: 2 }
      ];
      setChildrenData(fakeData);
      setFilteredChildren(fakeData);
      setLoading(false);
      setIsPageLoaded(true);
    }, 800);
  }, []);

  // دالة الإضافة (تستقبل الداتا من المودال وتضيفها للستيت)
  const handleAddChild = (newChild) => {
    const newId = `CH-${Math.floor(Math.random() * 9000) + 1000}`; // توليد ID وهمي
    const childObj = {
      id: newId,
      fullName: newChild.fullName,
      diagnosis: newChild.diagnosis || 'قيد التقييم',
      sessionsCount: newChild.sessionsCount || 0,
      remainingSessions: newChild.sessionsCount || 0,
      ...newChild
    };
    
    const updatedData = [childObj, ...childrenData]; // إضافته في الأول
    setChildrenData(updatedData);
    
    // تحديث الفلتر عشان يظهر فوراً
    if (!searchTerm.trim()) {
        setFilteredChildren(updatedData);
    } else {
        setFilteredChildren(updatedData.filter(c => c.fullName.includes(searchTerm)));
    }

    setIsAddModalOpen(false);
    toast.success("تم تسجيل الطفل بنجاح!");
  };

  // البحث
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChildren(childrenData);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredChildren(childrenData.filter(c => 
        c.fullName?.toLowerCase().includes(term) || 
        c.id?.toLowerCase().includes(term) ||
        c.phone?.includes(term)
      ));
    }
    setVisibleCount(9);
  }, [searchTerm, childrenData]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#0D9488] mb-4" />
        <span className="text-[#0D9488] font-bold text-lg">جاري تحميل سجل الأطفال...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans bg-transparent" dir="rtl" style={{ minHeight: '100vh' }}>
        <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="max-w-7xl mx-auto w-full">

                <ChildrenHeader />

                <div className="flex flex-col gap-6 md:gap-8 pb-10">
                    <ChildrenSearchBar 
                      totalCount={childrenData.length} 
                      searchTerm={searchTerm} 
                      setSearchTerm={setSearchTerm} 
                      clearSearch={() => setSearchTerm('')} 
                      onAddClick={() => setIsAddModalOpen(true)}
                    />

                    <ChildrenGrid 
                      childrenData={childrenData} 
                      filteredChildren={filteredChildren} 
                      visibleCount={visibleCount} 
                      searchTerm={searchTerm} 
                      clearSearch={() => setSearchTerm('')} 
                      handleLoadMore={() => setVisibleCount(prev => prev + 9)} 
                    />
                </div>
            </div>
        </div>

        {/* استدعاء المودال هنا */}
        <AddChildModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddChild} 
        />
    </div>
  );
};

export default Children;