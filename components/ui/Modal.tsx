import React from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Button from './Button';
import { IconSymbol } from './IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const { height: screenHeight } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({
  visible,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  size = 'md'
}: ModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(screenHeight);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(screenHeight, { duration: 200 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return { maxHeight: screenHeight * 0.33 };
      case 'lg': return { maxHeight: screenHeight * 0.83 };
      default: return { maxHeight: screenHeight * 0.67 };
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else onClose();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View style={[backdropStyle, styles.backdrop]}>
          <BlurView intensity={20} style={styles.blurView}>
            <TouchableOpacity 
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={onClose}
            />
          </BlurView>
        </Animated.View>

        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              modalStyle,
              styles.modal,
              getSizeStyle(),
              { backgroundColor: colors.background }
            ]}
          >
            {/* Header */}
            <View style={[
              styles.header,
              { borderBottomColor: colors.border }
            ]}>
              {title && (
                <Text style={[
                  styles.title,
                  { color: colors.text }
                ]}>
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    { backgroundColor: colors.surface }
                  ]}
                >
                  <IconSymbol name="xmark" size={20} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>

            {/* Content */}
            <View style={styles.content}>
              {description && (
                <Text style={[
                  styles.description,
                  { color: colors.textMuted }
                ]}>
                  {description}
                </Text>
              )}
              {children}
            </View>

            {/* Actions */}
            {(confirmText || cancelText) && (
              <View style={[
                styles.actions,
                { borderTopColor: colors.border }
              ]}>
                {cancelText && (
                  <Button
                    title={cancelText}
                    onPress={handleCancel}
                    variant="outline"
                    style={styles.actionButton}
                  />
                )}
                {confirmText && onConfirm && (
                  <Button
                    title={confirmText}
                    onPress={onConfirm}
                    variant="primary"
                    style={styles.actionButton}
                  />
                )}
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    flex: 1,
  },
  backdropTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  description: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
  },
});