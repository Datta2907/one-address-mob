import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, StatusBar as statusBar } from 'react-native';
import LoginComponent from './screens/login';
import Variables from './common/constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeComponent } from './screens/home';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoggedIn() {
      let token = await AsyncStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true)
      }
    }
    checkLoggedIn();
  }, [])

  return (
    <View
      style={styles.mainContainer}>
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
                name='Login'
                component={LoginComponent}
                options={{ headerShown: false }}
              />
            </Stack.Group>}
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
