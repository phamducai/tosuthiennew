import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import audioService from '../../api/audioService';
import { AudioListScreenRouteProp } from '../../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

interface AudioListItem {
  id: string;
  title: string;
  audio: string[];
}

const AudioListScreen = () => {
  const [audios, setAudios] = useState<AudioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigation = useNavigation();
  const route = useRoute<AudioListScreenRouteProp>();
  const { categoryId } = route.params;
  const { currentTrack, playTrack, isPlaying, pauseTrack, resumeTrack } = useAudioPlayer();

  useEffect(() => {
    loadAudios();
  }, [categoryId]);

  const loadAudios = async () => {
    try {
      setLoading(true);
      const collectionDetail = await audioService.fetchAudioById(categoryId);
      console.log(collectionDetail, 'collectionDetail');
      if (collectionDetail && collectionDetail.audios) {
        // Transform the audio items to a more usable format
        const audioItems = collectionDetail.audios.map(item => ({
          id: item.audio[0], // Using the first audio ID as the item ID
          title: item.title,
          audio: item.audio,
        }));
        
        setAudios(audioItems);
        setError('');
      } else {
        setAudios([]);
        setError('Không tìm thấy dữ liệu âm thanh.');
      }
    } catch (err) {
      console.error('Failed to load audios:', err);
      setError('Không thể tải dữ liệu âm thanh. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToAudioDetail = (id: string) => {
    // Tạo danh sách audio dạng đơn giản để truyền qua navigation
    const simplifiedAudioList = audios.map(audio => ({
      id: audio.id,
      title: audio.title
    }));
    
    // Tìm index của audio được chọn
    const currentIndex = audios.findIndex(audio => audio.id === id);
    
    // @ts-ignore
    navigation.navigate('AudioDetail', { 
      id, 
      audioList: simplifiedAudioList,
      currentIndex: currentIndex !== -1 ? currentIndex : 0
    });
  };

  const renderItem = ({ item }: { item: AudioListItem }) => {
    const isCurrentTrack = currentTrack && currentTrack.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.audioItem, isCurrentTrack && styles.activeAudioItem]}
        onPress={() => navigateToAudioDetail(item.id)}
      >
        <View style={styles.audioItemContent}>
          <Text style={[styles.audioTitle, isCurrentTrack && styles.activeTitle]}>
            {item.title}
          </Text>
          {isCurrentTrack ? (
            <Text style={styles.nowPlayingText}>Đang phát</Text>
          ) : (
            <Icon name="chevron-forward" size={24} color="#795548" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          onPress={loadAudios}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={audios}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có audio trong danh mục này</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  audioItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeAudioItem: {
    backgroundColor: '#f9f9f9',
  },
  audioItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  activeTitle: {
    color: '#1DB954',
  },
  nowPlayingText: {
    fontSize: 12,
    color: '#1DB954',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    margin: 20,
  },
  playButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenPlayer: {
    width: 0,
    height: 0,
  },
  retryButton: {
    backgroundColor: '#795548',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default AudioListScreen; 