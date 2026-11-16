import Avatar from '@/src/components/avatar'
import Button from '@/src/components/button'
import Input from '@/src/components/input'
import { CURRENT_USER, DEFAULT_PROFILE_AVATAR, DEFAULT_PROFILE_COVER, Profile } from '@/src/data/users'
import { fetchPosts, isMine, Post } from '@/src/lib/posts'
import { EditableProfile, saveProfile } from '@/src/lib/profile'
import { colors } from '@/src/theme'
import { router, useFocusEffect } from 'expo-router'
import { AtSign, Cake, Image as ImageIcon, LayoutGrid, LucideIcon, Mail, MapPin, User, X } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Image, ImageSourcePropType, Modal, Pressable, ScrollView, Text, View } from 'react-native'

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <View className='flex-1 items-center'>
      <Text className='text-xl font-extrabold text-seed-900'>{value}</Text>
      <Text className='text-sm text-seed-500'>{label}</Text>
    </View>
  )
}

function Detail({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <View className='flex-row items-center gap-3'>
      <View className='h-9 w-9 items-center justify-center rounded-full bg-sun-100'>
        <Icon size={18} color={colors.seed700} />
      </View>
      <Text className='flex-1 text-seed-700'>{value}</Text>
    </View>
  )
}

function editableValues(profile: Profile): EditableProfile {
  return {
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    email: profile.email,
    location: profile.location,
    birthday: profile.birthday,
    avatarUrl: profile.avatarUrl,
    coverImageUrl: profile.coverImageUrl,
  }
}

