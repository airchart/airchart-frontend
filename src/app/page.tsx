"use client";

import { cities } from "@/constants/cities";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TripType = "oneway" | "roundtrip";

export default function Home() {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !destination ||
      !departureDate ||
      (tripType === "roundtrip" && !returnDate)
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 날짜 형식 변환 (YYYY-MM-DD -> YYYYMMDD)
    const formattedDepartureDate = departureDate.replace(/-/g, "");
    const formattedReturnDate = returnDate.replace(/-/g, "");

    const searchParams = new URLSearchParams({
      from: "ICN",
      to: destination,
      date: formattedDepartureDate,
      type: tripType,
      ...(tripType === "roundtrip" && { returnDate: formattedReturnDate }),
    });

    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-md mx-auto mt-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">AirChart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            항공권 가격 추이를 한눈에 확인하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 여정 타입 선택 */}
          <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                tripType === "oneway"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setTripType("oneway")}
            >
              편도
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                tripType === "roundtrip"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setTripType("roundtrip")}
            >
              왕복
            </button>
          </div>

          {/* 출발지 (고정값) */}
          <div>
            <label className="block text-sm font-medium mb-2">출발지</label>
            <input
              type="text"
              value="인천국제공항 (ICN)"
              disabled
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* 도착지 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">도착지</label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            >
              <option value="" disabled>
                도시를 선택하세요
              </option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </div>

          {/* 날짜 선택 */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                출발 날짜
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 [color-scheme:light]"
                required
              />
            </div>

            {tripType === "roundtrip" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  귀국 날짜
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 [color-scheme:light]"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            가격 추이 검색
          </button>
        </form>
      </main>
    </div>
  );
}
