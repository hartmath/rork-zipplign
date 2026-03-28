import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { X, RotateCw, Zap, Music, Timer, Sparkles } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useZipplign } from '@/app/context/ZipplignProvider';

export default function CameraScreen() {
  const { zipId } = useLocalSearchParams();
  const { saveDraft, publishPost, posts, currentUser, isAuthenticated } = useZipplign();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const countdownAnimation = useRef(new Animated.Value(1)).current;
  const isZipMode = !!zipId;

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

  const startCountdown = () => {
    setShowCountdown(true);
    setCountdown(5);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          startRecording();
          return 0;
        }
        
        // Animate countdown
        Animated.sequence([
          Animated.timing(countdownAnimation, {
            toValue: 1.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    setIsRecording(true);
    handleHaptic();
    
    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => {
        const maxTime = isZipMode ? 180 : 60; // 3 minutes for zip mode, 1 minute for regular
        if (prev >= maxTime) {
          clearInterval(interval);
          stopRecording();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setTimer(0);
    
    // Create post object
    const originalPost = isZipMode ? posts.find(p => p.id === zipId) : undefined;
    
    const newPost = {
      id: `post_${Date.now()}`,
      username: currentUser?.username || 'anonymous',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      thumbnail: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800`,
      description: isZipMode ? `Riding the zip! 🔥 #ZipLine` : 'New Zippclip! ✨',
      music: 'Original Sound',
      musicCover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150',
      likes: '0',
      comments: '0',
      shares: '0',
      bookmarks: '0',
      hearts: '0',
      zippers: '0',
      duration: timer,
      isRemix: isZipMode,
      originalPost: originalPost ? {
        id: originalPost.id,
        username: originalPost.username,
        userAvatar: originalPost.userAvatar,
        thumbnail: originalPost.thumbnail,
        description: originalPost.description,
      } : undefined,
    };
    
    // Navigate to video edit screen
    router.push('/video-edit');
    
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Recording Complete', 
        `Your ${isZipMode ? 'Zippclip' : 'video'} is ready for editing!`,
        [{ text: 'OK' }]
      );
    } else {
      console.log(`Recording complete - ${isZipMode ? 'Zippclip' : 'video'} ready for editing!`);
    }
  };

  const handleRecord = async () => {
    handleHaptic();
    
    if (!isAuthenticated) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Sign In Required',
          'Please sign in to create Zippclips',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => router.push('/auth') }
          ]
        );
      } else {
        console.log('Please sign in to create Zippclips');
        router.push('/auth');
      }
      return;
    }
    
    if (isRecording) {
      stopRecording();
    } else {
      startCountdown();
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
          {isZipMode && (
            <View style={styles.zipModeIndicator}>
              <Text style={styles.zipModeText}>ZIP MODE</Text>
            </View>
          )}
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

      {showCountdown && (
        <View style={styles.countdownContainer}>
          <Animated.View style={[styles.countdownCircle, { transform: [{ scale: countdownAnimation }] }]}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </Animated.View>
          <Text style={styles.countdownLabel}>{isZipMode ? 'Get ready to Zipp!' : 'Get ready!'}</Text>
        </View>
      )}

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>
            {isZipMode ? 'ZIPPING' : 'REC'} {formatTime(timer)}
            {isZipMode && ` / ${formatTime(180)}`}
          </Text>
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
          style={[
            styles.recordButton, 
            isRecording && styles.recordingButton,
            isZipMode && styles.zipRecordButton
          ]} 
          onPress={handleRecord}
          disabled={showCountdown}
        >
          <View style={[
            styles.recordButtonInner, 
            isRecording && styles.recordingButtonInner,
            isZipMode && !isRecording && styles.zipRecordButtonInner
          ]}>
            {isZipMode && !isRecording && (
              <Text style={styles.zipRecordText}>Z</Text>
            )}
          </View>
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
  zipModeIndicator: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  zipModeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  countdownContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -75 }],
    alignItems: "center",
    zIndex: 20,
  },
  countdownCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(20, 184, 166, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  countdownText: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "bold",
  },
  countdownLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  zipRecordButton: {
    borderColor: "#fbbf24",
  },
  zipRecordButtonInner: {
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
  },
  zipRecordText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
  },
});