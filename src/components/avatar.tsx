import { Image, ImageSourcePropType, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { colors } from '../theme'

type Props = {
  source?: ImageSourcePropType
  fallbackLabel?: string
  size?: number
  ring?: boolean
}

export default function Avatar({ source, fallbackLabel, size = 44, ring = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  useEffect(() => setImageFailed(false), [source])

  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: ring ? 2 : 0,
    borderColor: colors.sun400,
    backgroundColor: colors.sun100,
  }

  if (!source || imageFailed) {
    return (
      <View style={style} className='items-center justify-center'>
        <Text className='font-bold text-seed-700'>{fallbackLabel?.trim().charAt(0).toUpperCase() || '?'}</Text>
      </View>
    )
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setImageFailed(true)}
    />
  )
}
