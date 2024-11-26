import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

function getAirportIndex(code: string) {
  return AIRPORT_CODES.indexOf(code as (typeof AIRPORT_CODES)[number]);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (!from || !to || !date) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const originIndex = getAirportIndex(from);
    const destinationIndex = getAirportIndex(to);

    if (originIndex === -1 || destinationIndex === -1) {
      return NextResponse.json(
        { error: "Invalid airport code" },
        { status: 400 }
      );
    }

    const { data, error: supabaseError } = await supabase
      .from("lowest_fare_history")
      .select("*")
      .eq("origin", originIndex)
      .eq("destination", destinationIndex)
      .eq("depart_date", date)
      .order("search_date", { ascending: true })
      .limit(30);

    if (supabaseError) throw supabaseError;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching fares:", error);
    return NextResponse.json(
      { error: "Failed to fetch fare data" },
      { status: 500 }
    );
  }
}
