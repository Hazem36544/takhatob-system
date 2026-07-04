import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabase"; 

import ChildrenHeader from "./components/ChildrenHeader";
import ChildrenSearchBar from "./components/ChildrenSearchBar";
import ChildrenGrid from "./components/ChildrenGrid";
import AddChildModal from "./components/AddChildModal"; 

const Children = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null); 

  const [childrenData, setChildrenData] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false }); 
      if (error) throw error;

      const formattedData = data.map(child => ({
        ...child,
        id: child.id,
        fullName: child.full_name,
        diagnosis: child.diagnosis,
        phone: child.phone,
        avatarUrl: child.avatar_url, 
        parentName: child.parent_name,
        dob: child.date_of_birth,
        address: child.address,
        school: child.school,
        doctor: child.referred_by,
        notes: child.notes,
        sessionsCount: 0, 
        remainingSessions: 0 
      }));

      setChildrenData(formattedData);
      setFilteredChildren(formattedData);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
      setIsPageLoaded(true);
    }
  };

  useEffect(() => { fetchChildren(); }, []);

  const handleEditClick = async (child) => {
    try {
        const { data: pkg } = await supabase.from('packages').select('*').eq('patient_id', child.id).maybeSingle();
        setEditingChild({ ...child, package: pkg });
        setIsAddModalOpen(true);
    } catch (error) {
        toast.error("خطأ في جلب بيانات الباقة");
    }
  };

  const handleCloseModal = () => {
      setIsAddModalOpen(false);
      setTimeout(() => setEditingChild(null), 300); 
  };

  const handleSaveChild = async (finalData) => {
    try {
      if (editingChild) {
        const { error: patientError } = await supabase.from('patients').update({
           full_name: finalData.fullName, date_of_birth: finalData.dob || null, parent_name: finalData.parentName,
           phone: finalData.phone, address: finalData.address, diagnosis: finalData.diagnosis,
           school: finalData.school, referred_by: finalData.doctor, notes: finalData.notes
        }).eq('id', editingChild.id);
        if (patientError) throw patientError;

        if (finalData.sessionsCount || finalData.price || finalData.startDate) {
            const { data: existingPkg } = await supabase.from('packages').select('id').eq('patient_id', editingChild.id).maybeSingle();
            
            const pkgData = {
                patient_id: editingChild.id, start_date: finalData.startDate || null,
                total_sessions: parseInt(finalData.sessionsCount) || 0, price: finalData.price,
                payment_status: finalData.paymentStatus // إرسال حالة الدفع
            };
            if (finalData.schedule) pkgData.schedule = finalData.schedule;

            if (existingPkg) await supabase.from('packages').update(pkgData).eq('id', existingPkg.id);
            else await supabase.from('packages').insert([pkgData]);
        }

        if (finalData.generatedSessions && finalData.generatedSessions.length > 0) {
            await supabase.from('sessions').delete().eq('patient_id', editingChild.id).eq('status', 'pending');
            const sessionsToInsert = finalData.generatedSessions.map(session => ({
                patient_id: editingChild.id, session_date: session.date, status: 'pending',
                notes: `موعد الجلسة المجدول: الساعة ${session.time}`, goal: 'منتظر تحديد الهدف', activities: 'منتظر', response: 'منتظر'
            }));
            await supabase.from('sessions').insert(sessionsToInsert);
        }
        toast.success("تم تعديل بيانات الطفل بنجاح!");

      } else {
        const { data: patientData, error: patientError } = await supabase.from('patients').insert([{
          full_name: finalData.fullName, date_of_birth: finalData.dob || null, parent_name: finalData.parentName,
          phone: finalData.phone, address: finalData.address, diagnosis: finalData.diagnosis,
          school: finalData.school, referred_by: finalData.doctor, notes: finalData.notes
        }]).select().single();
        if (patientError) throw patientError;

        if (finalData.sessionsCount || finalData.price || finalData.startDate) {
            await supabase.from('packages').insert([{
                patient_id: patientData.id, start_date: finalData.startDate || null,
                total_sessions: parseInt(finalData.sessionsCount) || 0, price: finalData.price, 
                schedule: finalData.schedule, payment_status: finalData.paymentStatus // إرسال حالة الدفع
            }]);
        }
        if (finalData.generatedSessions && finalData.generatedSessions.length > 0) {
            const sessionsToInsert = finalData.generatedSessions.map(session => ({
                patient_id: patientData.id, session_date: session.date, status: 'pending',
                notes: `موعد الجلسة المجدول: الساعة ${session.time}`, goal: 'منتظر تحديد الهدف', activities: 'منتظر', response: 'منتظر'
            }));
            await supabase.from('sessions').insert(sessionsToInsert);
        }
        toast.success("تم تسجيل الطفل وجدولة جلساته بنجاح!");
      }

      handleCloseModal();
      fetchChildren(); 

    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) setFilteredChildren(childrenData);
    else setFilteredChildren(childrenData.filter(c => c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm)));
    setVisibleCount(9);
  }, [searchTerm, childrenData]);

  if (loading) return <div className="flex flex-col items-center justify-center min-h-[80vh]"><Loader2 className="w-12 h-12 animate-spin text-teal-600 mb-4" /></div>;

  return (
    <div className="w-full font-sans bg-transparent" dir="rtl" style={{ minHeight: '100vh' }}>
        <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="max-w-7xl mx-auto w-full">
                <ChildrenHeader />
                <div className="flex flex-col gap-6 md:gap-8 pb-10">
                    <ChildrenSearchBar 
                      totalCount={childrenData.length} searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
                      clearSearch={() => setSearchTerm('')} onAddClick={() => setIsAddModalOpen(true)}
                    />
                    <ChildrenGrid 
                      childrenData={childrenData} filteredChildren={filteredChildren} visibleCount={visibleCount} 
                      searchTerm={searchTerm} clearSearch={() => setSearchTerm('')} handleLoadMore={() => setVisibleCount(prev => prev + 9)} 
                      onEditClick={handleEditClick} 
                    />
                </div>
            </div>
        </div>
        <AddChildModal isOpen={isAddModalOpen} onClose={handleCloseModal} onAdd={handleSaveChild} editingData={editingChild} />
    </div>
  );
};

export default Children;