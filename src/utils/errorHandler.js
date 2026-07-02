// src/utils/errorHandler.js

export const getErrorMessage = (error) => {
    // 1. التأكد من وجود اتصال بالسيرفر (سقوط السيرفر أو انقطاع الإنترنت)
    if (!error.response || error.code === 'ERR_NETWORK') {
        return "تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت أو حالة الخادم.";
    }

    const { status, data } = error.response;

    // 2. تجميع نصوص الخطأ للبحث عن الرسائل الإنجليزية الثابتة من (ASP.NET Core Identity)
    const errorText = String(
        data?.detail || data?.title || data?.message || (typeof data === 'string' ? data : "")
    ).toLowerCase();

    // اصطياد وترجمة رسائل تسجيل الدخول الشائعة
    if (errorText.includes("credentials are invalid") || errorText.includes("invalid credentials")) {
        return "اسم المستخدم أو كلمة المرور غير صحيحة.";
    }
    if (errorText.includes("locked out") || errorText.includes("lockout")) {
        return "تم قفل الحساب مؤقتاً لكثرة المحاولات الخاطئة، يرجى المحاولة لاحقاً.";
    }
    if (errorText.includes("temporary password") || errorText.includes("change password")) {
        return "يجب تأمين حسابك بكلمة مرور جديدة قبل الدخول.";
    }

    // 3. قراءة رسائل الخطأ التفصيلية من الباك إند (Validation & ProblemDetails)
    if (data) {
        // لو في أخطاء في الـ Validation (زي حقل إجباري أو صيغة خاطئة)
        if (data.errors && typeof data.errors === 'object') {
            const firstErrorKey = Object.keys(data.errors)[0];
            if (Array.isArray(data.errors[firstErrorKey]) && data.errors[firstErrorKey].length > 0) {
                return data.errors[firstErrorKey][0]; 
            }
        }
    }

    // 4. معالجة أكواد الخطأ الأساسية (Fallbacks)
    if (status === 401) return "اسم المستخدم أو كلمة المرور غير صحيحة، أو انتهت صلاحية الجلسة.";
    if (status === 403) return "لا تملك الصلاحيات الكافية لإجراء هذه العملية.";
    if (status === 404) return "البيانات المطلوبة غير موجودة في النظام.";
    if (status === 409) return "يوجد تعارض: هذه البيانات مسجلة بالفعل.";

    // 5. عرض الرسالة المخصصة من الباك إند (لو لم يتم اصطيادها في الشروط السابقة)
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;

    // 6. رسالة افتراضية لأي خطأ غير معروف
    return "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.";
};