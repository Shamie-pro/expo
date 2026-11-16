import PostForm from '@/src/components/post-form'
import { CURRENT_USER } from '@/src/data/users'
import { createPost, fetchPost, PostInput, updatePost } from '@/src/lib/posts'
import { colors } from '@/src/theme'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

export default function CreateOrEdit() {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const isEditing = Boolean(id)

    const [initial, setInitial] = useState<PostInput | null>(() =>
        isEditing ? null : { name: CURRENT_USER.name, title: '', caption: '', image: '' }
    )
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        if (!id) {
            setInitial({ name: CURRENT_USER.name, title: '', caption: '', image: '' })
            setLoadError('')
            return
        }

        let active = true
        setInitial(null)
        setLoadError('')
        fetchPost(id)
            .then((post) => {
                if (active) {
                    setInitial({
                        name: post.author.name,
                        title: post.name ?? '',
                        caption: post.description ?? '',
                        image: post.image ?? '',
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                if (active) setLoadError('Could not load post details.')
            })
        return () => {
            active = false
        }
    }, [id])

    if (loadError) {
        return (
            <View className='flex-1 items-center justify-center bg-sun-50 p-6'>
                <Stack.Screen options={{ headerTitle: 'Edit Post' }} />
                <Text className='text-center text-seed-700'>{loadError}</Text>
            </View>
        )
    }

    if (!initial) {
        return (
            <View className='flex-1 items-center justify-center bg-sun-50'>
                <Stack.Screen options={{ headerTitle: 'Edit Post' }} />
                <ActivityIndicator size='large' color={colors.sun500} />
            </View>
        )
    }

    return (
        <>
            <Stack.Screen options={{ headerTitle: isEditing ? 'Edit Post' : 'Create Post' }} />
            <PostForm
                key={id ?? 'create'}
                initial={initial}
                submitLabel={isEditing ? 'Save Changes' : 'Post'}
                onSubmit={async (values) => {
                    if (isEditing && id) {
                        await updatePost(id, values)
                    } else {
                        await createPost(values)
                    }
                    router.back()
                }}
            />
        </>
    )
}
