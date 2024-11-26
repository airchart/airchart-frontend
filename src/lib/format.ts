import { format } from "date-fns";
import { ko } from "date-fns/locale";

/** '2024-11-20' -> '2024년 11월 20일' */
export function formatKORDateString(date: Date) {
  return format(date, "PPP", { locale: ko });
}
