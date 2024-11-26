import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AIRPORT_CODES = [
  "NRT",
  "HND",
  "KIX",
  "FUK",
  "CTS",
  "CDG",
  "BCN",
  "ICN",
] as const;

export function getAirportIndex(code: string) {
  return AIRPORT_CODES.indexOf(code as (typeof AIRPORT_CODES)[number]);
}

export function getAirportCode(index: number) {
  return AIRPORT_CODES[index];
}
