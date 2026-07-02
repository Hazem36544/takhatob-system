import React from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const TakhatobLoginForm = ({
  email, setEmail, password, setPassword,
  showPassword, setShowPassword, isLoading, error, formErrors,
  handleInputChange, handleKeyPress, handleLogin
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-in fade-in duration-500">
    <h2 className="text-xl font-bold mb-8 text-center text-[#134E4A]">تسجيل الدخول</h2>

    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-bold flex items-center gap-2 justify-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative">
        <label className="block mb-2 text-[#134E4A] font-bold text-sm text-right">
          البريد الإلكتروني
        </label>
        <input
          type="email" 
          value={email}
          onChange={handleInputChange(setEmail, 'email')}
          placeholder="admin@takhatob.com"
          className={`w-full h-12 px-4 text-sm rounded-lg text-right outline-none transition-all font-mono border
            ${formErrors.email ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400' : 'bg-[#F8F9FA] border-[#E1E8ED] focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]'}
          `}
          dir="ltr"
          disabled={isLoading}
          onKeyDown={handleKeyPress}
        />
        {formErrors.email && <p className="absolute -bottom-5 right-0 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.email}</p>}
      </div>

      <div className="relative">
        <label className="block mb-2 text-[#134E4A] font-bold text-sm text-right">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleInputChange(setPassword, 'password')}
            placeholder="أدخل كلمة المرور"
            className={`w-full h-12 pr-4 pl-12 text-sm rounded-lg text-right outline-none transition-all font-mono border
              ${formErrors.password ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400' : 'bg-[#F8F9FA] border-[#E1E8ED] focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]'}
            `}
            dir="ltr"
            disabled={isLoading}
            onKeyDown={handleKeyPress}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0D9488] transition-colors focus:outline-none border-none bg-transparent cursor-pointer"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formErrors.password && <p className="absolute -bottom-5 right-0 text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formErrors.password}</p>}
      </div>

      <button
        type="button"
        onClick={handleLogin} 
        disabled={isLoading}
        className="w-full h-12 text-base font-bold rounded-lg mt-8 flex items-center justify-center gap-2 border-none transition-all text-white hover:bg-[#0F766E]"
        style={{ background: isLoading ? '#94A3B8' : '#0D9488', cursor: isLoading ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري التحقق...</> : "الدخول للوحة التحكم"}
      </button>
    </div>
  </div>
);

export default TakhatobLoginForm;