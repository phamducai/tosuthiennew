import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Platform, TouchableOpacity, StatusBar, PanResponder, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookStackParamList } from '../../navigation/types';
import { PDF_BASE_URL } from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simplified Book interface that matches our optimized API response
interface sourceDTO {
  uri: string;
  cache: boolean;
  trustAllCerts: boolean
}

// Interface for reading progress item
interface ReadingProgressItem {
  bookId: string;
  page: number;
  lastUpdated?: number; // Optional timestamp
}

// Storage key for reading progress
const READING_PROGRESS_KEY = 'reading_progress';

type BookDetailScreenRouteProp = RouteProp<BookStackParamList, 'BookDetail'>;
type BookDetailScreenNavigationProp = NativeStackNavigationProp<BookStackParamList, 'BookDetail'>;

type Props = {
  route: BookDetailScreenRouteProp;
  navigation: BookDetailScreenNavigationProp;
};

const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [source, setSource] = useState<sourceDTO | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [pageCurrent, setPageCurrent] = useState<number>(1);
  
  // Store for our reading progress to avoid frequent AsyncStorage calls
  const [readingProgressArray, setReadingProgressArray] = useState<ReadingProgressItem[]>([]);
  const progressInitialized = useRef<boolean>(false);
  const pdfRef = useRef<any>(null);
  const saveInProgress = useRef<boolean>(false);
  const pageChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Pan responder to detect swipe down from top
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward movement if the gesture started near the top of the screen
        return gestureState.dy > 5 && gestureState.moveY < 100;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 20) {
          setShowBackButton(true);
        }
      },
      onPanResponderRelease: () => {
        // Auto-hide the back button after 3 seconds
        setTimeout(() => {
          setShowBackButton(false);
        }, 3000);
      },
    })
  ).current;

  // Hide bottom tab navigator when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      try {
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'none' }
        });
      } catch (error) {
        console.warn('Could not hide tab bar:', error);
      }
      
      // Return callback for when screen loses focus
      return () => {
        try {
          navigation.getParent()?.setOptions({
            tabBarStyle: undefined
          });
        } catch (error) {
          console.warn('Could not restore tab bar:', error);
        }
      };
    }, [navigation])
  );

  // Safely load data from AsyncStorage with error handling
  const safelyLoadData = useCallback(async <T,>(key: string, defaultValue: T): Promise<T> => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        try {
          return JSON.parse(data) as T;
        } catch (parseError) {
          console.warn(`Invalid JSON in ${key}:`, parseError);
          return defaultValue;
        }
      }
    } catch (error) {
      console.warn(`Error loading ${key}:`, error);
    }
    return defaultValue;
  }, []);

  // Safely save data to AsyncStorage with error handling
  const safelySaveData = useCallback(async (key: string, data: any): Promise<boolean> => {
    if (saveInProgress.current) return false;
    
    saveInProgress.current = true;
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      saveInProgress.current = false;
      return true;
    } catch (error) {
      console.warn(`Error saving ${key}:`, error);
      saveInProgress.current = false;
      return false;
    }
  }, []);

  // Load all reading progress once at component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadAllReadingProgress = async () => {
      const progressArray = await safelyLoadData<ReadingProgressItem[]>(
        READING_PROGRESS_KEY, 
        []
      );
      
      if (isMounted) {
        setReadingProgressArray(progressArray);
        progressInitialized.current = true;
      }
    };

    loadAllReadingProgress().catch(err => {
      console.warn('Failed to load reading progress:', err);
      if (isMounted) {
        progressInitialized.current = true; // Mark as initialized even on error
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, [safelyLoadData]);

  // Check and update current page when reading progress loads or book ID changes
  useEffect(() => {
    // Only run when initialization is complete and we have a book ID
    if (!progressInitialized.current || !id) return;
    
    try {
      // Find the current book in the progress array
      const bookProgress = readingProgressArray.find(item => item.bookId === id);
      
      if (bookProgress && bookProgress.page > 1) {
        console.log(`Tự động khôi phục tiến trình đọc cho sách ${id}: trang ${bookProgress.page}`);
        // Set the current page to the saved value - this will automatically update the PDF view
        setPageCurrent(bookProgress.page);
      } else {
        console.log(`Không tìm thấy tiến trình đọc đã lưu cho sách ${id}, bắt đầu từ trang 1`);
      }
    } catch (error) {
      console.warn('Error restoring reading position:', error);
    }
  }, [readingProgressArray, id]);
  
  // Update the PDF source with the correct initial page whenever pageCurrent changes
  useEffect(() => {
    if (pdfRef.current && pageCurrent > 0) {
      try {
        console.log(`Cập nhật vị trí PDF đến trang ${pageCurrent}`);
        // This ensures the PDF view shows the correct page when reopening
        pdfRef.current.setPage(pageCurrent);
      } catch (error) {
        console.warn('Error setting PDF page:', error);
      }
    }
  }, [pageCurrent]);
  
  // Memoized save function to prevent recreation on every render
  const saveProgressToStorage = useCallback(() => {
    if (!progressInitialized.current || readingProgressArray.length === 0) return;
    
    safelySaveData(READING_PROGRESS_KEY, readingProgressArray)
      .then(success => {
        if (success) {
          console.log('Đã lưu tiến trình đọc vào bộ nhớ');
        }
      })
      .catch(error => {
        console.warn('Lỗi khi lưu tiến trình:', error);
      });
  }, [readingProgressArray, safelySaveData]);
  
  // Save on array changes with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveProgressToStorage();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [readingProgressArray, saveProgressToStorage]);

  // Memoized update function - FIX: Using useCallback properly to prevent infinite loops
  const updateReadingProgress = useCallback((bookId: string, page: number) => {
    // Skip updates for page 1 and invalid values
    if (!bookId || page <= 1) return;
    
    setReadingProgressArray(currentArray => {
      // First check if we actually need to update
      const existingItem = currentArray.find(item => item.bookId === bookId);
      if (existingItem && existingItem.page === page) {
        // No change needed, return the same array to prevent re-renders
        return currentArray;
      }
      
      // Create a copy of the array
      const updatedArray = [...currentArray];
      
      // Find index of current book
      const existingIndex = updatedArray.findIndex(item => item.bookId === bookId);
      
      if (existingIndex >= 0) {
        // Update existing entry
        updatedArray[existingIndex] = { 
          ...updatedArray[existingIndex],
          page,
          lastUpdated: Date.now()
        };
      } else {
        // Add new entry
        updatedArray.push({ 
          bookId, 
          page,
          lastUpdated: Date.now()
        });
      }
      
      return updatedArray;
    });
  }, []);

  // Update reading progress when page changes, with debounce - FIX: Clear timeout to prevent multiple updates
  useEffect(() => {
    // Skip if not initialized, no book ID, or default page
    if (!progressInitialized.current || !id || pageCurrent <= 1) return;
    
    // Clear existing timeout to avoid potential update loops
    if (pageChangeTimeoutRef.current) {
      clearTimeout(pageChangeTimeoutRef.current);
    }
    
    // Set new timeout
    pageChangeTimeoutRef.current = setTimeout(() => {
      updateReadingProgress(id, pageCurrent);
      pageChangeTimeoutRef.current = null;
    }, 1000); // 1 second debounce
    
    return () => {
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
        pageChangeTimeoutRef.current = null;
      }
    };
  }, [id, pageCurrent, updateReadingProgress]);

  // Handle page change event - FIX: Using useCallback to prevent recreation on every render
  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page !== pageCurrent) { // FIX: Only update if actually changed
      setPageCurrent(page);
    }
  }, [pageCurrent]);

  // Book loading - FIX: Added isMounted check to prevent state updates after unmount
  useEffect(() => {
    let isMounted = true;
    
    const loadBookDetails = async () => {
      if (!id) {
        if (isMounted) setError('Không có ID sách');
        return;
      }
      
      try {
        // Set up the PDF source immediately to start loading
        if (isMounted) {
          setSource({
            uri: PDF_BASE_URL + id,
            cache: true,
            trustAllCerts: false
          });
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading book details:', error);
        if (isMounted) {
          setError('Lỗi khi tải sách');
        }
      }
    };

    loadBookDetails().catch(err => {
      if (isMounted) {
        setError('Không thể tải sách: ' + (err.message || 'Lỗi không xác định'));
        setLoading(false);
      }
    });
    
    // Hide status bar for fullscreen experience
    try {
      StatusBar.setHidden(true);
    } catch (error) {
      console.warn('Could not hide status bar:', error);
    }
    
    return () => {
      isMounted = false;
      
      try {
        // Ensure we save progress before unmounting
        if (id && pageCurrent > 1 && progressInitialized.current) {
          // Directly save the current progress without triggering state updates
          const currentBook = readingProgressArray.find(item => item.bookId === id);
          if (!currentBook || currentBook.page !== pageCurrent) {
            const updatedArray = [...readingProgressArray];
            const existingIndex = updatedArray.findIndex(item => item.bookId === id);
            
            if (existingIndex >= 0) {
              updatedArray[existingIndex].page = pageCurrent;
            } else {
              updatedArray.push({ bookId: id, page: pageCurrent, lastUpdated: Date.now() });
            }
            
            // Save directly without setState
            safelySaveData(READING_PROGRESS_KEY, updatedArray);
          }
        }
        
        // Restore status bar when component unmounts
        StatusBar.setHidden(false);
      } catch (error) {
        console.warn('Error in cleanup:', error);
      }
    };
  }, [id, pageCurrent, readingProgressArray, safelySaveData]);

  // Error retry handler
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    
    // Reload the page
    if (id) {
      setSource({
        uri: PDF_BASE_URL + id,
        cache: true,
        trustAllCerts: false
      });
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải sách...</Text>
      </View>
    );
  }

  if (error || !source) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Đã xảy ra lỗi'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButtonError} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gesture detector area at top of screen */}
      <View 
        {...panResponder.panHandlers} 
        style={styles.gestureArea} 
      />
      
      {/* Back button that shows on swipe down */}
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            try {
              StatusBar.setHidden(false);
              navigation.goBack();
            } catch (error) {
              console.warn('Error navigating back:', error);
              // Fallback direct navigation if goBack fails
              navigation.navigate('BookList');
            }
          }}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      
      {source && id && (
        <Pdf
          ref={pdfRef}
          source={source}
          style={styles.pdf}
          trustAllCerts={false}
          enablePaging={true}
          page={pageCurrent}
          fitPolicy={0}
          horizontal={true}
          enableAntialiasing={true}
          enableDoubleTapZoom={true}
          minScale={1.0}
          maxScale={4.0}
          scale={1.0}
          spacing={0}
          renderActivityIndicator={() => (
            <View style={styles.pdfLoadingContainer}>
              <ActivityIndicator color="#0000ff" size="large" />
              <Text style={styles.pdfLoadingText}>Đang tải nội dung...</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          onPageChanged={handlePageChange}
          onError={(error) => {
            console.log(`PDF Error: ${error}`);
            setError(`Lỗi khi hiển thị PDF: ${error.toString()}`);
            setLoading(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for better reading
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  backButtonError: {
    marginTop: 15,
    padding: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#000', // Black background for better reading
  },
  gestureArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  pdfLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  pdfLoadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});

export default BookDetailScreen;