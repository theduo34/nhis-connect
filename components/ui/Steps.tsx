import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import type { StepsProps } from '@/interfaces/components/ui';

const CIRCLE_SIZE = 24;

const Steps: React.FC<StepsProps> = ({ currentStep, totalSteps, label, style, labelStyle }) => {
  return (
    <View className="mb-6" style={style}>
      {label && (
        <Text className="text-foreground mb-4 text-base font-bold" style={labelStyle}>
          {label}
        </Text>
      )}
      <View className="flex-row items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum <= currentStep;
          const isLast = i === totalSteps - 1;
          const connectorComplete = stepNum < currentStep;
          return (
            <React.Fragment key={i}>
              <View
                className={
                  isCompleted
                    ? 'bg-primary items-center justify-center rounded-full'
                    : 'bg-default items-center justify-center rounded-full'
                }
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                <Text
                  className={
                    isCompleted
                      ? 'text-primary-foreground text-sm font-semibold'
                      : 'text-muted text-sm font-semibold'
                  }>
                  {stepNum}
                </Text>
              </View>
              {!isLast && (
                <View
                  className={
                    connectorComplete
                      ? 'bg-primary mx-1 h-0.5 flex-1 rounded-full'
                      : 'bg-border mx-1 h-0.5 flex-1 rounded-full'
                  }
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default Steps;
