import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { fonts } from '@/constants/fonts';
import { FontSizes } from '@/constants/typography';

interface CustomTextProps extends TextProps {
  variant?: 'body' | 'title' | 'subtitle' | 'caption';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  className?: string;
}

const variantFontSize = {
  body: FontSizes.body,
  title: FontSizes.title,
  subtitle: FontSizes.subtitle,
  caption: FontSizes.caption,
} as const;

const weightFontFamily = {
  regular: fonts.regular,
  medium: fonts.medium,
  semiBold: fonts.semibold,
  bold: fonts.bold,
} as const;

/**
 * Poppins is loaded as separate font files per weight (not a variable font),
 * so `fontWeight` alone (what className="font-bold" produces) doesn't render
 * bold — the actual `fontFamily` has to switch to the bold file. This reads
 * the weight back out of className so Tailwind weight utilities still work.
 */
function resolveWeightFromClassName(className?: string): CustomTextProps['weight'] | undefined {
  if (!className) return undefined;
  if (/\bfont-bold\b/.test(className)) return 'bold';
  if (/\bfont-semibold\b/.test(className)) return 'semiBold';
  if (/\bfont-medium\b/.test(className)) return 'medium';
  return undefined;
}

/**
 * className (Tailwind/Uniwind) drives color — this component must NOT set an
 * inline `color` of its own (e.g. a hardcoded fallback), since inline style
 * wins over className and would silently override things like
 * `className="text-white"` on a dark card with a fallback dark color. Pass
 * `style={{ color: ... }}` only when you deliberately want to override
 * className from a caller.
 */
export const Text: React.FC<CustomTextProps> = ({
  style,
  className,
  variant = 'body',
  weight = 'regular',
  children,
  ...props
}) => {
  const resolvedWeight = resolveWeightFromClassName(className) ?? weight;
  return (
    <RNText
      className={className}
      style={[
        styles.base,
        {
          fontSize: variantFontSize[variant],
          fontFamily: weightFontFamily[resolvedWeight],
        },
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.regular,
  },
});
