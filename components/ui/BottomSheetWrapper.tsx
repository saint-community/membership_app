import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { KeyboardAvoidingView, Platform } from 'react-native';
import React, { forwardRef, useCallback, useMemo } from 'react';

interface BottomSheetWrapperProps {
  children: React.ReactNode;
  snapPoints?: string[];
  initialIndex?: number;
  onSheetChange?: (index: number) => void;
  backgroundStyle?: any;
  handleIndicatorStyle?: any;
  enablePanDownToClose?: boolean;
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent';
  keyboardBlurBehavior?: 'none' | 'restore';
  enableDynamicSizing?: boolean;
}

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetWrapperProps>(
  (
    {
      children,
      snapPoints = ['70%', '90%'],
      initialIndex = 0,
      onSheetChange,
      backgroundStyle = {
        backgroundColor: '#1F1F1F',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      handleIndicatorStyle = {
        backgroundColor: '#666',
        width: 40,
        height: 4,
      },
      enablePanDownToClose = false,
      keyboardBehavior = 'interactive',
      keyboardBlurBehavior = 'restore',
      enableDynamicSizing = false,
    },
    ref
  ) => {
    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    const handleSheetChanges = useCallback(
      (index: number) => {
        console.log('handleSheetChanges', index);
        onSheetChange?.(index);
      },
      [onSheetChange]
    );

    return (
      <BottomSheet
        ref={ref}
        index={initialIndex}
        snapPoints={memoizedSnapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        enablePanDownToClose={enablePanDownToClose}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        enableDynamicSizing={enableDynamicSizing}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          {/* <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}> */}
          <BottomSheetView className="flex-1 px-6 pb-8 pt-5">{children}</BottomSheetView>
          {/* </ScrollView> */}
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

BottomSheetWrapper.displayName = 'BottomSheetWrapper';

export default BottomSheetWrapper;
