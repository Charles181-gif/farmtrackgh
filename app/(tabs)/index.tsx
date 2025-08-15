import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Modal } from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { DesignTokens } from '../../constants/DesignSystem';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { TaskCreationModal } from '../../components/ui/TaskCreationModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { supabase } from '../../lib/supabase';
import * as Haptics from 'expo-haptics';
import { NotificationService } from '../../services/NotificationService';
import WeatherService from '../../services/WeatherService';
import WeatherCard from '../../components/WeatherCard';



interface Task {
  id: string;
  title: string;
  category: string;
  due_date: string;
  due_time?: string;
  completed: boolean;
}

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface WeatherData {
  temperature: number;
  temperatureMin: number;
  temperatureMax: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  windDirection: string;
  icon: string;
  location: string;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route?: string;
  badge?: string | number;
}

export default function HomeScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [harvests, setHarvests] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [stats, setStats] = useState({ crops: 0, completed: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Add Task', icon: 'plus.circle.fill', color: '#10B981' },
    { id: '2', title: 'Log Harvest', icon: 'leaf.fill', color: '#059669', route: '/(tabs)/log' },
    { id: '3', title: 'Market Prices', icon: 'chart.line.uptrend.xyaxis', color: '#F59E0B', route: '/(tabs)/resources', badge: 'NEW' },
    { id: '4', title: 'Weather', icon: 'cloud.sun.fill', color: '#3B82F6' },
    { id: '5', title: 'Farm Tips', icon: 'lightbulb.fill', color: '#8B5CF6', route: '/(tabs)/resources' },
    { id: '6', title: 'Expenses', icon: 'creditcard.fill', color: '#EF4444', route: '/(tabs)/log' },
    { id: '7', title: 'Reports', icon: 'chart.bar.fill', color: '#6366F1' },
    { id: '8', title: 'Settings', icon: 'gearshape.fill', color: '#6B7280', route: '/(tabs)/profile' },
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchWeatherData();
      // Request notification permissions
      NotificationService.requestPermissions();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('due_date', { ascending: true })
        .limit(10);
      
      if (tasksData) setTasks(tasksData);

      // Fetch recent harvests
      const { data: harvestsData } = await supabase
        .from('harvests')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(5);
      
      if (harvestsData) setHarvests(harvestsData);

      // Fetch recent expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(5);
      
      if (expensesData) setExpenses(expensesData);

      // Fetch stats
      const { data: statsData } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (statsData) {
        setStats({
          crops: statsData.active_crops || 0,
          completed: statsData.total_tasks - statsData.pending_tasks || 0,
          revenue: statsData.total_harvest_value || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchWeatherData = async () => {
    try {
      setWeatherLoading(true);
      const weatherData = await WeatherService.getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([fetchUserData(), fetchWeatherData()]);
    setRefreshing(false);
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Cancel notification if task is being completed
      if (!task.completed && task.due_time) {
        // Note: We'd need to store notification IDs to cancel specific ones
        // For now, this is a simplified implementation
      }
      
      await fetchUserData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleAddTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (newTask: any) => {
    try {
      const taskData = {
        ...newTask,
        user_id: user?.id,
        completed: false,
        due_time: newTask.due_time && newTask.due_time.trim() ? newTask.due_time : null,
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Schedule notification if task has due time
      if (data && taskData.due_time) {
        await NotificationService.scheduleTaskNotification({
          id: data.id,
          title: data.title,
          due_date: data.due_date,
          due_time: data.due_time,
        });
      }
      
      await fetchUserData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action.title === 'Add Task') {
      setShowTaskModal(true);
    } else if (action.route) {
      router.push(action.route as any);
    } else if (action.title === 'Weather') {
      fetchWeatherData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (action.title === 'Reports') {
      router.push('/(tabs)/reports');
    }
  };

  const todaysTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.due_date === today && !task.completed;
  });

  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const userName = profile?.name || user?.email?.split('@')[0] || 'Farmer';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(100)}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()}, {userName}!</Text>
              <Text style={styles.subtitle}>Let's grow something amazing today</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <View style={styles.avatar}>
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <IconSymbol name="person.fill" size={22} color="#10B981" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}

      >
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.statGradient}>
                <IconSymbol name="leaf.fill" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.statValue}>{stats.crops}</Text>
              <Text style={styles.statLabel}>Active Crops</Text>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.statGradient}>
                <IconSymbol name="checkmark.circle.fill" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.statGradient}>
                <IconSymbol name="chart.bar.fill" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.statValue}>₵{(stats.revenue / 1000).toFixed(1)}k</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </Animated.View>

        {weather && (
          <Animated.View entering={FadeInUp.delay(250)} style={styles.weatherSection}>
            <WeatherCard 
              weatherData={weather}
              onPress={fetchWeatherData}
            />
          </Animated.View>
        )}

        <Animated.View entering={SlideInRight.delay(300)} style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
          >
            {quickActions.map((action, index) => (
              <Animated.View 
                key={action.id}
                entering={FadeInUp.delay(400 + index * 50)}
              >
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction(action)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <IconSymbol name={action.icon} size={22} color="white" />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  {action.badge && (
                    <View style={[styles.badge, { backgroundColor: action.color }]}>
                      <Text style={styles.badgeText}>{action.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500)} style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            {pendingTasksCount > 0 && (
              <View style={styles.taskBadge}>
                <Text style={styles.taskBadgeText}>{pendingTasksCount} pending</Text>
              </View>
            )}
          </View>
          
          <View style={styles.tasksContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading tasks...</Text>
              </View>
            ) : todaysTasks.length > 0 ? (
              todaysTasks.slice(0, 4).map((task, index) => (
                <Animated.View 
                  key={task.id}
                  entering={FadeInUp.delay(600 + index * 100)}
                  style={[styles.taskCard, index === todaysTasks.slice(0, 4).length - 1 && styles.lastTaskCard]}
                >
                  <TouchableOpacity 
                    style={styles.taskCheckbox}
                    onPress={() => handleToggleTask(task.id)}
                  >
                    <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                      {task.completed && (
                        <IconSymbol name="checkmark" size={14} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskTime}>{task.due_time || 'No time set'}</Text>
                      <View style={styles.taskCategory}>
                        <Text style={styles.taskCategoryText}>{task.category}</Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))
            ) : (
              <View style={styles.emptyTasks}>
                <IconSymbol name="checkmark.circle.fill" size={48} color="#10B981" />
                <Text style={styles.emptyTasksTitle}>All caught up!</Text>
                <Text style={styles.emptyTasksText}>No tasks scheduled for today</Text>
              </View>
            )}
            
            {todaysTasks.length > 4 && (
              <TouchableOpacity style={styles.viewAllTasks}>
                <Text style={styles.viewAllTasksText}>View all {todaysTasks.length} tasks</Text>
                <IconSymbol name="chevron.right" size={16} color="#10B981" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600)} style={styles.recordsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Records</Text>
            <TouchableOpacity onPress={() => setShowAllRecords(true)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recordsContainer}>
            <View style={styles.recordColumn}>
              <Text style={styles.recordColumnTitle}>Harvests</Text>
              {harvests.length > 0 ? (
                harvests.slice(0, 3).map((harvest, index) => (
                  <View key={harvest.id} style={styles.recordItem}>
                    <View style={styles.recordIcon}>
                      <IconSymbol name="leaf.fill" size={16} color="#10B981" />
                    </View>
                    <View style={styles.recordContent}>
                      <Text style={styles.recordTitle}>{harvest.crop_type}</Text>
                      <Text style={styles.recordDetail}>{harvest.quantity_kg}kg</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyRecord}>No harvests yet</Text>
              )}
            </View>
            
            <View style={styles.recordColumn}>
              <Text style={styles.recordColumnTitle}>Expenses</Text>
              {expenses.length > 0 ? (
                expenses.slice(0, 3).map((expense, index) => (
                  <View key={expense.id} style={styles.recordItem}>
                    <View style={styles.recordIcon}>
                      <IconSymbol name="creditcard.fill" size={16} color="#EF4444" />
                    </View>
                    <View style={styles.recordContent}>
                      <Text style={styles.recordTitle}>{expense.category}</Text>
                      <Text style={styles.recordDetail}>₵{expense.amount}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyRecord}>No expenses yet</Text>
              )}
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
      
      <TaskCreationModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
      />

      <Modal visible={showAllRecords} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Records</Text>
            <TouchableOpacity onPress={() => setShowAllRecords(false)}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Harvests</Text>
            {harvests.map((harvest, index) => (
              <View key={harvest.id} style={styles.modalRecordItem}>
                <View style={styles.modalRecordIcon}>
                  <IconSymbol name="leaf.fill" size={20} color="#10B981" />
                </View>
                <View style={styles.modalRecordContent}>
                  <Text style={styles.modalRecordTitle}>{harvest.crop_type}</Text>
                  <Text style={styles.modalRecordDetail}>{harvest.quantity_kg}kg - {new Date(harvest.date).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
            
            <Text style={[styles.modalSectionTitle, { marginTop: 24 }]}>Expenses</Text>
            {expenses.map((expense, index) => (
              <View key={expense.id} style={styles.modalRecordItem}>
                <View style={styles.modalRecordIcon}>
                  <IconSymbol name="creditcard.fill" size={20} color="#EF4444" />
                </View>
                <View style={styles.modalRecordContent}>
                  <Text style={styles.modalRecordTitle}>{expense.category}</Text>
                  <Text style={styles.modalRecordDetail}>₵{expense.amount} - {new Date(expense.date).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  quickActionCard: {
    width: 100,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
  },
  tasksSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  taskBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  taskBadgeText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  tasksContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastTaskCard: {
    borderBottomWidth: 0,
  },
  taskCheckbox: {
    marginRight: 16,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  taskCategory: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  taskCategoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  emptyTasks: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTasksText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  viewAllTasks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewAllTasksText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 4,
  },
  weatherSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recordsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  viewAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  recordsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    gap: 20,
  },
  recordColumn: {
    flex: 1,
  },
  recordColumnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordContent: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  recordDetail: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyRecord: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  modalRecordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  modalRecordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalRecordContent: {
    flex: 1,
  },
  modalRecordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalRecordDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
});