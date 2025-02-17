export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface StockHistory {
  timestamp: string;
  price: number;
}