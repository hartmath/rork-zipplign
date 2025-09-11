import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { Settings, Grid3x3, Heart, Bookmark, Lock, Share } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { mockUserProfile, mockUserVideos } from "@/mocks/profile";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 4) / 3;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"videos" | "liked" | "private">("videos");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTabPress = (tab: "videos" | "liked" | "private") => {
    handleHaptic();
    setActiveTab(tab);
  };

  const handleVideoPress = (videoId: string) => {
    handleHaptic();
    console.log('Open video:', videoId);
  };

  const handleEditProfile = () => {
    handleHaptic();
    console.log('Edit profile');
  };

  const handleShareProfile = () => {
    handleHaptic();
    console.log('Share profile');
  };

  const handleSettingsPress = () => {
    handleHaptic();
    console.log('Open settings');
  };

  const tabs = [
    { id: "videos" as const, icon: Grid3x3, count: mockUserProfile.videosCount },
    { id: "liked" as const, icon: Heart, count: mockUserProfile.likesCount },
    { id: "private" as const, icon: Lock, count: 0 },
  ];

  const getTabVideos = () => {
    switch (activeTab) {
      case "videos":
        return mockUserVideos;
      case "liked":
        return mockUserVideos.slice(0, 6);
      case "private":
        return [];
      default:
        return mockUserVideos;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
              style={styles.logo}
            />
            <Text style={styles.username}>@{mockUserProfile.username}</Text>
          </View>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Image source={{ uri: mockUserProfile.avatar }} style={styles.avatar} />
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockUserProfile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockUserProfile.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockUserProfile.likes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.name}>{mockUserProfile.name}</Text>
          <Text style={styles.bio}>{mockUserProfile.bio}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
            <Share size={16} color="#fff" />
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

      {activeTab === "private" && (
        <View style={styles.emptyState}>
          <Lock size={48} color="#666" />
          <Text style={styles.emptyText}>Private videos</Text>
          <Text style={styles.emptySubtext}>
            Videos you set to private will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
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
  editButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  shareButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
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