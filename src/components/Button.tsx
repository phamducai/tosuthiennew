import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

interface ButtonProps {
  label: string;
  onPress: () => void;
  mode?: ButtonMode;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  uppercase?: boolean;
  style?: object;
  contentStyle?: object;
  labelStyle?: object;
  testID?: string;
}

const Button = ({
  label,
  onPress,
  mode = 'contained',
  disabled = false,
  loading = false,
  icon,
  uppercase = false,
  style,
  contentStyle,
  labelStyle,
  testID,
}: ButtonProps) => {
  const theme = useTheme();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      uppercase={uppercase}
      style={[styles.button, style]}
      contentStyle={[styles.contentStyle, contentStyle]}
      labelStyle={[styles.labelStyle, labelStyle]}
      testID={testID}
    >
      {label}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
  contentStyle: {
    paddingVertical: 8,
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button; 