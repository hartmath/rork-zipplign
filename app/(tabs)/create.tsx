import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Camera, Image as ImageIcon, Music, Sparkles, Film, Mic } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateScreen() {
  const insets = useSafeAreaInsets();

  const createOptions = [
    { id: "1", title: "Record Video", icon: Camera, gradient: ["#14b8a6", "#0d9488"] as const },
    { id: "2", title: "Upload", icon: ImageIcon, gradient: ["#8b5cf6", "#7c3aed"] as const },
    { id: "3", title: "Add Music", icon: Music, gradient: ["#ec4899", "#db2777"] as const },
    { id: "4", title: "Effects", icon: Sparkles, gradient: ["#f59e0b", "#d97706"] as const },
    { id: "5", title: "Templates", icon: Film, gradient: ["#3b82f6", "#2563eb"] as const },
    { id: "6", title: "Voiceover", icon: Mic, gradient: ["#10b981", "#059669"] as const },
  ];

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
        <Text style={styles.title}>Create</Text>
        <Text style={styles.subtitle}>Share your story with the world</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.push("/camera")}
        >
          <LinearGradient
            colors={["#14b8a6", "#0d9488"] as const}
            style={styles.mainButtonGradient}
          >
            <Camera size={32} color="#fff" />
            <Text style={styles.mainButtonText}>Start Recording</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.optionsGrid}>
          {createOptions.map((option) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity key={option.id} style={styles.optionCard}>
                <LinearGradient
                  colors={option.gradient}
                  style={styles.optionGradient}
                >
                  <Icon size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.optionText}>{option.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Pro Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>• Use good lighting for better quality</Text>
            <Text style={styles.tipText}>• Keep videos under 60 seconds</Text>
            <Text style={styles.tipText}>• Add trending music to boost views</Text>
            <Text style={styles.tipText}>• Use relevant hashtags</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#999",
    fontSize: 16,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  mainButton: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
  },
  mainButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  optionCard: {
    width: "30%",
    alignItems: "center",
    gap: 8,
  },
  optionGradient: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  tips: {
    marginTop: 40,
  },
  tipsTitle: {
    color: "#14b8a6",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  tipText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
});