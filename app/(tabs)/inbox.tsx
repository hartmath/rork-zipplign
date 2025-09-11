import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { Search, MoreHorizontal, Edit3 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { mockMessages } from "@/mocks/inbox";
import { router } from "expo-router";

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleHaptic();
    
    setTimeout(() => {
      console.log('Refreshed messages');
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleNewMessage = () => {
    handleHaptic();
    console.log('New message pressed');
  };

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         message.lastMessage.toLowerCase().includes(searchText.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && message.unread);
    return matchesSearch && matchesTab;
  });

  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => {
    const isRead = readMessages.has(item.id);
    const showUnread = item.unread && !isRead;
    
    return (
      <TouchableOpacity 
        style={[styles.messageItem, showUnread && styles.unreadMessage]}
        onPress={() => handleMessagePress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {showUnread && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.messageName, showUnread && styles.unreadText]}>
              {item.name}
            </Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
          <Text style={[styles.messageText, showUnread && styles.unreadText]} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </View>
        {showUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };



  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Inbox</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNewMessage} style={styles.iconButton}>
            <Edit3 size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreHorizontal size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Unread</Text>
          {mockMessages.filter(m => m.unread).length > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{mockMessages.filter(m => m.unread).length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#14b8a6"
            colors={["#14b8a6"]}
          />
        }
        contentContainerStyle={styles.messagesList}
      />
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
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#14b8a6",
  },
  tabText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  unreadBadge: {
    backgroundColor: "#ff4757",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#14b8a6",
    borderWidth: 2,
    borderColor: "#000",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  messageName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  messageTime: {
    color: "#666",
    fontSize: 14,
  },
  messageText: {
    color: "#999",
    fontSize: 15,
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#14b8a6",
    marginLeft: 12,
  },
  unreadMessage: {
    backgroundColor: "rgba(20, 184, 166, 0.03)",
  },
  unreadText: {
    color: "#fff",
    fontWeight: "700",
  },
});