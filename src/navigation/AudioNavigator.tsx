import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AudioCategoriesScreen from '../screens/audios/AudioCategoriesScreen';
import AudioListScreen from '../screens/audios/AudioListScreen';
import AudioDetailScreen from '../screens/audios/AudioDetailScreen';
import { AudioStackParamList } from './types';

const Stack = createNativeStackNavigator<AudioStackParamList>();

const AudioNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AudioCategories">
      <Stack.Screen 
        name="AudioCategories" 
        component={AudioCategoriesScreen} 
        options={{ title: 'Pháp Âm' }}
      />
      <Stack.Screen 
        name="AudioList" 
        component={AudioListScreen} 
        options={{ title: 'Pháp Âm'}}
      />
      <Stack.Screen 
        name="AudioDetail" 
        component={AudioDetailScreen}
        options={{ title: 'Chi Tiết Âm Thanh' }}
      />
    </Stack.Navigator>
  );
};

export default AudioNavigator; 