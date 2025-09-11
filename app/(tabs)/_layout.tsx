import { Tabs } from "expo-router";
import { Home, Search, MessageCircle, User, Users } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import createContextHook from '@nkzw/create-context-hook';

export const [RefreshProvider, useRefresh] = createContextHook(() => {
  const [refreshTrigger, setRefreshTrigger] = useState<(() => void) | null>(null);

  const triggerRefresh = () => {
    if (refreshTrigger) {
      refreshTrigger();
    }
  };

  const setRefreshTriggerFn = (fn: () => void) => {
    setRefreshTrigger(() => fn);
  };

  return useMemo(() => ({
    triggerRefresh,
    setRefreshTrigger: setRefreshTriggerFn
  }), [refreshTrigger]);
});

function CustomHomeIcon({ color, focused }: { color: string; focused: boolean }) {
  const { triggerRefresh } = useRefresh();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    triggerRefresh();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
    </TouchableOpacity>
  );
}

function TabLayoutContent() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <CustomHomeIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <Search size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <View style={styles.createButtonContainer}>
              <View style={styles.createButton}>
                <Image 
                  source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
                  style={styles.logoImage}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, focused }) => (
            <MessageCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <RefreshProvider>
      <TabLayoutContent />
    </RefreshProvider>
  );
}

const styles = StyleSheet.create({
  createButtonContainer: {
    marginBottom: 8,
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#065f46",
    shadowColor: "#000",
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