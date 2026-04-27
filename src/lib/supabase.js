import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nygqrchwrhvgkhjjapue.supabase.co'      // ta vraie URL
const SUPABASE_KEY = 'sb_publishable_rbzxnN3LRsqCJg_1ynUq0w_HroPP3TI'                        // ta vraie clé anon

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)