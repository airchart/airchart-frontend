"use client";

import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cities } from "@/constants/cities";
import { Suspense } from "react";
import { useFareItems } from "@/remote/useFareItems";

function SearchResultContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const type = searchParams.get("type");
  const returnDate = searchParams.get("returnDate");

  // SWR을 사용한 데이터 페칭
  const {
    data: fareData = [],
    error,
    isLoading,
  } = useFareItems(from!, to!, date!);

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

  // 도시 이름 찾기
  const destinationCity = cities.find((city) => city.code === to);
  const formattedDate = date
    ? new Date(date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 text-center">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 text-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto mt-20">
        {/* 검색 정보 요약 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">검색 결과</h1>
          <p className="text-gray-600 dark:text-gray-400">
            인천(ICN) → {destinationCity?.name}({to}) | {formattedDate}
            {type === "roundtrip" && returnDate && ` | 왕복`}
          </p>
        </div>

        {/* 가격 통계 */}
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

        {/* 가격 추이 차트 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">가격 변동 추이</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fareData}>
                <XAxis
                  dataKey="search_date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()}원`}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
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

        {/* 날짜별 최저가 테이블 */}
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
                        {item.fare === stats.max && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            최고
                          </span>
                        )}
                        {item.fare === stats.min && (
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

        {/* 가격 알림 설정 */}
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => {
              /* 알림 설정 모달 열기 */
            }}
          >
            가격 알림 설정하기
          </button>
        </div>
      </main>
    </div>
  );
}

export default function SearchResult() {
  return (
    <Suspense
      fallback={<div className="min-h-screen p-8 text-center">로딩 중...</div>}
    >
      <SearchResultContent />
    </Suspense>
  );
}
