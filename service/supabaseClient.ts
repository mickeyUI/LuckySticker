import { createClient } from "@supabase/supabase-js";

// One client, used anywhere. Guests only means no session to manage
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
