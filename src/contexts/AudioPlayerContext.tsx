import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Platform, AppState } from 'react-native';
import Video, { OnLoadData, VideoRef } from 'react-native-video';

interface AudioTrack {
  id: string;
  title: string;
  url?: string;
}

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  isBuffering: boolean;
  isLoading: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTo: (seconds: number) => void;
  stopTrack: () => void;
  setPlaylist: (tracks: AudioTrack[], startIndex?: number) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  playlist: AudioTrack[];
  currentTrackIndex: number;
}

const defaultContextValue: AudioPlayerContextType = {
  currentTrack: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  isBuffering: false,
  isLoading: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  seekTo: () => {},
  stopTrack: () => {},
  setPlaylist: () => {},
  skipToNext: () => {},
  skipToPrevious: () => {},
  playlist: [],
  currentTrackIndex: -1,
};

export const AudioPlayerContext = createContext<AudioPlayerContextType>(defaultContextValue);

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylistState] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  
  const videoRef = useRef<VideoRef>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  const getTrackUrl = (trackId: string) => {
    return `https://cms.tosu-thien.com/api/assets/tosuthien/${trackId}`;
  };

  const playTrack = (track: AudioTrack) => {
    const trackUrl = track.url || getTrackUrl(track.id);
    setCurrentTrack({...track, url: trackUrl});
    setIsPlaying(true);
    setIsLoading(true);
    
    // Tìm track index nếu track đó nằm trong playlist
    const trackIndex = playlist.findIndex(item => item.id === track.id);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
     setIsBuffering(true);
      
      setCurrentTime(seconds);
      
      videoRef.current.seek(seconds);
    }
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setDuration(0);
  };

  const setPlaylist = (tracks: AudioTrack[], startIndex: number = 0) => {
    // Đảm bảo các track có url
    const tracksWithUrl = tracks.map(track => ({
      ...track,
      url: track.url || getTrackUrl(track.id)
    }));
    
    setPlaylistState(tracksWithUrl);
    
    if (tracks.length > 0 && startIndex >= 0 && startIndex < tracks.length) {
      setCurrentTrackIndex(startIndex);
      playTrack(tracks[startIndex]);
    }
  };

  const skipToNext = () => {
    if (playlist.length > 1 && currentTrackIndex < playlist.length - 1) {
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      playTrack(playlist[nextIndex]);
    } else if (playlist.length > 1) {
      // Quay về bài đầu tiên (vòng lặp)
      setCurrentTrackIndex(0);
      playTrack(playlist[0]);
    }
  };

  const skipToPrevious = () => {
    if (playlist.length > 1 && currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      playTrack(playlist[prevIndex]);
    } else if (playlist.length > 1) {
      // Quay về bài cuối cùng (vòng lặp)
      const lastIndex = playlist.length - 1;
      setCurrentTrackIndex(lastIndex);
      playTrack(playlist[lastIndex]);
    }
  };

  const handleLoad = (data: OnLoadData) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const handleProgress = (data: { currentTime: number }) => {
    setCurrentTime(data.currentTime);
  };

  const handleEnd = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
    setCurrentTime(0);
    
    // Tự động phát bài tiếp theo
    if (playlist.length > 1) {
      skipToNext();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        duration,
        currentTime,
        isBuffering,
        isLoading,
        playTrack,
        pauseTrack,
        resumeTrack,
        seekTo,
        stopTrack,
        setPlaylist,
        skipToNext,
        skipToPrevious,
        playlist,
        currentTrackIndex,
      }}
    >
      {children}
      
      {currentTrack && (
        <Video
          ref={videoRef}
          source={{ uri: currentTrack.url }}
          paused={!isPlaying}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
          onBuffer={({ isBuffering: buffering }) => setIsBuffering(buffering)}
          style={{ width: 0, height: 0 }} // Ẩn video player
          playInBackground={true}
          playWhenInactive={true}
          progressUpdateInterval={500}
          ignoreSilentSwitch="ignore"
          controls={true}
          preventsDisplaySleepDuringVideoPlayback={true}
        />
      )}
    </AudioPlayerContext.Provider>
  );
}; 