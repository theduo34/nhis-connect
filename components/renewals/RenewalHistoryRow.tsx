import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import type { Renewal } from '@/services/renewals.service';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RenewalHistoryRow({ renewal }: { renewal: Renewal }) {
  return (
    <View className="border-border flex-row items-center justify-between border-b px-1 py-3.5">
      <View className="flex-1 pr-3">
        <Text className="text-foreground text-sm font-semibold">
          {renewal.plan} · {renewal.durationMonths} months
        </Text>
        <Text className="text-muted mt-0.5 text-xs">
          Submitted {formatDate(renewal.submittedAt)}
        </Text>
        {renewal.status === 'rejected' && renewal.rejectionReason && (
          <Text className="text-danger mt-1 text-xs">{renewal.rejectionReason}</Text>
        )}
      </View>
      {renewal.status === 'approved' && (
        <View className="bg-success-soft self-start rounded-full px-3 py-1">
          <Text className="text-success-soft-foreground text-xs font-semibold">Approved</Text>
        </View>
      )}
      {renewal.status === 'rejected' && (
        <View className="bg-danger-soft self-start rounded-full px-3 py-1">
          <Text className="text-danger-soft-foreground text-xs font-semibold">Rejected</Text>
        </View>
      )}
      {renewal.status === 'pending' && (
        <View className="bg-accent-soft self-start rounded-full px-3 py-1">
          <Text className="text-accent-soft-foreground text-xs font-semibold">Pending</Text>
        </View>
      )}
    </View>
  );
}
