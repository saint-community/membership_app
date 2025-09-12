import { StyleSheet, View } from 'react-native';

import Login from './login';

const LoginLayout = () => {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
};

export default LoginLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
