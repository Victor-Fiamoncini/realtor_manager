'use client'

import { CircleCheckBig, Download, File, Hospital } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import AppApplicationCard from '@/components/app-application-card'
import AppDashboardHeader from '@/components/app-dashboard-header'
import AppPageLoading from '@/components/app-page-loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetApplicationsQuery, useGetAuthUserQuery, useUpdateApplicationStatusMutation } from '@/state/api'

const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('all')

  const { data: user } = useGetAuthUserQuery()

  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: user?.cognitoInfo?.userId,
      userType: 'manager',
    },
    { skip: !user?.cognitoInfo?.userId }
  )
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation()

  const handleStatusChange = async (id: number, status: string) => {
    await updateApplicationStatus({ id, status })
  }

  const filteredApplications = Array.isArray(applications)
    ? applications.filter((application) => {
        if (activeTab === 'all') return true

        return application.status.toLowerCase() === activeTab
      })
    : []

  if (isLoading) return <AppPageLoading />

  if (isError || !applications) return <div>Error fetching applications</div>

  return (
    <div className="dashboard-container">
      <AppDashboardHeader title="Applications" subtitle="View and manage applications for your properties" />

      <Tabs className="my-5 w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>

          <TabsTrigger value="pending">Pending</TabsTrigger>

          <TabsTrigger value="approved">Approved</TabsTrigger>

          <TabsTrigger value="denied">Denied</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'denied'].map((tab) => (
          <TabsContent key={tab} className="mt-5 w-full" value={tab}>
            {filteredApplications
              .filter((application) => tab === 'all' || application.status.toLowerCase() === tab)
              .map((application) => (
                <AppApplicationCard key={application.id} application={application} userType="manager">
                  <div className="flex w-full justify-between gap-5 px-4 pb-4">
                    <div
                      className={`grow p-4 text-green-700 ${
                        application.status === 'Approved'
                          ? 'bg-green-100'
                          : application.status === 'Denied'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center">
                        <File className="mr-2 h-5 w-5 shrink-0" />

                        <span className="mr-2">
                          Application submitted on {new Date(application.applicationDate).toLocaleDateString()}.
                        </span>

                        <CircleCheckBig className="mr-2 h-5 w-5 shrink-0" />

                        <span
                          className={`font-semibold ${
                            application.status === 'Approved'
                              ? 'text-green-800'
                              : application.status === 'Denied'
                                ? 'text-red-800'
                                : 'text-yellow-800'
                          }`}
                        >
                          {application.status === 'Approved' && 'This application has been approved.'}

                          {application.status === 'Denied' && 'This application has been denied.'}

                          {application.status === 'Pending' && 'This application is pending review.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700"
                        href={`/managers/properties/${application.property.id}`}
                        scroll={false}
                      >
                        <Hospital className="mr-2 h-5 w-5" />
                        Property Details
                      </Link>

                      {application.status === 'Approved' && (
                        <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700">
                          <Download className="mr-2 h-5 w-5" />
                          Download Agreement
                        </button>
                      )}

                      {application.status === 'Pending' && (
                        <>
                          <button
                            className="cursor-pointer rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500"
                            title="Approve"
                            onClick={() => handleStatusChange(application.id, 'Approved')}
                          >
                            Approve
                          </button>

                          <button
                            className="cursor-pointer rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                            title="Deny"
                            onClick={() => handleStatusChange(application.id, 'Denied')}
                          >
                            Deny
                          </button>
                        </>
                      )}

                      {application.status === 'Denied' && (
                        <button className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white">
                          Contact User
                        </button>
                      )}
                    </div>
                  </div>
                </AppApplicationCard>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default ApplicationsPage
