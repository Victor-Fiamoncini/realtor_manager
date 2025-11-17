import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import { CustomFormField } from '@/components/app-form-field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { ApplicationFormData, applicationSchema } from '@/lib/schemas'
import { useCreateApplicationMutation, useGetAuthUserQuery } from '@/state/api'

const ApplicationModal = ({ isOpen, onClose, propertyId }) => {
  const [createApplication] = useCreateApplicationMutation()

  const { data: user } = useGetAuthUserQuery()

  const form =
    useForm <
    ApplicationFormData >
    {
      resolver: zodResolver(applicationSchema),
      defaultValues: {
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
      },
    }

  const handleFormSubmit = async (data) => {
    if (!user || user.userRole !== 'tenant') {
      console.error('You must be logged in as a tenant to submit an application')

      return
    }

    await createApplication({
      ...data,
      applicationDate: new Date().toISOString(),
      status: 'Pending',
      propertyId: propertyId,
      tenantCognitoId: user.cognitoInfo.userId,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle>Submit Application for this Property</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <CustomFormField name="name" label="Name" type="text" placeholder="Enter your full name" />

            <CustomFormField name="email" label="Email" type="email" placeholder="Enter your email address" />

            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              type="text"
              placeholder="Enter your phone number"
            />

            <CustomFormField
              name="message"
              label="Message (Optional)"
              type="textarea"
              placeholder="Enter any additional information"
            />

            <Button className="w-full cursor-pointer" title="Submit Application" type="submit">
              Submit Application
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationModal
