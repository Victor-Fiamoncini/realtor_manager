'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import AppDashboardHeader from '@/components/app-dashboard-header'
import { CustomFormField } from '@/components/app-form-field'
import { Button } from '@/components/ui/button'
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from '@/lib/constants'
import { propertySchema } from '@/lib/schemas'
import { useCreatePropertyMutation, useGetAuthUserQuery } from '@/state/api'
import { Form } from '@/components/ui/form'

const NewPropertyPage = () => {
  const [createProperty] = useCreatePropertyMutation()
  const { data: user } = useGetAuthUserQuery()

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      description: '',
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: '',
      highlights: '',
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  })

  const handleFormSubmit = async (data) => {
    if (!user) throw new Error('Manager not authenticated')

    if (!user.cognitoInfo) throw new Error('No cognito info found for manager')

    if (!user.cognitoInfo.userId) throw new Error('No manager ID found')

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photoUrls') {
        value.forEach((file) => formData.append('photos', file))
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    })

    formData.append('managerCognitoId', user.cognitoInfo.userId)

    await createProperty(formData)
  }

  return (
    <div className="dashboard-container">
      <AppDashboardHeader title="Add New Property" subtitle="Create a new property listing with detailed information" />

      <div className="rounded-xl bg-white p-6">
        <Form {...form}>
          <form className="space-y-10 p-4" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div>
              <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>

              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" />

                <CustomFormField name="description" label="Description" type="textarea" />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-semibold">Fees</h2>

              <CustomFormField name="pricePerMonth" label="Price per Month" type="number" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField name="securityDeposit" label="Security Deposit" type="number" />

                <CustomFormField name="applicationFee" label="Application Fee" type="number" />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-semibold">Property Details</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CustomFormField name="beds" label="Number of Beds" type="number" />

                <CustomFormField name="baths" label="Number of Baths" type="number" />

                <CustomFormField name="squareFeet" label="Square Feet" type="number" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField name="isPetsAllowed" label="Pets Allowed" type="switch" />

                <CustomFormField name="isParkingIncluded" label="Parking Included" type="switch" />
              </div>

              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({ value: type, label: type }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div>
              <h2 className="mb-4 text-lg font-semibold">Amenities and Highlights</h2>

              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  type="select"
                  options={Object.keys(AmenityEnum).map((amenity) => ({ value: amenity, label: amenity }))}
                />

                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  type="select"
                  options={Object.keys(HighlightEnum).map((highlight) => ({ value: highlight, label: highlight }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div>
              <h2 className="mb-4 text-lg font-semibold">Photos</h2>

              <CustomFormField
                className="cursor-pointer"
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-semibold">Additional Information</h2>

              <CustomFormField name="address" label="Address" />

              <div className="flex justify-between gap-4">
                <CustomFormField className="w-full" name="city" label="City" />

                <CustomFormField className="w-full" name="state" label="State" />

                <CustomFormField className="w-full" name="postalCode" label="Postal Code" />
              </div>

              <CustomFormField name="country" label="Country" />
            </div>

            <Button className="mt-8 w-full cursor-pointer" type="submit" title="Create Property">
              Create Property
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default NewPropertyPage
