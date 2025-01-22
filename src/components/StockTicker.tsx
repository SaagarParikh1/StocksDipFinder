import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Stock } from '../types';

interface StockTickerProps {
  stocks: Stock[];
  loading?: boolean;
}

export const StockTicker: React.FC<StockTickerProps> = ({ stocks, loading = false }) => {
  if (loading) {
    return (
      <div className="w-full bg-dark-800/50 backdrop-blur-sm border-b border-dark-700/50 h-12 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-800/50 backdrop-blur-sm border-b border-dark-700/50 overflow-hidden">
      <div className="animate-scroll flex whitespace-nowrap py-3 bg-gradient-to-r from-dark-800 via-transparent to-dark-800">
        {[...stocks, ...stocks].map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="inline-flex items-center mx-6 bg-dark-700/30 backdrop-blur-xs px-4 py-1.5 rounded-full border border-dark-600/30 hover:border-accent-primary/30 transition-colors duration-300"
          >
            <span className="font-semibold text-gray-100">{stock.symbol}</span>
            <span className="ml-2 text-gray-300">${stock.price.toLocaleString()}</span>
            <span
              className={`ml-2 flex items-center ${
                stock.change >= 0 ? 'text-accent-success' : 'text-accent-danger'
              }`}
            >
              {stock.change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};