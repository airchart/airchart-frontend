import { format } from "date-fns";

export function buildNaverFlightUrl(
  origin: string,
  dest: string,
  departDate: Date,
  returnDate: Date | null
) {
  // https://flight.naver.com/flights/international/ICN-NRT-20250204/NRT-ICN-20250212?adult=1&fareType=Y

  const isRoundtrip = returnDate !== null;

  const departDateString = format(departDate, "yyyyMMdd");
  const returnDateString = isRoundtrip ? format(returnDate, "yyyyMMdd") : "";

  return `https://flight.naver.com/flights/international/${origin}-${dest}-${departDateString}${
    isRoundtrip ? `/${dest}-${origin}-${returnDateString}` : ""
  }?adult=1&fareType=Y&isDirect=true`;
}
