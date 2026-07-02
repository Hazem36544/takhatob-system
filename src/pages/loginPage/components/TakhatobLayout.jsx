import React from 'react';

export const TakhatobHeader = () => (
  <>
    {/* الهيكل للوجو كما طلبت */}
    <div className="flex justify-center mb-6">
      <div className="w-32 h-32">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`} 
          alt="Takhatob Logo"
          className="w-full h-full object-contain"
          onError={(e) => { e.target.src = 'https://placehold.co/128x128/png?text=Takhatob'; }} 
        />
      </div>
    </div>

    {/* نصوص مشروع التخاطب الجديد بالألوان الجديدة */}
    <div className="text-center mb-3">
      <h1 className="text-3xl font-black text-[#134E4A] mb-2 tracking-tight">نظام إدارة التخاطب</h1>
      <p className="text-sm font-bold text-[#0D9488] tracking-wider">المنصة المتكاملة للأخصائيين</p>
    </div>
  </>
);

export const TakhatobFooter = () => (
  <div className="text-center">
    <p className="text-sm text-[#64748B] font-bold">
      نظام آمن لإدارة الجلسات وسجلات الأطفال
    </p>
  </div>
);