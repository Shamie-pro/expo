import { Eye, EyeOff, LucideIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native'
import { colors } from '../theme'

interface InputProps extends TextInputProps {
  label: string
  icon?: LucideIcon
}

export default function Input({ label, icon: Icon, secureTextEntry, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(true)
  const multiline = !!props.multiline

  return (
    <View className='gap-1.5'>
      <Text className='text-sm font-semibold text-seed-700'>{label}</Text>
      <View
        className={`flex-row px-4 rounded-2xl bg-white border-2 ${multiline ? 'min-h-28 items-start pt-3.5' : 'h-14 items-center'} ${focused ? 'border-sun-400' : 'border-seed-100'}`}
      >
        {Icon && <Icon size={20} color={colors.seed500} />}
        <TextInput
          className={`flex-1 text-base text-seed-900 ${Icon ? 'ml-3' : ''}`}
          placeholderTextColor={colors.seed300}
          textAlignVertical={multiline ? 'top' : 'center'}
          secureTextEntry={secureTextEntry && hidden}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          {...props}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            {hidden ? <Eye size={20} color={colors.seed500} /> : <EyeOff size={20} color={colors.seed500} />}
          </Pressable>
        )}
      </View>
    </View>
  )
}
