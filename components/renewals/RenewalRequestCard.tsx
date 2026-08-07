import { View } from 'react-native';
import { Button } from 'heroui-native';
import { Text } from '@/components/common/Text';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RejectReasonDialog from '@/components/renewals/RejectReasonDialog';
import type { RenewalRequest } from '@/services/admin-renewals.service';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface RenewalRequestCardProps {
  request: RenewalRequest;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export default function RenewalRequestCard({
  request,
  onApprove,
  onReject,
}: RenewalRequestCardProps) {
  return (
    <View
      className="mb-3 gap-3 rounded-2xl bg-white p-5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
      }}>
      <View>
        <Text className="text-foreground text-base font-bold">{request.subjectName}</Text>
        {request.nhisNumber && (
          <Text className="text-muted mt-0.5 text-xs">{request.nhisNumber}</Text>
        )}
      </View>

      <View className="border-border gap-1 border-t pt-3">
        <Text className="text-foreground text-sm">
          {request.plan} · {request.durationMonths} months
        </Text>
        <Text className="text-muted text-xs">
          Submitted {formatDate(request.submittedAt)} · New expiry{' '}
          {formatDate(request.requestedExpiry)}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <RejectReasonDialog
          trigger={
            <Button variant="outline" className="flex-1">
              Reject
            </Button>
          }
          onConfirm={onReject}
        />
        <ConfirmDialog
          trigger={<Button className="flex-1">Approve</Button>}
          title="Approve renewal?"
          description={`${request.subjectName}'s card will be valid until ${formatDate(request.requestedExpiry)}.`}
          confirmLabel="Approve"
          onConfirm={onApprove}
        />
      </View>
    </View>
  );
}
