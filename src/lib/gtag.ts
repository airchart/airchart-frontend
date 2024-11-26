type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

declare global {
  interface Window {
    gtag: (
      type: string,
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID!;

// 페이지 뷰 추적
export const pageview = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// 이벤트 추적
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
