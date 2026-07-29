import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from 'heroui-native';
import { MainContainerProps } from '@/interfaces/constants/maincontainer-props';

/** Standard horizontal margin for every screen — change once, applies everywhere. */
const SCREEN_PADDING = 'px-5';

const MainContainer: React.FC<MainContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  className,
  contentContainerClassName,
}) => {
  const renderSafeChildren = (children: ReactNode) => {
    if (typeof children === 'string') {
      console.warn('MainContainer: String passed as child. Wrapping in Text component.');
      return <Text>{children}</Text>;
    }
    return children;
  };

  return (
    <SafeAreaView className={className ?? 'bg-background flex-1'} style={[styles.container, style]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName={cn(SCREEN_PADDING, contentContainerClassName) as string}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}>
          {renderSafeChildren(children)}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 50,
  },
});

export default MainContainer;
