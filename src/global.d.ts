declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};
