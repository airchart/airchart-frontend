import { FareItem } from "@/remote/useFareItems";

export function FareTable({ fareData }: { fareData: FareItem[] }) {
  const maxFare = Math.max(...fareData.map((item) => item.fare));
  const minFare = Math.min(...fareData.map((item) => item.fare));

  const _fareData = [...fareData].sort((a, b) => {
    return (
      new Date(b.search_date).getTime() - new Date(a.search_date).getTime()
    );
  });

  return (
    <div className="bg-gray-800 md:p-6 p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">날짜별 변동</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 md:px-4 ">구매일</th>
              <th className="text-right py-3 md:px-4 ">가격</th>
            </tr>
          </thead>
          <tbody>
            {_fareData.map((item, index: number) => (
              <tr key={item.search_date} className="border-b border-gray-700">
                <td className="py-3 md:px-4 ">{item.search_date}</td>
                <td className="text-right py-3 md:px-4 ">
                  <div className="flex items-center justify-end gap-2">
                    {item.fare === maxFare && <Chip color="blue">최고</Chip>}
                    {item.fare === minFare && <Chip color="green">최저</Chip>}
                    <div>
                      {item.fare.toLocaleString()}원<br className="md:hidden" />
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

function Chip({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "blue" | "green";
}) {
  const colorClass =
    color === "blue"
      ? "bg-blue-900 text-blue-300"
      : "bg-green-900 text-green-300";

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium ${colorClass} rounded-full`}
    >
      {children}
    </span>
  );
}
