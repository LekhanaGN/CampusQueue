const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

function createSupabaseClient(token) {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            },
            global: {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {}
            }
        }
    );
}

const supabase = createSupabaseClient();

module.exports = supabase;
module.exports.createSupabaseClient = createSupabaseClient;