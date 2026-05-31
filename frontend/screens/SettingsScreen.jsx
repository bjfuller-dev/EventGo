import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  function logOut(){
  AsyncStorage.setItem('userLoggedIn','');
  AsyncStorage.setItem('token','');
  navigation.navigate("Login");
  }
  return (
  <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />
      
      {/* Title */}
      <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
      Settings
      </Text>

      <View className="flex mx-10 space-y-4 my-52">
        <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-2xl h-20" onPress={()=> logOut()}>
            <Text className="text-xl font-bold text-white text-center m-auto">Log out</Text>
        </TouchableOpacity>
      </View>

        {/* Back button */}
      <TouchableWithoutFeedback onPress={()=> navigation.navigate('Home')}>
        <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0 left-0">
          <Icon.ArrowLeft height="50" width="50" stroke="black" />
        </View>
      </TouchableWithoutFeedback>

    </SafeAreaView>
  )
}


