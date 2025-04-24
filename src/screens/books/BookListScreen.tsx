import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BookStackParamList } from '../../navigation/types';
import { fetchBooks } from '../../api/bookService';
import bookCoverImage from '../../assets/book-covers.jpg';

// Kích thước màn hình
const { width } = Dimensions.get('window');
const COLUMN_NUM = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_NUM; // 48 = padding (16) * 3 (2 bên + ở giữa)

// Simplified Book interface that matches our optimized API response
interface SimplifiedBookDTO {
  id: string;
  title: string;
  description: string;
  firstChapterId: string | null;
  isCollection: boolean;
}

type BookListScreenNavigationProp = NativeStackNavigationProp<BookStackParamList, 'BookList'>;

type Props = {
  navigation: BookListScreenNavigationProp;
};

const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const [books, setBooks] = useState<SimplifiedBookDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Không thể tải dữ liệu sách');
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const navigateToBookDetail = (id: string) => {
    navigation.navigate('BookDetail', { id });
  };

  const renderItem = ({ item }: { item: SimplifiedBookDTO }) => {
    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => navigateToBookDetail(item.firstChapterId || '')}
        activeOpacity={0.7}
      >
        <View style={styles.bookCard}>
          <ImageBackground
            source={bookCoverImage}
            style={styles.bookCover}
            resizeMode="cover"
            imageStyle={{ opacity: 0.8 }}
          >
            <View style={styles.titleOverlay}>
              <Text style={styles.overlayText} numberOfLines={3}>
                {item.title}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={COLUMN_NUM}
        key={COLUMN_NUM.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  bookItem: {
    width: ITEM_WIDTH,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    width: '100%',
    height: 210,
  },
  bookCover: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'flex-end',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: 'red',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});

export default BookListScreen; 