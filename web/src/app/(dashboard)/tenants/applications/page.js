'use client'

import { CircleCheckBig, Clock, XCircle } from 'lucide-react'
import React from 'react'

import AppApplicationCard from '@/components/app-application-card'
import AppDashboardHeader from '@/components/app-dashboard-header'
import AppPageLoading from '@/components/app-page-loading'
import { useGetApplicationsQuery, useGetAuthUserQuery } from '@/state/api'

const ApplicationsPage = () => {
  const { data: user } = useGetAuthUserQuery()
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery({
    userId: user?.cognitoInfo?.userId,
    userType: 'tenant',
  })

  if (isLoading) return <AppPageLoading />

  if (isError || !applications) return <div>Error fetching applications</div>

  return (
    <div className="dashboard-container">
      <AppDashboardHeader title="Applications" subtitle="Track and manage your property rental applications" />

      <div className="w-full">
        {applications?.map((application) => (
          <AppApplicationCard key={application.id} application={application} userType="renter">
            <div className="flex w-full justify-between gap-5 px-4 pb-4">
              {application.status === 'Approved' ? (
                <div className="flex grow items-center bg-green-100 p-4 text-green-700">
                  <CircleCheckBig className="mr-2 h-5 w-5" />
                  The property is being rented by you until {new Date(application.lease?.endDate).toLocaleDateString()}
                </div>
              ) : application.status === 'Pending' ? (
                <div className="flex grow items-center bg-yellow-100 p-4 text-yellow-700">
                  <Clock className="mr-2 h-5 w-5" />
                  Your application is pending approval
                </div>
              ) : (
                <div className="flex grow items-center bg-red-100 p-4 text-red-700">
                  <XCircle className="mr-2 h-5 w-5" />
                  Your application has been denied
                </div>
              )}
            </div>
          </AppApplicationCard>
        ))}
      </div>
    </div>
  )
}

export default ApplicationsPage
