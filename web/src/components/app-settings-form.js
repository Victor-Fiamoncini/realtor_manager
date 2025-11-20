import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { CustomFormField } from '@/components/app-form-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { settingsSchema } from '@/lib/schemas'

const AppSettingsForm = ({ initialData, onSubmit, userType }) => {
  const [editMode, setEditMode] = useState(false)

  const form = useForm({ resolver: zodResolver(settingsSchema), defaultValues: initialData })

  const handleToggleEditMode = () => {
    setEditMode(!editMode)

    if (editMode) form.reset(initialData)
  }

  const handleSubmit = async (data) => {
    await onSubmit(data)

    setEditMode(false)
  }

  return (
    <div className="px-8 pt-8 pb-5">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">{`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}</h1>

        <p className="mt-1 text-sm text-gray-500">Manage your account preferences and personal information</p>
      </div>

      <div className="rounded-xl bg-white p-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <CustomFormField name="name" label="Name" disabled={!editMode} />

            <CustomFormField name="email" label="Email" type="email" disabled={!editMode} />

            <CustomFormField name="phoneNumber" label="Phone Number" disabled={!editMode} />

            <div className="flex items-center gap-4 pt-4">
              <Button
                className="cursor-pointer"
                type="button"
                title={editMode ? 'Cancel' : 'Edit'}
                onClick={handleToggleEditMode}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </Button>

              {editMode && (
                <Button className="cursor-pointer" type="submit" title="Save Changes">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AppSettingsForm
