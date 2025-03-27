
export enum Exchange {
  BINANCE = "Binance",
  BYBIT = "Bybit",
  BINGX = "BingX"
}

export enum SignalStatus {
  ACTIVE = "active",
  FILLED = "filled",
  CANCELED = "canceled",
  FAILED = "failed"
}

export enum OrderSide {
  BUY = "buy",
  SELL = "sell"
}

export interface ApiKey {
  id: string;
  exchange: Exchange;
  name: string;
  apiKey: string;
  secretKey: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ApiSettings {
  leverage: number;
  orderSize: number; // in percentage of balance
  stopLoss: number;  // in percentage
  takeProfit: number; // in percentage
  useTrailingStop: boolean;
  trailingStopDistance: number; // in percentage
}

export interface Trade {
  id: string;
  exchange: Exchange;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  timestamp: Date;
  pnl?: number; // Profit/Loss (if trade is closed)
  status: string;
}

export interface Signal {
  id: string;
  symbol: string;
  side: OrderSide;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: Date;
  status: SignalStatus;
  notes?: string;
}

export interface Subscription {
  id: string;
  isActive: boolean;
  plan: string;
  startDate: Date;
  endDate: Date;
  price: number;
  autoRenew: boolean;
}

// Mock data generators
export const generateMockTrades = (): Trade[] => {
  const symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT", "ADA/USDT"];
  const statuses = ["filled", "open", "canceled"];
  
  return Array(10).fill(null).map((_, i) => ({
    id: `trade-${i}`,
    exchange: Object.values(Exchange)[Math.floor(Math.random() * 3)],
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    side: Math.random() > 0.5 ? OrderSide.BUY : OrderSide.SELL,
    quantity: parseFloat((Math.random() * 10).toFixed(3)),
    price: parseFloat((Math.random() * 10000).toFixed(2)),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    pnl: parseFloat((Math.random() * 1000 - 500).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export const generateMockSignals = (): Signal[] => {
  const symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT", "ADA/USDT"];
  const statuses = [SignalStatus.ACTIVE, SignalStatus.FILLED, SignalStatus.CANCELED];
  
  return Array(8).fill(null).map((_, i) => ({
    id: `signal-${i}`,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    side: Math.random() > 0.5 ? OrderSide.BUY : OrderSide.SELL,
    entryPrice: parseFloat((Math.random() * 10000).toFixed(2)),
    stopLoss: parseFloat((Math.random() * 9000).toFixed(2)),
    takeProfit: parseFloat((Math.random() * 11000).toFixed(2)),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: Math.random() > 0.5 ? "Breakout trade with confirmation" : undefined
  }));
};

export const generateMockApiKeys = (): ApiKey[] => {
  return [
    {
      id: "key-1",
      exchange: Exchange.BINANCE,
      name: "Binance Main",
      apiKey: "bnc1x2y3z4",
      secretKey: "••••••••••••••••",
      isActive: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: "key-2",
      exchange: Exchange.BYBIT,
      name: "Bybit Futures",
      apiKey: "byb1a2b3c4",
      secretKey: "••••••••••••••••",
      isActive: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ];
};

export const generateMockSubscription = (): Subscription => {
  return {
    id: "sub-1",
    isActive: true,
    plan: "Premium",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    price: 49.99,
    autoRenew: true
  };
};

export const generateMockApiSettings = (): ApiSettings => {
  return {
    leverage: 5,
    orderSize: 10, // 10% of balance
    stopLoss: 5,   // 5% from entry
    takeProfit: 15, // 15% from entry
    useTrailingStop: true,
    trailingStopDistance: 2 // 2% trailing stop
  };
};
