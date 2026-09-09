import React from 'react'

function DonorCards({title, value, icon}) {
  return (
    <div className='rounded-xl bg-white p-6 shadow-md'>
      <div className='mb-4 text-red-600'>
        {icon}
      </div>

      <h1 className='text-sm text-gray-500'>
        {title}
      </h1>

      <p className='mt-2 text-3xl font-bold'>
        {value}
      </p>
    </div>
  )
}

export default DonorCards
