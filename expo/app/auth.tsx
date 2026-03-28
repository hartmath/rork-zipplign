import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useZipplign } from '@/app/context/ZipplignProvider';
import type { ZipperUser } from '@/types/post';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });
  const { authenticateUser } = useZipplign();

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAuth = () => {
    handleHaptic();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Please fill in all required fields');
      } else {
        console.log('Please fill in all required fields');
      }
      return;
    }

    if (isSignUp && (!formData.email.trim() || !formData.displayName.trim())) {
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Please fill in all required fields');
      } else {
        console.log('Please fill in all required fields');
      }
      return;
    }

    // Create user object
    const user: ZipperUser = {
      id: `user_${Date.now()}`,
      username: formData.username.trim(),
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150`,
      displayName: formData.displayName.trim() || formData.username.trim(),
      followers: '0',
      following: '0',
      zippclips: '0',
      bio: 'New Zipper on Zipplign! 🎬✨',
      isVerified: false,
    };

    authenticateUser(user);
    
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Welcome to Zipplign!', 
        `${isSignUp ? 'Account created' : 'Signed in'} successfully!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      console.log(`${isSignUp ? 'Account created' : 'Signed in'} successfully!`);
      router.back();
    }
  };

  const toggleAuthMode = () => {
    handleHaptic();
    setIsSignUp(!isSignUp);
    setFormData({ username: '', email: '', password: '', displayName: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          handleHaptic();
          router.back();
        }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isSignUp ? 'Join Zipplign' : 'Welcome Back'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
            style={styles.logo}
          />
          <Text style={styles.appName}>zipplign</Text>
          <Text style={styles.tagline}>
            {isSignUp 
              ? 'Create your Zipper profile and start sharing Zippclips!' 
              : 'Sign in to continue your Zipplign journey'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={formData.username}
              onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {isSignUp && (
            <>
              <View style={styles.inputContainer}>
                <User size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Display Name"
                  placeholderTextColor="#666"
                  value={formData.displayName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Lock size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => {
              handleHaptic();
              setShowPassword(!showPassword);
            }}>
              {showPassword ? (
                <EyeOff size={20} color="#666" />
              ) : (
                <Eye size={20} color="#666" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.switchLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>What makes Zipplign special?</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>🎬</Text>
            <Text style={styles.featureText}>Create Zippclips up to 3 minutes long</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>⚡</Text>
            <Text style={styles.featureText}>Join Zip Lines and see who's coming down the pipeline</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>🎵</Text>
            <Text style={styles.featureText}>Add music from our gallery or upload your own</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>🌍</Text>
            <Text style={styles.featureText}>Discover Zippclips near your location</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    color: '#14b8a6',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  switchText: {
    color: '#999',
    fontSize: 14,
  },
  switchLink: {
    color: '#14b8a6',
    fontSize: 14,
    fontWeight: '600',
  },
  features: {
    flex: 1,
  },
  featuresTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  featureBullet: {
    fontSize: 20,
  },
  featureText: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});