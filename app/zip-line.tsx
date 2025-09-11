import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { ArrowLeft, Play, Users, Heart, MessageCircle } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockPosts } from "@/mocks/posts";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ZipLineScreen() {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedValues = useRef(mockPosts.map(() => new Animated.Value(0))).current;

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  useEffect(() => {
    // Animate the zip line movement
    const animateZipLine = () => {
      animatedValues.forEach((animValue, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 3000 + (index * 500), // Staggered animation
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    animateZipLine();
  }, [animatedValues]);

  const handleVideoSelect = (index: number) => {
    handleHaptic();
    setSelectedVideo(index);
    scrollViewRef.current?.scrollTo({
      x: index * (SCREEN_WIDTH * 0.7 + 16),
      animated: true,
    });
  };

  const handleJoinZip = () => {
    handleHaptic();
    router.push('/camera?zipId=demo');
  };

  const renderZipLineVideo = (post: typeof mockPosts[0], index: number) => {
    const animatedStyle = {
      transform: [
        {
          translateX: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
          }),
        },
      ],
    };

    return (
      <Animated.View key={post.id} style={[styles.zipLineItem, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.videoThumbnail,
            selectedVideo === index && styles.selectedThumbnail
          ]}
          onPress={() => handleVideoSelect(index)}
        >
          <Image source={{ uri: post.thumbnail }} style={styles.thumbnailImage} />
          <View style={styles.videoOverlay}>
            <Image source={{ uri: post.userAvatar }} style={styles.miniAvatar} />
            <Text style={styles.miniUsername}>@{post.username}</Text>
          </View>
          <View style={styles.zipIndicator}>
            <Text style={styles.zipNumber}>{index + 1}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const selectedPost = mockPosts[selectedVideo];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          handleHaptic();
          router.back();
        }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zip Line</Text>
        <TouchableOpacity onPress={handleJoinZip}>
          <View style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Z</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.zipLineContainer}>
        <Text style={styles.zipLineTitle}>The Zipping Experience</Text>
        <Text style={styles.zipLineDescription}>
          Watch videos move down the line towards the Zipping windows
        </Text>
        
        <View style={styles.zipLineTrack}>
          <View style={styles.zipLine} />
          {mockPosts.slice(0, 6).map((post, index) => renderZipLineVideo(post, index))}
        </View>

        <View style={styles.windowsContainer}>
          <View style={styles.smallWindow}>
            <Text style={styles.windowLabel}>Small Window (15s)</Text>
            <View style={styles.windowContent}>
              <Image 
                source={{ uri: selectedPost.thumbnail }} 
                style={styles.windowImage}
              />
              <TouchableOpacity style={styles.playButton}>
                <Play size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.largeWindow}>
            <Text style={styles.windowLabel}>Large Window (15s)</Text>
            <View style={styles.windowContent}>
              <Image 
                source={{ uri: selectedPost.thumbnail }} 
                style={styles.windowImage}
              />
              <TouchableOpacity style={styles.playButton}>
                <Play size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.videoCarousel}
        contentContainerStyle={styles.carouselContent}
      >
        {mockPosts.map((post, index) => (
          <TouchableOpacity
            key={post.id}
            style={[
              styles.carouselItem,
              selectedVideo === index && styles.selectedCarouselItem
            ]}
            onPress={() => handleVideoSelect(index)}
          >
            <Image source={{ uri: post.thumbnail }} style={styles.carouselImage} />
            <View style={styles.carouselOverlay}>
              <View style={styles.carouselInfo}>
                <Image source={{ uri: post.userAvatar }} style={styles.carouselAvatar} />
                <View style={styles.carouselText}>
                  <Text style={styles.carouselUsername}>@{post.username}</Text>
                  <Text style={styles.carouselDescription} numberOfLines={2}>
                    {post.description}
                  </Text>
                </View>
              </View>
              <View style={styles.carouselStats}>
                <View style={styles.statItem}>
                  <Heart size={12} color="#fff" />
                  <Text style={styles.statText}>{post.hearts}</Text>
                </View>
                <View style={styles.statItem}>
                  <MessageCircle size={12} color="#fff" />
                  <Text style={styles.statText}>{post.comments}</Text>
                </View>
                <View style={styles.statItem}>
                  <Users size={12} color="#fbbf24" />
                  <Text style={styles.statText}>{post.zippers}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomInfo}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Zip Lines Work</Text>
          <Text style={styles.infoText}>
            • Videos move along the line towards viewing windows{'\n'}
            • Each video shows for 15 seconds in each window{'\n'}
            • Tap the Z button to join the line with your own Zippclip{'\n'}
            • See who's coming down the pipeline before they arrive
          </Text>
        </View>
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
  joinButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  zipLineContainer: {
    padding: 20,
    alignItems: "center",
  },
  zipLineTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  zipLineDescription: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  zipLineTrack: {
    height: 120,
    width: "100%",
    position: "relative",
    marginBottom: 24,
  },
  zipLine: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#14b8a6",
  },
  zipLineItem: {
    position: "absolute",
    top: 20,
  },
  videoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: "#14b8a6",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  miniAvatar: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  miniUsername: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "600",
    flex: 1,
  },
  zipIndicator: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fbbf24",
    alignItems: "center",
    justifyContent: "center",
  },
  zipNumber: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  windowsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  smallWindow: {
    alignItems: "center",
  },
  largeWindow: {
    alignItems: "center",
  },
  windowLabel: {
    color: "#14b8a6",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  windowContent: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#14b8a6",
  },
  windowImage: {
    width: 100,
    height: 120,
    resizeMode: "cover",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoCarousel: {
    marginTop: 20,
  },
  carouselContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  carouselItem: {
    width: SCREEN_WIDTH * 0.7,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCarouselItem: {
    borderColor: "#14b8a6",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  carouselOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 12,
  },
  carouselInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  carouselAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  carouselText: {
    flex: 1,
  },
  carouselUsername: {
    color: "#14b8a6",
    fontSize: 12,
    fontWeight: "600",
  },
  carouselDescription: {
    color: "#fff",
    fontSize: 11,
    marginTop: 2,
  },
  carouselStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "#fff",
    fontSize: 10,
  },
  bottomInfo: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    color: "#14b8a6",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 18,
  },
});