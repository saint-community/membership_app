import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import ChangePasswordForm from '~/components/forms/ChangePasswordForm';
import { View } from 'react-native';
import { useChangePassword } from '~/hooks/useChangePassword';

export default function ChangePassword() {
  const { isLoading, snapPoints, handlePasswordFocus, handleFieldBlur, onSubmit, bottomSheetRef } =
    useChangePassword();
  return (
    <View className="h-full bg-[#141414]">
      <BottomSheetWrapper ref={bottomSheetRef} snapPoints={snapPoints} initialIndex={0}>
        <ChangePasswordForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onPasswordFocus={handlePasswordFocus}
          onFieldBlur={handleFieldBlur}
        />
      </BottomSheetWrapper>
    </View>
  );
}
