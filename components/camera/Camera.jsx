import React, { useEffect, useState } from "react";
import { Camera, CameraType } from 'expo-camera';
import { Audio } from "expo-av";
import { Button, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import axios from "axios";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CameraView() {
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
 
  const [hasAudioPermissions, setHasAudioPermissions] = useState(false);
  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false);

  const [galleryItems, setGalleryItems] = useState([]);

  const [cameraRef, setCameraRef] = useState(null);

  
  const [cameraFlash, setCameraFlash] = useState(
    Camera.Constants.FlashMode.off
  );

  const [isCameraReady, setIsCameraReady] = useState(false);


  // record a video and save it to the gallery
  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const videoReq = {
          maxDuration: 15,
          quality: Camera.Constants.VideoQuality["720"],
        };
        const videoRecordPromise = cameraRef.recordAsync(videoReq);
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          // grabs the video uri and stores it to pass it to the next screen, ex: navigates to the next screen and holds the props value
         console.log(source);
         postVideo(source);
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
  
  // tauthToken
  // mEqflkxLByGhidIpRhFdLGRyoLsSSn5xxutkGsno


  const postVideo = async (source) => {
    const cloudflareURL = "https://api.cloudflare.com/client/v4/accounts/4620feac32477b7ac7326aee3b509daf/stream"

    // upload video to url
    const form = new FormData();

    const file = {
      uri: source,
      name: "test",
    };

    form.append("file", file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer mEqflkxLByGhidIpRhFdLGRyoLsSSn5xxutkGsno"
      },
      
    };

    axios.post(cloudflareURL, form, config)
      .then((response) => {
        console.log(response);
      }
      )
      .catch((error) => {
        console.log(error);
      });
    
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === "granted");

      const audioStatus = await Audio.requestPermissionsAsync();
      setHasAudioPermissions(audioStatus.status === "granted");

    })();
  }, []);



  if (!hasCameraPermissions) {
    // Camera permissions are still loading
    return <View />;
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <>
      <View style={styles.container}>
        
          <Camera
            ref={(ref) => setCameraRef(ref)}
            style={styles.camera}
            ratio={"16:9"}
            type={cameraType}
            flashMode={cameraFlash}
            onCameraReady={() => setIsCameraReady(true)}
          />
       

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

          <View style={styles.sideBarContainerRight}>
            <TouchableOpacity
              style={styles.sideBarButton}
              onPress={() =>
                setCameraType(
                  cameraType === Camera.Constants.Type.front
                    ? Camera.Constants.Type.back
                    : Camera.Constants.Type.front
                )
              }
            >
           
              {/* <Text style={styles.iconText}>Flip</Text> */}
            </TouchableOpacity>

            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
        </View>
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
  sideBarContainerRight: {
    marginRight: 40,
    alignSelf: "flex-end",
    top: -40,
  },
  iconText: {
    color: "white",
    fontSize: 12,
  },
});
