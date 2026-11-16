import PostCard from '@/src/components/post-card';
import { fetchPost, Post } from '@/src/lib/posts';
import { colors } from '@/src/theme';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function PostById() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [post, setPost] = useState<Post>()
    const [loading, setLoading] = useState(true)

    useFocusEffect(useCallback(() => {
        fetchPost(id)
            .then(setPost)
            .catch(console.log)
            .finally(() => setLoading(false))
    }, [id]))

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-sun-50">
                <ActivityIndicator size="large" color={colors.sun500} />
            </View>
        )
    }

    if (!post) {
        return (
            <View className="flex-1 items-center justify-center bg-sun-50 p-6">
                <Text className="text-seed-700">This post could not be found.</Text>
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-sun-50" contentContainerStyle={{ padding: 16 }}>
            <PostCard post={post} detail />
        </ScrollView>
    )
}
