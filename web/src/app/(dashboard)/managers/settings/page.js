'use client'

import { useMemo } from 'react'

import AppSettingsForm from '@/components/app-settings-form'
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from '@/state/api'

const SettingsPage = () => {
  const { data: user, isLoading: isAuthLoading } = useGetAuthUserQuery()

  const [updateManager] = useUpdateManagerSettingsMutation()

  const initialData = useMemo(() => {
    if (!user?.userInfo) return { name: '', email: '', phoneNumber: '' }

    return {
      name: user.userInfo.name,
      email: user.userInfo.email,
      phoneNumber: user.userInfo.phoneNumber,
    }
  }, [user])

  const handleSubmit = async (data) => {
    if (!user?.cognitoInfo) return

    await updateManager({ cognitoId: user.cognitoInfo.userId, ...data })
  }

  if (isAuthLoading) return 'Loading...'

  return <AppSettingsForm initialData={initialData} onSubmit={handleSubmit} userType="manager" />
}

export default SettingsPage
