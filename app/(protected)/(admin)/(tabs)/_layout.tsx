import { Tabs } from 'expo-router';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import { ADMIN_TABS } from '@/constants/tabs';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} tabs={ADMIN_TABS} />}>
      {ADMIN_TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
