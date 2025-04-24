import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AudioStackParamList } from '../../navigation/types';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

type AudioDetailScreenRouteProp = RouteProp<AudioStackParamList, 'AudioDetail'>;

const AudioDetailScreen = () => {
  const route = useRoute<AudioDetailScreenRouteProp>();
  const { id, audioList = [], currentIndex = 0 } = route.params;
  const navigation = useNavigation();
  
  // Thêm state để kiểm soát việc kéo thanh trượt
  const [isSeeking, setIsSeeking] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(0);
  
  // Sử dụng AudioPlayerContext
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    isLoading,
    duration,
    currentTime,
    playTrack,
    pauseTrack,
    resumeTrack,
    seekTo,
    setPlaylist,
    skipToNext,
    skipToPrevious,
    playlist,
    currentTrackIndex
  } = useAudioPlayer();
  
  // Cập nhật giá trị local khi currentTime thay đổi (chỉ khi không kéo)
  useEffect(() => {
    if (!isSeeking) {
      setLocalSliderValue(currentTime);
    }
  }, [currentTime, isSeeking]);
  
  // Thiết lập playlist và bài hát hiện tại khi màn hình được tải
  useEffect(() => {
    if (audioList && audioList.length > 0) {
      // Chỉ thiết lập playlist nếu người dùng mở bài hát mới
      if (!currentTrack || currentTrack.id !== id) {
        setPlaylist(audioList, currentIndex);
      }
    }
  }, [audioList, id, currentIndex]);
  
  // Xử lý nút back
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  // Xử lý khi người dùng bắt đầu kéo thanh trượt
  const handleSliderSlidingStart = () => {
    setIsSeeking(true);
  };
  
  // Cập nhật giá trị local khi kéo thanh trượt
  const handleSliderValueChange = (value: number) => {
    setLocalSliderValue(value);
  };
  
  // Xử lý khi người dùng kết thúc kéo thanh trượt
  const handleSliderSlidingComplete = (value: number) => {
    seekTo(value);
    setIsSeeking(false);
  };
  
  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    seekTo(newTime);
  };
  
  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    seekTo(newTime);
  };
  
  // Định dạng thời gian (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Kiểm tra xem có đang phát audio không
  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Không có âm thanh đang phát</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{currentTrack.title}</Text>
          {playlist.length > 1 && (
            <Text style={styles.trackInfo}>
              Bài {currentTrackIndex + 1}/{playlist.length}
            </Text>
          )}
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {formatTime(isSeeking ? localSliderValue : currentTime)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={isSeeking ? localSliderValue : currentTime}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#1DB954"
            onSlidingStart={handleSliderSlidingStart}
            onValueChange={handleSliderValueChange}
            onSlidingComplete={handleSliderSlidingComplete}
          />
          <Text style={styles.progressText}>
            {formatTime(duration)}
          </Text>
        </View>
        
        <View style={styles.audioButtonsContainer}>
          <TouchableOpacity 
            style={styles.audioNavButton} 
            onPress={skipBackward}
          >
            <Icon name="play-back" size={24} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.audioNavButton} 
            onPress={skipToPrevious}
            disabled={playlist.length <= 1}
          >
            <Icon 
              name="play-skip-back" 
              size={24} 
              color={playlist.length > 1 ? "#FFFFFF" : "#555555"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.playButton, (isBuffering && !isSeeking) && styles.disabledButton]}
            onPress={handlePlayPause}
            disabled={isBuffering && !isSeeking}
          >
            {(isBuffering && !isSeeking) || isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icon name={isPlaying ? "pause" : "play"} size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.audioNavButton} 
            onPress={skipToNext}
            disabled={playlist.length <= 1}
          >
            <Icon 
              name="play-skip-forward" 
              size={24} 
              color={playlist.length > 1 ? "#FFFFFF" : "#555555"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.audioNavButton} 
            onPress={skipForward}
          >
            <Icon name="play-forward" size={24} color="#AAAAAA" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.audioStatusContainer}>
          <Text style={styles.audioStatusText}>
            {isSeeking
              ? 'Đang tìm vị trí...'
              : isBuffering
              ? 'Đang tải...'
              : isPlaying
              ? 'Đang phát'
              : 'Đã tạm dừng'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackInfo: {
    color: '#1DB954',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  progressText: {
    color: '#AAAAAA',
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  audioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  audioNavButton: {
    padding: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  playButton: {
    backgroundColor: '#1DB954',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  disabledButton: {
    backgroundColor: '#196F33',
  },
  audioStatusContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  audioStatusText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default AudioDetailScreen; 