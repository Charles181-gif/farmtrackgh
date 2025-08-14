import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Image } from 'react-native';
const { TextInput } = require('react-native');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { supabase } from '../../lib/supabase';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { LegalModal } from '../../components/ui/LegalModal';
import * as Haptics from 'expo-haptics';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  phone: Yup.string(),
  location: Yup.string(),
});

interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  farm_type: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, loading, refreshProfile, updateProfile: updateProfileContext } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLegal, setShowLegal] = useState<'terms' | 'privacy' | null>(null);



  const updateProfile = async (values: any) => {
    try {
      setSaving(true);
      await updateProfileContext({
        name: values.name,
        phone: values.phone,
        location: values.location,
      });
      
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    Alert.alert('Coming Soon', 'Profile picture upload will be available soon!');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#10B981" />
        <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <Animated.View entering={FadeInUp.delay(100)}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <IconSymbol name="gearshape.fill" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarTouchable}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
              ) : (
                <LinearGradient colors={['#10B981', '#059669']} style={styles.avatar}>
                  <IconSymbol name="person.fill" size={32} color="white" />
                </LinearGradient>
              )}
              <View style={styles.cameraIcon}>
                <IconSymbol name="camera.fill" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.name || 'Username'}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#10B981' }]}>
                <IconSymbol name="leaf.fill" size={20} color="white" />
              </View>
              <Text style={styles.statLabel}>Farmer</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F6' }]}>
                <IconSymbol name="calendar" size={20} color="white" />
              </View>
              <Text style={styles.statLabel}>
                {profile?.created_at ? new Date(profile.created_at).getFullYear() : 'New'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.infoCard}>
          {isEditing ? (
            <Formik
              initialValues={{
                name: profile?.name || '',
                phone: profile?.phone || '',
                location: profile?.location || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={updateProfile}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <Text style={styles.cardTitle}>Edit Profile</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="person" size={20} color="#6B7280" />
                      <TextInput
                        style={[styles.textInput, errors.name && touched.name && styles.inputError]}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholder="Enter your full name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    {errors.name && touched.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="phone" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <View style={styles.inputWrapper}>
                      <IconSymbol name="location" size={20} color="#6B7280" />
                      <TextInput
                        style={styles.textInput}
                        onChangeText={handleChange('location')}
                        onBlur={handleBlur('location')}
                        value={values.location}
                        placeholder="Enter your location"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>



                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={() => handleSubmit()}
                      disabled={saving}
                    >
                      <Text style={styles.primaryButtonText}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          ) : (
            <View>
              <Text style={styles.cardTitle}>Profile Information</Text>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{profile?.name || 'Not set'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile?.email}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{profile?.location || 'Not set'}</Text>
              </View>
              


              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <IconSymbol name="pencil" size={20} color="#10B981" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Legal</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.legalButton]}
            onPress={() => setShowLegal('terms')}
          >
            <IconSymbol name="doc.text" size={20} color="#6B7280" />
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.legalButton]}
            onPress={() => setShowLegal('privacy')}
          >
            <IconSymbol name="lock.shield" size={20} color="#6B7280" />
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Account Actions</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <IconSymbol name="arrow.right.square" size={20} color="white" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
      
      {showLegal && (
        <LegalModal
          visible={!!showLegal}
          onClose={() => setShowLegal(null)}
          type={showLegal}
        />
      )}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    flex: 1,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#F0FDF4',
    marginTop: 16,
  },
  editButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  legalButton: {
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  legalButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});