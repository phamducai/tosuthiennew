import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    pauseTrack,
    resumeTrack,
    skipToNext,
    skipToPrevious,
    playlist,
    stopTrack,
  } = useAudioPlayer();
  
  const navigation = useNavigation();

  if (!currentTrack) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const openFullPlayer = () => {
    // @ts-ignore - Bỏ qua lỗi kiểu navigation
    navigation.navigate('AudioStack', {
      screen: 'AudioDetail',
      params: {
        id: currentTrack.id,
        audioList: playlist.map(track => ({ id: track.id, title: track.title })),
        currentIndex: playlist.findIndex(track => track.id === currentTrack.id),
      },
    });
  };
  
  const handleClose = () => {
    stopTrack();
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.9}
      onPress={openFullPlayer}
    >
      <View style={styles.playerContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {currentTrack.title}
        </Text>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={skipToPrevious}
            disabled={playlist.length <= 1}
          >
            <Icon 
              name="play-skip-back" 
              size={22} 
              color={playlist.length > 1 ? "#FFFFFF" : "#777777"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            {isBuffering ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icon name={isPlaying ? "pause" : "play"} size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={skipToNext}
            disabled={playlist.length <= 1}
          >
            <Icon 
              name="play-skip-forward" 
              size={22} 
              color={playlist.length > 1 ? "#FFFFFF" : "#777777"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Icon name="close-circle" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 49, // Vị trí trên cùng của TabBar
    width: width,
    height: 56,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingHorizontal: 16,
  },
  playerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 2,
  },
  playButton: {
    backgroundColor: '#1DB954',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  closeButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default MiniPlayer; 