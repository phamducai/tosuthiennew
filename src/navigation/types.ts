import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Main tab navigation param list
export type MainTabParamList = {
  Home: undefined;
  BookStack: undefined;
  AudioStack: undefined;
  VideoList: undefined;
  CenterList: undefined;
};

// Book stack navigation param list
export type BookStackParamList = {
  BookList: undefined;
  BookDetail: { id: string };
  BookCategoryList: { category: string };
};

// Audio stack navigation param list
export type AudioStackParamList = {
  AudioCategories: { categoryId?: string };
  AudioList: { categoryId: string; categoryName: string };
  AudioDetail: { 
    id: string; 
    audioList?: { id: string; title: string }[]; 
    currentIndex?: number;
  };
};

// Route prop types - Book
export type BookDetailScreenRouteProp = RouteProp<BookStackParamList, 'BookDetail'>;
export type BookCategoryListScreenRouteProp = RouteProp<BookStackParamList, 'BookCategoryList'>;

// Route prop types - Audio
export type AudioListScreenRouteProp = RouteProp<AudioStackParamList, 'AudioList'>;
export type AudioDetailScreenRouteProp = RouteProp<AudioStackParamList, 'AudioDetail'>; 