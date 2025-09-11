import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Home, Search, MessageCircle, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';

export default function BottomNavigation() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Hide bottom navigation on chat page
  if (pathname === '/chat') {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/(tabs)' && (pathname === '/' || pathname === '/(tabs)')) return true;
    if (path !== '/(tabs)' && pathname.includes(path.replace('/(tabs)/', ''))) return true;
    return false;
  };

  const isZippersActive = pathname === '/zippers';

  const navigateTo = (path: string) => {
    if (path && path.trim()) {
      router.push(path as any);
    }
  };

  return (
    <View style={[
      styles.container,
      {
        paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom - 15, 5) : 5,
        paddingTop: 5,
        backgroundColor: isZippersActive ? '#14b8a6' : '#14b8a6',
      }
    ]}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigateTo('/(tabs)')}
      >
        <Home 
          size={24} 
          color={isActive('/(tabs)') ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} 
          strokeWidth={isActive('/(tabs)') ? 2.5 : 2} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigateTo('/(tabs)/discover')}
      >
        <Search 
          size={24} 
          color={isActive('discover') ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} 
          strokeWidth={isActive('discover') ? 2.5 : 2} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createButtonContainer}
        onPress={() => navigateTo('/(tabs)/create')}
      >
        <View style={styles.createButton}>
          <Image 
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
            style={styles.logoImage}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigateTo('/(tabs)/inbox')}
      >
        <MessageCircle 
          size={24} 
          color={isActive('inbox') ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} 
          strokeWidth={isActive('inbox') ? 2.5 : 2} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigateTo('/(tabs)/profile')}
      >
        <User 
          size={24} 
          color={isActive('profile') ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'} 
          strokeWidth={isActive('profile') ? 2.5 : 2} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#14b8a6',
    borderTopWidth: 0,
    zIndex: 1000,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  createButtonContainer: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#065f46',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});