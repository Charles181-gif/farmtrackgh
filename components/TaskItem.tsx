import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Card from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Task {
  id: string;
  title: string;
  category: string;
  due_date: string;
  due_time?: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onPress?: (task: Task) => void;
}

export default function TaskItem({ task, onToggleComplete, onPress }: TaskItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'planting':
        return 'leaf.fill';
      case 'irrigation':
        return 'drop.fill';
      case 'harvesting':
        return 'scissors';
      case 'fertilizing':
        return 'sparkles';
      case 'weeding':
        return 'trash.fill';
      case 'pest control':
        return 'shield.fill';
      default:
        return 'checkmark.circle.fill';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'planting':
        return colors.success;
      case 'irrigation':
        return colors.info;
      case 'harvesting':
        return colors.accent;
      case 'fertilizing':
        return '#8B5CF6';
      case 'weeding':
        return '#EF4444';
      case 'pest control':
        return '#F59E0B';
      default:
        return colors.primary;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isOverdue = () => {
    const taskDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today && !task.completed;
  };

  return (
    <AnimatedTouchableOpacity
      style={animatedStyle}
      onPress={() => onPress?.(task)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Card 
        style={[
          styles.container,
          { 
            backgroundColor: task.completed 
              ? colors.backgroundMuted 
              : colors.card,
            borderLeftWidth: 4,
            borderLeftColor: isOverdue() 
              ? colors.error 
              : getCategoryColor(task.category)
          }
        ]}
        variant="default"
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => onToggleComplete(task.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              name={task.completed ? 'checkmark.circle.fill' : 'circle'}
              size={28}
              color={task.completed ? colors.success : colors.border}
            />
          </TouchableOpacity>

          <View style={styles.taskInfo}>
            <View style={styles.header}>
              <Text 
                style={[
                  styles.title,
                  { 
                    color: task.completed ? colors.textMuted : colors.text,
                    textDecorationLine: task.completed ? 'line-through' : 'none'
                  }
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              
              <View style={styles.categoryBadge}>
                <IconSymbol
                  name={getCategoryIcon(task.category)}
                  size={16}
                  color={getCategoryColor(task.category)}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.timeInfo}>
                <IconSymbol name="calendar" size={14} color={colors.textSecondary} />
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                  {formatDate(task.due_date)}
                </Text>
                {task.due_time && (
                  <>
                    <IconSymbol name="clock" size={14} color={colors.textSecondary} />
                    <Text style={[styles.time, { color: colors.textSecondary }]}>
                      {formatTime(task.due_time)}
                    </Text>
                  </>
                )}
              </View>

              {isOverdue() && (
                <View style={[styles.overdueBadge, { backgroundColor: colors.error + '20' }]}>
                  <Text style={[styles.overdueText, { color: colors.error }]}>
                    Overdue
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  date: {
    fontSize: 14,
    marginLeft: 4,
    marginRight: 12,
  },
  time: {
    fontSize: 14,
    marginLeft: 4,
  },
  overdueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '600',
  },
});