import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';

interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string;
  onPress?: () => void;
  coverImage?: string;
  children?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  style?: object;
  contentStyle?: object;
  testID?: string;
}

const Card = ({
  title,
  subtitle,
  content,
  onPress,
  coverImage,
  children,
  leftContent,
  rightContent,
  style,
  contentStyle,
  testID,
}: CardProps) => {
  return (
    <PaperCard
      style={[styles.card, style]}
      onPress={onPress}
      testID={testID}
    >
      {coverImage && (
        <PaperCard.Cover source={{ uri: coverImage }} style={styles.cover} />
      )}
      
      {title && (
        <PaperCard.Title
          title={title}
          subtitle={subtitle}
          left={leftContent ? () => leftContent : undefined}
          right={rightContent ? () => rightContent : undefined}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
      )}
      
      <PaperCard.Content style={[styles.content, contentStyle]}>
        {content && <Text style={styles.contentText}>{content}</Text>}
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    elevation: 4,
    borderRadius: 8,
  },
  cover: {
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    paddingVertical: 8,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Card; 