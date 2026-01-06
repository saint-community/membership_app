import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/cn';
import { Ionicons } from '@expo/vector-icons';

interface DurationPickerProps {
  value: number; // Duration in minutes
  onChange: (minutes: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select duration',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(0);

  // Convert minutes to hours and minutes
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  // Initialize temp values when modal opens
  const handleOpen = () => {
    if (!disabled) {
      setTempHours(hours);
      setTempMinutes(minutes);
      setIsOpen(true);
    }
  };

  const handleConfirm = () => {
    const totalMinutes = tempHours * 60 + tempMinutes;
    onChange(totalMinutes);
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (value === 0) return placeholder;
    if (hours === 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    if (minutes === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${hours}h ${minutes}m`;
  };

  // Generate hour options (0-8)
  const hourOptions = Array.from({ length: 9 }, (_, i) => i);
  
  // Generate minute options (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

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
            value > 0 ? 'text-foreground dark:text-white' : 'text-[#666]'
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
              <Text className="text-lg font-semibold text-white">Select Duration</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-base font-semibold text-[#FF007F]">Done</Text>
              </TouchableOpacity>
            </View>

            {/* Picker Content */}
            <View className="flex-row px-4 py-6">
              {/* Hours Picker */}
              <View className="flex-1">
                <Text className="mb-3 text-center text-sm font-medium text-gray-400">Hours</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-64"
                  contentContainerStyle={{ paddingVertical: 10 }}>
                  {hourOptions.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => setTempHours(hour)}
                      className={cn(
                        'mx-2 rounded-lg px-4 py-3',
                        tempHours === hour && 'bg-[#FF007F]'
                      )}>
                      <Text
                        className={cn(
                          'text-center text-lg',
                          tempHours === hour ? 'font-semibold text-white' : 'text-gray-400'
                        )}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Separator */}
              <View className="mx-2 w-px bg-[#333]" />

              {/* Minutes Picker */}
              <View className="flex-1">
                <Text className="mb-3 text-center text-sm font-medium text-gray-400">Minutes</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-64"
                  contentContainerStyle={{ paddingVertical: 10 }}>
                  {minuteOptions.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => setTempMinutes(minute)}
                      className={cn(
                        'mx-2 rounded-lg px-4 py-3',
                        tempMinutes === minute && 'bg-[#FF007F]'
                      )}>
                      <Text
                        className={cn(
                          'text-center text-lg',
                          tempMinutes === minute ? 'font-semibold text-white' : 'text-gray-400'
                        )}>
                        {minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Summary */}
            <View className="border-t border-[#333] px-4 py-4">
              <Text className="text-center text-sm text-gray-400">
                Selected: {tempHours}h {tempMinutes}m ({tempHours * 60 + tempMinutes} minutes)
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

