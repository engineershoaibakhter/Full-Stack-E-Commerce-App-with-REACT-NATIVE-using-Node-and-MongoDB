import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Ensure axios is imported correctly
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { REACT_NATIVE_APP_API_URL } from "@env";

const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail"); // Assuming you store user email in AsyncStorage
        if (email) {
          const response = await axios.get(`${REACT_NATIVE_APP_API_URL}/user/${email}`);
          if (response.status === 200) {
            setUserId(response.data.userId);
          } else {
            console.log("Failed to fetch userId");
          }
        } else {
          console.log("No email found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [setUserId]);

  const handleAddAddress = async () => {
    const address = {
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };

    if (!userId) {
      Alert.alert("Error", "User ID is not set. Please try again.");
      return;
    }

    if(name!=="" || mobileNo!=="" || houseNo!=="" || street!=="" || landmark!=="" || postalCode!==""){
    try {
      const response = await axios.post(`${REACT_NATIVE_APP_API_URL}/addresses`, {
        userId,
        address,
      });
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Address added successfully");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        Alert.alert("Failed", "Response status is not 201");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add address");
      console.log("Error:", error.response ? error.response.data : error.message);
    }
  }
  else{
    Alert.alert("Enter All Form Field")
  }
  };

  return (
    <ScrollView>
      <View style={{ height: 50 }} />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 27, fontWeight: "bold",textAlign:"center" }}>Add a new Address</Text>
        <TextInput
          placeholderTextColor={"black"}
          placeholder="Enter Country Name"
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
        />
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Full name (First and last name)</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Name"
          />
        </View>
        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mobile number</Text>
          <TextInput
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Mobile No"
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Flat, House No, Building, Company</Text>
          <TextInput
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter House No"
          />
        </View>
        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Area, Street, sector, village</Text>
          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Area"
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Eg Near Zubaida hospital"
          />
        </View>
        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Pincode</Text>
          <TextInput
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Pin-code"
          />
        </View>
        <Pressable
          onPress={handleAddAddress}
          style={{
            backgroundColor: "#FFC72C",
            padding: 19,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Add Address</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});
