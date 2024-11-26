import { FareItem } from "@/remote/useFareItems";

export function FareTable({ fareData }: { fareData: FareItem[] }) {
  const maxFare = Math.max(...fareData.map((item) => item.fare));
  const minFare = Math.min(...fareData.map((item) => item.fare));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">검색 기록</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4">검색일</th>
              <th className="text-left py-3 px-4">출발일</th>
              <th className="text-right py-3 px-4">가격</th>
            </tr>
          </thead>
          <tbody>
            {fareData.map((item, index: number) => (
              <tr
                key={item.search_date}
                className="border-b dark:border-gray-700"
              >
                <td className="py-3 px-4">
                  {new Date(item.search_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-3 px-4">
                  {new Date(item.depart_date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="text-right py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {item.fare === maxFare && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                        최고
                      </span>
                    )}
                    {item.fare === minFare && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                        최저
                      </span>
                    )}
                    <div>
                      {item.fare.toLocaleString()}원
                      {index < fareData.length - 1 && (
                        <span
                          className={`ml-2 text-sm ${
                            ((item.fare - fareData[index + 1].fare) /
                              fareData[index + 1].fare) *
                              100 >
                            0
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {`(${
                            ((item.fare - fareData[index + 1].fare) /
                              fareData[index + 1].fare) *
                              100 >
                            0
                              ? "+"
                              : ""
                          }${(
                            ((item.fare - fareData[index + 1].fare) /
                              fareData[index + 1].fare) *
                            100
                          ).toFixed(1)}%)`}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
