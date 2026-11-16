import { Flower2 } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../theme'

type Props = { subtitle: string }

export default function AuthHero({ subtitle }: Props) {
  const { top } = useSafeAreaInsets()
  return (
    <View className='bg-sun-300 items-center px-8 pb-16 rounded-b-[48px]' style={{ paddingTop: top + 28 }}>
      <View className='h-24 w-24 rounded-full bg-seed-900 items-center justify-center border-4 border-sun-100'>
        <Flower2 size={52} color={colors.sun300} />
      </View>
      <Text className='mt-4 text-4xl tracking-widest text-seed-900' style={{ fontFamily: 'CutePunch' }}>AM-AM</Text>
      <Text className='mt-1 text-center text-base text-seed-700'>{subtitle}</Text>
    </View>
  )
}
