import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Platform,
  TextInput,
} from "react-native";
import { ArrowLeft, Search, Play, Pause, Upload, Mic, TrendingUp } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockMusicTracks } from "@/mocks/zippers";

export default function MusicGalleryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const categories = ["All", "Popular", "Pop", "Rock", "Electronic", "Classic", "Indie Rock", "Classic Rock"];

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const filteredTracks = mockMusicTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           (selectedCategory === "Popular" && track.isPopular) ||
                           track.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayPause = (trackId: string) => {
    handleHaptic();
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  const handleSelectTrack = (track: typeof mockMusicTracks[0]) => {
    handleHaptic();
    console.log(`Selected track: ${track.title} by ${track.artist}`);
    router.back();
  };

  const renderTrack = ({ item }: { item: typeof mockMusicTracks[0] }) => {
    const isPlaying = playingTrack === item.id;
    
    return (
      <TouchableOpacity 
        style={styles.trackItem}
        onPress={() => handleSelectTrack(item)}
      >
        <Image source={{ uri: item.cover }} style={styles.trackCover} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
          <Text style={styles.trackDuration}>{item.duration}</Text>
        </View>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => handlePlayPause(item.id)}
        >
          {isPlaying ? (
            <Pause size={20} color="#14b8a6" />
          ) : (
            <Play size={20} color="#14b8a6" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          handleHaptic();
          router.back();
        }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music Gallery</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs or artists"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeCategoryChip
            ]}
            onPress={() => {
              handleHaptic();
              setSelectedCategory(category);
            }}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          handleHaptic();
          console.log('Upload song functionality - would open file picker');
        }}>
          <Upload size={24} color="#14b8a6" />
          <Text style={styles.actionText}>Upload Song</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => {
          handleHaptic();
          console.log('Record original functionality - would start audio recording');
        }}>
          <Mic size={24} color="#14b8a6" />
          <Text style={styles.actionText}>Record Original</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <TrendingUp size={20} color="#14b8a6" />
        <Text style={styles.sectionTitle}>
          {selectedCategory === "All" ? "All Tracks" : 
           selectedCategory === "Popular" ? "Popular Tracks" : 
           `${selectedCategory} Tracks`}
        </Text>
        <Text style={styles.trackCount}>({filteredTracks.length})</Text>
      </View>

      <FlatList
        data={filteredTracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tracksList}
      />
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: "#fff",
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  activeCategoryChip: {
    backgroundColor: "#14b8a6",
    borderColor: "#14b8a6",
  },
  categoryText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#14b8a6",
    gap: 8,
  },
  actionText: {
    color: "#14b8a6",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  trackCount: {
    color: "#666",
    fontSize: 14,
  },
  tracksList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  trackCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  trackArtist: {
    color: "#999",
    fontSize: 13,
    marginBottom: 2,
  },
  trackDuration: {
    color: "#666",
    fontSize: 12,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(20, 184, 166, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});