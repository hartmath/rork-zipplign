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
import { Bell, MessageCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { mockMessages } from "@/mocks/inbox";
import { router } from "expo-router";

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMessagePress = (messageId: string) => {
    handleHaptic();
    setReadMessages(prev => new Set([...prev, messageId]));
    router.push('/chat');
  };

  const handleNotificationPress = () => {
    handleHaptic();
    router.push('/notifications');
  };



  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
            style={styles.logo}
          />
          <Text style={styles.title}>Messages</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => { handleHaptic(); router.push('/chat'); }} style={styles.chatButton}>
            <MessageCircle size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNotificationPress}>
            <Bell size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {mockMessages.map((message) => {
            const isRead = readMessages.has(message.id);
            const showUnread = message.unread && !isRead;
            
            return (
              <TouchableOpacity 
                key={message.id} 
                style={[styles.messageItem, showUnread && styles.unreadMessage]}
                onPress={() => handleMessagePress(message.id)}
              >
                <Image source={{ uri: message.avatar }} style={styles.avatar} />
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={[styles.messageName, showUnread && styles.unreadText]}>
                      {message.name}
                    </Text>
                    <Text style={styles.messageTime}>{message.time}</Text>
                  </View>
                  <Text style={[styles.messageText, showUnread && styles.unreadText]} numberOfLines={1}>
                    {message.lastMessage}
                  </Text>
                </View>
                {showUnread && <View style={styles.unreadDot} />}
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },

  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  messageTime: {
    color: "#666",
    fontSize: 12,
  },
  messageText: {
    color: "#999",
    fontSize: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#14b8a6",
  },

  unreadMessage: {
    backgroundColor: "rgba(20, 184, 166, 0.05)",
  },

  unreadText: {
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  chatButton: {
    padding: 4,
  },

});