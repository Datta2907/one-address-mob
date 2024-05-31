import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, StatusBar as statusBar } from 'react-native';
import SignInOrSignUpComponent from './screens/signInOrSignUp';
import Variables from './common/constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeComponent } from './screens/home';
import { useCallback, useEffect, useState } from 'react';
import { useFonts, LibreFranklin_500Medium } from '@expo-google-fonts/libre-franklin';
import * as SplashScreen from 'expo-splash-screen';
import RegisterUser from './screens/register-user-details';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { tokenValid } from './redux/auth-store';
import { store } from './redux/store';
SplashScreen.preventAutoHideAsync();

export default function App() {
  const Stack = createNativeStackNavigator();
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  const tokenExpired = useSelector((state) => state.userDetails.tokenExpired);
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkLoggedIn() {
      dispatch(tokenValid());
      if (!tokenExpired) {
        setIsLoggedIn(true)
      }
    }
    checkLoggedIn();
  }, [])

  let [fontsLoaded] = useFonts({
    LibreFranklin_500Medium
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={styles.mainContainer} onLayout={onLayoutRootView}>
      <StatusBar style='light' />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
            {isLoggedIn ?
              <Stack.Screen
                name='Home'
                component={HomeComponent}
              />
              :
              <Stack.Group>
                <Stack.Screen
                  name='signInOrSignUp'
                  component={SignInOrSignUpComponent}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='registerUser'
                  component={RegisterUser}
                  options={{ headerShown: false }}
                />
              </Stack.Group>}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
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
