import React from 'react';
import { View, Text } from 'react-native';
import { Field, FieldProps } from 'formik';
import Input from './Input';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  icon?: any;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function FormField({
  name,
  label,
  placeholder,
  icon,
  secureTextEntry,
  showPasswordToggle,
  keyboardType,
  autoCapitalize,
  multiline,
  numberOfLines,
}: FormFieldProps) {
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <Animated.View entering={FadeInDown.delay(100)}>
          <Input
            label={label}
            placeholder={placeholder}
            value={field.value}
            onChangeText={field.onChange(name)}
            onBlur={field.onBlur(name)}
            error={meta.touched && meta.error ? meta.error : undefined}
            icon={icon}
            secureTextEntry={secureTextEntry}
            showPasswordToggle={showPasswordToggle}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        </Animated.View>
      )}
    </Field>
  );
}