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
  ScrollView,
} from "react-native";
import { Search, MoreHorizontal, Edit3, MessageCircle, Users, Video } from "lucide-react-native";
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
    // Navigate to a new message screen or show user picker
    console.log('New message functionality - would show user picker to start new conversation');
  };

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         message.lastMessage.toLowerCase().includes(searchText.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && message.unread);
    return matchesSearch && matchesTab;
  });

  const renderStoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.storyItem}>
      <View style={styles.storyAvatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
        <View style={styles.storyRing} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => {
    const isRead = readMessages.has(item.id);
    const showUnread = item.unread && !isRead;
    
    return (
      <TouchableOpacity 
        style={[styles.messageItem, showUnread && styles.unreadMessage]}
        onPress={() => handleMessagePress(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {showUnread && <View style={styles.onlineIndicator} />}
          <View style={styles.avatarBorder} />
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.messageName, showUnread && styles.unreadText]}>
              {item.name}
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.messageTime}>{item.time}</Text>
              {showUnread && <View style={styles.unreadDot} />}
            </View>
          </View>
          <Text style={[styles.messageText, showUnread && styles.unreadText]} numberOfLines={2}>
            {item.lastMessage}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageType}>Message</Text>
            {item.unread && (
              <View style={styles.unreadBadgeSmall}>
                <Text style={styles.unreadBadgeSmallText}>New</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>{mockMessages.filter(m => m.unread).length} new messages</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Video size={22} color="#14b8a6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNewMessage} style={styles.headerButton}>
            <Edit3 size={22} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesSection}>
        <Text style={styles.sectionTitle}>Active Now</Text>
        <FlatList
          horizontal
          data={mockMessages.slice(0, 8)}
          renderItem={renderStoryItem}
          keyExtractor={(item) => `story-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <MessageCircle size={18} color={activeTab === 'all' ? '#14b8a6' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Users size={18} color={activeTab === 'unread' ? '#14b8a6' : '#666'} />
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
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#14b8a6",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.2)",
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  storiesSection: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  storiesList: {
    paddingHorizontal: 20,
  },
  storyItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 70,
  },
  storyAvatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "#14b8a6",
  },
  storyName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 32,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    gap: 8,
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
    color: "#14b8a6",
  },
  unreadBadge: {
    backgroundColor: "#ff4757",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#0a0a0a",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "rgba(20, 184, 166, 0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#14b8a6",
    borderWidth: 3,
    borderColor: "#000",
  },
  messageContent: {
    flex: 1,
    paddingTop: 2,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  messageName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  messageTime: {
    color: "#666",
    fontSize: 13,
  },
  messageText: {
    color: "#999",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageType: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  unreadBadgeSmall: {
    backgroundColor: "#14b8a6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeSmallText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
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
    color: "#fff",
    fontWeight: "700",
  },
});