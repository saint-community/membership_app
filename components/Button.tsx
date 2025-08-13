import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

type ButtonProps = {
  title: string;
  isLoading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, isLoading, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`h-12 w-full items-center justify-center rounded-lg ${
          !touchableProps.disabled && !isLoading ? 'bg-[#FF007F]' : 'bg-[#353535]'
        } ${touchableProps.className} ${touchableProps.disabled ? 'opacity-60' : ''}`}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-base font-semibold text-white">{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);
