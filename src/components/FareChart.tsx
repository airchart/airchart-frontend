import { FareItem } from "@/remote/useFareItems";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { formatToKRW } from "@toss/utils";

export function FareChart({ fareData }: { fareData: FareItem[] }) {
  const _fareData = [...fareData].sort((a, b) => {
    return (
      new Date(a.search_date).getTime() - new Date(b.search_date).getTime()
    );
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-4">가격 변동 추이</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={_fareData}>
            <XAxis dataKey="search_date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip formatter={(value) => formatToKRW(Number(value))} />
            <Line
              type="monotone"
              dataKey="fare"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
