import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Spinner, useThemeColor, useToast } from 'heroui-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import Picker from '@/components/ui/Picker';
import StatusBadge from '@/components/card/StatusBadge';
import RenewalHistoryRow from '@/components/renewals/RenewalHistoryRow';
import { useAuthStore } from '@/store/auth';
import { fetchMembershipStatus, type MembershipStatus } from '@/services/membership.service';
import { fetchDependents } from '@/services/dependents.service';
import {
  fetchPendingRenewalFor,
  fetchRenewalHistory,
  submitRenewal,
  type Renewal,
} from '@/services/renewals.service';

const PLAN_OPTIONS = ['Standard', 'Premium'];
const DURATION_OPTIONS = ['6 months', '12 months', '24 months'];
const DURATION_MONTHS: Record<string, number> = {
  '6 months': 6,
  '12 months': 12,
  '24 months': 24,
};

const cardStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function RenewMembership() {
  const { dependentId, dependentName } = useLocalSearchParams<{
    dependentId?: string;
    dependentName?: string;
  }>();
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();
  const onPrimary = useThemeColor('accent-foreground');

  const [status, setStatus] = useState<MembershipStatus | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [pending, setPending] = useState<Renewal | null>(null);
  const [history, setHistory] = useState<Renewal[]>([]);
  const [plan, setPlan] = useState('Standard');
  const [duration, setDuration] = useState('12 months');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const subjectName = dependentId ? (dependentName ?? 'Dependent') : (user?.name ?? 'You');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const [pendingRequest, fullHistory] = await Promise.all([
        fetchPendingRenewalFor(user!.id, dependentId ?? null),
        fetchRenewalHistory(user!.id),
      ]);

      if (dependentId) {
        const dependents = await fetchDependents(user!.id);
        const dependent = dependents.find((d) => d.id === dependentId);
        if (!cancelled) {
          setStatus(dependent?.membershipStatus ?? null);
          setExpiry(dependent?.membershipExpiry ?? null);
        }
      } else {
        const membership = await fetchMembershipStatus(user!.id);
        if (!cancelled) {
          setStatus(membership?.status ?? null);
          setExpiry(membership?.expiry ?? null);
        }
      }

      if (!cancelled) {
        setPending(pendingRequest);
        setHistory(fullHistory.filter((r) => r.dependentId === (dependentId ?? null)));
        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, dependentId]);

  const onSubmit = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await submitRenewal(user.id, {
      dependentId: dependentId ?? null,
      plan,
      durationMonths: DURATION_MONTHS[duration] ?? 12,
      previousExpiry: expiry,
    });
    setIsSaving(false);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't submit renewal", description: error });
      return;
    }
    toast.show({ variant: 'success', label: 'Renewal request submitted' });
    router.back();
  };

  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-1 mt-2 text-2xl font-bold">Renew membership</Text>
      <Text className="text-muted mb-6 text-sm">{subjectName}</Text>

      {isLoading ? (
        <Spinner />
      ) : (
        <View className="gap-6">
          <View className="gap-2 rounded-2xl bg-white p-5" style={cardStyle}>
            <View className="flex-row items-center justify-between">
              <Text className="text-foreground text-base font-bold">Current status</Text>
              {status && <StatusBadge status={status} />}
            </View>
            <Text className="text-muted text-sm">
              {expiry ? `Valid until ${formatDate(expiry)}` : 'No expiry date on file yet'}
            </Text>
          </View>

          {pending ? (
            <View className="gap-1 rounded-2xl bg-white p-5" style={cardStyle}>
              <Text className="text-foreground text-base font-bold">Request under review</Text>
              <Text className="text-muted text-sm">
                Submitted {formatDate(pending.submittedAt)} · {pending.plan} ·{' '}
                {pending.durationMonths} months. You&apos;ll be notified once it&apos;s reviewed.
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              <Picker label="Plan" value={plan} onValueChange={setPlan} items={PLAN_OPTIONS} />
              <Picker
                label="Duration"
                value={duration}
                onValueChange={setDuration}
                items={DURATION_OPTIONS}
              />
              <Button onPress={onSubmit} isDisabled={isSaving} className="mt-2">
                {isSaving ? <Spinner size="sm" color={onPrimary} /> : 'Submit renewal request'}
              </Button>
            </View>
          )}

          {history.length > 0 && (
            <View>
              <Text className="text-foreground mb-1 text-lg font-bold">History</Text>
              {history.map((renewal) => (
                <RenewalHistoryRow key={renewal.id} renewal={renewal} />
              ))}
            </View>
          )}
        </View>
      )}
    </MainContainer>
  );
}
