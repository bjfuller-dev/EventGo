import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState } from "react";
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    console.log(email, password);
    const userData = {
      email: email,
      password: password,
    };
    axios
      .post(`${API_URL}/login`, userData).then(res => {
        console.log(res.data);    
        if (res.data.status == 'Ok.') {
          Alert.alert('Login successful.');
          AsyncStorage.setItem("token", res.data.data);
          AsyncStorage.setItem('userLoggedIn', JSON.stringify(true));
          navigation.navigate('Home');
        } else {
              Alert.alert("User with these details was not found.");
            }
      })
    .catch((e) => console.log(e));
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <StatusBar barStyle="dark-content" />

        {/* Title */}
        <Text className="top-20 text-center font-bold t.alignAuto text-[55px]">
          Login
        </Text>

        {/* Login form */}
        <View className="flex mx-10 space-y-4 my-36">
          <Text>Email</Text>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholder="Email"
              placeholderTextColor={"gray"}
              onChange={(e) => setEmail(e.nativeEvent.text)}
            />
          </View>
          <Text>Password</Text>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              secureTextEntry={showPassword}
              placeholder="Password"
              placeholderTextColor={"gray"}
              onChange={(e) => setPassword(e.nativeEvent.text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : showPassword ? (
                <View className="absolute right-3 top-1/2 my-[-25px] mx-[-20px]">
                  <Icon.EyeOff name="eye-off" color="black" size={20} />
                </View>
              ) : (
                <View className="absolute right-3 top-1/2 my-[-25px] mx-[-20px]">
                  <Icon.Eye name="eye-off" color="black" size={20} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-slate-800 px-4 py-2 rounded-2xl"
            onPress={() => handleLogin()}
          >
            <Text className="text-xl font-bold text-white text-center">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back button */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Splash")}>
          <View className="flex-row items-center space-x-2 px-4 pb-2 my-20">
            <Icon.ArrowLeft height="50" width="50" stroke="black" />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}


