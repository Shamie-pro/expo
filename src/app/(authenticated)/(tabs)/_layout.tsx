import { colors } from "@/src/theme";
import { Tabs } from "expo-router";
import { Flower2, Home, User } from 'lucide-react-native';
import { Text, View } from "react-native";

function Brand() {
  return (
    <View className="flex-row items-center gap-2">
      <Flower2 size={26} color={colors.seed900} />
      <Text className="text-2xl tracking-widest text-seed-900" style={{ fontFamily: 'CutePunch' }}>AM-AM</Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.sun400 },
        headerTintColor: colors.seed900,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.sun600,
        tabBarInactiveTintColor: colors.seed300,
        tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: colors.sun200 },
        tabBarLabelStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="home" options={{
        title: "Home",
        headerTitle: () => <Brand />,
        tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Me",
        headerTitle: () => (
          <Text style={{ fontFamily: 'CutePunch', fontSize: 22, color: colors.seed900 }}>Me</Text>
        ),
        tabBarIcon: ({ color, size }) => <User color={color} size={size} />
      }} />
    </Tabs>
  )
}
