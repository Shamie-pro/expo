import { ImageSourcePropType } from 'react-native'

export type User = {
  id: string
  name: string
  username: string
  avatar?: ImageSourcePropType
}

export type Profile = User & {
  bio: string
  email: string
  location: string
  birthday: string
  followers: string
  following: string
  avatarUrl: string
  coverImageUrl: string
}

const profileImages = require.context(
  '../../assets/images',
  true,
  /\/profiles\/(me|background)\.png$/
)

function findProfileImage(fileName: string): ImageSourcePropType | undefined {
  const key = `./profiles/${fileName}`
  return profileImages.keys().includes(key) ? profileImages<ImageSourcePropType>(key) : undefined
}

export const DEFAULT_PROFILE_AVATAR = findProfileImage('me.png')
export const DEFAULT_PROFILE_COVER = findProfileImage('background.png')

export const CURRENT_USER: Profile = {
  id: 'me',
  name: 'Shamie Barba',
  username: 'sham.sunny',
  avatar: DEFAULT_PROFILE_AVATAR,
  avatarUrl: '',
  coverImageUrl: '',
  bio: 'Chasing the sun, one post at a time. 🌻',
  email: 'sham@am-am.app',
  location: 'Sunny Valley, CA',
  birthday: 'June 22, 2006',
  followers: '1.2K',
  following: '348',
}


