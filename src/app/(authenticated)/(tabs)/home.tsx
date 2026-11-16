import Avatar from "@/src/components/avatar";
import Button from "@/src/components/button";
import PostCard from "@/src/components/post-card";
import { CURRENT_USER } from "@/src/data/users";
import { fetchPosts, Post } from "@/src/lib/posts";
import { colors } from "@/src/theme";
import { router, useFocusEffect } from "expo-router";
import { CloudOff, Flower2, Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    try {
      setPosts(await fetchPosts())
      setError(false)
    } catch (e) {
      console.log(e)
      setError(true)
    }
  }, [])

  // Reload whenever the tab is focused (so a new or edited post shows up)
  useFocusEffect(useCallback(() => {
    load().finally(() => setLoading(false))
  }, [load]))

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const composer = (
    <Pressable
      onPress={() => router.push('/posts/create')}
      className="flex-row items-center gap-3 rounded-3xl border border-sun-200 bg-white p-4"
    >
      <Avatar source={CURRENT_USER.avatar} size={44} ring />
      <Text className="flex-1 text-seed-500">Share something sunny…</Text>
      <View className="h-9 w-9 items-center justify-center rounded-full bg-sun-400">
        <Plus size={20} color={colors.seed900} />
      </View>
    </Pressable>
  )

  const empty = loading ? (
    <View className="items-center py-16">
      <ActivityIndicator size="large" color={colors.sun500} />
    </View>
  ) : error ? (
    <View className="items-center gap-3 py-12">
      <CloudOff size={40} color={colors.seed300} />
      <Text className="text-center text-seed-700">Couldn’t load the feed. Check your connection.</Text>
      <Button label="Try again" className="px-8" onPress={() => { setLoading(true); load().finally(() => setLoading(false)) }} />
    </View>
  ) : (
    <View className="items-center gap-3 py-12">
      <Flower2 size={40} color={colors.sun500} />
      <Text className="text-center text-seed-700">No posts yet. Be the first to bloom!</Text>
    </View>
  )

  return (
    <View className="flex-1 bg-sun-50">
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onDeleted={(deletedId) =>
              setPosts((prev) => prev.filter((p) => p.id !== deletedId))
            }
          />
        )}
        ListHeaderComponent={composer}
        ListEmptyComponent={empty}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.sun500} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
