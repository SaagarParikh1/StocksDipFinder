import React from 'react';
import { StockHistory } from '../types';

interface StockChartProps {
  data: StockHistory[];
  symbol: string;
  loading?: boolean;
}

export const StockChart: React.FC<StockChartProps> = ({ data, symbol, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm p-6 rounded-xl border border-dark-700/50 h-[500px] flex items-center justify-center animate-glow">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm p-6 rounded-xl border border-dark-700/50 h-[500px] flex items-center justify-center">
        <div className="text-gray-400">No data available</div>
      </div>
    );
  }

  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const range = maxPrice - minPrice;
  const padding = range * 0.1;

  const getY = (price: number) => {
    return 400 - ((price - (minPrice - padding)) / (range + 2 * padding)) * 350;
  };

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 800;
    const y = getY(d.price);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm p-6 rounded-xl border border-dark-700/50 animate-glow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">{symbol} Price Chart</h2>
        <div className="text-sm text-gray-400 bg-dark-700/30 px-3 py-1 rounded-full border border-dark-600/30">
          Last 30 Days
        </div>
      </div>
      <div className="relative">
        <svg width="800" height="400" className="bg-dark-800/30 rounded-lg">
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <React.Fragment key={i}>
              <line
                x1="0"
                y1={i * 100}
                x2="800"
                y2={i * 100}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x="10"
                y={i * 100 - 5}
                className="text-xs fill-gray-400"
              >
                ${(maxPrice - (i * range) / 4).toFixed(2)}
              </text>
            </React.Fragment>
          ))}
          
          {/* Price line */}
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
          <path
            d={`${points} L 800,400 L 0,400 Z`}
            fill="url(#lineGradient)"
            className="transition-all duration-300"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#818CF8"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={(i / (data.length - 1)) * 800}
                cy={getY(d.price)}
                r="4"
                className="fill-dark-800 stroke-2 stroke-accent-primary transition-all duration-300 hover:r-6"
              />
              {i % 5 === 0 && (
                <text
                  x={(i / (data.length - 1)) * 800}
                  y="420"
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  {d.timestamp}
                </text>
              )}
            </g>
          ))}
        </svg>
        
        {/* Hover tooltip */}
        <div className="absolute top-4 right-4 bg-dark-700/80 backdrop-blur-sm p-4 rounded-lg border border-dark-600/50">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-2xl font-bold text-gray-100">
            ${data[data.length - 1].price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};