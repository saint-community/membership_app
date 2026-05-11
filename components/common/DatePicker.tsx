import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/cn';
import dayjs from 'dayjs';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  maximumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  maximumDate = dayjs().toDate(),
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(value ? dayjs(value).toDate() : dayjs().toDate());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      onChange(dayjs(selectedDate).toISOString());
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        className={cn(
          'h-14 w-full flex-row items-center justify-between rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3',
          disabled && 'opacity-50'
        )}>
        <Text
          className={cn('text-base', value ? 'text-foreground dark:text-white' : 'text-[#666]')}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Text className="text-lg text-white">📅</Text>
      </TouchableOpacity>

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          {...(maximumDate && { maximumDate })}
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <View className="rounded-t-xl bg-white">
              <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text className="text-base text-blue-500">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text className="text-base font-semibold text-blue-500">Done</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center justify-center p-4">
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  {...(maximumDate && { maximumDate })}
                  textColor="black"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
