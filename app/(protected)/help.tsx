import { View } from 'react-native';
import { Text } from '@/components/common/Text';
import MainContainer from '@/components/common/MainContainer';
import { BackArrow } from '@/components/ui/BackArrow';
import MenuSection from '@/components/profile/MenuSection';

const FAQS = [
  {
    question: 'How do I renew my NHIS membership?',
    answer:
      'Go to the Card tab and follow the renewal prompts — your renewal status updates once it’s processed.',
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'Open the Appointments tab, choose an accredited facility, and pick a time that works for you.',
  },
  {
    question: "I haven't received my verification code",
    answer: 'Check your spam folder, or tap Resend on the verification screen for a new code.',
  },
  {
    question: 'How do I update my personal details?',
    answer: 'Go to Profile → Account settings to update your name, phone number, and region.',
  },
];

export default function Help() {
  return (
    <MainContainer contentContainerClassName="flex-1">
      <View className="flex-row items-center pb-2 pt-1">
        <BackArrow size={40} />
      </View>
      <Text className="text-foreground mb-6 mt-2 text-2xl font-bold">Help</Text>
      <MenuSection>
        {FAQS.map((faq) => (
          <View key={faq.question} className="gap-1 px-4 py-3.5">
            <Text className="text-foreground font-semibold">{faq.question}</Text>
            <Text className="text-muted text-sm">{faq.answer}</Text>
          </View>
        ))}
      </MenuSection>
    </MainContainer>
  );
}
