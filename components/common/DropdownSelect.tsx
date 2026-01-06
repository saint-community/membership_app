import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/cn';

interface DropdownSelectProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  items,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          'h-14 w-full flex-row items-center justify-between rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3',
          disabled && 'opacity-50'
        )}>
        <Text
          className={cn('text-base', value ? 'text-foreground dark:text-white' : 'text-[#666]')}>
          {value || placeholder}
        </Text>
        <Text className="text-lg text-white">▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setIsOpen(false)}
          activeOpacity={1}>
          <View className="mx-6 max-h-80 w-4/5 rounded-xl bg-[#2A2A2A]">
            <ScrollView showsVerticalScrollIndicator={false}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleSelect(item)}
                  className={cn(
                    'border-b border-[#333] px-4 py-4',
                    index === items.length - 1 && 'border-b-0',
                    value === item && 'bg-[#FF007F]'
                  )}>
                  <Text className="text-base text-white">{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
