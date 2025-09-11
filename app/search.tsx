import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Platform,
} from "react-native";
import { ArrowLeft, Search, X, TrendingUp, Clock } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockPosts } from "@/mocks/posts";
import { mockDiscoverVideos } from "@/mocks/discover";
import type { Post } from "@/types/post";

type SearchResults = {
  users: Post[];
  videos: typeof mockDiscoverVideos;
};

export default function SearchScreen() {
  const { query } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(typeof query === 'string' ? query : "");
  const [recentSearches, setRecentSearches] = useState([
    "dance challenge",
    "cooking tips",
    "travel vlog",
    "fitness routine",
    "comedy skits",
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const trendingSearches = [
    "#TealVibes",
    "#DanceChallenge2024",
    "#CookingHacks",
    "#TravelGoals",
    "#FitnessMotivation",
    "#ComedyGold",
    "#LifeHacks",
    "#FashionTrends",
  ];

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const searchResults = useMemo((): SearchResults | null => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    const filteredPosts = mockPosts.filter(post => 
      post.username.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
    
    const filteredVideos = mockDiscoverVideos.filter((_, index) => 
      Math.random() > 0.5 // Simulate some matching videos
    );
    
    return {
      users: filteredPosts.slice(0, 5),
      videos: filteredVideos.slice(0, 12)
    };
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
    
    setTimeout(() => setIsSearching(false), 500);
  };

  const clearSearch = () => {
    handleHaptic();
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleTrendingPress = (trend: string) => {
    handleHaptic();
    handleSearch(trend);
  };

  const handleRecentPress = (search: string) => {
    handleHaptic();
    handleSearch(search);
  };

  const renderUserResult = ({ item }: { item: typeof mockPosts[0] }) => (
    <TouchableOpacity style={styles.userResult} onPress={handleHaptic}>
      <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>@{item.username}</Text>
        <Text style={styles.userFollowers}>245K followers</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderVideoResult = ({ item }: { item: typeof mockDiscoverVideos[0] }) => (
    <TouchableOpacity style={styles.videoResult} onPress={handleHaptic}>
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.videoOverlay}>
        <Text style={styles.videoViews}>{item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          handleHaptic();
          router.back();
        }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search zipp"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchQuery.length === 0 ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="#666" />
                <Text style={styles.sectionTitle}>Recent</Text>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.searchItem}
                  onPress={() => handleRecentPress(search)}
                >
                  <Search size={16} color="#666" />
                  <Text style={styles.searchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color="#14b8a6" />
                <Text style={styles.sectionTitle}>Trending</Text>
              </View>
              <View style={styles.trendingGrid}>
                {trendingSearches.map((trend, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.trendingTag}
                    onPress={() => handleTrendingPress(trend)}
                  >
                    <Text style={styles.trendingText}>{trend}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : (
              <>
                {searchResults && searchResults.users.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Users</Text>
                    <FlatList
                      data={searchResults.users}
                      renderItem={renderUserResult}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  </View>
                )}
                
                {searchResults && searchResults.videos.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Videos</Text>
                    <FlatList
                      data={searchResults.videos}
                      renderItem={renderVideoResult}
                      keyExtractor={(item) => item.id}
                      numColumns={3}
                      scrollEnabled={false}
                      columnWrapperStyle={styles.videoRow}
                    />
                  </View>
                )}
                
                {searchResults && searchResults.users.length === 0 && searchResults.videos.length === 0 && (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>No results found</Text>
                    <Text style={styles.noResultsSubtext}>Try searching for something else</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  searchText: {
    color: "#ccc",
    fontSize: 15,
  },
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  trendingTag: {
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    borderWidth: 1,
    borderColor: "#14b8a6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trendingText: {
    color: "#14b8a6",
    fontSize: 14,
    fontWeight: "500",
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  userResult: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  userFollowers: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: "#14b8a6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  videoRow: {
    gap: 2,
  },
  videoResult: {
    width: "32%",
    aspectRatio: 0.75,
    backgroundColor: "#1a1a1a",
    borderRadius: 4,
    overflow: "hidden",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoViews: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  noResults: {
    paddingVertical: 60,
    alignItems: "center",
  },
  noResultsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  noResultsSubtext: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
});