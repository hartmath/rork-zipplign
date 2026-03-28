import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Platform,
  RefreshControl,
} from "react-native";
import { Search, TrendingUp, Hash } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockTrends, mockDiscoverVideos } from "@/mocks/discover";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 3) / 3;

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTrendPress = (trendId: string) => {
    handleHaptic();
    // Navigate to search with the trend tag
    router.push(`/search?query=${encodeURIComponent(mockTrends.find(t => t.id === trendId)?.tag || '')}`);
  };

  const handleVideoPress = (videoId: string) => {
    handleHaptic();
    router.push(`/video/${videoId}`);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleHaptic();
    
    setTimeout(() => {
      console.log('Refreshed discover content');
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleSearchPress = () => {
    handleHaptic();
    router.push("/search");
  };

  const renderGridItem = ({ item }: { item: typeof mockDiscoverVideos[0] }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => handleVideoPress(item.id)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.gridImage} />
      <View style={styles.gridOverlay}>
        <Text style={styles.gridViews}>{item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image 
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ksbndrs7ygm0hfnsn6zmq" }}
            style={styles.logo}
          />
          <Text style={styles.appName}>zipp</Text>
        </View>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={handleSearchPress}
        >
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>Trending</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.trendingContainer}>
              {mockTrends.map((trend) => (
                <TouchableOpacity 
                  key={trend.id} 
                  style={styles.trendCard}
                  onPress={() => handleTrendPress(trend.id)}
                >
                  <LinearGradient
                    colors={["#14b8a6", "#0d9488"]}
                    style={styles.trendGradient}
                  >
                    <Hash size={24} color="#fff" />
                    <Text style={styles.trendTitle}>{trend.tag}</Text>
                    <Text style={styles.trendViews}>{trend.views} views</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover</Text>
          </View>
          
          <FlatList
            data={mockDiscoverVideos}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
          />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  appName: {
    color: "#14b8a6",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
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
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  trendingContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  trendCard: {
    width: 150,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
  },
  trendGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  trendTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  trendViews: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  gridRow: {
    gap: 1,
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
});