import { getAirportIndex, supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");

  if (!from || !to || !date || !returnDate) {
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

    const { data: departureData, error: departureError } = await supabase
      .from("lowest_fare_history")
      .select("*")
      .eq("origin", originIndex)
      .eq("destination", destinationIndex)
      .eq("depart_date", date)
      .order("search_date", { ascending: false })
      .limit(30);

    if (departureError) throw departureError;

    const { data: returnData, error: returnError } = await supabase
      .from("lowest_fare_history")
      .select("*")
      .eq("origin", destinationIndex)
      .eq("destination", originIndex)
      .eq("depart_date", returnDate)
      .order("search_date", { ascending: false })
      .limit(30);

    if (returnError) throw returnError;

    const responseData = departureData
      .map((departEle) => {
        const returnMatched = returnData.find(
          (returnEle) => returnEle.search_date === departEle.search_date
        );

        if (returnMatched == null) return null;

        return {
          ...departEle,
          fare: departEle.fare + returnMatched.fare,
        };
      })
      .filter((x) => x != null);

    return NextResponse.json({ data: responseData });
  } catch (error) {
    console.error("Error fetching fares:", error);
    return NextResponse.json(
      { error: "Failed to fetch fare data" },
      { status: 500 }
    );
  }
}
