import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common/Text';

interface MembershipCardProps {
  name: string;
  nhisNumber?: string | null;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return value;
  return digits.match(/.{1,4}/g)?.join('  ') ?? value;
}

export default function MembershipCard({ name, nhisNumber }: MembershipCardProps) {
  return (
    <Pressable
      onPress={() => router.push('/(protected)/(subscriber)/(tabs)/card')}
      className="active:opacity-90"
      style={{
        shadowColor: '#013A40',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
      }}>
      <LinearGradient
        colors={['#0B4A52', '#013A40', '#012024']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ aspectRatio: 1.6, borderRadius: 24, overflow: 'hidden', padding: 22 }}>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: -60,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />

        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase text-white">NHIS Connect</Text>
            <Ionicons name="shield-checkmark" size={22} color="#ffffff" />
          </View>

          <View>
            <Text className="text-[10px] font-semibold uppercase text-white/50">Member</Text>
            <Text className="mt-0.5 text-xl font-bold text-white" numberOfLines={1}>
              {name || 'Your name'}
            </Text>
          </View>

          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-[10px] font-semibold uppercase text-white/50">NHIS number</Text>
              <Text
                className="mt-0.5 text-base font-semibold text-white"
                style={{ letterSpacing: 2 }}>
                {nhisNumber ? formatCardNumber(nhisNumber) : 'Not linked yet'}
              </Text>
            </View>
            <Ionicons name="chevron-forward-circle" size={26} color="rgba(255,255,255,0.85)" />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
