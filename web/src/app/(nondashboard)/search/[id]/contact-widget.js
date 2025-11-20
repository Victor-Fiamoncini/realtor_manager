import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useGetAuthUserQuery } from '@/state/api'

const ContactWidget = ({ onOpenModal }) => {
  const { data: user } = useGetAuthUserQuery()

  const router = useRouter()

  const handleButtonClick = () => {
    if (user) {
      onOpenModal()
    } else {
      router.push('/signin')
    }
  }

  return (
    <div className="border-primary-200 h-fit min-w-[300px] rounded-2xl border bg-white p-7">
      <Button
        className="w-full cursor-pointer"
        title={user ? 'Submit Application' : 'Sign In to Apply'}
        onClick={handleButtonClick}
      >
        {user ? 'Submit Application' : 'Sign In to Apply'}
      </Button>

      <hr className="my-4" />

      <div className="text-sm">
        <div className="text-primary-600 mb-1">Language: English, Portuguese.</div>

        <div className="text-primary-600">Open by appointment on Monday - Sunday</div>
      </div>
    </div>
  )
}

export default ContactWidget
