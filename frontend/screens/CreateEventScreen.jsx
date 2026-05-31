import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [email, setEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);

  const [name, setName] = useState("");
  const [verifyName, setVerifyName] = useState(false);

  const [description, setDescription] = useState("");
  const [verifyDescription, setVerifyDescription] = useState(false);

  const [location, setLocation] = useState("");
  const [verifyLocation, setVerifyLocation] = useState(false);

  const [fee, setFee] = useState("");
  const [verifyFee, setVerifyFee] = useState(false);

  const [max, setMax] = useState("");
  const [verifyMax, setVerifyMax] = useState(false);

  const [isChecked, setChecked] = useState(true);

  const [date, setDate] = useState(new Date());
  const [verifyDate, setVerifyDate] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date"); // 'date' or 'time'

  const [openDate, setOpenDate] = useState(new Date());
  const [openShow, setOpenShow] = useState(false);
  const [openMode, setOpenMode] = useState("date"); // 'date' or 'time'

  const [closeDate, setCloseDate] = useState(new Date());
  const [closeShow, setCloseShow] = useState(false);
  const [closeMode, setCloseMode] = useState("date"); // 'date' or 'time'

  const [openDaySelect, setOpenDaySelect] = useState("5");
  const [closeDaySelect, setCloseDaySelect] = useState("3");

  const startDateString = JSON.stringify(date);
  const [startDate, startTime] = startDateString.split("T");
  const [startYear, startMonth, startDay] = startDate.split("-");
  const [startTrim, startTrimYear] = startYear.split('"');
  const [startHour, startMinute, startSecond] = startTime.split(":");
  const startHourBST = parseInt(startHour) + 1;

  const openDateString = JSON.stringify(openDate);
  const [openingDate, openTime] = openDateString.split("T");
  const [openHour, openMinute, openSecond] = openTime.split(":");
  const openHourBST = parseInt(openHour) + 1;

  const closeDateString = JSON.stringify(closeDate);
  const [closingDate, closeTime] = closeDateString.split("T");
  const [closeHour, closeMinute, closeSecond] = closeTime.split(":");
  const closeHourBST = parseInt(closeHour) + 1;

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

  // Handles all time pickers

  const onOpenChange = (event, selectedDate) => {
    const currentDate = selectedDate || openDate;
    setOpenShow(Platform.OS === "ios");
    setOpenDate(currentDate);
  };
  const onCloseChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setCloseShow(Platform.OS === "ios");
    setCloseDate(currentDate);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const openShowMode = (currentMode) => {
    setOpenShow(true);
    setOpenMode(currentMode);
  };
  const closeShowMode = (currentMode) => {
    setCloseShow(true);
    setCloseMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const showTimepicker = () => {
    showMode("time");
  };
  const showOpenTimepicker = () => {
    openShowMode("time");
  };
  const showCloseTimepicker = () => {
    closeShowMode("time");
  };

  // Sets the current users email value
  async function handleEmail(e) {
    const creatorEmail = userDetails.email;
    setEmail(creatorEmail);
    setVerifyEmail(true);
  }

  useEffect(() => {
    handleEmail();
  });

  // Handles user input of event name, trims whitespace and removes dangerous characters
  function handleName(e) {
    const eventName = e.nativeEvent.text.trim().replace(/[^\w\s]/gi, "");
    setName(eventName);
    setVerifyName(false);

    if (eventName.length > 4) {
      setVerifyName(true);
    }
  }

  // Handles user input of event description, trims whitespace and removes dangerous characters
  function handleDescription(e) {
    const eventDescription = e.nativeEvent.text.trim().replace(/[^\w\s]/gi, "");
    setDescription(eventDescription);
    setVerifyDescription(false);

    if (eventDescription.length > 10) {
      setVerifyDescription(true);
    }
  }

  // Holds the error string for the date selector
  const [dateError, setDateError] = useState("");

  // Handles user start date selection
  const onStartChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");

    if (selectedDate) {
      setDate(selectedDate);
      validateStartDate(selectedDate);
    }
  };

  // Validates the chosen start date, ensuring it is beyond the current date.
  const validateStartDate = (selectedDate) => {
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      setDateError("The event date must be in the future.");
      setVerifyDate(false);
    } else {
      setDateError("");
      setVerifyDate(true);
    }
  };

  // Handles user input of event location, trims whitespace and removes dangerous characters
  function handleLocation(e) {
    const eventLocation = e.nativeEvent.text.trim().replace(/[^\w\s]/gi, "");
    setLocation(eventLocation);
    setVerifyLocation(false);

    if (eventLocation.length > 2) {
      setVerifyLocation(true);
    }
  }

  // Holds the error string for the fee input
  const [feeError, setFeeError] = useState("");

  // Handles user input of event fee, trims whitespace and ensures it is a number with up to 2 d.p
  function handleFee(e) {
    const eventFee = e.nativeEvent.text.trim();
    const validFee = /^\d+(\.\d{1,2})?$/.test(eventFee);

    if (!validFee) {
      setFeeError("Please enter a valid number, with up to 2 decimal places.");
      setVerifyFee(false);
    } else {
      setFeeError("");
      setFee(eventFee);
      setVerifyFee(true);
    }
  }

  // Holds the error string for the maximum participants input
  const [maxError, setMaxError] = useState("");

  // Handles user input of event maximum participants, trims whitespace and ensures it is a whole number
  function handleMax(e) {
    const eventMax = e.nativeEvent.text;
    const validMax = /^\d+$/.test(eventMax);

    if (!validMax) {
      setMaxError("Please enter a valid whole number.");
      setVerifyMax(false);
    } else {
      setMaxError("");
      setMax(eventMax);
      setVerifyMax(true);
    }
  }

  // Adds the created event to the creators list of owned events
  const updateOwned = () => {
    const userData = {
      email: email,
      owned: name,
    };
    axios
      .post(`${API_URL}/owned`, userData)
      .then((res) => console.log(res));
  };

  // Handles creation of event, checks all inputs are valid, displays errors
  function handleCreate() {
    const openDayTime = openHourBST + ":" + openMinute + "/" + openDaySelect;
    const closeDayTime = closeHourBST + ":" + closeMinute + "/" + closeDaySelect;
    const event = 0;

    const eventData = {
      creator: email,
      name: name,
      description: description,
      start: date,
      repeat: isChecked,
      location: location,
      open: openDayTime,
      close: closeDayTime,
      fee: fee,
      max: max,
      event: event,
      registered: email,
    };
    if (
      verifyEmail &&
      verifyName &&
      verifyDescription &&
      verifyDate &&
      verifyLocation &&
      verifyFee &&
      verifyMax
    ) {
      axios
        .post(`${API_URL}/event`, eventData)
        .then((res) => {
          console.log(res.data);
          if (res.data.status == "Ok.") {
            Alert.alert("Event successfully created.");
            updateOwned();
            getUserDetails();
            navigation.navigate("Home", { data: userDetails });
          } else {
            Alert.alert(
              "An event with this name already exists, please pick another name."
            );
          }
        })
        .catch((e) => console.log(e));
    } else {
      Alert.alert("Please complete all required fields.");
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
        <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
          Create Event
        </Text>

        {/* Create event form */}
        <View className="flex mx-10 space-y-4">
          <Text className="my-2 text-[20px]">Event name</Text>
          <View className="relative bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholderTextColor={"gray"}
              onChange={(e) => handleName(e)}
            />
            {name.length < 1 ? null : verifyName ? (
              <View className="absolute right-3 top-1/2 my-2">
                <Icon.CheckCircle name="check-circle" color="green" size={20} />
              </View>
            ) : (
              <View className="absolute right-3 top-1/2 my-2">
                <Icon.X name="error" color="red" size={20} />
              </View>
            )}
          </View>
          {name.length < 1 ? null : verifyName ? null : (
            <Text className="text-red-500">
              Name must be at least 5 characters long.
            </Text>
          )}

          <Text className="text-[20px]">Description</Text>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholderTextColor={"gray"}
              onChange={(e) => handleDescription(e)}
            />
            {description.length < 1 ? null : verifyDescription ? (
              <View className="absolute right-3 top-1/2 my-2">
                <Icon.CheckCircle name="check-circle" color="green" size={20} />
              </View>
            ) : (
              <View className="absolute right-3 top-1/2 my-2">
                <Icon.X name="error" color="red" size={20} />
              </View>
            )}
          </View>
          {description.length < 1 ? null : verifyDescription ? null : (
            <Text className="text-red-500">
              Description must be at least 10 characters long.
            </Text>
          )}
          <View>
            <View>
              <Text className="text-center t.alignAuto text-[28px]">
                Event start date & time
              </Text>
              <TouchableOpacity
                className="bg-slate-800 px-4 py-2 rounded-2xl my-2"
                onPress={showDatepicker}
                title="Show Date Picker"
              >
                <Text className="text-xl font-bold text-white text-center">
                  Show Date Picker
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className="bg-slate-800 px-4 py-2 rounded-2xl"
                onPress={showTimepicker}
                title="Show Date Picker"
              >
                <Text className="text-xl font-bold text-white text-center">
                  Show Time Picker
                </Text>
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                value={date}
                mode={mode}
                display="default"
                onChange={onStartChange}
              />
            )}
            <Text className="my-2 text-center text-[20px]">
              {startDay}/{startMonth}/{startTrimYear}
            </Text>
            <Text className="text-center text-[20px]">
              {startHourBST}:{startMinute}
            </Text>
          </View>

          {dateError ? (
            <View>
              <Text className="text-red-500">{dateError}</Text>
              <Icon.X
                className="absolute right-0"
                name="error"
                color="red"
                size={20}
              />
            </View>
          ) : null}
          <Text className="text-[20px]">Location</Text>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholder=""
              placeholderTextColor={"gray"}
              onChange={(e) => handleLocation(e)}
            />

            {location.length < 1 ? null : verifyLocation ? (
              <View className="absolute right-3 top-1/2 my-2">
                <Icon.CheckCircle name="check-circle" color="green" size={20} />
              </View>
            ) : (
              <View className="absolute right-3 top-1/2 my-2">
                <Icon.X name="error" color="red" size={20} />
              </View>
            )}
          </View>
          {location.length < 1 ? null : verifyLocation ? null : (
            <Text className="text-red-500">
              Location must be at least 3 characters long.
            </Text>
          )}

          <Text className="text-[20px]">Event fee</Text>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholder=""
              placeholderTextColor={"gray"}
              onChange={(e) => handleFee(e)}
            />
          </View>
          {feeError ? (
            <View>
              <Text className="text-red-500">{feeError}</Text>
              <Icon.X
                className="absolute right-0"
                name="error"
                color="red"
                size={20}
              />
            </View>
          ) : null}

          <Text className="text-[20px]">Maximum allowed participants</Text>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput
              placeholder=""
              placeholderTextColor={"gray"}
              onChange={(e) => handleMax(e)}
            />
          </View>
          {maxError ? (
            <View>
              <Text className="text-red-500">{maxError}</Text>
              <Icon.X
                className="absolute right-0"
                name="error"
                color="red"
                size={20}
              />
            </View>
          ) : null}
          <Text className="text-[20px]">Repeat event weekly?</Text>
          <View className="align-center">
            <Checkbox
              color="blue"
              value={isChecked}
              onValueChange={setChecked}
            />
          </View>
          <View>
            <View>
              <Text className="text-center t.alignAuto text-[28px]">
                Sign up open day and time
              </Text>
            </View>
            <View>
              <Text className="my-5 text-center text-[20px]">
                {openDaySelect} days before event at {openHourBST}:{openMinute}
              </Text>
              <TouchableOpacity
                className="bg-slate-800 px-4 py-2 rounded-2xl"
                onPress={showOpenTimepicker}
                title="Show Date Picker"
              >
                <Text className="text-xl font-bold text-white text-center">
                  Show Time Picker
                </Text>
              </TouchableOpacity>
            </View>
            {openShow && (
              <DateTimePicker
                value={openDate}
                mode={openMode}
                display="default"
                onChange={onOpenChange}
              />
            )}
            <Picker
              selectedValue={openDaySelect}
              onValueChange={(itemValue, itemIndex) =>
                setOpenDaySelect(itemValue)
              }
            >
              <Picker.Item label="0 days" value="0" />
              <Picker.Item label="1 day" value="1" />
              <Picker.Item label="2 days" value="2" />
              <Picker.Item label="3 days" value="3" />
              <Picker.Item label="4 days" value="4" />
              <Picker.Item label="5 days" value="5" />
              <Picker.Item label="6 days" value="6" />
            </Picker>
          </View>
          <View>
            <View>
              <Text className="text-center t.alignAuto text-[28px]">
                Sign up deadline
              </Text>
            </View>
            <Text className="my-5 text-center text-[20px]">
              {closeDaySelect} days before event at {closeHourBST}:{closeMinute}
            </Text>
            <View>
              <TouchableOpacity
                className="bg-slate-800 px-4 py-2 rounded-2xl"
                onPress={showCloseTimepicker}
                title="Show Date Picker"
              >
                <Text className="text-xl font-bold text-white text-center">
                  Show Time Picker
                </Text>
              </TouchableOpacity>
            </View>
            {closeShow && (
              <DateTimePicker
                value={closeDate}
                mode={closeMode}
                display="default"
                onChange={onCloseChange}
              />
            )}
            <Picker
              selectedValue={closeDaySelect}
              onValueChange={(itemValue, itemIndex) =>
                setCloseDaySelect(itemValue)
              }
            >
              <Picker.Item label="0 days" value="0" />
              <Picker.Item label="1 day" value="1" />
              <Picker.Item label="2 days" value="2" />
              <Picker.Item label="3 days" value="3" />
              <Picker.Item label="4 days" value="4" />
              <Picker.Item label="5 days" value="5" />
              <Picker.Item label="6 days" value="6" />
            </Picker>
          </View>

          {/* Event Create button */}
          <TouchableOpacity className="bg-slate-800 px-4 py-2 rounded-2xl">
            <Text
              className="text-xl font-bold text-white text-center"
              onPress={() => handleCreate()}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back button */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
          <View className="flex-row items-center my-10">
            <Icon.ArrowLeft height="50" width="50" stroke="black" />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}
