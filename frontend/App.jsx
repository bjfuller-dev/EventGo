import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import JoinEventScreen from "./screens/JoinEventScreen";
import BrowseEventScreen from "./screens/BrowseEventScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentRecordScreen from "./screens/PaymentRecordScreen";
import MembershipScreen from "./screens/MembershipScreen";
import OwnedEventScreen from "./screens/OwnedEventScreen";
import EventSettingsScreen from "./screens/EventSettingsScreen";
import JoinedEventScreen from "./screens/JoinedEventScreen";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Asyncstorage: ...']); 
LogBox.ignoreAllLogs(); 
console.disableYellowBox = true;

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  async function getUserData() {
      const data = await AsyncStorage.getItem("userLoggedIn");
      console.log(data, 'at app.jsx');
      setUserLoggedIn(data);
  }

  useEffect(() => {
      getUserData();
  }, []);

  const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();

    const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_KEY;

    return (
      <StripeProvider publishableKey="{process.env.EXPO_PUBLIC_STRIPE_KEY}">
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Create" component={CreateEventScreen} />
          <Stack.Screen name="Join" component={JoinEventScreen} />
          <Stack.Screen name="Browse" component={BrowseEventScreen} />
          <Stack.Screen name="OwnedEvent" component={OwnedEventScreen} />
          <Stack.Screen name="JoinedEvent" component={JoinedEventScreen} />
          <Stack.Screen name="Pay" component={PaymentScreen} />
          <Stack.Screen name="Record" component={PaymentRecordScreen} />
          <Stack.Screen name="Membership" component={MembershipScreen} />
          <Stack.Screen name="EventSettings" component={EventSettingsScreen} />
          <Stack.Screen name="Login" component={LoginNavigation} />
        </Stack.Navigator>
      </StripeProvider>
    );
  };

  const LoginNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
      <StripeProvider publishableKey="{process.env.EXPO_PUBLIC_STRIPE_KEY}">
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={StackNavigation} />
        </Stack.Navigator>
      </StripeProvider>
    );
  };

  return (
    <StripeProvider publishableKey="{process.env.EXPO_PUBLIC_STRIPE_KEY}">
      <NavigationContainer>
        {userLoggedIn ? <StackNavigation /> : <LoginNavigation />}
      </NavigationContainer>
    </StripeProvider>
  );
}