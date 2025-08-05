import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ThemeToggle } from '~/components/nativewindui/ThemeToggle';
import { useColors } from '~/theme/colors';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { languages } from '~/translation';
import { useTranslation } from 'react-i18next';

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
    <TouchableOpacity onPress={onPress} className="flex-row px-4 py-4" disabled={showSwitch}>
      {icon && <View className="mr-3 mt-1">{icon}</View>}
      <View className="flex-1">
        <Text className="text-base ">{title}</Text>
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
        className="flex-row  px-4 py-3">
        <View className="mr-3 mt-1">{icon}</View>
        <View className="flex-1">
          <Text className="text-base font-medium ">{title}</Text>
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
  const [isSwitchLanguageModalVisible, setIsSwitchLanguageModalVisible] = useState(false);
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <View className="pt-safe flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold ">Settings</Text>
          <View />
        </View>

        <View className="flex-1 gap-6 pb-20">
          {/* Notifications Section */}
          <SettingSection
            title={t('settings.notifications.title')}
            subtitle={t('settings.notifications.description')}
            icon={<Ionicons name="notifications-outline" size={24} color="#9CA3AF" />}
            useSwitch
            expandable={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}>
            <SettingItem
              title={t('settings.newAssignments')}
              showSwitch={true}
              switchValue={newAssignments}
              onSwitchChange={setNewAssignments}
            />
            <SettingItem
              title={t('settings.prayerReminders')}
              showSwitch={true}
              switchValue={prayerReminders}
              onSwitchChange={setPrayerReminders}
            />
            <SettingItem
              title={t('settings.inAppActivities')}
              showSwitch={true}
              switchValue={inAppActivities}
              onSwitchChange={setInAppActivities}
            />
          </SettingSection>

          {/* Theme & Accessibility Section */}
          <SettingSection
            title={t('settings.theme.title')}
            subtitle={t('settings.theme.description')}
            icon={<Ionicons name="color-palette-outline" size={24} color="#9CA3AF" />}
            expandable={true}>
            <View className="flex-row items-center px-4 py-4">
              <View className="flex-1">
                <Text className="text-base ">{t('settings.theme.darkMode')}</Text>
              </View>
              <ThemeToggle />
            </View>
            <SettingItem
              title={t('settings.theme.textSizeAdjustment')}
              showChevron={true}
              onPress={() => console.log('Text size pressed')}
            />
          </SettingSection>

          {/* Language & Region */}
          <SettingItem
            icon={<Ionicons name="globe-outline" size={24} color="#9CA3AF" />}
            title={t('settings.language.title')}
            subtitle={t('settings.language.description')}
            onPress={() => setIsSwitchLanguageModalVisible(true)}
          />

          {/* Support */}
          <SettingItem
            icon={<AntDesign name="customerservice" size={24} color="#9CA3AF" />}
            title={t('settings.support.title')}
            subtitle={t('settings.support.description')}
            onPress={() => console.log('Support pressed')}
          />

          {/* App Info */}
          <SettingItem
            icon={<Ionicons name="information-circle-outline" size={24} color="#9CA3AF" />}
            title={t('settings.appInfo.title')}
            subtitle={t('settings.appInfo.description')}
            onPress={() => console.log('App Info pressed')}
          />
        </View>

        {/* Delete Account Section */}
        <View className="mb-20 px-4">
          <TouchableOpacity
            onPress={() => console.log('Delete Account pressed')}
            className="flex-row  py-4">
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <View className="ml-3 flex-1">
              <Text className="text-base text-red-500">{t('settings.deleteAccount.title')}</Text>
              <Text className="text-sm text-gray-400">
                {t('settings.deleteAccount.description')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SwitchLanguageModal
        isVisible={isSwitchLanguageModalVisible}
        onClose={() => setIsSwitchLanguageModalVisible(false)}
      />
    </View>
  );
}

function SwitchLanguageModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colors = useColors();
  const { i18n, t } = useTranslation();

  const toggleLanguage = (locale: 'en' | 'fr') => {
    i18n.changeLanguage(locale);
  };

  const handleSave = (locale: 'en' | 'fr') => {
    toggleLanguage(locale);
    onClose();
  };

  const snapPoints = React.useMemo(() => ['40%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} />,
    []
  );

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.foreground }}
      backdropComponent={renderBackdrop}>
      <BottomSheetView className="flex-1 px-4">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={onClose} className="flex-1">
            <Text className="text-base text-destructive-foreground">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold ">{t('settings.language.switchLanguage')}</Text>
          <View className="flex-1" />
        </View>
        <View className="flex-1 gap-3">
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              onPress={() => handleSave(language.code)}
              className="flex-row items-center gap-2 rounded-lg bg-white px-4 py-4 dark:bg-gray-800">
              <Text className="text-lg ">{language.flag}</Text>
              <Text className="text-lg ">{language.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
