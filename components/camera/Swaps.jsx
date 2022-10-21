import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { useIsFocused } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import IconRedoCamera from "../iconRedoCamera";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// import asyncst
import { useNavigation } from "@react-navigation/native";


const Swaps = () => {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
  const [hasAudioPermissions, setHasAudioPermissions] = useState(false);
  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false);

  const [galleryItems, setGalleryItems] = useState([]);

  const [cameraRef, setCameraRef] = useState(null);

  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [cameraFlash, setCameraFlash] = useState(
    Camera.Constants.FlashMode.off
  );

  const [isCameraReady, setIsCameraReady] = useState(false);

  const isFocused = useIsFocused();

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === "granted");

      const audioStatus = await Audio.requestPermissionsAsync();
      setHasAudioPermissions(audioStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermissions(galleryStatus.status === "granted");

      if (galleryStatus.status === "granted") {
        const { assets } = await MediaLibrary.getAssetsAsync();
        setGalleryItems(assets);
      }
    })();
  }, []);

  // record a video and save it to the gallery
  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const videoReq = {
          maxDuration: 60,
          quality: Camera.Constants.VideoQuality["480"],
        };
        const videoRecordPromise = cameraRef.recordAsync(videoReq);
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          // grabs the video uri and stores it to pass it to the next screen, ex: navigates to the next screen and holds the props value
          navigation.navigate("SaveSwaps", { source });
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  // stop recording the video
  const stopVideo = () => {
    if (cameraRef) {
      cameraRef.stopRecording();
    }
  };

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.cancelled) {
      // grabs the video uri and stores it to pass it to the next screen, ex: navigates to the next screen and holds the props value
      navigation.navigate("SaveSwaps", { source: result.uri });
    }
  };

  // checker for permissions
  if (!hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions) {
    return <View></View>;
  }

  return (
    <>
      <View style={styles.container}>
        {isFocused ? (
          <Camera
            ref={(ref) => setCameraRef(ref)}
            style={styles.camera}
            ratio={"16:9"}
            type={cameraType}
            flashMode={cameraFlash}
            onCameraReady={() => setIsCameraReady(true)}
          />
        ) : null}

        <View style={[styles.rec]}>
          <TouchableOpacity style={styles.purpleOutline}>
            <TouchableOpacity
              // onPress={this.props.onPress}
              disabled={!isCameraReady}
              onLongPress={() => recordVideo()}
              onPressOut={() => stopVideo()}
              style={styles.purpleButton}
            ></TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.sideBarContainer}>
            <TouchableOpacity
              style={styles.sideBarButton}
              onPress={() =>
                setCameraType(
                  cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }
            >
              <IconRedoCamera />
              <Text style={styles.iconText}>Flip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideBarButton}
              onPress={() =>
                setCameraFlash(
                  cameraFlash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.torch
                    : Camera.Constants.FlashMode.off
                )
              }
            >
              <Feather name="zap" size={24} color={"white"} />
              <Text style={styles.iconText}>Flash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={() => pickFromGallery()}
          style={styles.gallery}
        >
          {galleryItems[0] == undefined ? (
            <></>
          ) : (
            <Image
              style={styles.galleryImage}
              source={{ uri: galleryItems[0].uri }}
            />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    backgroundColor: "black",
    aspectRatio: 9 / 16,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  rec: {
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
  redovideopos: {
    position: "absolute",
    top: "4%",
    right: 20,
    height: 80,
    width: 80,
  },
  gallery: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    width: 50,
    height: 50,
    top: -110,
    paddingLeft: 10,
  },
  galleryImage: {
    width: 50,
    height: 50,
  },
  recordButton: {
    borderWidth: 8,
    borderColor: "#ff404087",
    backgroundColor: "#ff4040",
    borderRadius: 100,
    height: 80,
    width: 80,
    alignSelf: "center",
  },
  purpleButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 56,
    height: 56,
    borderRadius: 1000,
    backgroundColor: "#AD55C3",
    margin: 10,
  },
  purpleOutline: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 1000,
    borderColor: "#AD55C3",
    borderWidth: 1,
    margin: 10,
  },
  sideBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sideBarButton: {
    alignItems: "center",
  },
  iconText: {
    color: "white",
    fontSize: 12,
  },

  
});

export default Swaps