import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// استدعاء ملف Supabase اللي عملناه
import { supabase } from "../../supabase"; // <-- تأكد من صحة هذا المسار 

// استدعاء المكونات الجديدة
import { TakhatobHeader, TakhatobFooter } from "./components/TakhatobLayout";
import TakhatobLoginForm from "./components/TakhatobLoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateLoginForm = () => {
    let errors = {};
    let isValid = true;
    if (!email.trim()) { errors.email = "يرجى إدخال البريد الإلكتروني"; isValid = false; }
    if (!password.trim()) { errors.password = "يرجى إدخال كلمة المرور"; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  // حولنا الدالة دي لـ async عشان نقدر نكلم السيرفر
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setError("");
    setFormErrors({});

    try {
      // الاتصال بـ Supabase للتحقق من بيانات الدخول
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      // لو فيه خطأ (الباسورد غلط أو الإيميل مش موجود)
      if (authError) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setIsLoading(false);
        return;
      }

      // لو الدخول نجح، بنبعت بيانات اليوزر للـ Context
      if (login && data.session) {
        login(data.user, data.session.access_token);
      }
      
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/dashboard"); 

    } catch (err) {
      console.error(err);
      setError("حدث خطأ في الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
       handleLogin(e);
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (formErrors[fieldName]) {
        setFormErrors(prev => ({...prev, [fieldName]: null}));
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slowGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-gradient-bg {
            background: linear-gradient(-45deg, #F0FDFA, #CCFBF1, #E0F2FE, #F8FAFC);
            background-size: 400% 400%;
            animation: slowGradient 15s ease infinite;
          }
        `}
      </style>

      <div 
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden animated-gradient-bg" 
        dir="rtl" 
        style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif' }}
      >
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#0D9488] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-pulse" style={{ animationDuration: '12s' }}></div>

        <div className="w-full max-w-[460px] relative z-10">
          <TakhatobHeader />
          <TakhatobLoginForm 
            email={email} setEmail={setEmail} 
            password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword} 
            isLoading={isLoading} error={error} formErrors={formErrors}
            handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} handleLogin={handleLogin} 
          />
          <TakhatobFooter />
        </div>
      </div>
    </>
  );
}