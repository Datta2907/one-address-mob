import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, StatusBar as statusBar } from 'react-native';
import LoginComponent from './screens/login';
import { useFonts, LibreFranklin_400Regular } from '@expo-google-fonts/libre-franklin';
import Variables from './common/constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeComponent } from './screens/home';

export default function App() {
  const Stack = createNativeStackNavigator();

  let [fontsLoaded, fontError] = useFonts({
    LibreFranklin_400Regular
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View
      style={styles.mainContainer}>
      <StatusBar style='light' />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen
            name='Login'
            component={LoginComponent}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Home'
            component={HomeComponent}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Variables.colors.blue,
    paddingTop: statusBar.currentHeight
  }
});
