import { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { Text } from '@/components/common/Text';
import { useOnboardingStore } from '@/store/onboarding';

const SLIDES = [
  {
    title: 'Renew in minutes',
    description: 'Submit your NHIS membership renewal from anywhere — no office visit needed.',
  },
  {
    title: 'Book appointments',
    description: 'Find accredited facilities and schedule a visit that fits your day.',
  },
  {
    title: 'Your card, always with you',
    description: 'Access your digital membership card whenever you need it.',
  },
];

export default function Carousel() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const setHasSeenOnboarding = useOnboardingStore((s) => s.setHasSeenOnboarding);

  const finish = () => {
    setHasSeenOnboarding(true);
    router.replace('/(landing)/welcome');
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    } else {
      finish();
    }
  };

  return (
    <View className="bg-background flex-1">
      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}>
          {SLIDES.map((slide) => (
            <View
              key={slide.title}
              style={{ width }}
              className="flex-1 items-center justify-center px-8">
              <Text className="text-foreground mb-4 text-center text-3xl font-bold">
                {slide.title}
              </Text>
              <Text className="text-muted text-center text-base">{slide.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="mb-6 flex-row justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            className={
              i === index ? 'bg-primary h-2 w-6 rounded-full' : 'bg-default h-2 w-2 rounded-full'
            }
          />
        ))}
      </View>

      <View className="gap-3 px-8 pb-8">
        <Button onPress={next}>{index === SLIDES.length - 1 ? 'Get started' : 'Next'}</Button>
        <Button variant="ghost" onPress={finish}>
          Skip
        </Button>
      </View>
    </View>
  );
}
