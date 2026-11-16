import "@/global.css";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font'
import { useEffect } from 'react'

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CutePunch: require('../../assets/fonts/CutePunch.ttf'),
  })

  useEffect(() => {
    if (fontError) console.error('Could not load the CutePunch font.', fontError)
  }, [fontError])

  if (!fontsLoaded && !fontError) return null

  return <Stack screenOptions={{
    headerShown: false
  }} />;
}
