import { View, Text, TextInput, TouchableWithoutFeedback, Button, TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  
    return (
      <SafeAreaView className="bg-white flex-1">
        <StatusBar barStyle="dark-content" />

        {/* Title */}
        <Text className="top-20 text-center font-bold t.alignAuto text-[100px]">
        EventGo
        </Text>

        {/* Description */}
        <View className="flex-1">
          <View className="absolute my-40">
            <Text className="text-center text-lg text-gray-400">
            Creating tailored events has never been easier. Make an event that suits you, invite your friends and receive payments effortlessly.
            </Text>
          </View>
        </View>

        {/* Login & Sign up Buttons */}
        <View className="absolute bottom-10 w-full flex-row justify-center">
          <View className="flex-row space-x-4">
            <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-2xl" onPress={()=> navigation.navigate('Login')}>
              <Text className="text-xl font-bold text-white text-center">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-2xl" onPress={()=> navigation.navigate('SignUp')}>
              <Text className="text-xl font-bold text-white text-center">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </SafeAreaView>
    )
}