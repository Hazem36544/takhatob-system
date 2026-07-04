import { createClient } from '@supabase/supabase-js';

// رابط المشروع بتاعك
const supabaseUrl = 'https://liymbhdhugjuwgbnvrpi.supabase.co';

// حط مفتاح الـ Publishable key اللي بيبدأ بـ sb_publishable هنا
const supabaseKey = 'sb_publishable_vschP802fIck3TEmDASEMQ_TAXoUIU-'; 

// تهيئة قاعدة البيانات
export const supabase = createClient(supabaseUrl, supabaseKey);