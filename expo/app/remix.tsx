import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { X, RotateCcw, Check, Music } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { mockPosts } from '@/mocks/posts';

export default function RemixScreen() {
  const insets = useSafeAreaInsets();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  const originalPost = mockPosts.find(post => post.id === postId);

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const toggleCameraFacing = () => {
    handleHaptic();
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleRecord = () => {
    handleHaptic();
    setIsRecording(!isRecording);
    // In a real app, you would start/stop video recording here
    console.log(isRecording ? 'Stop recording' : 'Start recording');
  };

  const handlePost = () => {
    handleHaptic();
    if (!description.trim()) {
      setShowSuccessModal(true);
      return;
    }
    
    // In a real app, you would upload the video and create the remix post
    console.log('Creating remix post with description:', description);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.back();
    }, 2000);
  };

  const handleClose = () => {
    handleHaptic();
    router.back();
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.permissionText}>We need camera permission to create remixes</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!originalPost) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Original post not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Camera View */}
      <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          {/* Original Video PiP */}
          <View style={[styles.pipContainer, { top: insets.top + 60 }]}>
            <Image source={{ uri: originalPost.thumbnail }} style={styles.pipVideo} />
            <View style={styles.pipOverlay}>
              <Image source={{ uri: originalPost.userAvatar }} style={styles.pipAvatar} />
              <Text style={styles.pipUsername}>@{originalPost.username}</Text>
            </View>
          </View>

          {/* Top Controls */}
          <View style={[styles.topControls, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Ride my Zip</Text>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.descriptionContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add your remix description..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={150}
              />
            </View>
            
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.musicButton}>
                <Music size={24} color="#fff" />
                <Text style={styles.musicText}>Add Sound</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={handleRecord}
              >
                <View style={[styles.recordInner, isRecording && styles.recordingInner]} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.postButton, { opacity: description.trim() ? 1 : 0.5 }]}
                onPress={handlePost}
                disabled={!description.trim()}
              >
                <Check size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <View style={styles.successModal}>
          <View style={styles.successContent}>
            <Check size={48} color="#14b8a6" />
            <Text style={styles.successText}>
              {description.trim() ? 'Your remix has been posted!' : 'Please add a description!'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#333',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pipContainer: {
    position: 'absolute',
    left: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  pipVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    alignItems: 'center',
  },
  pipAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  pipUsername: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#333',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  musicButton: {
    alignItems: 'center',
    gap: 4,
  },
  musicText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordingButton: {
    backgroundColor: 'rgba(239,68,68,0.3)',
    borderColor: '#ef4444',
  },
  recordInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  recordingInner: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 40,
    height: 40,
  },
  postButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    gap: 15,
    marginHorizontal: 40,
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});