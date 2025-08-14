import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius, TouchTargets } from '../../constants/Colors';
import { Button } from './Button';
import { IconSymbol } from './IconSymbol';
import * as Haptics from 'expo-haptics';

interface TaskCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: NewTask) => void;
}

interface NewTask {
  title: string;
  category: string;
  due_date: string;
  due_time?: string;
  priority: 'low' | 'medium' | 'high';
}

const categories = [
  { id: 'planting', name: 'Planting', icon: '🌱', color: Colors.light.success },
  { id: 'irrigation', name: 'Irrigation', icon: '💧', color: Colors.light.info },
  { id: 'harvesting', name: 'Harvesting', icon: '🌾', color: Colors.light.accent },
  { id: 'fertilizing', name: 'Fertilizing', icon: '🧪', color: '#8B5CF6' },
  { id: 'weeding', name: 'Weeding', icon: '🌿', color: '#EF4444' },
  { id: 'pest_control', name: 'Pest Control', icon: '🐛', color: Colors.light.warning },
];

const priorities = [
  { id: 'low', name: 'Low', color: Colors.light.success },
  { id: 'medium', name: 'Medium', color: Colors.light.warning },
  { id: 'high', name: 'High', color: Colors.light.error },
];

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [task, setTask] = useState<NewTask>({
    title: '',
    category: 'planting',
    due_date: new Date().toISOString().split('T')[0],
    due_time: '',
    priority: 'medium',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleSave = () => {
    if (!task.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(task);
    setTask({
      title: '',
      category: 'planting',
      due_date: new Date().toISOString().split('T')[0],
      due_time: '',
      priority: 'medium',
    });
    onClose();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return 'Set time';
    return timeString;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedDate) {
      const timeString = selectedDate.toTimeString().slice(0, 5);
      setTask(prev => ({ ...prev, due_time: timeString }));
      setSelectedTime(selectedDate);
    }
  };

  const showTimePickerModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTimePicker(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={Colors.light.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Task</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Task Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.textInput}
              value={task.title}
              onChangeText={(text) => setTask(prev => ({ ...prev, title: text }))}
              placeholder="What needs to be done?"
              placeholderTextColor={Colors.light.textMuted}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    task.category === category.id && styles.categoryButtonSelected,
                    { borderColor: category.color },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTask(prev => ({ ...prev, category: category.id }));
                  }}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    task.category === category.id && styles.categoryTextSelected,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity style={styles.dateButton}>
                <IconSymbol name="calendar" size={20} color={Colors.light.primary} />
                <Text style={styles.dateText}>
                  {formatDateForDisplay(task.due_date)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Time (Optional)</Text>
            <TouchableOpacity style={styles.timeButton} onPress={showTimePickerModal}>
              <IconSymbol name="clock" size={20} color={Colors.light.primary} />
              <Text style={[
                styles.timeText,
                !task.due_time && styles.timeTextPlaceholder
              ]}>
                {formatTimeForDisplay(task.due_time)}
              </Text>
              {task.due_time && (
                <TouchableOpacity
                  onPress={() => setTask(prev => ({ ...prev, due_time: '' }))}
                  style={styles.clearTimeButton}
                >
                  <IconSymbol name="xmark.circle.fill" size={20} color={Colors.light.textMuted} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  style={[
                    styles.priorityButton,
                    task.priority === priority.id && styles.priorityButtonSelected,
                    { borderColor: priority.color },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTask(prev => ({ ...prev, priority: priority.id as any }));
                  }}
                >
                  <Text style={[
                    styles.priorityText,
                    task.priority === priority.id && { color: priority.color },
                  ]}>
                    {priority.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={handleClose}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
          <Button
            title="Save Task"
            onPress={handleSave}
            variant="primary"
            size="large"
            style={styles.saveButton}
          />
        </View>
      </SafeAreaView>
      
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    fontFamily: Typography.families.primary,
  },
  placeholder: {
    width: TouchTargets.minimum,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    marginBottom: Spacing.md,
    fontFamily: Typography.families.primary,
  },
  textInput: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minHeight: TouchTargets.large,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: TouchTargets.large,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.light.primary + '10',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.textSecondary,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.semibold,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minHeight: TouchTargets.comfortable,
  },
  dateText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
    fontWeight: Typography.weights.medium,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.light.border,
    minHeight: TouchTargets.comfortable,
  },
  timeText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  timeTextPlaceholder: {
    color: Colors.light.textMuted,
  },
  clearTimeButton: {
    padding: Spacing.xs,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    minHeight: TouchTargets.comfortable,
  },
  priorityButtonSelected: {
    backgroundColor: Colors.light.primary + '10',
  },
  priorityText: {
    fontSize: Typography.sizes.base,
    color: Colors.light.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});