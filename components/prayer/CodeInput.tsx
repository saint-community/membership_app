import { useEffect, useRef } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';

type CodeInputProps = {
  value: string;
  onChange: (code: string) => void;
  length?: number;
};

export function CodeInput({ value, onChange, length = 6 }: CodeInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Ensure only digits and max length
    const digitsOnly = value.replace(/\D/g, '').slice(0, length);
    if (digitsOnly !== value) onChange(digitsOnly);
  }, [value]);

  const handlePress = () => inputRef.current?.focus();

  return (
    <View>
      <Text className="mb-2 text-sm text-muted-foreground">Input 6 digits code</Text>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className="flex-row items-center justify-between rounded-xl border border-border bg-card px-3 py-4">
        {Array.from({ length }).map((_, idx) => {
          const char = value[idx] ?? '';
          const isFilled = char !== '';
          return (
            <View
              key={idx}
              className={`h-10 w-10 items-center justify-center rounded-md ${
                isFilled ? 'bg-primary/20 border-transparent' : 'border border-border'
              }`}>
              <Text className="text-lg font-semibold">{char}</Text>
            </View>
          );
        })}
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        // visually hidden but accessible
        className="absolute h-0 w-0 opacity-0"
      />
    </View>
  );
}
