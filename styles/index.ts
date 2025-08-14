import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Layout
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  itemsCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  textCenter: { textAlign: 'center' },

  // Padding & Margin
  p3: { padding: 12 },
  p4: { padding: 16 },
  p6: { padding: 24 },
  px3: { paddingHorizontal: 12 },
  px4: { paddingHorizontal: 16 },
  px6: { paddingHorizontal: 24 },
  py2: { paddingVertical: 8 },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: 16 },
  mb4: { marginBottom: 16 },
  mb6: { marginBottom: 24 },
  mt2: { marginTop: 8 },

  // Border Radius
  roundedLg: { borderRadius: 8 },
  roundedXl: { borderRadius: 12 },

  // Colors
  bgWhite: { backgroundColor: '#ffffff' },
  bgGray800: { backgroundColor: '#1f2937' },
  bgGreen500: { backgroundColor: '#10b981' },
  bgOrange500: { backgroundColor: '#f97316' },
  bgTransparent: { backgroundColor: 'transparent' },
  
  textWhite: { color: '#ffffff' },
  textGreen500: { color: '#10b981' },
  textGray600: { color: '#4b5563' },
  textGray800: { color: '#1f2937' },

  // Border
  border2: { borderWidth: 2 },
  borderGreen500: { borderColor: '#10b981' },
  borderGray200: { borderColor: '#e5e7eb' },
  borderGray700: { borderColor: '#374151' },

  // Typography
  textSm: { fontSize: 14 },
  textBase: { fontSize: 16 },
  textLg: { fontSize: 18 },
  textXl: { fontSize: 20 },
  text2xl: { fontSize: 24 },
  text3xl: { fontSize: 30 },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: 'bold' },

  // Opacity
  opacity50: { opacity: 0.5 },

  // Shadow
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Button variants
  buttonPrimary: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Button sizes
  buttonSm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonMd: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonLg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },

  // Card variants
  cardDefault: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardOutlined: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  // Dark mode variants
  cardDefaultDark: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardElevatedDark: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardOutlinedDark: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
});