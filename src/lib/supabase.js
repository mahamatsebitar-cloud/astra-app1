import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nygqrchwrhvgkhjjapue.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Z3FyY2h3cmh2Z2toamphcHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzQ1OTgsImV4cCI6MjA5Mjg1MDU5OH0.8Nwn7TX9IkU9y4uNh9AN3X18dbV_aou33JzfldLHy-A'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)