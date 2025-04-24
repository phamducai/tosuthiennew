import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/home/HomeScreen';
import BookNavigator from './BookNavigator';
import AudioNavigator from './AudioNavigator';
import VideoListScreen from '../screens/videos/VideoListScreen';
import CenterListScreen from '../screens/centers/CenterListScreen';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import MiniPlayer from '../components/MiniPlayer';

export type MainTabParamList = {
  Home: undefined;
  BookStack: undefined;
  AudioStack: undefined;
  VideoList: undefined;
  CenterList: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom theme cho navigation
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#000000',
    border: '#d0d0d0',
    notification: '#FF3B30',
  },
};

const RootNavigator = () => {
  return (
    <AudioPlayerProvider>
      <PaperProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
          <View style={styles.container}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName = '';

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'BookStack') {
                    iconName = focused ? 'book' : 'book-outline';
                  } else if (route.name === 'AudioStack') {
                    iconName = focused ? 'headset' : 'headset-outline';
                  } else if (route.name === 'VideoList') {
                    iconName = focused ? 'videocam' : 'videocam-outline';
                  } else if (route.name === 'CenterList') {
                    iconName = focused ? 'location' : 'location-outline';
                  }

                  return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
              })}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Trang chủ' }}
              />
              <Tab.Screen
                name="AudioStack"
                component={AudioNavigator}
                options={{ 
                  title: 'Âm thanh',
                  headerShown: false 
                }}
              />
              <Tab.Screen
                name="BookStack"
                component={BookNavigator}
                options={{ title: 'Sách', headerShown: false }}
              />
              <Tab.Screen
                name="VideoList"
                component={VideoListScreen}
                options={{ 
                  title: 'Video',
                  headerShown: false 
                }}
              />
              <Tab.Screen
                name="CenterList"
                component={CenterListScreen}
                options={{ 
                  title: 'Thiền đường',
                  headerShown: false 
                }}
              />
            </Tab.Navigator>
            
            {/* Hiển thị MiniPlayer trên toàn ứng dụng */}
            <MiniPlayer />
          </View>
        </NavigationContainer>
      </PaperProvider>
    </AudioPlayerProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default RootNavigator; 