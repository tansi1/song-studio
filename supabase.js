import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://nuugxlcydbsfjfrhtkpe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_W-ffO2QB1_axR8WHRJXvtA_C0XUBK4r";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);