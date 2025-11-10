'use client'

import { ArrowDownToLine, ArrowLeft, Check, Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

import AppDashboardHeader from '@/components/app-dashboard-header'
import AppPageLoading from '@/components/app-page-loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetPaymentsQuery, useGetPropertyLeasesQuery, useGetPropertyQuery } from '@/state/api'

const PropertyTenants = () => {
  const { id } = useParams()
  const propertyId = Number(id)

  const { data: property, isLoading: propertyLoading } = useGetPropertyQuery(propertyId)
  const { data: leases, isLoading: leasesLoading } = useGetPropertyLeasesQuery(propertyId)
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(propertyId)

  const getCurrentMonthPaymentStatus = (leaseId: number) => {
    const today = new Date()

    const currentMonthPayment = payments?.find(
      (payment) =>
        payment.leaseId === leaseId &&
        new Date(payment.dueDate).getMonth() === today.getMonth() &&
        new Date(payment.dueDate).getFullYear() === today.getFullYear()
    )

    return currentMonthPayment?.paymentStatus || 'Not Paid'
  }

  if (propertyLoading || leasesLoading || paymentsLoading) return <AppPageLoading />

  return (
    <div className="dashboard-container">
      <Link href="/managers/properties" className="hover:text-primary-500 mb-4 flex items-center" scroll={false}>
        <ArrowLeft className="mr-2 h-4 w-4" />

        <span>Back to Properties</span>
      </Link>

      <AppDashboardHeader
        title={property?.name || 'My Property'}
        subtitle="Manage tenants and leases for this property"
      />

      <div className="w-full space-y-6">
        <div className="mt-8 overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-bold">Tenants Overview</h2>

              <p className="text-sm text-gray-500">Manage and view all tenants for this property.</p>
            </div>

            <div>
              <button
                className={`hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700`}
              >
                <Download className="mr-2 h-5 w-5" />

                <span>Download All</span>
              </button>
            </div>
          </div>

          <hr className="mt-4 mb-1" />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>

                  <TableHead>Lease Period</TableHead>

                  <TableHead>Monthly Rent</TableHead>

                  <TableHead>Current Month Status</TableHead>

                  <TableHead>Contact</TableHead>

                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leases?.map((lease) => (
                  <TableRow key={lease.id} className="h-24">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src="/landing-i1.png"
                          alt={lease.tenant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />

                        <div>
                          <div className="font-semibold">{lease.tenant.name}</div>

                          <div className="text-sm text-gray-500">{lease.tenant.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>{new Date(lease.startDate).toLocaleDateString()} -</div>

                      <div>{new Date(lease.endDate).toLocaleDateString()}</div>
                    </TableCell>

                    <TableCell>${lease.rent.toFixed(2)}</TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          getCurrentMonthPaymentStatus(lease.id) === 'Paid'
                            ? 'border-green-300 bg-green-100 text-green-800'
                            : 'border-red-300 bg-red-100 text-red-800'
                        }`}
                      >
                        {getCurrentMonthPaymentStatus(lease.id) === 'Paid' && (
                          <Check className="mr-1 inline-block h-4 w-4" />
                        )}

                        {getCurrentMonthPaymentStatus(lease.id)}
                      </span>
                    </TableCell>

                    <TableCell>{lease.tenant.phoneNumber}</TableCell>

                    <TableCell>
                      <button
                        className={`hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700`}
                      >
                        <ArrowDownToLine className="mr-1 h-4 w-4" />
                        Download Agreement
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyTenants
