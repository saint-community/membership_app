import React, { useState, useMemo, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, Modal } from 'react-native';
import { Text } from '../nativewindui/Text';
import { cn } from '~/lib/cn';
import { Ionicons } from '@expo/vector-icons';

interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'GH', dialCode: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', dialCode: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'CN', dialCode: '+86', name: 'China', flag: '🇨🇳' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', dialCode: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', dialCode: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'BR', dialCode: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', dialCode: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', dialCode: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: 'RU', dialCode: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: 'EG', dialCode: '+20', name: 'Egypt', flag: '🇪🇬' },
];

interface PhoneNumberInputProps {
  value: string; // Full phone number with country code (e.g., "+2348012345678")
  onChange: (phoneNumber: string) => void;
  placeholder?: string;
  disabled?: boolean;
  defaultCountry?: string; // Country code like 'NG'
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder = 'Phone Number',
  disabled = false,
  defaultCountry = 'NG',
}) => {
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.code === defaultCountry) || COUNTRY_CODES[0]
  );

  // Parse existing value to extract country code and phone number
  useEffect(() => {
    if (value) {
      // Try to find matching country code
      const matchingCountry = COUNTRY_CODES.find((country) => value.startsWith(country.dialCode));
      if (matchingCountry) {
        setSelectedCountry(matchingCountry);
        setPhoneNumber(value.replace(matchingCountry.dialCode, '').trim());
      } else {
        // If no country code found, assume it's just the number
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  // Format phone number (add spaces for readability)
  const formatPhoneNumber = (text: string): string => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // Format based on length (common formats)
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)}`;
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    
    // Combine country code and phone number
    const digits = formatted.replace(/\D/g, '');
    const fullNumber = digits ? `${selectedCountry.dialCode}${digits}` : '';
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsCountryPickerOpen(false);
    
    // Update the full phone number with new country code
    const digits = phoneNumber.replace(/\D/g, '');
    const fullNumber = digits ? `${country.dialCode}${digits}` : '';
    onChange(fullNumber);
  };

  const displayValue = phoneNumber || (value ? value.replace(selectedCountry.dialCode, '').trim() : '');

  return (
    <View>
      <View className="flex-row gap-2">
        {/* Country Code Picker */}
        <TouchableOpacity
          onPress={() => !disabled && setIsCountryPickerOpen(true)}
          disabled={disabled}
          className={cn(
            'h-14 w-24 flex-row items-center justify-center rounded-xl border border-[#8A8A8A] bg-transparent px-2',
            disabled && 'opacity-50'
          )}>
          <Text className="mr-1 text-lg">{selectedCountry.flag}</Text>
          <Text className="text-sm text-foreground dark:text-white">{selectedCountry.dialCode}</Text>
          <Ionicons name="chevron-down" size={16} color="#9CA3AF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View className="flex-1">
          <TextInput
            className={cn(
              'h-14 w-full rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3 text-base text-foreground dark:text-white'
            )}
            placeholder={placeholder}
            placeholderTextColor="#666"
            value={displayValue}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
            editable={!disabled}
            maxLength={20}
          />
        </View>
      </View>

      {/* Country Code Picker Modal */}
      <Modal
        visible={isCountryPickerOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCountryPickerOpen(false)}>
        <TouchableOpacity
          className="flex-1 items-end justify-center bg-black/50"
          onPress={() => setIsCountryPickerOpen(false)}
          activeOpacity={1}>
          <View
            className="w-full rounded-t-3xl bg-[#2A2A2A]"
            onStartShouldSetResponder={() => true}>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-[#333] px-4 py-4">
              <TouchableOpacity onPress={() => setIsCountryPickerOpen(false)}>
                <Text className="text-base text-gray-400">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">Select Country</Text>
              <View className="w-16" />
            </View>

            {/* Country List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-96"
              contentContainerStyle={{ paddingVertical: 10 }}>
              {COUNTRY_CODES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  onPress={() => handleCountrySelect(country)}
                  className={cn(
                    'flex-row items-center border-b border-[#333] px-4 py-4',
                    selectedCountry.code === country.code && 'bg-[#FF007F]/20'
                  )}>
                  <Text className="mr-3 text-2xl">{country.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-base text-white">{country.name}</Text>
                    <Text className="text-sm text-gray-400">{country.dialCode}</Text>
                  </View>
                  {selectedCountry.code === country.code && (
                    <Ionicons name="checkmark" size={20} color="#FF007F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
