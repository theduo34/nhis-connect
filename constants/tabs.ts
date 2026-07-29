import type { Ionicons } from '@expo/vector-icons';

export interface TabConfig {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

export const SUBSCRIBER_TABS: TabConfig[] = [
  { name: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'card', label: 'Card', icon: 'card-outline', activeIcon: 'card' },
  { name: 'appointments', label: 'Appointments', icon: 'calendar-outline', activeIcon: 'calendar' },
  { name: 'profile', label: 'Profile', icon: 'person-circle-outline', activeIcon: 'person-circle' },
];

export const ADMIN_TABS: TabConfig[] = [
  { name: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  {
    name: 'renewals',
    label: 'Renewals',
    icon: 'document-text-outline',
    activeIcon: 'document-text',
  },
  { name: 'facilities', label: 'Facilities', icon: 'business-outline', activeIcon: 'business' },
  { name: 'profile', label: 'Profile', icon: 'person-circle-outline', activeIcon: 'person-circle' },
];
