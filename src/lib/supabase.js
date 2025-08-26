import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://inbvsrgqtvxjyegpxrhp.supabase.co"; // ganti
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYnZzcmdxdHZ4anllZ3B4cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTQ5ODcsImV4cCI6MjA3MTc5MDk4N30.QHNxFhNb-2MB__tF3-4zcqHHWYq6vA-mOR-yUP0F82o"; // ganti

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
