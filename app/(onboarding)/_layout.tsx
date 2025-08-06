import { StyleSheet, View } from 'react-native';
import Onboarding from './onboarding';

const OnboardingLayout = () => {
  return (
    <View style={styles.container}>
      <Onboarding />
    </View>
  );
};

export default OnboardingLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
