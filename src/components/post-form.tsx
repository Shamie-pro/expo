import Button from '@/src/components/button'
import Input from '@/src/components/input'
import { PostInput } from '@/src/lib/posts'
import { User } from 'lucide-react-native'
import { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native'

type Props = {
  initial: PostInput
  submitLabel: string
  onSubmit: (values: PostInput) => Promise<void>
}

export default function PostForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial.name)
  const [title, setTitle] = useState(initial.title)
  const [caption, setCaption] = useState(initial.caption)
  const [image, setImage] = useState(initial.image)
  const [saving, setSaving] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [error, setError] = useState('')

  const hasContent = [title, caption, image].some((value) => value.trim() !== '')
  const canSubmit = name.trim() !== '' && hasContent && !saving

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      await onSubmit({ name, title, caption, image })
    } catch (submitError) {
      console.error(submitError)
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className='flex-1 bg-sun-50'>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Input
          label='Name'
          icon={User}
          placeholder='Name shown on the post'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
        />
        <Input
          label='Title (optional)'
          placeholder='Give it a title'
          value={title}
          onChangeText={setTitle}
        />
        <Input
          label='Caption'
          placeholder='What’s on your mind?'
          value={caption}
          onChangeText={setCaption}
          multiline
        />
        <Input
          label='Image URL'
          placeholder='https://…'
          value={image}
          onChangeText={(value) => {
            setImage(value)
            setPreviewFailed(false)
          }}
          autoCapitalize='none'
          keyboardType='url'
        />

        {image.trim() !== '' && !previewFailed && (
          <Image
            source={{ uri: image.trim() }}
            className='aspect-square w-full rounded-3xl bg-sun-100'
            resizeMode='cover'
            onError={() => setPreviewFailed(true)}
          />
        )}

        {!!error && <Text className='text-red-600'>{error}</Text>}
        <Button label={submitLabel} onPress={submit} disabled={!canSubmit} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
