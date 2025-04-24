import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AudioCollection } from '../../dto/AudioDTO';
import audioService from '../../api/audioService';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, Title } from 'react-native-paper';

const AudioCategoriesScreen = () => {
  const [categories, setCategories] = useState<AudioCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadCategories();
  }, [currentCategoryId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // Fetch categories với currentCategoryId (có thể null để lấy gốc)
      const data = await audioService.fetchAudioCategory(currentCategoryId);
      setCategories(data);
      setError('');
    } catch (err) {
      console.error('Failed to load audio categories:', err);
      setError('Không thể tải danh mục âm thanh. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToAudioList = (categoryId: string, categoryName: string, isCategory?: boolean) => {
    if (isCategory) {
      setCurrentCategoryId(categoryId);
    } else {
      // @ts-ignore
      navigation.navigate('AudioList', { categoryId, categoryName });
    }
  };

  const renderItem = ({ item, index }: { item: AudioCollection, index: number }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigateToAudioList(item.id, item.name, item.isCategory)}
    >
      <Card style={styles.categoryCard}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Title style={styles.categoryName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Title>
            <Text style={styles.itemCount} numberOfLines={1} ellipsizeMode="tail">
              {item.description}
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#9E9E9E" />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setCurrentCategoryId(null);
            loadCategories();
          }}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentCategoryId && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setCurrentCategoryId(null)}
        >
          <Icon name="arrow-back-outline" size={22} color="#757575" />
          <Text style={styles.backButtonText}>Quay lại danh mục gốc</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
  },
  listContent: {
    padding: 16,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  itemCount: {
    fontSize: 14,
    color: '#555555',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#603a2a',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#795548',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F0F0E8',
    borderBottomColor: '#D8D8D0',
    borderBottomWidth: 1,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#555555',
    fontWeight: '500',
  },
});

export default AudioCategoriesScreen; 
