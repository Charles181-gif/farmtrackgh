import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
const { TextInput } = require('react-native');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const HarvestSchema = Yup.object().shape({
  cropType: Yup.string().required('Crop type is required'),
  quantity: Yup.string().required('Quantity is required'),
  notes: Yup.string(),
});

const ExpenseSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  amount: Yup.string().required('Amount is required'),
  notes: Yup.string(),
});

// Crop types for the picker
const cropTypes = [
  'Maize',
  'Yam',
  'Cassava',
  'Plantain',
  'Rice',
  'Soybeans',
  'Groundnuts',
  'Vegetables',
  'Other',
];

// Expense categories for the picker
const expenseCategories = [
  'Seeds',
  'Fertilizer',
  'Pesticides',
  'Labor',
  'Equipment',
  'Transportation',
  'Storage',
  'Other',
];

export default function LogScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'harvest' | 'expense'>('harvest');

  const handleHarvestSubmit = async (values: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('harvests')
        .insert({
          user_id: user.id,
          crop_type: values.cropType,
          quantity_kg: parseFloat(values.quantity) || 0,
          date: new Date().toISOString().split('T')[0],
          notes: values.notes,
        });
      
      if (error) throw error;
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Harvest logged successfully!');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to log harvest');
    }
  };

  const handleExpenseSubmit = async (values: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          category: values.category,
          amount: parseFloat(values.amount) || 0,
          date: new Date().toISOString().split('T')[0],
          notes: values.notes,
        });
      
      if (error) throw error;
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Expense logged successfully!');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to log expense');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Text style={styles.title}>Log Entry</Text>
        <Text style={styles.subtitle}>Track your harvests and expenses</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'harvest' && styles.activeTab]}
            onPress={() => setActiveTab('harvest')}
          >
            <Text style={[styles.tabText, activeTab === 'harvest' && styles.activeTabText]}>Harvest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'expense' && styles.activeTab]}
            onPress={() => setActiveTab('expense')}
          >
            <Text style={[styles.tabText, activeTab === 'expense' && styles.activeTabText]}>Expense</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'harvest' && (
          <View style={styles.formCard}>
            <Formik
              initialValues={{ cropType: '', quantity: '', notes: '' }}
              validationSchema={HarvestSchema}
              onSubmit={handleHarvestSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View>
                  <Text style={styles.formTitle}>Log Harvest</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Crop Type</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="leaf.fill" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter crop type"
                        placeholderTextColor="#9CA3AF"
                        value={values.cropType}
                        onChangeText={handleChange('cropType')}
                        onBlur={handleBlur('cropType')}
                      />
                    </View>
                    {errors.cropType && touched.cropType && (
                      <Text style={styles.errorText}>{errors.cropType}</Text>
                    )}
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantity (kg)</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="scalemass.fill" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter quantity"
                        placeholderTextColor="#9CA3AF"
                        value={values.quantity}
                        onChangeText={handleChange('quantity')}
                        onBlur={handleBlur('quantity')}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.quantity && touched.quantity && (
                      <Text style={styles.errorText}>{errors.quantity}</Text>
                    )}
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="note.text" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Additional details"
                        placeholderTextColor="#9CA3AF"
                        value={values.notes}
                        onChangeText={handleChange('notes')}
                        onBlur={handleBlur('notes')}
                        multiline
                      />
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <LinearGradient colors={['#10B981', '#059669']} style={styles.buttonGradient}>
                      <Text style={styles.buttonText}>
                        {isSubmitting ? 'Logging Harvest...' : 'Log Harvest'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        )}

        {activeTab === 'expense' && (
          <View style={styles.formCard}>
            <Formik
              initialValues={{ category: '', amount: '', notes: '' }}
              validationSchema={ExpenseSchema}
              onSubmit={handleExpenseSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View>
                  <Text style={styles.formTitle}>Log Expense</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="tag.fill" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter expense category"
                        placeholderTextColor="#9CA3AF"
                        value={values.category}
                        onChangeText={handleChange('category')}
                        onBlur={handleBlur('category')}
                      />
                    </View>
                    {errors.category && touched.category && (
                      <Text style={styles.errorText}>{errors.category}</Text>
                    )}
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount (₵)</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="creditcard.fill" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter amount"
                        placeholderTextColor="#9CA3AF"
                        value={values.amount}
                        onChangeText={handleChange('amount')}
                        onBlur={handleBlur('amount')}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.amount && touched.amount && (
                      <Text style={styles.errorText}>{errors.amount}</Text>
                    )}
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="note.text" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Additional details"
                        placeholderTextColor="#9CA3AF"
                        value={values.notes}
                        onChangeText={handleChange('notes')}
                        onBlur={handleBlur('notes')}
                        multiline
                      />
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.buttonGradient}>
                      <Text style={styles.buttonText}>
                        {isSubmitting ? 'Logging Expense...' : 'Log Expense'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
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
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});