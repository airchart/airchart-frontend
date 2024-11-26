import { FareItem } from "@/remote/useFareItems";

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
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">최저가</p>
        <p className="text-2xl font-bold">{stats.min.toLocaleString()}원</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">평균가</p>
        <p className="text-2xl font-bold">{avgPrice.toLocaleString()}원</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">최고가</p>
        <p className="text-2xl font-bold">{stats.max.toLocaleString()}원</p>
      </div>
    </div>
  );
}
