import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/cn';
import { Ionicons } from '@expo/vector-icons';

interface TimePickerProps {
  value: string; // Time in format "HH:MM" (24-hour) or "HH:MM AM/PM" (12-hour)
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHour, setTempHour] = useState(12);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>('AM');

  // Parse input value (supports both 24-hour and 12-hour formats)
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' as const };

    // Try 24-hour format first (HH:MM)
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      let hour24 = parseInt(match24[1]);
      const minute = parseInt(match24[2]);
      const period = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      return { hour: hour12, minute, period };
    }

    // Try 12-hour format (HH:MM AM/PM)
    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      const hour = parseInt(match12[1]);
      const minute = parseInt(match12[2]);
      const period = match12[3].toUpperCase() as 'AM' | 'PM';
      return { hour, minute, period };
    }

    return { hour: 12, minute: 0, period: 'AM' as const };
  };

  // Initialize temp values when modal opens
  const handleOpen = () => {
    if (!disabled) {
      const parsed = parseTime(value);
      setTempHour(parsed.hour);
      setTempMinute(parsed.minute);
      setTempPeriod(parsed.period);
      setIsOpen(true);
    }
  };

  const handleConfirm = () => {
    // Convert 12-hour to 24-hour format for storage
    let hour24 = tempHour;
    if (tempPeriod === 'PM' && tempHour !== 12) {
      hour24 = tempHour + 12;
    } else if (tempPeriod === 'AM' && tempHour === 12) {
      hour24 = 0;
    }

    const time24 = `${hour24.toString().padStart(2, '0')}:${tempMinute.toString().padStart(2, '0')}`;
    onChange(time24);
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!value) return placeholder;

    const parsed = parseTime(value);
    const minuteStr = parsed.minute.toString().padStart(2, '0');
    return `${parsed.hour}:${minuteStr} ${parsed.period}`;
  };

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minute options (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  const periodOptions: ('AM' | 'PM')[] = ['AM', 'PM'];

  return (
    <View>
      <TouchableOpacity
        onPress={handleOpen}
        disabled={disabled}
        className={cn(
          'h-14 w-full flex-row items-center justify-between rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3',
          disabled && 'opacity-50'
        )}>
        <Text
          className={cn(
            'text-base',
            value ? 'text-foreground dark:text-white' : 'text-[#666]'
          )}>
          {formatDisplay()}
        </Text>
        <Ionicons name="time-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          className="flex-1 items-end justify-center bg-black/50"
          onPress={() => setIsOpen(false)}
          activeOpacity={1}>
          <View
            className="w-full rounded-t-3xl bg-[#2A2A2A]"
            onStartShouldSetResponder={() => true}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-[#333] px-4 py-4">
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text className="text-base text-gray-400">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">Select Time</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-base font-semibold text-[#FF007F]">Done</Text>
              </TouchableOpacity>
            </View>

            {/* Picker Content */}
            <View className="flex-row px-4 py-6">
              {/* Hours Picker */}
              <View className="flex-1">
                <Text className="mb-3 text-center text-sm font-medium text-gray-400">Hour</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-64"
                  contentContainerStyle={{ paddingVertical: 10 }}>
                  {hourOptions.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => setTempHour(hour)}
                      className={cn(
                        'mx-2 rounded-lg px-4 py-3',
                        tempHour === hour && 'bg-[#FF007F]'
                      )}>
                      <Text
                        className={cn(
                          'text-center text-lg',
                          tempHour === hour ? 'font-semibold text-white' : 'text-gray-400'
                        )}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Separator */}
              <View className="mx-1 w-px bg-[#333]" />

              {/* Minutes Picker */}
              <View className="flex-1">
                <Text className="mb-3 text-center text-sm font-medium text-gray-400">Minute</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-64"
                  contentContainerStyle={{ paddingVertical: 10 }}>
                  {minuteOptions.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => setTempMinute(minute)}
                      className={cn(
                        'mx-2 rounded-lg px-4 py-3',
                        tempMinute === minute && 'bg-[#FF007F]'
                      )}>
                      <Text
                        className={cn(
                          'text-center text-lg',
                          tempMinute === minute ? 'font-semibold text-white' : 'text-gray-400'
                        )}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Separator */}
              <View className="mx-1 w-px bg-[#333]" />

              {/* AM/PM Picker */}
              <View className="flex-1">
                <Text className="mb-3 text-center text-sm font-medium text-gray-400">Period</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-64"
                  contentContainerStyle={{ paddingVertical: 10 }}>
                  {periodOptions.map((period) => (
                    <TouchableOpacity
                      key={period}
                      onPress={() => setTempPeriod(period)}
                      className={cn(
                        'mx-2 rounded-lg px-4 py-3',
                        tempPeriod === period && 'bg-[#FF007F]'
                      )}>
                      <Text
                        className={cn(
                          'text-center text-lg',
                          tempPeriod === period ? 'font-semibold text-white' : 'text-gray-400'
                        )}>
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Summary */}
            <View className="border-t border-[#333] px-4 py-4">
              <Text className="text-center text-sm text-gray-400">
                Selected: {tempHour}:{tempMinute.toString().padStart(2, '0')} {tempPeriod}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

