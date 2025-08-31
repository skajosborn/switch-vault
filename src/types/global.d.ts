declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeAllListeners: (eventName: string) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

export {};
