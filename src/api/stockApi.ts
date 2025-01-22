import axios from 'axios';
import { format } from 'date-fns';
import { Stock, StockHistory } from '../types';

const API_KEY = 'JIDY7QECRME2M60F';
const BASE_URL = 'https://www.alphavantage.co/query';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryRequest<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) throw error;
    
    // Check if it's a rate limit error
    if (error?.response?.status === 429) {
      await delay(delayMs);
      return retryRequest(fn, retries - 1, delayMs * 2);
    }
    
    throw error;
  }
}

export async function getStockQuote(symbol: string): Promise<Stock> {
  return retryRequest(async () => {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    });

    const quote = response.data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No data available for ${symbol}`);
    }

    return {
      symbol,
      name: symbol,
      price: parseFloat(quote['05. price']) || 0,
      change: parseFloat(quote['09. change']) || 0,
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
    };
  });
}

export async function getStockHistory(symbol: string): Promise<StockHistory[]> {
  return retryRequest(async () => {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        apikey: API_KEY,
      },
    });

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error(`No historical data available for ${symbol}`);
    }

    return Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, values]: [string, any]) => ({
        timestamp: format(new Date(date), 'MMM dd'),
        price: parseFloat(values['4. close']),
      }))
      .reverse();
  });
}

export async function searchStocks(query: string): Promise<Stock[]> {
  return retryRequest(async () => {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: API_KEY,
      },
    });

    if (!response.data.bestMatches) {
      return [];
    }

    return response.data.bestMatches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      price: 0,
      change: 0,
      changePercent: 0,
    }));
  });
}