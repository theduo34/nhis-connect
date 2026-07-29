import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/common/Text';

interface MenuSectionProps {
  title?: string;
  children: ReactNode;
  /** 'card' groups rows in a white rounded container; 'flat' sits directly on the page background. */
  variant?: 'card' | 'flat';
}

export default function MenuSection({ title, children, variant = 'card' }: MenuSectionProps) {
  const items = Children.toArray(children);

  return (
    <View className="mb-6">
      {title && (
        <Text className="text-muted mb-2 px-1 text-xs font-semibold uppercase">{title}</Text>
      )}
      <View className={variant === 'card' ? 'bg-surface overflow-hidden rounded-2xl' : ''}>
        {items.map((child, index) => (
          <Fragment key={index}>
            {child}
            {index < items.length - 1 && <View className="border-border ml-8 border-b" />}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
