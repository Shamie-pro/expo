import AuthHero from '@/src/components/auth-hero'
import Button from '@/src/components/button'
import Input from '@/src/components/input'
import { router } from 'expo-router'
import { Lock, Mail, User } from 'lucide-react-native'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'

export default function Register() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className='flex-1 bg-sun-50'>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
        <AuthHero subtitle='Join the garden and start sharing your sunny moments.' />

        <View className='mx-6 -mt-8 gap-4 rounded-3xl bg-white p-6 shadow-md'>
          <Text className='text-2xl font-extrabold text-seed-900'>Create account</Text>
          <Input label='Name' icon={User} placeholder='Your full name' autoCapitalize='words' />
          <Input
            label='Email'
            icon={Mail}
            placeholder='you@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
          />
          <Input label='Password' icon={Lock} placeholder='••••••••' secureTextEntry />
          <Input label='Confirm Password' icon={Lock} placeholder='••••••••' secureTextEntry />
          <Button label='Register' onPress={() => router.replace('/home')} />
        </View>

        <View className='flex-row justify-center py-8'>
          <Text className='text-seed-700'>Already have an account? </Text>
          <Text className='font-bold text-leaf-600' onPress={() => router.replace('/login')}>
            Login
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
