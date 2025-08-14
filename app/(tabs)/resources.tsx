import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, StyleSheet, StatusBar } from 'react-native';
const { TextInput } = require('react-native');
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { TaskCreationModal } from '../../components/ui/TaskCreationModal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import * as Haptics from 'expo-haptics';

interface FarmingTip {
  id: string;
  title: string;
  description: string;
  content: string;
}

const categories = [
  { id: '1', name: 'Crops', icon: 'leaf.fill', color: '#22C55E' },
  { id: '2', name: 'Livestock', icon: 'house.fill', color: '#F97316' },
  { id: '3', name: 'Equipment', icon: 'plus', color: '#3B82F6' },
  { id: '4', name: 'Weather', icon: 'cloud.sun.fill', color: '#EAB308' },
  { id: '5', name: 'Market', icon: 'chart.bar.fill', color: '#8B5CF6' },
  { id: '6', name: 'Tips', icon: 'lightbulb.fill', color: '#F59E0B' },
];

const farmingTips = [
  { id: '1', title: 'Soil Testing Guide', description: 'Learn how to test your soil pH and nutrients', content: 'Test soil pH using a digital meter or test strips. Ideal pH for most crops is 6.0-7.0. Add lime to raise pH or sulfur to lower it.' },
  { id: '2', title: 'Crop Rotation Benefits', description: 'Maximize yield with proper crop rotation', content: 'Rotate crops in 3-4 year cycles. Follow heavy feeders (corn) with legumes (beans) then light feeders (root vegetables).' },
  { id: '3', title: 'Pest Management', description: 'Natural methods to control common pests', content: 'Use neem oil for aphids, companion planting with marigolds, and beneficial insects like ladybugs for natural pest control.' },
  { id: '4', title: 'Water Conservation', description: 'Efficient irrigation techniques for your farm', content: 'Use drip irrigation, mulch around plants, water early morning, and collect rainwater in barrels for dry periods.' },
];

const equipmentList = [
  { id: '1', name: 'Tractor', type: 'Heavy Machinery', price: '₵45,000', condition: 'New', description: 'John Deere 5055E utility tractor' },
  { id: '2', name: 'Plow', type: 'Tillage', price: '₵2,500', condition: 'Used', description: '3-bottom moldboard plow' },
  { id: '3', name: 'Sprayer', type: 'Application', price: '₵1,200', condition: 'New', description: 'Backpack sprayer 20L capacity' },
  { id: '4', name: 'Harvester', type: 'Harvesting', price: '₵85,000', condition: 'Used', description: 'Combine harvester for grains' },
  { id: '5', name: 'Irrigation System', type: 'Water Management', price: '₵8,500', condition: 'New', description: 'Drip irrigation kit for 1 acre' },
];

const livestockTips = [
  { id: '1', animal: 'Cattle', title: 'Dairy Cow Care', description: 'Provide clean water, balanced feed, and regular milking schedule. Monitor for mastitis and maintain proper hygiene.' },
  { id: '2', animal: 'Goats', title: 'Goat Management', description: 'Ensure proper shelter, deworming every 3 months, and balanced nutrition. Goats need mineral supplements.' },
  { id: '3', animal: 'Chickens', title: 'Poultry Housing', description: 'Maintain clean coops, provide adequate ventilation, and ensure 14 hours of light for laying hens.' },
  { id: '4', animal: 'Pigs', title: 'Pig Nutrition', description: 'Feed high-protein diet, ensure clean water access, and maintain proper temperature in housing.' },
  { id: '5', animal: 'Sheep', title: 'Sheep Health', description: 'Regular hoof trimming, vaccination schedule, and rotational grazing to prevent parasites.' },
];

