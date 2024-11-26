import { FareItem } from "@/remote/useFareItems";
import { formatToKRW } from "@toss/utils";

export function FareStat({ fareData }: { fareData: FareItem[] }) {
  // 통계 데이터 계산
  const stats = fareData.reduce(
    (
      acc: { min: number; max: number; sum: number; count: number },
      curr: { price?: number; fare?: number }
    ) => ({
      min: Math.min(acc.min, curr.price || curr.fare || 0),
      max: Math.max(acc.max, curr.price || curr.fare || 0),
      sum: acc.sum + (curr.price || curr.fare || 0),
      count: acc.count + 1,
    }),
    { min: Infinity, max: -Infinity, sum: 0, count: 0 }
  );

  const avgPrice = stats.count > 0 ? Math.round(stats.sum / stats.count) : 0;

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-8">
      <Card title="최저가" value={stats.min} />
      <Card title="평균가" value={avgPrice} />
      <Card title="최고가" value={stats.max} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex md:flex-col flex-row md:items-start items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{formatToKRW(value)}</p>
    </div>
  );
}
