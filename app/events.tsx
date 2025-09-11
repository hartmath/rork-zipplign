import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EventsScreen() {
  const insets = useSafeAreaInsets();

  const handleStoreNavigation = () => {
    router.push('/store');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Events',
          headerStyle: { backgroundColor: '#14b8a6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#14b8a6', '#0f766e']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Welcome to MEA Platform</Text>
            <Text style={styles.heroSubtitle}>
              Discover amazing events, connect with creators, and explore unique experiences
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleStoreNavigation}>
              <Text style={styles.ctaButtonText}>Visit MEA Store</Text>
              <ExternalLink size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About MEA Platform</Text>
            <Text style={styles.sectionText}>
              MEA Platform is your gateway to discovering incredible events, connecting with talented creators, 
              and exploring a world of unique experiences. Join our community of innovators, artists, and 
              entrepreneurs who are shaping the future of digital creativity.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
            
            <View style={styles.eventCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Creator Showcase 2024</Text>
                <View style={styles.eventDetail}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.eventDetailText}>December 15, 2024</Text>
                </View>
                <View style={styles.eventDetail}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.eventDetailText}>Virtual Event</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Users size={16} color="#666" />
                  <Text style={styles.eventDetailText}>500+ Attendees</Text>
                </View>
              </View>
            </View>

            <View style={styles.eventCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400' }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>Digital Art Workshop</Text>
                <View style={styles.eventDetail}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.eventDetailText}>December 20, 2024</Text>
                </View>
                <View style={styles.eventDetail}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.eventDetailText}>Online Workshop</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Users size={16} color="#666" />
                  <Text style={styles.eventDetailText}>Limited to 50</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Platform Features</Text>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Users size={24} color="#14b8a6" />
                </View>
                <Text style={styles.featureTitle}>Creator Network</Text>
                <Text style={styles.featureText}>Connect with talented creators worldwide</Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Calendar size={24} color="#14b8a6" />
                </View>
                <Text style={styles.featureTitle}>Live Events</Text>
                <Text style={styles.featureText}>Join exclusive live streaming events</Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <ExternalLink size={24} color="#14b8a6" />
                </View>
                <Text style={styles.featureTitle}>Creator Store</Text>
                <Text style={styles.featureText}>Shop unique products from creators</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH - 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  eventCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});