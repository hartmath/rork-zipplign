import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  Alert,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { X, RotateCw, Zap, Music, Timer, Sparkles } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const toggleCameraFacing = () => {
    handleHaptic();
    setFacing((current: CameraType) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    handleHaptic();
    setFlashMode(!flashMode);
  };

  const handleRecord = async () => {
    handleHaptic();
    if (isRecording) {
      setIsRecording(false);
      setTimer(0);
      if (Platform.OS !== 'web') {
        Alert.alert('Recording Stopped', 'Your video has been saved!');
      } else {
        console.log('Recording stopped - video saved!');
      }
    } else {
      setIsRecording(true);
      // Start timer
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev >= 60) {
            clearInterval(interval);
            setIsRecording(false);
            if (Platform.OS !== 'web') {
              Alert.alert('Recording Complete', 'Maximum recording time reached!');
            } else {
              console.log('Recording complete - maximum time reached!');
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          handleHaptic();
          router.back();
        }}>
          <X size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Image 
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
            style={styles.logo}
          />
          <Text style={styles.appName}>zipp</Text>
        </View>
        
        <View style={styles.headerOptions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleHaptic}>
            <Music size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleHaptic}>
            <Timer size={24} color={isRecording ? "#14b8a6" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleHaptic}>
            <Sparkles size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>REC {formatTime(timer)}</Text>
        </View>
      )}

      <CameraView 
        ref={cameraRef}
        style={styles.cameraView} 
        facing={facing}
        flash={flashMode ? 'on' : 'off'}
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
          <RotateCw size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recordingButton]} 
          onPress={handleRecord}
        >
          <View style={[styles.recordButtonInner, isRecording && styles.recordingButtonInner]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
          <Zap size={28} color={flashMode ? "#14b8a6" : "#fff"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#14b8a6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  appName: {
    color: "#14b8a6",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerOptions: {
    flexDirection: "row",
    gap: 20,
  },
  headerButton: {
    padding: 4,
  },
  recordingIndicator: {
    position: "absolute",
    top: 80,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(220, 38, 38, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  recordingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cameraView: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  sideButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#14b8a6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  recordingButton: {
    borderColor: "#dc2626",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#14b8a6",
  },
  recordingButtonInner: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    width: 40,
    height: 40,
  },
});