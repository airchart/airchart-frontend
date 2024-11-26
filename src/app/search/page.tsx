"use client";

import { useSearchParams } from "next/navigation";
import { cities } from "@/constants/cities";
import { Suspense } from "react";
import { useFareItems } from "@/remote/useFareItems";
import { FareChart } from "@/components/FareChart";
import { FareTable } from "@/components/FareTable";
import { FareStat } from "@/components/FareStat";

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

        <FareStat fareData={fareData} />

        {/* 가격 추이 차트 */}
        <FareChart fareData={fareData} />

        {/* 날짜별 최저가 테이블 */}
        <FareTable fareData={fareData} />

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
