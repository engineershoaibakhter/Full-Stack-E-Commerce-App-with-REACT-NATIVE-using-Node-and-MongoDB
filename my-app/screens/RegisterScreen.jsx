import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigation=useNavigation();

  const handleSignUp=()=>{

  }
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
            Sign Up to your Account
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
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
            <FontAwesome6 name="person-circle-question" size={24} color="gray"  style={{ marginLeft: 8 }}  />
            <TextInput
              value={name}
              onChangeText={(text)=>setName(text)}
              style={{ color: "gray", marginVertical: 10, width: 300,fontSize:16 }}
              placeholder="Enter Your Name"
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
            secureTextEntry={true}
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
          onPress={handleSignUp}
          style={{width:200,backgroundColor:"#FEBE10",borderRadius:6,marginLeft:"auto",marginRight:"auto",padding:15}}>
            <Text style={{textAlign:"center",color:"white",fontSize:16,fontWeight:"bold"}}>Sign Up</Text>
          </Pressable>
          <Pressable onPress={()=>navigation.goBack()}
          style={{marginTop:15}}>
            <Text style={{textAlign:"center",color:"gray",fontSize:16}}>Already have an account? Sign In</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});