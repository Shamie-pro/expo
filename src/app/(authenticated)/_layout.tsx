import { colors } from "@/src/theme";
import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Button from "@/src/components/button";
import { loadProfile } from "@/src/lib/profile";

export default function DefaultLayout() {
  const [profileReady, setProfileReady] = useState(false)
  const [profileError, setProfileError] = useState('')

  const initializeProfile = useCallback(() => {
    setProfileError('')
    loadProfile()
      .then(() => setProfileReady(true))
      .catch((error: unknown) => {
        console.error(error)
        setProfileError('Could not load your saved profile.')
      })
  }, [])

  useEffect(() => {
    initializeProfile()
  }, [initializeProfile])

  if (!profileReady) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-sun-50 p-6">
        {profileError ? (
          <>
            <Text className="text-center text-seed-700">{profileError}</Text>
            <Button label="Try again" onPress={initializeProfile} />
          </>
        ) : (
          <ActivityIndicator size="large" color={colors.sun500} />
        )}
      </View>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.sun400 },
        headerTintColor: colors.seed900,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="posts/create" options={{ headerTitle: "Create Post" }} />
      <Stack.Screen name="posts/[id]" options={{ headerTitle: "Post" }} />
    </Stack>
  )
}
