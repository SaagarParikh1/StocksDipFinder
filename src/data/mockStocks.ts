export const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 2.30, changePercent: 1.34 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.85, change: -1.20, changePercent: -0.32 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 0.75, changePercent: 0.53 },
  { symbol: 'AMZN', name: 'Amazon.com', price: 175.35, change: 3.45, changePercent: 2.01 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 824.90, change: 15.70, changePercent: 1.94 },
  { symbol: 'META', name: 'Meta Platforms', price: 484.10, change: -2.80, changePercent: -0.57 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 202.45, change: -5.30, changePercent: -2.55 },
  { symbol: 'BRK.A', name: 'Berkshire Hathaway', price: 621340, change: 1240, changePercent: 0.20 },
];

export const generateMockStockHistory = (days: number = 30) => {
  const data: { timestamp: string; price: number }[] = [];
  const basePrice = 100;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const randomChange = (Math.random() - 0.5) * 5;
    data.push({
      timestamp: date.toISOString().split('T')[0],
      price: basePrice + randomChange + i,
    });
  }
  return data;
};