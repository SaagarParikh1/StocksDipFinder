import React, { useState, useEffect } from 'react';
import { StockTicker } from './components/StockTicker';
import { StockSearch } from './components/StockSearch';
import { StockChart } from './components/StockChart';
import { Stock, StockHistory } from './types';
import { getStockQuote, getStockHistory } from './api/stockApi';

const POPULAR_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA'];

function App() {
  const [popularStocks, setPopularStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPopularStocks = async () => {
      setLoading(true);
      setError('');
      try {
        const stocks: Stock[] = [];
        for (const symbol of POPULAR_SYMBOLS) {
          try {
            const stock = await getStockQuote(symbol);
            stocks.push(stock);
            setPopularStocks(current => [...current, stock]);
          } catch (err) {
            console.error(`Failed to fetch ${symbol}:`, err);
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (stocks.length === 0) {
          setError('Unable to fetch stock data. Please try again later.');
        } else if (!selectedStock && stocks.length > 0) {
          setSelectedStock(stocks[0]);
        }
      } catch (error) {
        console.error('Failed to fetch popular stocks:', error);
        setError('Unable to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStocks();
    const interval = setInterval(fetchPopularStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStockHistory = async () => {
      if (!selectedStock) return;

      setChartLoading(true);
      try {
        const history = await getStockHistory(selectedStock.symbol);
        setStockHistory(history);
      } catch (error) {
        console.error('Failed to fetch stock history:', error);
        setError('Unable to fetch stock history. Please try again later.');
      } finally {
        setChartLoading(false);
      }
    };

    fetchStockHistory();
  }, [selectedStock]);

  const handleSelectStock = async (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <div className="sticky top-0 z-10">
        <StockTicker stocks={popularStocks} loading={loading} />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Market Overview</h1>
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-700/30 rounded-lg text-red-400">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <StockSearch onSelectStock={handleSelectStock} />
          </div>
          <div className="md:col-span-2">
            {selectedStock && (
              <StockChart
                data={stockHistory}
                symbol={selectedStock.symbol}
                loading={chartLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;