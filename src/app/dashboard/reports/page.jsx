import Sidebar from '@/components/sidebar'
import React from 'react'

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="text-center justify-center items-center tesxt-3xl font-bold">
        Can't get any reports at this moment.
      </div>
    </div>
  )
}

export default page
