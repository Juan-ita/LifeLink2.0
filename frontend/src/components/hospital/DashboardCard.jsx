
function DashboardCard({title, value, icon}) {
  return (
    <div className='rounded-xl bg-white p-6 shadow-md'>
      <div className='mb-4 text-red-600'>
        {icon}
      </div>

      <h3 className='text-gray-500 text-sm'>
        {title}
      </h3>

      <p className='mt-2 text-3xl font-bold'>
        {value}
      </p>
    </div>
  )
}

export default DashboardCard
