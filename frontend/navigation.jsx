import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from "react";
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import JoinEventScreen from './screens/JoinEventScreen';
import BrowseEventScreen from './screens/BrowseEventScreen';
import EventScreen from './screens/EventScreen'
import PaymentScreen from './screens/PaymentScreen'
import PaymentRecordScreen from './screens/PaymentRecordScreen'
import MembershipScreen from "./screens/MembershipScreen";
import OwnedEventScreen from './screens/OwnedEventScreen'

const Stack = createNativeStackNavigator();

export default function Navigation(){

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateEventScreen} />
        <Stack.Screen name="Join" component={JoinEventScreen} />
        <Stack.Screen name="Browse" component={BrowseEventScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="PaymentRecord" component={PaymentRecordScreen} />
        <Stack.Screen name="Membership" component={MembershipScreen} />
        <Stack.Screen name="OwnedEvent" component={OwnedEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}