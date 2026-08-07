import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor, useToast } from 'heroui-native';
import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';
import RenewalRequestCard from '@/components/renewals/RenewalRequestCard';
import { useAuthStore } from '@/store/auth';
import {
  approveRenewal,
  fetchPendingRenewals,
  rejectRenewal,
  type RenewalRequest,
} from '@/services/admin-renewals.service';

export default function AdminRenewals() {
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();
  const [requests, setRequests] = useState<RenewalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [muted] = useThemeColor(['muted']);

  const load = useCallback(() => {
    fetchPendingRenewals().then((data) => {
      setRequests(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onApprove = async (request: RenewalRequest) => {
    if (!user) return;
    const { error } = await approveRenewal(request.id, user.id);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't approve renewal", description: error });
      return;
    }
    toast.show({ variant: 'success', label: `Approved ${request.subjectName}'s renewal` });
    load();
  };

  const onReject = async (request: RenewalRequest, reason: string) => {
    if (!user) return;
    const { error } = await rejectRenewal(request.id, user.id, reason);
    if (error) {
      toast.show({ variant: 'danger', label: "Couldn't reject renewal", description: error });
      return;
    }
    toast.show({ variant: 'success', label: `Rejected ${request.subjectName}'s renewal` });
    load();
  };

  return (
    <CollapsibleScreen title="Renewals">
      <Text className="text-muted mb-4 text-sm">
        {isLoading
          ? 'Loading…'
          : `${requests.length} pending renewal request${requests.length === 1 ? '' : 's'}`}
      </Text>

      {!isLoading && requests.length === 0 ? (
        <View
          className="items-center gap-3 rounded-2xl bg-white px-6 py-8"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 1,
          }}>
          <Ionicons name="checkmark-done-circle-outline" size={32} color={muted} />
          <Text className="text-muted text-center text-sm">
            All caught up — no renewals waiting on review.
          </Text>
        </View>
      ) : (
        requests.map((request) => (
          <RenewalRequestCard
            key={request.id}
            request={request}
            onApprove={() => onApprove(request)}
            onReject={(reason) => onReject(request, reason)}
          />
        ))
      )}
    </CollapsibleScreen>
  );
}
