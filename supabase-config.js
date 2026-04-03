const SUPABASE_URL = "https://bsckjqnqwskpjtsufdov.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_8fkG69MQMNmavW1hZq1_pw_7okJyVA1";

const hasSupabaseLibrary = () => Boolean(window.supabase?.createClient);

const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && hasSupabaseLibrary());
};

const supabase = hasSupabaseLibrary()
  ? window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  : null;

if (!supabase) {
  console.warn(
    "Supabase browser library is missing. Load @supabase/supabase-js before auth modules."
  );
}

export {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  hasSupabaseLibrary,
  isSupabaseConfigured,
  supabase
};
