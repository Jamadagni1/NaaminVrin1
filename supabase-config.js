const SUPABASE_URL = "https://bsckjqnqwskpjtsufdov.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_8fkG69MQMNmavW1hZq1_pw_7okJyVA1";

let cachedSupabaseClient = null;

const hasBrowserWindow = () => typeof window !== "undefined";

const hasSupabaseLibrary = () => {
  if (!hasBrowserWindow()) return false;
  return Boolean(window.supabase?.createClient);
};

const canCreateClient = () => {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && hasSupabaseLibrary());
};

const getSupabaseClient = () => {
  if (cachedSupabaseClient) return cachedSupabaseClient;
  if (!canCreateClient()) return null;

  cachedSupabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );

  return cachedSupabaseClient;
};

const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
};

const supabase = getSupabaseClient();

const waitForSupabaseClient = async (timeoutMs = 4000) => {
  const startedAt = Date.now();
  let client = getSupabaseClient();
  if (client) return client;

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    client = getSupabaseClient();
    if (client) return client;
  }

  return null;
};

if (isSupabaseConfigured() && !supabase) {
  console.warn(
    "Supabase browser library is not ready yet. Auth modules will retry automatically."
  );
}

if (!isSupabaseConfigured()) {
  console.warn(
    "Supabase config is missing. Add your project URL and publishable key in supabase-config.js."
  );
}

export {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  hasSupabaseLibrary,
  isSupabaseConfigured,
  getSupabaseClient,
  waitForSupabaseClient,
  supabase
};
