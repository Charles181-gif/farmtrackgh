import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const categories = [
  { id: 'planting', name: 'Planting', icon: '🌱', color: '#22C55E' },
  { id: 'irrigation', name: 'Irrigation', icon: '💧', color: '#3B82F6' },
  { id: 'harvesting', name: 'Harvesting', icon: '🌾', color: '#F59E0B' },
  { id: 'fertilizing', name: 'Fertilizing', icon: '🧪', color: '#8B5CF6' },
  { id: 'weeding', name: 'Weeding', icon: '🌿', color: '#10B981' },
  { id: 'pest_control', name: 'Pest Control', icon: '🐛', color: '#EF4444' },
];

const priorities = [
  { id: 'low', name: 'Low', color: '#10B981' },
  { id: 'medium', name: 'Medium', color: '#F59E0B' },
  { id: 'high', name: 'High', color: '#EF4444' },
];

export default function AddTaskScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [taskData, setTaskData] = useState({
    title: '',
    category: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    priority: 'medium',
    notes: '',
  });

  const handleSave = () => {
    if (!taskData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if (!taskData.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      category: taskData.category,
      due_date: taskData.dueDate,
      due_time: taskData.dueTime || '08:00',
      priority: taskData.priority,
      notes: taskData.notes,
      completed: false,
    };

    // Store task in AsyncStorage or pass back to home screen
    global.newTask = newTask;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Task created successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeInUp}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        }}
      >
        <TouchableOpacity onPress={handleCancel} style={{ padding: 8 }}>
          <IconSymbol name="xmark" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
          Add New Task
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          {/* Task Title */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Input
              label="Task Title"
              placeholder="What needs to be done?"
              value={taskData.title}
              onChangeText={(text) => setTaskData(prev => ({ ...prev, title: text }))}
            />
          </Animated.View>

          {/* Category Selection */}
          <Animated.View entering={FadeInDown.delay(200)} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
              Category
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTaskData(prev => ({ ...prev, category: category.id }));
                  }}
                  style={{
                    backgroundColor: taskData.category === category.id ? category.color + '20' : colors.card,
                    borderWidth: 2,
                    borderColor: taskData.category === category.id ? category.color : colors.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 20,
                    minWidth: '45%',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>{category.icon}</Text>
                  <Text style={{
                    color: taskData.category === category.id ? category.color : colors.text,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Date and Time */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Due Date"
                  placeholder="Select date"
                  value={new Date(taskData.dueDate).toLocaleDateString()}
                  onChangeText={() => {}}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Due Time"
                  placeholder="08:00"
                  value={taskData.dueTime}
                  onChangeText={(text) => {
                    // Format time input (HH:MM)
                    let formatted = text.replace(/[^0-9:]/g, '');
                    if (formatted.length === 2 && !formatted.includes(':')) {
                      formatted = formatted + ':';
                    }
                    if (formatted.length <= 5) {
                      setTaskData(prev => ({ ...prev, dueTime: formatted }));
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>
          </Animated.View>

          {/* Priority */}
          <Animated.View entering={FadeInDown.delay(400)} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
              Priority
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTaskData(prev => ({ ...prev, priority: priority.id }));
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: taskData.priority === priority.id ? priority.color + '20' : colors.card,
                    borderWidth: 2,
                    borderColor: taskData.priority === priority.id ? priority.color : colors.border,
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: taskData.priority === priority.id ? priority.color : colors.text,
                    fontWeight: '600',
                    fontSize: 16
                  }}>
                    {priority.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Notes */}
          <Animated.View entering={FadeInDown.delay(500)}>
            <Input
              label="Notes (Optional)"
              placeholder="Additional details about the task..."
              value={taskData.notes}
              onChangeText={(text) => setTaskData(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={4}
            />
          </Animated.View>

          {/* Task Preview */}
          {taskData.title && taskData.category && (
            <Animated.View entering={FadeInDown.delay(600)} style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>
                Preview
              </Text>
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>
                    {categories.find(c => c.id === taskData.category)?.icon}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, flex: 1 }}>
                    {taskData.title}
                  </Text>
                  <View style={{
                    backgroundColor: priorities.find(p => p.id === taskData.priority)?.color + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                    <Text style={{
                      color: priorities.find(p => p.id === taskData.priority)?.color,
                      fontSize: 12,
                      fontWeight: '600'
                    }}>
                      {priorities.find(p => p.id === taskData.priority)?.name}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                  {categories.find(c => c.id === taskData.category)?.name}
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  Due: {new Date(taskData.dueDate).toLocaleDateString()}
                  {taskData.dueTime && ` at ${taskData.dueTime}`}
                </Text>
                {taskData.notes && (
                  <Text style={{ color: colors.textMuted, marginTop: 8, fontStyle: 'italic' }}>
                    {taskData.notes}
                  </Text>
                )}
              </Card>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInDown.delay(700)}
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          gap: 12,
        }}
      >
        <Button
          title="Create Task"
          onPress={handleSave}
          variant="primary"
          size="large"
        />
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          size="large"
        />
      </Animated.View>
    </SafeAreaView>
  );
}