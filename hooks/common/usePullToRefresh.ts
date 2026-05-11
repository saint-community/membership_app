import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<any>;
  minimumRefreshDuration?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  minimumRefreshDuration = 1000,
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    const startTime = dayjs().valueOf();

    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      const elapsedTime = dayjs().valueOf() - startTime;
      const remainingTime = Math.max(0, minimumRefreshDuration - elapsedTime);

      // Ensure minimum refresh duration for better UX
      setTimeout(() => {
        setIsRefreshing(false);
      }, remainingTime);
    }
  }, [isRefreshing, onRefresh, minimumRefreshDuration]);

  return {
    isRefreshing,
    onRefresh: handleRefresh,
  };
};
