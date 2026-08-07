import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common/Text';
import type { MembershipStatus } from '@/services/membership.service';

interface MembershipCardProps {
  name: string;
  nhisNumber?: string | null;
  /** Omit while loading — the card falls back to its default (Card tab) tap target. */
  status?: MembershipStatus | null;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return value;
  return digits.match(/.{1,4}/g)?.join('  ') ?? value;
}

/** Non-null only when the card should surface a renew CTA instead of the plain shield icon. */
function getActionState(status?: MembershipStatus | null): { label: string; tint: string } | null {
  if (status === 'expiring_soon') return { label: 'Renew soon', tint: 'rgba(245, 166, 35, 0.28)' };
  if (status === 'expired') return { label: 'Renew now', tint: 'rgba(240, 68, 56, 0.28)' };
  if (status === 'pending') return { label: 'Renewal pending', tint: 'rgba(255, 255, 255, 0.16)' };
  return null;
}

export default function MembershipCard({ name, nhisNumber, status }: MembershipCardProps) {
  const actionState = getActionState(status);

  const onPress = () => {
    if (actionState) {
      router.push('/(protected)/renew-membership');
      return;
    }
    router.push('/(protected)/(subscriber)/(tabs)/card');
  };

  return (
    <Pressable
      onPress={onPress}
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
            {actionState ? (
              <View
                className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
                style={{ backgroundColor: actionState.tint }}>
                <Ionicons name="alert-circle" size={13} color="#ffffff" />
                <Text className="text-[10px] font-semibold uppercase text-white">
                  {actionState.label}
                </Text>
              </View>
            ) : (
              <Ionicons name="shield-checkmark" size={22} color="#ffffff" />
            )}
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
