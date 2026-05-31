import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from "react";
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import { useStripe, CardField } from "@stripe/stripe-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const testDetails = route.params.data;

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const { confirmPayment } = useStripe();
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(false);

  const eventFee = "£" + testDetails.fee.toString()

  const [userDetails, setUserDetails] = useState("");

  async function getUserDetails() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    axios
      .post(`${API_URL}/userdetails`, { token: token })
      .then((res) => {
        console.log(res.data);
        setUserDetails(res.data.data);
      });
  }
  useEffect(() => {
    getUserDetails();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/create-payment-intent`,
        {
          amount: testDetails.fee * 100,
          currency: "gbp",
        }
      );

      const { clientSecret } = response.data; 
      setPaymentIntent(clientSecret);

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            email: userDetails.email, 
          },
        },
      });

      if (error) {
        Alert.alert("Payment failed", error.message);
      } else if (paymentIntent) {
        Alert.alert(
          "Payment successful",
        );
        handlePaid();
        navigation.navigate("JoinedEvent", { data: testDetails });
      }
    } catch (err) {
      Alert.alert("Payment error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaid = async () => {
    try {
      const eventData = {
        name: testDetails.name,
        payment: userDetails.email,
      };
      axios
        .post(`${API_URL}/payment`, eventData)
        .then((res) => console.log(res));
    } catch (err) {
      Alert.alert("Payment error", err.message);
    }
  }

  console.log("Details: ", userDetails.name);

  return (
    <SafeAreaView
      className="bg-white flex-1"
      keyboardShouldPersistTaps="always"
    >
      <View className="flex mx-10 space-y-4">
        <StatusBar barStyle="dark-content" />

        {/* Title */}
        <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
          Payment
        </Text>
        <View className="flex mx-10 space-y-4">
          <Text className="">Fee amount</Text>
          <View className="bg-black/5 p-3.5 rounded-2xl w-full">
            <TextInput
              placeholder={eventFee}
              placeholderTextColor={"gray"}
              editable={false}
            />
          </View>
        </View>
        <Text>Enter your card details:</Text>
        <CardField
          postalCodeEnabled={true}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={{
            width: "100%",
            height: 50,
            marginVertical: 30,
          }}
        />

        <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-2xl">
          <Text
            className="text-xl font-bold text-white text-center"
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Back button */}
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("JoinedEvent", { data: testDetails })
        }
      >
        <View className="my-72">
          <Icon.ArrowLeft height="50" width="50" stroke="black" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}


