import { ImageBackground, View } from 'react-native';

import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import LoginForm from '~/components/forms/LoginForm';
import React from 'react';
import { swipeList } from '~/lib/constants';
import { useLogin } from '~/hooks/mutations/useLogin';

const Login = () => {
  const {
    isLoading,
    snapPoints,
    handleEmailFocus,
    handlePasswordFocus,
    handleFieldBlur,
    onSubmit,
    bottomSheetRef,
  } = useLogin();

  return (
    <ImageBackground
      source={swipeList[2].source}
      resizeMode="cover"
      className="h-full w-full items-center justify-center">
      <View className="absolute inset-0 flex-1 items-center justify-center dark:bg-black/70">
        <BottomSheetWrapper ref={bottomSheetRef} snapPoints={snapPoints} initialIndex={0}>
          <View className="mb-6">
            <LoginForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              onEmailFocus={handleEmailFocus}
              onPasswordFocus={handlePasswordFocus}
              onFieldBlur={handleFieldBlur}
            />
          </View>
        </BottomSheetWrapper>
      </View>
    </ImageBackground>
  );
};

export default Login;