const marketPrices = [
  { crop: 'Maize', price: 3.50, unit: 'kg', trend: 'up' },
  { crop: 'Yam', price: 8.00, unit: 'kg', trend: 'stable' },
  { crop: 'Cassava', price: 2.20, unit: 'kg', trend: 'down' },
  { crop: 'Plantain', price: 1.80, unit: 'piece', trend: 'up' },
];

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTip, setSelectedTip] = useState<FarmingTip | null>(null);
  const [showMarketPrices, setShowMarketPrices] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showLivestock, setShowLivestock] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { user } = useAuth();

  const filteredTips = farmingTips.filter(tip => {
    const query = searchQuery.toLowerCase();
    return tip.title.toLowerCase().includes(query) ||
           tip.description.toLowerCase().includes(query) ||
           tip.content.toLowerCase().includes(query);
  });

  const handleCategoryPress = (category: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (category.name === 'Market') {
      setShowMarketPrices(true);
    } else if (category.name === 'Equipment') {
      setShowEquipment(true);
    } else if (category.name === 'Livestock') {
      setShowLivestock(true);
    } else if (category.name === 'Tips') {
      Alert.alert('Farming Tips', 'Browse helpful farming tips below');
    } else {
      setSearchQuery(category.name.toLowerCase());
    }
  };

  const handleTipPress = (tip: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedTip(tip);
  };

  const handleAddTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (newTask: any) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          user_id: user?.id,
          completed: false,
        }]);
      
      if (error) throw error;
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Task created successfully!');
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Text style={styles.title}>Resources</Text>
        <Text style={styles.subtitle}>Farming tips and market insights</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.searchCard}>
          <View style={styles.inputWrapper}>
            <IconSymbol name="magnifyingglass" size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search farming tips and guides..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {categories.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard} onPress={() => handleCategoryPress(item)}>
                <LinearGradient colors={[item.color, item.color + 'CC']} style={styles.categoryIcon}>
                  <IconSymbol name={item.icon} size={24} color="white" />
                </LinearGradient>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Farming Tips</Text>
          {filteredTips.map((tip) => (
            <TouchableOpacity key={tip.id} style={styles.tipCard} onPress={() => handleTipPress(tip)}>
              <View style={styles.tipIcon}>
                <IconSymbol name="lightbulb.fill" size={20} color="#10B981" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddTask}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.actionGradient}>
                <IconSymbol name="plus" size={24} color="white" />
                <Text style={styles.actionText}>Add Task</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowMarketPrices(true)}>
              <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.actionGradient}>
                <IconSymbol name="chart.bar.fill" size={24} color="white" />
                <Text style={styles.actionText}>Market Prices</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!selectedTip} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedTip?.title}</Text>
            <TouchableOpacity onPress={() => setSelectedTip(null)}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>{selectedTip?.content}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showMarketPrices} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Market Prices</Text>
            <TouchableOpacity onPress={() => setShowMarketPrices(false)}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {marketPrices.map((item, index) => (
              <View key={index} style={styles.priceCard}>
                <View>
                  <Text style={styles.cropName}>{item.crop}</Text>
                  <Text style={styles.priceUnit}>per {item.unit}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceAmount}>₵{item.price}</Text>
                  <Text style={[styles.priceTrend, { 
                    color: item.trend === 'up' ? '#10B981' : item.trend === 'down' ? '#EF4444' : '#6B7280' 
                  }]}>
                    {item.trend === 'up' ? '↗️ Rising' : item.trend === 'down' ? '↘️ Falling' : '→ Stable'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showEquipment} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Farm Equipment</Text>
            <TouchableOpacity onPress={() => setShowEquipment(false)}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {equipmentList.map((item, index) => (
              <View key={index} style={styles.equipmentCard}>
                <View style={styles.equipmentHeader}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                  <View style={[styles.conditionBadge, { 
                    backgroundColor: item.condition === 'New' ? '#DCFCE7' : '#FEF3C7' 
                  }]}>
                    <Text style={[styles.conditionText, {
                      color: item.condition === 'New' ? '#16A34A' : '#D97706'
                    }]}>{item.condition}</Text>
                  </View>
                </View>
                <Text style={styles.equipmentType}>{item.type}</Text>
                <Text style={styles.equipmentDescription}>{item.description}</Text>
                <Text style={styles.equipmentPrice}>{item.price}</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={showLivestock} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Livestock Tips</Text>
            <TouchableOpacity onPress={() => setShowLivestock(false)}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {livestockTips.map((item, index) => (
              <View key={index} style={styles.livestockCard}>
                <View style={styles.livestockHeader}>
                  <Text style={styles.livestockName}>{item.title}</Text>
                  <Text style={styles.livestockAge}>{item.animal}</Text>
                </View>
                <Text style={styles.livestockDescription}>{item.description}</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <TaskCreationModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
      />
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  searchCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  formCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  priceTrend: {
    fontSize: 12,
    fontWeight: '500',
  },
  equipmentCard: {
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
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  equipmentType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  equipmentPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  livestockCard: {
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
  livestockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  livestockName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  livestockAge: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  livestockDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});