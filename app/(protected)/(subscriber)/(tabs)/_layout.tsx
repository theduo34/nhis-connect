import { Tabs } from 'expo-router';
import BottomTabBar from '@/components/navigation/BottomTabBar';
import { SUBSCRIBER_TABS } from '@/constants/tabs';

export default function SubscriberTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} tabs={SUBSCRIBER_TABS} />}>
      {SUBSCRIBER_TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
