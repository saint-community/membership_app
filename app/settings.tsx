import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface SettingItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = false,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
      disabled={showSwitch}>
      {icon && <View className="mr-3">{icon}</View>}
      <View className="flex-1">
        <Text className="text-base text-white">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-400">{subtitle}</Text>}
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#374151', true: '#10B981' }}
          thumbColor={switchValue ? '#ffffff' : '#9CA3AF'}
        />
      )}
      {showChevron && <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />}
    </TouchableOpacity>
  );
}

interface SettingSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  expandable?: boolean;
  useSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  icon?: React.ReactNode;
}

function SettingSection({
  title,
  subtitle,
  children,
  expandable = false,
  useSwitch = false,
  switchValue = false,
  onSwitchChange,
  icon,
}: SettingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expandable);

  return (
    <View>
      <TouchableOpacity
        onPress={expandable ? () => setIsExpanded(!isExpanded) : undefined}
        className="flex-row items-center px-4 py-3">
        <View className="mr-3">{icon}</View>
        <View className="flex-1">
          <Text className="text-base font-medium text-white">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-400">{subtitle}</Text>}
        </View>
        {expandable && !useSwitch && (
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#9CA3AF" />
        )}
        {useSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#374151', true: '#10B981' }}
            thumbColor={switchValue ? '#ffffff' : '#9CA3AF'}
          />
        )}
      </TouchableOpacity>
      {((isExpanded && !useSwitch) || (switchValue && useSwitch)) && (
        <View className="ml-4  pl-6">{children}</View>
      )}
    </View>
  );
}

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [newAssignments, setNewAssignments] = useState(true);
  const [prayerReminders, setPrayerReminders] = useState(true);
  const [inAppActivities, setInAppActivities] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <View className="pt-safe flex-1 bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Settings</Text>
          <View />
        </View>

        <View className="flex-1 gap-6 pb-20">
          {/* Notifications Section */}
          <SettingSection
            title="Notifications"
            subtitle="Personalise the notifications you receive"
            icon={<Ionicons name="notifications-outline" size={24} color="#9CA3AF" />}
            useSwitch
            expandable={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}>
            <SettingItem
              title="New assignments"
              showSwitch={true}
              switchValue={newAssignments}
              onSwitchChange={setNewAssignments}
            />
            <SettingItem
              title="Prayer meeting reminders"
              showSwitch={true}
              switchValue={prayerReminders}
              onSwitchChange={setPrayerReminders}
            />
            <SettingItem
              title="In-app activities"
              showSwitch={true}
              switchValue={inAppActivities}
              onSwitchChange={setInAppActivities}
            />
          </SettingSection>

          {/* Theme & Accessibility Section */}
          <SettingSection
            title="Theme & Accessibility"
            subtitle="Personalise the appearance you receive"
            icon={<Ionicons name="color-palette-outline" size={24} color="#9CA3AF" />}
            expandable={true}>
            <SettingItem
              title="Dark mode"
              showSwitch={true}
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
            />
            <SettingItem
              title="Text size adjustment"
              showChevron={true}
              onPress={() => console.log('Text size pressed')}
            />
          </SettingSection>

          {/* Language & Region */}
          <SettingItem
            icon={<Ionicons name="globe-outline" size={24} color="#9CA3AF" />}
            title="Language & Region"
            subtitle="Select languages and regions"
            onPress={() => console.log('Language pressed')}
          />

          {/* Support */}
          <SettingItem
            icon={<AntDesign name="customerservice" size={24} color="#9CA3AF" />}
            title="Support"
            subtitle="Get help, send feedback and see helpful resources"
            onPress={() => console.log('Support pressed')}
          />

          {/* App Info */}
          <SettingItem
            icon={<Ionicons name="information-circle-outline" size={24} color="#9CA3AF" />}
            title="App Info"
            subtitle="App details and information"
            onPress={() => console.log('App Info pressed')}
          />
        </View>

        {/* Delete Account Section */}
        <View className="mb-20 px-4">
          <TouchableOpacity
            onPress={() => console.log('Delete Account pressed')}
            className="flex-row items-center py-4">
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <View className="flex-1">
              <Text className="ml-3 text-base text-red-500">Delete Account</Text>
              <Text className="ml-2 text-sm text-gray-400">Permanently delete my account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
