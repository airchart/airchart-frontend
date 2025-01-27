import { getAirportIndex, supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

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
      .order("search_date", { ascending: false })
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
