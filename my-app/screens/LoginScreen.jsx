import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_APP_API_URL } from '@env';
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigation=useNavigation();

  useEffect( ()=>{
    const checkLoginStatus=(async ()=>{
      try {
        const token = await AsyncStorage.getItem("authToken");
        if(token){
          navigation.replace('Main');
        }

      } catch (error) {
        console.log("Token is not get",error);
      }
    })
    checkLoginStatus();
  },[])
  const handleLogin = async () => {
    const user = {
      email: email,
      password: password
    };
  
    try {
      const response = await axios.post(`${REACT_NATIVE_APP_API_URL}/login`, user);
      if (response.status === 200 && response.data.token) {
        console.log("Login is successful");
        const token = response.data.token;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userEmail', email);
        navigation.replace("Main");
      } else {
        // If the response does not have a token or status is not 200
        Alert.alert("Login failed", "Invalid email or password");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Alert.alert("Login failed", error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert("Login failed", "No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert("Login failed", error.message);
      }
      console.log(error);
    }
  };
  
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 250, height: 150, marginTop: 40 }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 6,
              color: "#041E42",
            }}
          >
            Login In to your Account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialCommunityIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text)=>setEmail(text)}
              style={{ color: "gray", marginVertical: 10, width: 300,fontSize:16 }}
              placeholder="Enter Your Email"
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              value={password}
              onChangeText={(text)=>setPassword(text)}
              style={{ color: "gray", marginVertical: 10, width: 300,fontSize:16 }}
              placeholder="Enter Your Password"
            />
          </View>
        </View>

        <View style={{marginTop:12,flexDirection:"row",justifyContent:"space-between"}}>
          <Text>keep me Logged in</Text>
          <Text style={{color:"#007FFF",fontWeight:"700"}}>Forgot Password</Text>
        </View>

        <View style={{marginTop:50}}>
          <Pressable
          onPress={handleLogin}
          style={{width:200,backgroundColor:"#FEBE10",borderRadius:6,marginLeft:"auto",marginRight:"auto",padding:15}}>
            <Text style={{textAlign:"center",color:"white",fontSize:16,fontWeight:"bold"}}>Login</Text>
          </Pressable>
          <Pressable onPress={()=>navigation.navigate("Register")}
          style={{marginTop:15}}>
            <Text style={{textAlign:"center",color:"gray",fontSize:16}}>Don't have an account? Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
