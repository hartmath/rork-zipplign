import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  RefreshControl,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Grid3x3, Heart, Lock, Share, MessageCircle, UserPlus, UserCheck } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useZipplign } from '@/app/context/ZipplignProvider';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 4) / 3;

interface UserProfile {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  following: string;
  followers: string;
  likes: string;
  videosCount: number;
  likesCount: number;
}

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { username, avatar } = useLocalSearchParams<{ username: string; avatar: string }>();
  const [activeTab, setActiveTab] = useState<"videos" | "liked">("videos");
  const { followedUsers, toggleFollow, posts } = useZipplign();
  const isFollowing = followedUsers.has(username || '');
  const [refreshing, setRefreshing] = useState(false);

  const getUserPosts = () => {
    return posts.filter(post => post.username === username);
  };

  // Mock user profile data - in real app, fetch based on username
  const userProfile: UserProfile = {
    username: username || "unknown_user",
    name: username?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Unknown User",
    avatar: avatar ? decodeURIComponent(avatar) : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300",
    bio: "Content creator ✨\n📍 New York\n🎬 Making amazing videos",
    following: "234",
    followers: "12.5K",
    likes: "456K",
    videosCount: getUserPosts().length,
    likesCount: getUserPosts().reduce((acc, post) => acc + parseInt(post.hearts.replace('K', '000').replace('M', '000000')), 0),
  };

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTabPress = (tab: "videos" | "liked") => {
    handleHaptic();
    setActiveTab(tab);
  };

  const handleVideoPress = (videoId: string) => {
    handleHaptic();
    router.push(`/video/${videoId}`);
  };

  const handleFollowPress = () => {
    handleHaptic();
    if (username) {
      toggleFollow(username);
    }
  };

  const handleMessagePress = () => {
    handleHaptic();
    router.push('/chat');
  };

  const handleShareProfile = () => {
    handleHaptic();
    console.log('Share profile');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleHaptic();
    
    setTimeout(() => {
      console.log('Refreshed user profile');
      setRefreshing(false);
    }, 1500);
  }, []);

  const tabs = [
    { id: "videos" as const, icon: Grid3x3, count: userProfile.videosCount },
    { id: "liked" as const, icon: Heart, count: userProfile.likesCount },
  ];

  const getTabVideos = () => {
    const userPosts = getUserPosts();
    switch (activeTab) {
      case "videos":
        return userPosts.map(post => ({
          id: post.id,
          thumbnail: post.thumbnail,
          views: post.hearts,
        }));
      case "liked":
        // In a real app, you'd fetch liked videos from the backend
        return userPosts.slice(0, 6).map(post => ({
          id: post.id,
          thumbnail: post.thumbnail,
          views: post.hearts,
        }));
      default:
        return [];
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerTitle: `@${userProfile.username}`,
          headerRight: () => (
            <TouchableOpacity onPress={handleShareProfile}>
              <Share size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#14b8a6"
            colors={["#14b8a6"]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.likes}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text style={styles.name}>{userProfile.name}</Text>
            <Text style={styles.bio}>{userProfile.bio}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]} 
              onPress={handleFollowPress}
            >
              {isFollowing ? (
                <UserCheck size={16} color="#fff" />
              ) : (
                <UserPlus size={16} color="#fff" />
              )}
              <Text style={styles.followButtonText}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress}>
              <MessageCircle size={16} color="#fff" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => handleTabPress(tab.id)}
              >
                <Icon 
                  size={20} 
                  color={activeTab === tab.id ? "#14b8a6" : "#666"} 
                />
                {tab.count > 0 && (
                  <Text style={[styles.tabCount, activeTab === tab.id && styles.activeTabCount]}>
                    {tab.count}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.grid}>
          {getTabVideos().map((video) => (
            <TouchableOpacity 
              key={video.id} 
              style={styles.gridItem}
              onPress={() => handleVideoPress(video.id)}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.gridImage} />
              <View style={styles.gridOverlay}>
                <Text style={styles.gridViews}>{video.views}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "liked" && getTabVideos().length === 0 && (
          <View style={styles.emptyState}>
            <Heart size={48} color="#666" />
            <Text style={styles.emptyText}>No liked videos</Text>
            <Text style={styles.emptySubtext}>
              Videos this user liked will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#14b8a6",
  },
  stats: {
    flexDirection: "row",
    gap: 40,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    color: "#999",
    fontSize: 13,
    marginTop: 2,
  },
  bioSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  bio: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  followButton: {
    flex: 1,
    backgroundColor: "#14b8a6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  followingButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  messageButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#14b8a6",
  },
  tabCount: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabCount: {
    color: "#14b8a6",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  gridItem: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_WIDTH * 1.3,
    backgroundColor: "#1a1a1a",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridViews: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
});