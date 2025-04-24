import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Appbar, Card, Title, Paragraph, Text, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Dữ liệu mẫu
const DUMMY_CENTERS = [
  {
    id: '1',
    name: 'Thiền Đường Hoa Sen',
    address: '123 Nguyễn Văn Trỗi, Quận Phú Nhuận, TP. HCM',
    image: 'https://placehold.co/600x400/E5FAFF/007AFF?text=Hoa+Sen',
    rating: 4.8,
    tags: ['Thiền Vipassana', 'Tâm Từ'],
    distance: '1.2 km',
  },
  {
    id: '2',
    name: 'Thiền Viện Vạn Hạnh',
    address: '45 Phan Đăng Lưu, Quận Bình Thạnh, TP. HCM',
    image: 'https://placehold.co/600x400/FFF0E5/FF9500?text=Vạn+Hạnh',
    rating: 4.5,
    tags: ['Thiền Chỉ Quán', 'Kinh Hành'],
    distance: '3.5 km',
  },
  {
    id: '3',
    name: 'Thiền Đường Minh Đăng',
    address: '78 Lê Đại Hành, Quận 11, TP. HCM',
    image: 'https://placehold.co/600x400/FFEBFA/FF2D55?text=Minh+Đăng',
    rating: 4.7,
    tags: ['Thiền Minh Sát', 'Thiền Tông'],
    distance: '5.1 km',
  },
  {
    id: '4',
    name: 'Trung Tâm Thiền Bát Nhã',
    address: '102 Lê Lợi, Quận 1, TP. HCM',
    image: 'https://placehold.co/600x400/F0FFE5/34C759?text=Bát+Nhã',
    rating: 4.9,
    tags: ['Thiền Zen', 'Yoga Thiền'],
    distance: '2.4 km',
  },
  {
    id: '5',
    name: 'Thiền Đường Trúc Lâm',
    address: '56 Trần Hưng Đạo, Quận 5, TP. HCM',
    image: 'https://placehold.co/600x400/F0E5FF/5856D6?text=Trúc+Lâm',
    rating: 4.6,
    tags: ['Thiền Trúc Lâm', 'Thiền Khí Công'],
    distance: '4.8 km',
  },
];

const CenterListScreen = () => {
  const [centers] = useState(DUMMY_CENTERS);
  const navigation = useNavigation();

  const navigateToCenterDetail = (id: string) => {
    // @ts-ignore
    navigation.navigate('CenterDetail', { id });
  };

  const renderItem = ({ item }: { item: typeof DUMMY_CENTERS[0] }) => (
    <TouchableOpacity
      style={styles.centerItem}
      onPress={() => navigateToCenterDetail(item.id)}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Title style={styles.name}>{item.name}</Title>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FF9500" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
          
          <Paragraph style={styles.address}>
            <Icon name="location-outline" size={14} color="#666" /> {item.address}
          </Paragraph>
          
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
          </View>

          <View style={styles.distanceContainer}>
            <Icon name="navigate" size={14} color="#007AFF" />
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content 
          title={
            <View style={styles.headerTitleContainer}>
              <Icon name="location" size={24} color="#FFF" style={styles.headerIcon} />
              <Text style={styles.headerTitle}>Thiền Đường</Text>
            </View>
          } 
        />
      </Appbar.Header>

      <FlatList
        data={centers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  centerItem: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
  },
  cardImage: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E5FAFF',
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  distance: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
});

export default CenterListScreen; 