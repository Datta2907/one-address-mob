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
import { checkTokenValid } from './redux/auth-store';
import { store } from './redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
SplashScreen.preventAutoHideAsync();

function App() {
  const Stack = createNativeStackNavigator();
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  const tokenExpired = useSelector((state) => state.userDetails.tokenExpired);
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkLoggedIn() {
      const token = await AsyncStorage.getItem("authToken");
      dispatch(checkTokenValid({ token }));
      if (!tokenExpired) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false);
      }
    }
    checkLoggedIn();
  }, [tokenExpired])

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
    </View>
  );
}

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Variables.colors.blue,
    paddingTop: statusBar.currentHeight
  }
});
