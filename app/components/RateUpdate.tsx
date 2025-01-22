"use client"
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, Loader2, RefreshCcw, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

const RateUpdate = () => {
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [usd, setUsd] = useState<number>(84);
  const [x, setX] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [retryCount, setRetryCount] = useState<number>(0);

  const initializeRates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Add timeout to axios requests
      const axiosConfig = {
        timeout: 5000, // 5 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      let usdRate: number | null = null;
      let rateX: number | null = null;

      try {
        const usdResponse = await axios.get('https://open.er-api.com/v6/latest/USD', axiosConfig);
        usdRate = usdResponse.data.rates.INR;
      } catch (usdError) {
        console.error('USD rate fetch failed:', usdError);
        // Use fallback USD rate if API fails
        usdRate = 84.5; // Fallback value
        setError('Using fallback USD rate due to network error');
      }

      try {
        const rateResponse = await axios.get('https://admin-pearl-kappa-34.vercel.app/api/rate', axiosConfig);
        rateX = rateResponse.data[0].x;
      } catch (rateError) {
        console.error('X rate fetch failed:', rateError);
        // Keep current X value if API fails
        rateX = x;
      }

      if (!usdRate || isNaN(usdRate)) {
        throw new Error('Invalid USD rate received');
      }

      if (!rateX || isNaN(rateX)) {
        console.warn('Invalid X rate received:', rateX);
        rateX = 1; // Fallback to 1
      }

      setX(rateX);
      setUsd(usdRate);
      setRetryCount(0); // Reset retry count on successful fetch
      return usdRate;
    } catch (error) {
      console.error('Error in initializeRates:', error);
      setError('Failed to fetch rates. Using fallback values.');
      setRetryCount(prev => prev + 1);
      return null;
    }
  }, [x]);

  const fetchGoldPrice = useCallback(async (currentUsd: number) => {
    if (!currentUsd || isNaN(currentUsd)) {
      setError('Invalid USD rate');
      setLoading(false);
      return;
    }

    try {
      const axiosConfig = {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get('https://api.gold-api.com/price/XAU', axiosConfig);
      
      const goldApiPrice = response.data.price;
      if (!goldApiPrice || isNaN(goldApiPrice)) {
        throw new Error('Invalid gold price received');
      }

      const calculatedPrice = goldApiPrice * currentUsd * 0.337 * x;
      if (isNaN(calculatedPrice)) {
        throw new Error('Error calculating gold price');
      }

      setGoldPrice(calculatedPrice);
      setLastUpdated(new Date());
      setRetryCount(0); // Reset retry count on successful fetch
    } catch (error) {
      console.error('Error in fetchGoldPrice:', error);
      setError('Failed to fetch gold price. Will retry shortly.');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [x]);

  const handleXChange = useCallback((value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setX(numValue);
    }
  }, []);

  const handleManualRefresh = useCallback(async () => {
    setLoading(true);
    setRetryCount(0); // Reset retry count on manual refresh
    const currentUsd = await initializeRates();
    if (currentUsd) {
      await fetchGoldPrice(currentUsd);
    } else {
      setLoading(false);
    }
  }, [initializeRates, fetchGoldPrice]);

  useEffect(() => {
    let mounted = true;
    // let intervalId: NodeJS.Timeout;

    const updateRates = async () => {
      if (mounted) {
        const currentUsd = await initializeRates();
        if (currentUsd && mounted) {
          await fetchGoldPrice(currentUsd);
        }
      }
    };

    // Adjust interval based on retry count
    const intervalTime = Math.min(10000 * (retryCount + 1), 60000); // Exponential backoff up to 1 minute

    updateRates();
    const intervalId = setInterval(updateRates, intervalTime);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [initializeRates, fetchGoldPrice, retryCount]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            Live Gold Rate
          </h2>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh rates"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            ) : (
              <RefreshCcw className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="text-center py-4">
          <div className="text-3xl font-bold text-yellow-600">
            ₹{goldPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-500">
            Current USD Rate: ₹{usd.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            {error && ' (Fallback)'}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="x-value" className="block text-sm font-medium text-gray-700 mb-1">
              Multiplier (X)
            </label>
            {/* <input
              id="x-value"
              type="number"
              value={x}
              onChange={(e) => handleXChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter multiplier value"
              min="0.01"
              step="0.01"
            /> */}
            <Input
                id="x-value"
                type="number"
                value={x}
                onChange={(e) => handleXChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter multiplier value"
                required
              />
          </div>

          {error && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="ml-3 text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateUpdate;
