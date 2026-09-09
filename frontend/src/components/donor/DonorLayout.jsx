import React, { Children } from 'react'
import DonorSidebar from './DonorSidebar'

function DonorLayout({children}) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <DonorSidebar/>

      <main className='flex-1 p-8'>
        {children}
      </main>
    </div>
  )
}

export default DonorLayout
