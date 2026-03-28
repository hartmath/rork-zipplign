import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { Search, Filter, Star, ShoppingBag, Heart, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  creator: string;
  rating: number;
  reviews: number;
  category: string;
}

interface Store {
  id: string;
  name: string;
  image: string;
  creator: string;
  followers: number;
  products: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Digital Art Print Collection',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    creator: 'ArtistMike',
    rating: 4.8,
    reviews: 124,
    category: 'Art',
  },
  {
    id: '2',
    name: 'Custom Logo Design Package',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    creator: 'DesignPro',
    rating: 4.9,
    reviews: 89,
    category: 'Design',
  },
  {
    id: '3',
    name: 'Photography Preset Bundle',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    creator: 'PhotoMaster',
    rating: 4.7,
    reviews: 203,
    category: 'Photography',
  },
  {
    id: '4',
    name: 'Music Production Course',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    creator: 'BeatMaker',
    rating: 4.9,
    reviews: 156,
    category: 'Music',
  },
];

const mockStores: Store[] = [
  {
    id: '1',
    name: 'Creative Studio',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    creator: 'ArtistMike',
    followers: 12500,
    products: 45,
  },
  {
    id: '2',
    name: 'Design Hub',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400',
    creator: 'DesignPro',
    followers: 8900,
    products: 32,
  },
  {
    id: '3',
    name: 'Photo Gallery',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    creator: 'PhotoMaster',
    followers: 15600,
    products: 78,
  },
];

export default function StoreScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const categories = ['All', 'Art', 'Design', 'Photography', 'Music', 'Fashion'];

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleCreateStore = () => {
    console.log('Create store functionality would be implemented here');
    // This would typically open a modal or navigate to a create store screen
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = (product: Product) => {
    const isLiked = likedProducts.has(product.id);
    
    return (
      <View key={product.id} style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => toggleLike(product.id)}
          >
            <Heart 
              size={20} 
              color={isLiked ? '#14b8a6' : '#fff'} 
              fill={isLiked ? '#14b8a6' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.productCreator}>by {product.creator}</Text>
          <View style={styles.productRating}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>({product.reviews})</Text>
          </View>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${product.price}</Text>
            <TouchableOpacity style={styles.addToCartButton}>
              <ShoppingBag size={16} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderStore = (store: Store) => (
    <TouchableOpacity key={store.id} style={styles.storeCard}>
      <Image source={{ uri: store.image }} style={styles.storeImage} />
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeCreator}>by {store.creator}</Text>
        <View style={styles.storeStats}>
          <Text style={styles.storeStatText}>{store.followers.toLocaleString()} followers</Text>
          <Text style={styles.storeStatText}>•</Text>
          <Text style={styles.storeStatText}>{store.products} products</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'MEA Store',
          headerStyle: { backgroundColor: '#14b8a6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products and creators..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Stores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storesScroll}>
            {mockStores.map(renderStore)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          <View style={styles.productsGrid}>
            {filteredProducts.map(renderProduct)}
          </View>
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.createStoreButton} onPress={handleCreateStore}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
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
  searchSection: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    padding: 4,
  },
  categoriesSection: {
    paddingVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: '#14b8a6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: '#fff',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  storesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  storeCard: {
    width: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  storeInfo: {
    padding: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  storeCreator: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  storeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeStatText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  productCreator: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createStoreButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});