import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Bell, Heart, AtSign, MessageCircle, Users, ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockNotifications } from "@/mocks/inbox";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNotificationPress = (notificationId: string) => {
    handleHaptic();
    setReadNotifications(prev => new Set([...prev, notificationId]));
    console.log('Open notification:', notificationId);
  };

  const handleBack = () => {
    handleHaptic();
    router.back();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={18} color="#14b8a6" fill="#14b8a6" />;
      case "comment":
        return <MessageCircle size={18} color="#14b8a6" />;
      case "mention":
        return <AtSign size={18} color="#14b8a6" />;
      case "follow":
        return <Users size={18} color="#14b8a6" />;
      default:
        return <Bell size={18} color="#14b8a6" />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {mockNotifications.map((notification) => {
            const isRead = readNotifications.has(notification.id);
            
            return (
              <TouchableOpacity 
                key={notification.id} 
                style={[styles.notificationItem, !isRead && styles.unreadNotification]}
                onPress={() => handleNotificationPress(notification.id)}
              >
                <View style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </View>
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationText, !isRead && styles.unreadText]}>
                    <Text style={styles.notificationUser}>{notification.user}</Text>
                    {" " + notification.action}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                {notification.thumbnail && (
                  <Image source={{ uri: notification.thumbnail }} style={styles.thumbnail} />
                )}
                {!isRead && <View style={styles.unreadIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 32,
  },
  section: {
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  notificationUser: {
    color: "#fff",
    fontWeight: "600",
  },
  notificationTime: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  unreadNotification: {
    backgroundColor: "rgba(20, 184, 166, 0.05)",
  },
  unreadText: {
    fontWeight: "600",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#14b8a6",
    position: "absolute",
    top: 12,
    right: 12,
  },
});