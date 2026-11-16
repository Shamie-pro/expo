import { router } from 'expo-router'
import { Heart, ImageOff, Pencil, Trash2 } from 'lucide-react-native'
import { useState } from 'react'
import { Image, Modal, Pressable, Text, View } from 'react-native'
import { deletePost, Post, timeAgo } from '../lib/posts'
import { colors } from '../theme'
import Avatar from './avatar'

type Props = {
  post: Post
  /** Detail mode: full text, no navigation on tap. */
  detail?: boolean
  onDeleted?: (id: string) => void
}

export default function PostCard({ post, detail = false, onDeleted }: Props) {
  const [liked, setLiked] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<'confirm' | 'error' | null>(null)

  const open = () => router.push({ pathname: '/posts/[id]', params: { id: post.id } })
  const ago = timeAgo(post.createdAt)
  const likes = liked ? 1 : 0
  const handleEdit = () => {
    router.push({ pathname: '/posts/create', params: { id: post.id } })
  }

  const confirmDelete = async () => {
    setDeleteDialog(null)
    setDeleting(true)
    try {
      await deletePost(post.id)
      if (onDeleted) {
        onDeleted(post.id)
      } else if (detail) {
        router.back()
      }
    } catch (error) {
      console.log(error)
      setDeleteDialog('error')
    } finally {
      setDeleting(false)
    }
  }

  const handleDelete = () => {
    setDeleteDialog('confirm')
  }

  return (
    <View className={`bg-white rounded-3xl overflow-hidden border border-sun-100 ${deleting ? 'opacity-50' : ''}`}>
      <View className='flex-row items-center gap-3 p-4'>
        <Pressable onPress={open} disabled={detail} className='flex-row items-center gap-3 flex-1'>
          <Avatar source={post.author.avatar} fallbackLabel={post.author.name} size={44} ring />
          <View className='flex-1'>
            <Text className='text-base font-bold text-seed-900'>{post.author.name}</Text>
            <Text className='text-sm text-seed-500'>
              @{post.author.username}
              {ago ? ` · ${ago}` : ''}
            </Text>
          </View>
        </Pressable>

        <View className='flex-row items-center gap-2'>
          <Pressable
            onPress={handleEdit}
            hitSlop={8}
            className='h-9 w-9 items-center justify-center rounded-full bg-sun-100'
          >
            <Pencil size={16} color={colors.seed700} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            disabled={deleting}
            hitSlop={8}
            className='h-9 w-9 items-center justify-center rounded-full bg-red-50'
          >
            <Trash2 size={16} color='#DC2626' />
          </Pressable>
        </View>
      </View>

      <Modal
        transparent
        visible={deleteDialog !== null}
        animationType='fade'
        onRequestClose={() => setDeleteDialog(null)}
      >
        <View className='flex-1 items-center justify-center bg-black/50 px-6'>
          <View className='w-full max-w-sm gap-4 rounded-3xl bg-white p-6'>
            <Text className='text-lg font-bold text-seed-900'>
              {deleteDialog === 'error' ? 'Could not delete post' : 'Delete Post'}
            </Text>
            <Text className='leading-5 text-seed-700'>
              {deleteDialog === 'error'
                ? 'Please check your connection and try again.'
                : 'Are you sure you want to delete this post?'}
            </Text>
            <View className='flex-row justify-end gap-3'>
              <Pressable
                onPress={() => setDeleteDialog(null)}
                className='items-center justify-center rounded-full bg-sun-100 px-5 py-3'
              >
                <Text className='font-semibold text-seed-900'>
                  {deleteDialog === 'error' ? 'OK' : 'Cancel'}
                </Text>
              </Pressable>
              {deleteDialog === 'confirm' && (
                <Pressable
                  onPress={() => void confirmDelete()}
                  className='items-center justify-center rounded-full bg-red-600 px-5 py-3'
                >
                  <Text className='font-semibold text-white'>Delete</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Pressable onPress={open} disabled={detail}>
        {!!post.image &&
          (imageFailed ? (
            <View className='w-full aspect-square bg-sun-100 items-center justify-center'>
              <ImageOff size={32} color={colors.seed300} />
            </View>
          ) : (
            <Image
              source={{ uri: post.image }}
              className='w-full aspect-square bg-sun-100'
              resizeMode='cover'
              onError={() => setImageFailed(true)}
            />
          ))}

        <View className='px-4 pt-3 gap-1'>
          {!!post.name && <Text className='text-lg font-bold text-seed-900'>{post.name}</Text>}
          {!!post.description && (
            <Text numberOfLines={detail ? undefined : 3} className='leading-5 text-seed-700'>
              {post.description}
            </Text>
          )}
        </View>
      </Pressable>

      <View className='flex-row items-center px-4 py-3'>
        <Pressable className='flex-row items-center gap-1.5' onPress={() => setLiked((l) => !l)} hitSlop={8}>
          <Heart size={24} color={liked ? colors.like : colors.seed500} fill={liked ? colors.like : 'none'} />
          <Text className='font-semibold text-seed-700'>{likes}</Text>
        </Pressable>
      </View>
    </View>
  )
}
