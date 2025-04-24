import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Quick access descriptions
const tabDescriptions = [
  {
    id: 'audio-desc',
    title: 'Âm thanh',
    description: 'Nghe bài giảng và âm thanh thiền',
    icon: 'headset',
    color: '#FF9500',
    navigate: 'AudioStack',
  },
  {
    id: 'book-desc',
    title: 'Kinh Sách',
    description: 'Kinh Sách Hòa Thượng Thiền Sư Thích Duy Lực',
    icon: 'library',
    color: '#007AFF',
    navigate: 'BookStack',
  },
  {
    id: 'video-desc',
    title: 'Video',
    description: 'Xem video hướng dẫn thiền và bài giảng',
    icon: 'videocam',
    color: '#FF2D55',
    navigate: 'VideoList',
  },
  {
    id: 'center-desc',
    title: 'Thiền đường',
    description: 'Tìm thiền đường gần bạn',
    icon: 'location',
    color: '#34C759',
    navigate: 'CenterList',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName: string) => {
    // @ts-ignore - Ignoring type check for simplicity
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Enso.svg/150px-Enso.svg.png' }} 
            style={styles.zenCircleIcon} 
          />
          <Text style={styles.headerTitle}>Thiền Tổ Sư</Text>
        </View>

        {/* Features Access */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresList}>
            {tabDescriptions.map((feature) => (
              <TouchableOpacity 
                key={feature.id} 
                onPress={() => navigateToScreen(feature.navigate)}
                activeOpacity={0.7}
              >
                <Card style={styles.featureCard}>
                  <Card.Content style={styles.featureCardContent}>
                    <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                      <Icon name={feature.icon} size={24} color="#FFF" />
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Title style={styles.featureTitle}>{feature.title}</Title>
                      <Paragraph style={styles.featureDescription}>{feature.description}</Paragraph>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  zenCircleIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  featuresSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen; 