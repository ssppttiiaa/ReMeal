import { supabase } from "./supabase";

export async function testSupabaseSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabase session error:", error);
    return;
  }

  console.log("Supabase session:", data.session);
}