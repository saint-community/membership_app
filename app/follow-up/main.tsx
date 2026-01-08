import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import DashboardTab from './_components/DashboardTab';
import AddRecordTab from './_components/AddRecordTab';
import HistoryTab from './_components/HistoryTab';

type TabType = 'Dashboard' | 'Add Record' | 'History';

export default function FollowUpMain() {
  const router = useRouter();
  const colors = useColors();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>(
    (tab as TabType) || 'Dashboard'
  );

  useEffect(() => {
    if (tab && ['Dashboard', 'Add Record', 'History'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [tab]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const tabs: TabType[] = ['Dashboard', 'Add Record', 'History'];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black dark:text-white">Reports</Text>
        {activeTab !== 'History' ? (
          <View className="w-7" />
        ) : (
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-700 px-4">
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className="flex-1 py-3">
            <Text
              className={`text-center text-base font-medium ${
                activeTab === tab
                  ? 'text-[#FF007F] dark:text-[#FF007F]'
                  : 'text-gray-400 dark:text-gray-400'
              }`}>
              {tab}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF007F]" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View className="flex-1">
        {activeTab === 'Dashboard' && <DashboardTab onNavigateToHistory={() => setActiveTab('History')} />}
        {activeTab === 'Add Record' && <AddRecordTab />}
        {activeTab === 'History' && <HistoryTab />}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilter(false)}>
        <TouchableOpacity
          className="flex-1 items-end justify-start bg-black/50 pr-4 pt-20"
          onPress={() => setShowFilter(false)}
          activeOpacity={1}>
          <View className="w-48 rounded-xl bg-[#2A2A2A] p-4">
            <View className="mb-4">
              <Text className="mb-2 text-base font-semibold text-white">All</Text>
              <View className="mb-4 border-b border-[#333]" />
              <View className="mb-2">
                <Text className="mb-2 text-sm text-gray-400">Duration</Text>
                <View className="h-10 rounded border border-[#333] bg-transparent" />
              </View>
              <View>
                <Text className="mb-2 text-sm text-gray-400">List</Text>
                <View className="h-10 rounded border border-[#333] bg-transparent" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
