import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Appbar, Card, Title, Paragraph, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Dữ liệu mẫu
const DUMMY_VIDEOS = [
  {
    id: '1',
    title: 'Hướng dẫn thiền cho người mới bắt đầu',
    author: 'Thiền Sư Hoa Sen',
    duration: '18:25',
    thumbnail: 'https://placehold.co/600x400/FFE0D1/FF2D55?text=Thiền',
    views: '15.2K',
  },
  {
    id: '2',
    title: 'Bài giảng về Thiền và cuộc sống hàng ngày',
    author: 'Thầy Thích Thiện Tuệ',
    duration: '32:08',
    thumbnail: 'https://placehold.co/600x400/E5E1FF/3F51B5?text=Giảng+Pháp',
    views: '8.7K',
  },
  {
    id: '3',
    title: 'Kỹ thuật thở để tĩnh tâm',
    author: 'Thiền Sư Minh Niệm',
    duration: '12:45',
    thumbnail: 'https://placehold.co/600x400/D1F5FF/007AFF?text=Kỹ+Thuật+Thở',
    views: '23.5K',
  },
  {
    id: '4',
    title: '5 phút thiền mỗi ngày - Tập 1',
    author: 'Thiền Sư Hoa Sen',
    duration: '5:15',
    thumbnail: 'https://placehold.co/600x400/D1FFEA/34C759?text=5+Phút+Thiền',
    views: '45.1K',
  },
  {
    id: '5',
    title: 'Thiền và đời sống hiện đại',
    author: 'Thiền Sư Nam Sơn',
    duration: '28:32',
    thumbnail: 'https://placehold.co/600x400/FFF5D1/FF9500?text=Thiền+Hiện+Đại',
    views: '12.3K',
  },
  {
    id: '6',
    title: 'Phương pháp thiền cho người bận rộn',
    author: 'Thầy Thích Minh Tuệ',
    duration: '15:08',
    thumbnail: 'https://placehold.co/600x400/D1DDFF/5856D6?text=Thiền+Nhanh',
    views: '18.9K',
  },
];

const VideoListScreen = () => {
  const [videos] = useState(DUMMY_VIDEOS);
  const navigation = useNavigation();

  const navigateToVideoDetail = (id: string) => {
    // @ts-ignore
    navigation.navigate('VideoDetail', { id });
  };

  const renderItem = ({ item }: { item: typeof DUMMY_VIDEOS[0] }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => navigateToVideoDetail(item.id)}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.durationBadge}>
            <Icon name="time-outline" size={12} color="#FFF" />
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <Card.Content style={styles.cardContent}>
          <Title numberOfLines={2} style={styles.title}>{item.title}</Title>
          <View style={styles.metaContainer}>
            <Paragraph style={styles.author}>{item.author}</Paragraph>
            <View style={styles.viewsContainer}>
              <Icon name="eye-outline" size={14} color="#666" />
              <Text style={styles.views}>{item.views}</Text>
            </View>
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
              <Icon name="videocam" size={24} color="#FFF" style={styles.headerIcon} />
              <Text style={styles.headerTitle}>Video</Text>
            </View>
          } 
        />
      </Appbar.Header>

      <FlatList
        data={videos}
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
  videoItem: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  views: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default VideoListScreen; 