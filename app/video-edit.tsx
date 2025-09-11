import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  Palette, 
  Type, 
  Sticker,
  Save,
  Share2,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  Film,
  Layers,
  Zap
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useZipplign } from '@/app/context/ZipplignProvider';
import type { Post } from '@/types/post';

export default function VideoEditScreen() {
  const { publishPost, saveDraft, currentUser } = useZipplign();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45); // 45 seconds
  const [selectedFilter, setSelectedFilter] = useState("None");
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('Somewhere Only We Know - Keane');
  const [isPGN, setIsPGN] = useState(false);

  const filters = [
    { id: "none", name: "None", preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" },
    { id: "vintage", name: "Vintage", preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" },
    { id: "dramatic", name: "Dramatic", preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" },
    { id: "bright", name: "Bright", preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" },
    { id: "cool", name: "Cool", preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" },
    { id: "warm", name: "Warm", preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100" },
  ];

  const effects = [
    { id: "sparkle", name: "Sparkle", icon: Sparkles },
    { id: "glow", name: "Glow", icon: Palette },
    { id: "blur", name: "Blur", icon: Type },
    { id: "zoom", name: "Zoom", icon: Sticker },
  ];

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePlayPause = () => {
    handleHaptic();
    setIsPlaying(!isPlaying);
  };

  const handleSaveDraft = () => {
    handleHaptic();
    
    const draftPost: Partial<Post> = {
      description: description.trim() || 'New Zippclip! ✨',
      music: selectedMusic,
      isPGN,
      duration,
      thumbnail: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800`,
    };

    saveDraft(draftPost);
    
    if (Platform.OS !== 'web') {
      Alert.alert('Draft Saved', 'Your Zippclip has been saved as a draft.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      console.log('Draft saved successfully!');
      router.back();
    }
  };

  const handlePublish = () => {
    handleHaptic();
    
    const newPost: Post = {
      id: `post_${Date.now()}`,
      username: currentUser?.username || 'anonymous',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      thumbnail: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800`,
      description: description.trim() || 'New Zippclip! ✨',
      music: selectedMusic,
      musicCover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150',
      likes: '0',
      comments: '0',
      shares: '0',
      bookmarks: '0',
      hearts: '0',
      zippers: '0',
      duration,
      isPGN,
    };

    publishPost(newPost);
    
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Zippclip Published!', 
        'Your Zippclip is now live on Zipplign!',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } else {
      console.log('Zippclip published successfully!');
      router.push('/');
    }
  };

  const handleShare = () => {
    handleHaptic();
    console.log('Sharing Zippclip...');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <Text style={styles.headerTitle}>Edit Zippclip</Text>
        <TouchableOpacity onPress={handleSaveDraft}>
          <Save size={24} color="#14b8a6" />
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" }}
          style={styles.videoPreview}
        />
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {isPlaying ? (
            <Pause size={32} color="#fff" />
          ) : (
            <Play size={32} color="#fff" />
          )}
        </TouchableOpacity>
        
        <View style={styles.videoControls}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentTime / duration) * 100}%` }]} />
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <ScrollView style={styles.editingPanel} showsVerticalScrollIndicator={false}>
        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Type size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your Zippclip..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>

        {/* Music Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Music size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>Music</Text>
          </View>
          <TouchableOpacity 
            style={styles.musicSelector}
            onPress={() => router.push('/music-gallery')}
          >
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50" }}
              style={styles.musicCover}
            />
            <View style={styles.musicInfo}>
              <Text style={styles.musicTitle}>{selectedMusic}</Text>
              <Text style={styles.musicArtist}>Tap to change</Text>
            </View>
            <View style={styles.volumeControls}>
              <TouchableOpacity onPress={() => {
                handleHaptic();
                setIsMuted(!isMuted);
              }}>
                {isMuted ? (
                  <VolumeX size={20} color="#666" />
                ) : (
                  <Volume2 size={20} color="#14b8a6" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <View style={styles.volumeBar}>
            <View style={[styles.volumeFill, { width: `${(isMuted ? 0 : volume) * 100}%` }]} />
          </View>
        </View>

        {/* Filters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Palette size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>Filters</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersContainer}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterItem,
                    selectedFilter === filter.name && styles.selectedFilter
                  ]}
                  onPress={() => {
                    handleHaptic();
                    setSelectedFilter(filter.name);
                  }}
                >
                  <Image source={{ uri: filter.preview }} style={styles.filterPreview} />
                  <Text style={[
                    styles.filterName,
                    selectedFilter === filter.name && styles.selectedFilterName
                  ]}>
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Effects Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>Effects</Text>
          </View>
          <View style={styles.effectsGrid}>
            {effects.map((effect) => {
              const IconComponent = effect.icon;
              return (
                <TouchableOpacity
                  key={effect.id}
                  style={styles.effectItem}
                  onPress={handleHaptic}
                >
                  <IconComponent size={24} color="#14b8a6" />
                  <Text style={styles.effectName}>{effect.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Text & Stickers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Type size={20} color="#14b8a6" />
            <Text style={styles.sectionTitle}>Text & Stickers</Text>
          </View>
          <View style={styles.textStickersContainer}>
            <TouchableOpacity style={styles.textStickerButton} onPress={handleHaptic}>
              <Type size={20} color="#14b8a6" />
              <Text style={styles.textStickerText}>Add Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textStickerButton} onPress={handleHaptic}>
              <Sticker size={20} color="#14b8a6" />
              <Text style={styles.textStickerText}>Add Sticker</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PGN Toggle */}
        <View style={styles.section}>
          <View style={styles.pgnContainer}>
            <View>
              <Text style={styles.sectionTitle}>Parental Guidance Needed (PGN)</Text>
              <Text style={styles.sectionSubtitle}>Mark if content needs parental guidance</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, isPGN && styles.toggleActive]}
              onPress={() => {
                handleHaptic();
                setIsPGN(!isPGN);
              }}
            >
              <View style={[styles.toggleThumb, isPGN && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleHaptic}>
          <RotateCcw size={20} color="#666" />
          <Text style={styles.actionButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handlePublish}>
          <Text style={styles.primaryButtonText}>Publish Zippclip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color="#14b8a6" />
          <Text style={[styles.actionButtonText, { color: "#14b8a6" }]}>Share</Text>
        </TouchableOpacity>
      </View>
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
  videoContainer: {
    height: 300,
    backgroundColor: "#1a1a1a",
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#14b8a6",
  },
  editingPanel: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  musicSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  musicCover: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  musicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  musicTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  musicArtist: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  volumeControls: {
    marginLeft: 12,
  },
  volumeBar: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    overflow: "hidden",
  },
  volumeFill: {
    height: "100%",
    backgroundColor: "#14b8a6",
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 20,
  },
  filterItem: {
    alignItems: "center",
    gap: 8,
  },
  selectedFilter: {
    // Selected filter styling
  },
  filterPreview: {
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedFilterName: {
    color: "#14b8a6",
  },
  filterName: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
  },
  effectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  effectItem: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  effectName: {
    color: "#ccc",
    fontSize: 11,
    textAlign: "center",
  },
  textStickersContainer: {
    flexDirection: "row",
    gap: 12,
  },
  textStickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  textStickerText: {
    color: "#14b8a6",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  actionButton: {
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: {
    color: "#666",
    fontSize: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#14b8a6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  descriptionInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  sectionSubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  pgnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#14b8a6',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});