import { StyleSheet, Text, View, SafeAreaView, Image,KeyboardAvoidingView } from "react-native";
import React from "react";

const LoginScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 250, height: 150,marginTop:40 }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View>
          <Text style={{fontSize:17,fontWeight:"bold",marginTop:6,color:"#041E42"}}>Login In to your Account</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
