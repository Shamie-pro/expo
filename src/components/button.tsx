import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { colors } from '../theme'

type Variant = 'primary' | 'outline' | 'ghost'

interface BtnProps extends TouchableOpacityProps {
  label: string
  variant?: Variant
  loading?: boolean
}

const container: Record<Variant, string> = {
  primary: 'bg-sun-400',
  outline: 'bg-transparent border-2 border-seed-700',
  ghost: 'bg-transparent',
}
const text: Record<Variant, string> = {
  primary: 'text-seed-900',
  outline: 'text-seed-700',
  ghost: 'text-seed-500',
}

export default function Button({ label, variant = 'primary', loading = false, disabled, className, ...props }: BtnProps) {
  const off = disabled || loading
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={off}
      className={`h-14 rounded-full items-center justify-center ${container[variant]} ${off ? 'opacity-60' : ''} ${className ?? ''}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.seed900} />
      ) : (
        <Text className={`text-lg font-bold ${text[variant]}`}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}
