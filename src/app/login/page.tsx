"use client";

import { useEffect } from "react";
import Image from "next/image";

declare global {
  interface Window {
    Kakao: {
      init: (apiKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (settings: { redirectUri: string }) => void;
      };
    };
  }
}

export default function LoginPage() {
  useEffect(() => {
    const initializeKakao = () => {
      if (typeof window.Kakao === "undefined") {
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!);
      }
    };

    // Kakao SDK가 로드되었는지 확인
    if (document.readyState === "complete") {
      initializeKakao();
    } else {
      window.addEventListener("load", initializeKakao);
      return () => window.removeEventListener("load", initializeKakao);
    }
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao?.Auth?.authorize) {
      console.error("Kakao SDK not loaded");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* 로고 및 서비스 제목 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            항공권 가격 추적기
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            실시간으로 항공권 가격을 추적하고 알림을 받아보세요
          </p>
        </div>

        {/* 주요 기능 설명 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              실시간 가격 모니터링
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              가격 변동 알림
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              가격 추이 분석
            </span>
          </div>
        </div>

        {/* 카카오 로그인 버튼 */}
        <div className="mt-8">
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#FEE500] hover:bg-[#FDD800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
          >
            <Image
              src="/image/kakao.svg"
              alt="Kakao Logo"
              width={20}
              height={20}
              className="mr-2"
            />
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
