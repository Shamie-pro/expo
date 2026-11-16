import AsyncStorage from '@react-native-async-storage/async-storage'
import { CURRENT_USER, Profile } from '../data/users'

const PROFILE_STORAGE_KEY = 'shamie.profile'

export type EditableProfile = Pick<
  Profile,
  'name' | 'username' | 'bio' | 'email' | 'location' | 'birthday' | 'avatarUrl' | 'coverImageUrl'
>

function applyProfile(profile: EditableProfile) {
  Object.assign(CURRENT_USER, profile, {
    avatar: profile.avatarUrl ? { uri: profile.avatarUrl } : undefined,
  })
}

export async function loadProfile(): Promise<Profile> {
  const saved = await AsyncStorage.getItem(PROFILE_STORAGE_KEY)
  if (saved === null) return CURRENT_USER

  let parsed: unknown
  try {
    parsed = JSON.parse(saved)
  } catch {
    throw new Error('Saved profile data is invalid. Clear the app storage and try again.')
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Saved profile data is invalid. Clear the app storage and try again.')
  }

  const values = parsed as Partial<EditableProfile>
  const fields: (keyof EditableProfile)[] = [
    'name',
    'username',
    'bio',
    'email',
    'location',
    'birthday',
    'avatarUrl',
    'coverImageUrl',
  ]
  for (const field of fields) {
    if (typeof values[field] !== 'string') {
      throw new Error('Saved profile data is incomplete. Clear the app storage and try again.')
    }
  }

  applyProfile(values as EditableProfile)
  return CURRENT_USER
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export async function saveProfile(input: EditableProfile): Promise<Profile> {
  const profile: EditableProfile = {
    name: input.name.trim(),
    username: input.username.trim().replace(/^@/, ''),
    bio: input.bio.trim(),
    email: input.email.trim(),
    location: input.location.trim(),
    birthday: input.birthday.trim(),
    avatarUrl: input.avatarUrl.trim(),
    coverImageUrl: input.coverImageUrl.trim(),
  }

  if (!profile.name || !profile.username) {
    throw new Error('Name and username are required.')
  }
  if (profile.avatarUrl && !isHttpUrl(profile.avatarUrl)) {
    throw new Error('Profile picture must be a valid http or https image URL.')
  }
  if (profile.coverImageUrl && !isHttpUrl(profile.coverImageUrl)) {
    throw new Error('Cover picture must be a valid http or https image URL.')
  }

  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  applyProfile(profile)
  return CURRENT_USER
}
