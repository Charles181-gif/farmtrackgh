import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './IconSymbol';

interface LegalModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const termsContent = `
TERMS OF SERVICE

Last updated: ${new Date().getFullYear()}

1. ACCEPTANCE OF TERMS
By using FarmTrack, you agree to these terms.

2. USE OF SERVICE
- You must be 18+ to use this service
- Provide accurate information
- Use service for lawful purposes only

3. USER ACCOUNTS
- Keep login credentials secure
- Responsible for all account activity
- Notify us of unauthorized access

4. DATA AND PRIVACY
- We collect farming data you provide
- Data used to improve service
- See Privacy Policy for details

5. PROHIBITED ACTIVITIES
- No illegal or harmful content
- No interference with service
- No unauthorized access attempts

6. LIMITATION OF LIABILITY
Service provided "as is" without warranties.

7. CHANGES TO TERMS
We may update terms with notice.

Contact: support@farmtrack.com
`;

const privacyContent = `
PRIVACY POLICY

Last updated: ${new Date().getFullYear()}

1. INFORMATION WE COLLECT
- Account information (name, email)
- Farm data (harvests, expenses, tasks)
- Usage analytics

2. HOW WE USE INFORMATION
- Provide farming services
- Improve app functionality
- Send important updates

3. INFORMATION SHARING
- We don't sell personal data
- May share with service providers
- Required by law when necessary

4. DATA SECURITY
- Encrypted data transmission
- Secure cloud storage
- Regular security updates

5. YOUR RIGHTS
- Access your data
- Request data deletion
- Update information anytime

6. DATA RETENTION
- Keep data while account active
- Delete upon account closure
- Some data kept for legal requirements

7. COOKIES AND TRACKING
- Essential cookies only
- No third-party tracking
- Analytics for app improvement

8. CONTACT US
Questions about privacy:
Email: privacy@farmtrack.com
`;

export function LegalModal({ visible, onClose, type }: LegalModalProps) {
  const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';
  const content = type === 'terms' ? termsContent : privacyContent;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>{content}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
});