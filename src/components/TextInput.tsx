import React, { forwardRef } from 'react';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import { TextInput as PaperTextInput, HelperText, useTheme } from 'react-native-paper';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  mode?: 'flat' | 'outlined';
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  right?: React.ReactNode;
  left?: React.ReactNode;
  testID?: string;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      mode = 'outlined',
      error,
      disabled = false,
      secureTextEntry = false,
      keyboardType = 'default',
      autoCapitalize = 'none',
      autoCorrect = false,
      placeholder,
      multiline = false,
      numberOfLines = 1,
      style,
      right,
      left,
      testID,
    },
    ref
  ) => {
    const theme = useTheme();
    const hasError = !!error;

    return (
      <View style={styles.container}>
        <PaperTextInput
          ref={ref}
          label={label}
          value={value}
          onChangeText={onChangeText}
          mode={mode}
          error={hasError}
          disabled={disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[styles.input, style]}
          right={right}
          left={left}
          testID={testID}
        />
        {hasError && <HelperText type="error">{error}</HelperText>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    width: '100%',
  },
});

export default TextInput; 