export default function ProfileScreen() {
  const [user, setUser] = useState<Profile>({ ...CURRENT_USER })
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<EditableProfile>(() => editableValues(CURRENT_USER))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [viewingImage, setViewingImage] = useState<{ source: ImageSourcePropType; label: string } | null>(null)
  const [coverImageFailed, setCoverImageFailed] = useState(false)
  const [avatarPreviewFailed, setAvatarPreviewFailed] = useState(false)
  const [coverPreviewFailed, setCoverPreviewFailed] = useState(false)

  useFocusEffect(useCallback(() => {
    setUser({ ...CURRENT_USER })
    fetchPosts()
      .then((all) => setPosts(all.filter(isMine)))
      .catch(console.log)
  }, []))

  const photos = posts.filter((post) => !!post.image)
  const coverSource = user.coverImageUrl ? { uri: user.coverImageUrl } : DEFAULT_PROFILE_COVER
  const avatarPreviewSource = avatarPreviewFailed
    ? undefined
    : draft.avatarUrl
      ? { uri: draft.avatarUrl }
      : DEFAULT_PROFILE_AVATAR
  const coverPreviewSource = coverPreviewFailed
    ? undefined
    : draft.coverImageUrl
      ? { uri: draft.coverImageUrl }
      : DEFAULT_PROFILE_COVER

  const openEditor = () => {
    setDraft(editableValues(user))
    setSaveError('')
    setAvatarPreviewFailed(false)
    setCoverPreviewFailed(false)
    setEditing(true)
  }

  const updateDraft = (field: keyof EditableProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const save = async () => {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await saveProfile(draft)
      setUser({ ...updated })
      setCoverImageFailed(false)
      setEditing(false)
    } catch (error) {
      console.error(error)
      setSaveError(error instanceof Error ? error.message : 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <ScrollView className='flex-1 bg-sun-50' showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='View cover photo'
          disabled={!coverSource || coverImageFailed}
          onPress={() => coverSource && setViewingImage({ source: coverSource, label: 'Cover photo' })}
          className='h-40 items-center justify-center overflow-hidden bg-sun-300'
        >
          {coverSource && !coverImageFailed ? (
            <Image
              source={coverSource}
              resizeMode="cover"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              onError={() => setCoverImageFailed(true)}
            />
          ) : (
            <Text className='text-sm font-semibold text-seed-700'>Add a cover photo in Edit Profile</Text>
          )}
        </Pressable>

        <View className='-mt-14 px-6'>
          <View className='flex-row items-end justify-between'>
            <Pressable
              accessibilityRole='button'
              accessibilityLabel='View profile picture'
              disabled={!user.avatar}
              onPress={() => user.avatar && setViewingImage({ source: user.avatar, label: 'Profile picture' })}
              className='rounded-full border-4 border-sun-50 bg-sun-50'
            >
              <Avatar source={user.avatar} fallbackLabel={user.name} size={104} ring />
            </Pressable>
            <Button
              label='Edit Profile'
              variant='outline'
              className='h-11 px-6'
              style={{ transform: [{ translateY: 10 }] }}
              onPress={openEditor}
            />
          </View>

          <Text className='mt-3 text-2xl font-extrabold text-seed-900'>{user.name}</Text>
          <Text className='text-seed-500'>@{user.username}</Text>
          <Text className='mt-3 leading-5 text-seed-700'>{user.bio}</Text>

          <View className='mt-5 flex-row rounded-3xl border border-sun-200 bg-white py-4'>
            <Stat value={photos.length} label='Posts' />
            <Stat value={user.followers} label='Followers' />
            <Stat value={user.following} label='Following' />
          </View>

          <View className='mt-5 gap-3 rounded-3xl border border-sun-200 bg-white p-4'>
            <Detail icon={Mail} value={user.email} />
            <Detail icon={MapPin} value={user.location} />
            <Detail icon={Cake} value={user.birthday} />
          </View>

          <View className='mb-3 mt-6 flex-row items-center gap-2'>
            <LayoutGrid size={18} color={colors.seed700} />
            <Text className='text-lg font-bold text-seed-900'>My Photos</Text>
          </View>
        </View>

        {photos.length === 0 ? (
          <Text className='px-6 py-6 text-center text-seed-500'>No photos yet.</Text>
        ) : (
          <View className='flex-row flex-wrap px-5'>
            {photos.map((post) => (
              <Pressable
                key={post.id}
                className='w-1/3 p-1'
                onPress={() => router.push({ pathname: '/posts/[id]', params: { id: post.id } })}
              >
                <Image source={{ uri: post.image }} className='aspect-square w-full rounded-xl bg-sun-100' resizeMode='cover' />
              </Pressable>
            ))}
          </View>
        )}

        <View className='px-6 pb-10 pt-6'>
          <Button label='Log out' variant='ghost' onPress={() => router.replace('/login')} />
        </View>
      </ScrollView>

      <Modal visible={editing} animationType='slide' onRequestClose={() => setEditing(false)}>
        <View className='flex-1 bg-sun-50 pt-12'>
          <View className='flex-row items-center justify-between px-6 pb-4'>
            <Text className='text-xl font-extrabold text-seed-900'>Edit Profile</Text>
            <Pressable accessibilityRole='button' accessibilityLabel='Close editor' onPress={() => setEditing(false)} hitSlop={10}>
              <X size={24} color={colors.seed700} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ padding: 24, gap: 16 }}>
            <Input label='Name' icon={User} value={draft.name} onChangeText={(value) => updateDraft('name', value)} autoCapitalize='words' />
            <Input label='Username' icon={AtSign} value={draft.username} onChangeText={(value) => updateDraft('username', value)} autoCapitalize='none' />
            <Input label='Bio' value={draft.bio} onChangeText={(value) => updateDraft('bio', value)} multiline />
            <Input label='Email' icon={Mail} value={draft.email} onChangeText={(value) => updateDraft('email', value)} keyboardType='email-address' autoCapitalize='none' />
            <Input label='Location' icon={MapPin} value={draft.location} onChangeText={(value) => updateDraft('location', value)} />
            <Input label='Birthday' icon={Cake} value={draft.birthday} onChangeText={(value) => updateDraft('birthday', value)} />
            <Input
              label='Profile picture URL'
              icon={ImageIcon}
              placeholder='Optional image URL'
              value={draft.avatarUrl}
              onChangeText={(value) => {
                setAvatarPreviewFailed(false)
                updateDraft('avatarUrl', value)
              }}
              autoCapitalize='none'
              keyboardType='url'
            />
            {avatarPreviewSource ? (
              <Image
                source={avatarPreviewSource}
                className='h-24 w-24 rounded-full bg-sun-100'
                resizeMode='cover'
                onError={() => setAvatarPreviewFailed(true)}
              />
            ) : (
              <View className='h-24 w-24 items-center justify-center rounded-full bg-sun-100'>
                <Text className='text-3xl font-bold text-seed-700'>{draft.name.trim().charAt(0).toUpperCase() || '?'}</Text>
              </View>
            )}
            <Input
              label='Cover picture URL'
              icon={ImageIcon}
              placeholder='Optional image URL'
              value={draft.coverImageUrl}
              onChangeText={(value) => {
                setCoverPreviewFailed(false)
                updateDraft('coverImageUrl', value)
              }}
              autoCapitalize='none'
              keyboardType='url'
            />
            {coverPreviewSource ? (
              <Image
                source={coverPreviewSource}
                className='h-32 w-full rounded-2xl bg-sun-100'
                resizeMode='cover'
                onError={() => setCoverPreviewFailed(true)}
              />
            ) : (
              <View className='h-32 w-full items-center justify-center rounded-2xl bg-sun-200'>
                <Text className='text-sm font-semibold text-seed-700'>Add a cover photo URL to preview it</Text>
              </View>
            )}
            {!!saveError && <Text className='text-red-600'>{saveError}</Text>}
            <Button label='Save Profile' onPress={save} disabled={saving} loading={saving} />
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={viewingImage !== null}
        transparent
        animationType='fade'
        onRequestClose={() => setViewingImage(null)}
      >
        <View className='flex-1 items-center justify-center bg-black'>
          {viewingImage && (
            <Image
              source={viewingImage.source}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
          )}
          <Pressable
            accessibilityRole='button'
            accessibilityLabel='Close image'
            onPress={() => setViewingImage(null)}
            className='absolute right-6 top-14 h-11 w-11 items-center justify-center rounded-full bg-black/60'
          >
            <X size={24} color='white' />
          </Pressable>
          {!!viewingImage && (
            <Text className='absolute bottom-10 text-base font-semibold text-white'>{viewingImage.label}</Text>
          )}
        </View>
      </Modal>
    </>
  )
}
