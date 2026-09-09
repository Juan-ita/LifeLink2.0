import React from 'react'
import Sidebar from './Sidebar'

function HospitalLayout({children}) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <Sidebar/>

      <main className='flex-1 p-8'>
        {children}
      </main>
    </div>
  )
}

export default HospitalLayout
