"use client";

import { useSearchParams } from "next/navigation";
import { cities } from "@/constants/cities";
import { Suspense } from "react";
import { FareItem, useFareItems } from "@/remote/useFareItems";
import { FareChart } from "@/components/FareChart";
import { FareTable } from "@/components/FareTable";
import { FareStat } from "@/components/FareStat";
import { formatKORDateString } from "@/lib/format";
import { parse } from "date-fns";
import { formatToKRW } from "@toss/utils";
import { buildNaverFlightUrl } from "@/lib/naver";
import { InfoCircledIcon } from "@radix-ui/react-icons";

// 연속된 가격 변동 일수를 계산하는 함수
function getConsecutivePriceChange(
  fareData: FareItem[]
): [number, "plus" | "minus" | null] {
  let count = 0;
  let sign: "plus" | "minus" | null = null;
  let i = 0;

  while (i < fareData.length - 1) {
    if (fareData[i].fare > fareData[i + 1].fare) {
      if (sign === "minus") {
        break;
      }

      count++;
      sign = "plus";
    } else if (fareData[i].fare < fareData[i + 1].fare) {
      if (sign === "plus") {
        break;
      }

      count++;
      sign = "minus";
    } else {
      break;
    }

    i++;
  }

  return [count, sign];
}

// 출발까지 남은 일수를 계산하는 함수
function getDaysUntilDeparture(departureDate: Date): number {
  const today = new Date();
  const diffTime = departureDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function SearchResultContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from")!;
  const to = searchParams.get("to")!;
  const departDateString = searchParams.get("date")!;
  const returnDateString = searchParams.get("returnDate");

  // SWR을 사용한 데이터 페칭
  const { data: fareData = [], isLoading } = useFareItems(
    from!,
    to!,
    departDateString!,
    returnDateString
  );

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 text-center">데이터 불러오는 중...</div>
    );
  }

  const departDate = parse(departDateString!, "yyyyMMdd", new Date());
  const returnDate = returnDateString
    ? parse(returnDateString!, "yyyyMMdd", new Date())
    : null;

  const isRoundtrip = returnDateString != null;

  // 도시 이름 찾기
  const destCity = cities.find((city) => city.code === to);

  if (fareData.length === 0) {
    return <div>검색 결과가 없습니다.</div>;
  }

  const currentRecord = fareData[0];
  const currentFare = currentRecord.fare;
  const minFare = Math.min(...fareData.map((x) => x.fare));
  const maxFare = Math.max(...fareData.map((x) => x.fare));
  const avgFare = Math.round(
    fareData.reduce((acc, curr) => acc + curr.fare, 0) / fareData.length
  );

  const [consecutivePriceChange, sign] = getConsecutivePriceChange(fareData);
  console.log(consecutivePriceChange, sign);

  return (
    <div className="min-h-screen md:p-8 p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto md:mt-20 mt-12">
        {/* 검색 정보 요약 */}
        <div className="flex md:flex-row flex-col items-center md:justify-between">
          <div className="md:mb-12 mb-8 space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              인천(ICN) {isRoundtrip ? "↔" : "→"} {destCity?.name}({to}) |{" "}
              {formatKORDateString(departDate)}
              {isRoundtrip && ` ~ ${formatKORDateString(returnDate!)}`}
            </p>
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-3xl font-bold mb-2 leading-relaxed w-fit">
                지금{isRoundtrip ? " 왕복 " : ""}
                <br className="md:hidden" />
                <b className="text-red-500">
                  {formatToKRW(currentRecord.fare)}
                </b>
                에
                <br />
                구매할 수 있어요
              </h1>

              <div className="relative">
                <InfoCircledIcon className="size-6 cursor-pointer hover:opacity-80 peer" />
                <div className="absolute z-10 opacity-0 peer-hover:opacity-100 transition-opacity duration-200 bg-gray-200 text-gray-800 text-sm rounded-md p-2 -right-2 top-8 md:w-80 w-64">
                  - 매일 자정에 업데이트돼요. 실시간 가격과 조금 다를 수 있어요
                  <br />
                  - 직항/1인 기준 금액이에요
                  <br />
                  {isRoundtrip
                    ? "- 가는편/오는편 편도 기준으로 합산된 금액이에요. 왕복 기준은 더 저렴할 수 있어요."
                    : ""}
                </div>
              </div>
            </div>
          </div>

          <NaverFlightButton
            origin={from}
            dest={to}
            departDate={departDate}
            returnDate={returnDate}
          />
        </div>

        <div className="space-y-2 mb-8 text-sm text-gray-600 dark:text-gray-400">
          {currentFare > minFare && currentFare !== maxFare ? (
            <InfoItem>
              • 30일 최저가보다{" "}
              <span className="text-blue-500 font-bold">
                {formatToKRW(currentRecord.fare - minFare)}
              </span>{" "}
              비싸요
            </InfoItem>
          ) : currentFare === minFare ? (
            <InfoItem>
              • 최근 30일 중{" "}
              <span className="text-green-500 font-bold">최저가에요! 😃</span>
            </InfoItem>
          ) : null}
          {currentFare < maxFare && currentFare > minFare ? (
            <InfoItem>
              • 30일 최고가보다{" "}
              <span className="text-green-500 font-bold">
                {formatToKRW(maxFare - currentRecord.fare)}
              </span>{" "}
              저렴해요
            </InfoItem>
          ) : currentFare === maxFare ? (
            <InfoItem>
              • 최근 30일 중{" "}
              <span className="text-blue-500 font-bold">최고가에요 😢</span>
            </InfoItem>
          ) : null}
          {currentFare !== avgFare ? (
            <InfoItem>
              • 30일 평균가보다{" "}
              {currentFare > avgFare ? (
                <>
                  <span className="text-blue-500 font-bold">
                    {formatToKRW(currentFare - avgFare)}
                  </span>{" "}
                  비싸요
                </>
              ) : (
                <>
                  <span className="text-green-500 font-bold">
                    {formatToKRW(avgFare - currentFare)}
                  </span>{" "}
                  저렴해요
                </>
              )}
            </InfoItem>
          ) : null}

          {/* 연속 가격 변동 표시 */}
          {consecutivePriceChange > 2 && (
            <InfoItem>
              • 최근{" "}
              <span className="font-bold">{consecutivePriceChange}일</span> 연속
              가격이{" "}
              {sign === "plus" ? (
                <span className="text-blue-500 font-bold">상승</span>
              ) : (
                <span className="text-green-500 font-bold">하락</span>
              )}
              했어요
            </InfoItem>
          )}

          {/* 출발까지 3주 이내인 경우에만 표시 */}
          {getDaysUntilDeparture(departDate) <= 21 && (
            <InfoItem>
              • 보통 3주 전부터 금액이 낮아지지 않아요.{" "}
              <br className="md:hidden" />
              존버보단 <b>구매</b>를 추천해요
            </InfoItem>
          )}
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

function InfoItem({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-300 text-lg">{children}</p>;
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

const NAVER_FLIGHT_ICON_URL = "/image/naver.jpg";
function NaverFlightButton({
  origin,
  dest,
  departDate,
  returnDate,
}: {
  origin: string;
  dest: string;
  departDate: Date;
  returnDate: Date | null;
}) {
  const url = buildNaverFlightUrl(origin, dest, departDate, returnDate);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#02D070] hover:opacity-80 transition-opacity rounded-md px-6 py-2 flex items-center gap-2 text-white w-fit font-bold md:self-auto self-end md:mb-0 mb-16 text-xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={NAVER_FLIGHT_ICON_URL} alt="네이버 항공" className="w-6 h-6" />
      바로 구매하기
    </a>
  );
}
