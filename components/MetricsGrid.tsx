import { View } from 'react-native';
import { MetricCard } from './MetricCard';
import type { MetricData } from '~/types/dashboard';

interface MetricsGridProps {
  metrics: MetricData[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <View className="mb-6 gap-3 px-4">
      <View className="flex-row gap-3">
        <MetricCard {...metrics[0]} />
        <MetricCard {...metrics[1]} />
      </View>
      <View className="flex-row gap-3">
        <MetricCard {...metrics[2]} />
        <MetricCard {...metrics[3]} />
      </View>
    </View>
  );
}
