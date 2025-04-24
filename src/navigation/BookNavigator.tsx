import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookListScreen from '../screens/books/BookListScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import { BookStackParamList } from './types';

const Stack = createNativeStackNavigator<BookStackParamList>();

const BookNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="BookList">
      <Stack.Screen 
        name="BookList" 
        component={BookListScreen} 
        options={{ title: 'Sách' }}
      />
      <Stack.Screen 
        name="BookDetail" 
        component={BookDetailScreen} 
        options={{ title: 'Book Details', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default BookNavigator; 