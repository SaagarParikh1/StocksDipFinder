import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Stock } from '../types';
import { searchStocks, getStockQuote } from '../api/stockApi';

interface StockSearchProps {
  onSelectStock: (stock: Stock) => void;
}

export const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock }) => {
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      if (!search) {
        setStocks([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const results = await searchStocks(search);
        const stocksWithPrices = await Promise.all(
          results.slice(0, 5).map(async (stock) => {
            try {
              return await getStockQuote(stock.symbol);
            } catch {
              return stock;
            }
          })
        );
        setStocks(stocksWithPrices);
      } catch (err) {
        setError('Failed to fetch stocks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchStocks, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm p-6 rounded-xl border border-dark-700/50 animate-glow">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Search Stocks</h2>
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Enter stock symbol or name..."
          className="w-full pl-10 pr-4 py-2.5 bg-dark-700/50 border border-dark-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all duration-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-3 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/10 text-red-400 rounded-lg text-sm border border-red-700/20 backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            className="w-full text-left p-4 bg-dark-700/30 hover:bg-dark-600/50 rounded-lg transition-all duration-300 border border-dark-600/30 hover:border-accent-primary/30 backdrop-blur-xs group"
            onClick={() => onSelectStock(stock)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-100 group-hover:text-accent-primary transition-colors duration-300">
                  {stock.symbol}
                </div>
                <div className="text-sm text-gray-400">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-100">${stock.price.toLocaleString()}</div>
                <div
                  className={`text-sm flex items-center justify-end gap-1 ${
                    stock.change >= 0 ? 'text-accent-success' : 'text-accent-danger'
                  }`}
                >
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};