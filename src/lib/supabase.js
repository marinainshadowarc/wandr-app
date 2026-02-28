import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtnugabaxipgourmmkne.supabase.co';
const supabaseAnonKey = 'sb_publishable_c79RMiV6pyoHWmlcLHkH1Q_fqCxyYCY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
