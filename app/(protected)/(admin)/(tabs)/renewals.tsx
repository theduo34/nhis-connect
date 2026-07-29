import { Text } from '@/components/common/Text';
import CollapsibleScreen from '@/components/navigation/CollapsibleScreen';

export default function AdminRenewals() {
  return (
    <CollapsibleScreen title="Renewals">
      <Text className="text-muted">
        Review and approve or reject subscriber renewal submissions.
      </Text>
    </CollapsibleScreen>
  );
}
