import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

export default function SignUpScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [email, setEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState(false);
  const [name, setName] = useState("");
  const [verifyName, setVerifyName] = useState(false);
  const [joined, setJoined] = useState(null);
  const [verifyJoined, setVerifyJoined] = useState(true);
  const [owned, setOwned] = useState(null);
  const [verifyOwned, setVerifyOwned] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  function handleSignUp() {
    const userData = {
      name: name,
      email: email,
      password: password,
    };
    if (verifyName && verifyEmail && verifyPassword) {
      axios
        .post(`${API_URL}/register`, userData)
        .then((res) => {
          console.log(res.data);
          if (res.data.status == "Ok.") {
            Alert.alert("Successfully registered.");
            navigation.navigate("Login");
          } else {
            Alert.alert("This email is already in use.");
          }
        })
        .catch((e) => console.log(e));
    } else {
      Alert.alert("Please complete all required fields.");
    }
  }


  function handleName(e){
    const userName = e.nativeEvent.text;
    setName(userName);
    setVerifyName(false);

    if (userName.length > 1) {
      setVerifyName(true);
    }
  }

  function handleEmail(e) {
    const userEmail = e.nativeEvent.text;
    setEmail(userEmail);
    setVerifyEmail(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-z]{2,}$/.test(userEmail)){
      setEmail(userEmail);
      setVerifyEmail(true);
    }
  }

  function handlePassword(e) {
    const userPassword = e.nativeEvent.text;
    setPassword(userPassword);
    setVerifyPassword(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(userPassword)) {
      setPassword(userPassword);
      setVerifyPassword(true);
    }
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
            Create Account
          </Text>

          {/* Sign up form */}
          <View className="flex mx-10 space-y-4 my-36">
            {/* Name input and validation */}
            <View className="flex text-left">
              <Text>Name</Text>
            </View>
            <View className="relative bg-black/5 p-5 rounded-2xl w-full">
              <TextInput
                placeholder="Name"
                placeholderTextColor={"gray"}
                onChange={(e) => handleName(e)}
              />
              {name.length < 1 ? null : verifyName ? (
                <View className="absolute right-3 top-1/2 my-2">
                  <Icon.CheckCircle
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </View>
              ) : (
                <View className="absolute right-3 top-1/2 my-2">
                  <Icon.X name="error" color="red" size={20} />
                </View>
              )}
            </View>
            {name.length < 1 ? null : verifyName ? null : (
              <Text className="text-red-500">
                Name must be longer than 1 character.
              </Text>
            )}

            {/* Email input and validation */}
            <Text>Email</Text>
            <View className="relative bg-black/5 p-5 rounded-2xl w-full">
              <TextInput
                placeholder="Email"
                placeholderTextColor={"gray"}
                onChange={(e) => handleEmail(e)}
              />

              {email.length < 1 ? null : verifyEmail ? (
                <View className="absolute right-3 top-1/2 my-2">
                  <Icon.CheckCircle
                    name="check-circle"
                    color="green"
                    size={20}
                  />
                </View>
              ) : (
                <View className="absolute right-3 top-1/2 my-2">
                  <Icon.X name="error" color="red" size={20} />
                </View>
              )}
            </View>
            {email.length < 1 ? null : verifyEmail ? null : (
              <Text className="text-red-500">
                Please enter a proper email address.
              </Text>
            )}

            {/* Password input and validation */}
            <Text>Password</Text>
            <View className="relative bg-black/5 p-5 rounded-2xl w-full">
              <TextInput
                placeholder="Password"
                placeholderTextColor={"gray"}
                secureTextEntry={showPassword}
                onChange={(e) => handlePassword(e)}
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
            {password.length < 1 ? null : verifyPassword ? null : (
              <Text className="text-red-500">
                Password must contain at least 6 characters, including an
                uppercase, lowercase and a number.
              </Text>
            )}

            {/* Sign up button */}
            <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-2xl">
              <Text
                className="text-xl font-bold text-white text-center"
                onPress={() => handleSignUp()}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back button */}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Splash")}
          >
            <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0 left-0">
              <Icon.ArrowLeft height="50" width="50" stroke="black" />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    );
}


