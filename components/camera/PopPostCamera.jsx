import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import PurpleCircleButton from "../purpleCircleButton";
import IconRedoCamera from "../iconRedoCamera";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";

const PopPostCamera = (props) => {
  return (
    <>
      <View style={[styles.container]}></View>
    </>
  );
};

// add styles to drawer
const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#242A37",
    position: "absolute",
    top: "85%",
    borderRadius: 20,
    shadowRadius: 20,
    shadowColor: "#242A37",
    alignItems: "center",
  },
});

export default PopPostCamera;
