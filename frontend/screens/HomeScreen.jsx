import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen(props) {
  console.disableYellowBox = true;
  const navigation = useNavigation();
  console.log(props);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const insets = useSafeAreaInsets();
  const [userDetails, setUserDetails] = useState("")

  async function getUserDetails() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post(`${API_URL}/userdetails`, { token: token })
      .then(res => {
        console.log(res.data);
        setUserDetails(res.data.data);
      });
  }
  useEffect( () => {
    getUserDetails();
  },[]);

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Title */}
      <Text className="top-20 text-center font-bold t.alignAuto text-[50px]">
        EventGo
      </Text>

      <View className="absolute my-52 w-full flex-row justify-center">
        <View className="flex-1 px-10">
          <Text className="my-10 text-center text-3xl">
            Hello {userDetails.name}.
          </Text>
          <TouchableOpacity
            className="bg-slate-800 px-4 py-2 rounded-2xl h-20"
            onPress={() => navigation.navigate("Create")}
          >
            <Text className="text-xl font-bold text-white text-center m-auto">
              Create Event
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-slate-800 px-4 py-2 rounded-2xl my-10 h-20"
            onPress={() => navigation.navigate("Join", { data: userDetails })}
          >
            <Text className="text-xl font-bold text-white text-center m-auto">
              Join Event
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-slate-800 px-4 py-2 rounded-2xl h-20"
            onPress={() => {
              getUserDetails();
              navigation.navigate("Browse", { data: userDetails })
            }}
          >
            <Text className="text-xl font-bold text-white text-center m-auto">
              Browse Events
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile & Settings Button */}
      <View
        style={{ bottom: insets.bottom }}
        className="absolute left-0 right-0 flex-row justify-between px-5 pb-2"
      >
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Profile", { data: userDetails })}
        >
          <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0 left-0">
            <Icon.User height="50" width="50" stroke="black" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Settings")}
        >
          <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0 right-0">
            <Icon.Settings height="50" width="50" stroke="black" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}


