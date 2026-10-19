import DonorLayout from '@/components/donor/DonorLayout'
import { Heart, Clipboard, CheckCircle, Clock, Calendar } from 'lucide-react'
import DonorCards from '@/components/donor/DonorCards'
import { useState, useEffect } from 'react'
import DonorQuickActions from '@/components/donor/DonorQuickActions'
import EmergencyRequests from '@/components/donor/EmergencyRequests'

import api from '@/services/api'

function DonorDashboard() {
  const [donor, setDonor] = useState(null)
  const [stats, setStats] = useState({
    requests: 0,
    appointments: 0,
    approved: 0,
    pending: 0,

  })
useEffect(() => {
  async function fetchStats() {
    try {
      // Fetch the logged-in user's profile from Django.
      const profileResponse = await api.get('me/')
      setDonor(profileResponse.data)

      // Fetch blood requests available to the donor.
      const requestsResponse = await api.get('blood-requests/')

      const requests = Array.isArray(requestsResponse.data)
        ? requestsResponse.data
        : requestsResponse.data.results ?? []

      const approvedRequests = requests.filter(
        request => request.status === 'APPROVED'
      )

      // Appointment statistics will be connected separately.
      setStats(previous => ({
        ...previous,
        requests: approvedRequests.length,
      }))
    } catch (error) {
      console.error('Failed to load donor dashboard:', error)
    }
  }

  fetchStats()
}, [])
  return (
    <DonorLayout>
        <main className='flex-1 p-8'>
         <h1 className='text-3xl font-bold'>
            Welcome Back, {donor?.username ?? "Donor"}
        </h1> 
         <p className='mt-2 text-gray-500'>
         Ready to make another life-saving donation?
         </p>

    <div className='mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-6'>
        <DonorCards
        title="Available Requests"
        value={stats.requests}
        icon={<Clipboard size={28}/>}
        />

        <DonorCards
        title="My Appointments"
        value={stats.appointments}
        icon={<Calendar size={28}/>}
        />
        <DonorCards
        title="Approved"
        value={stats.approved}
        icon={<CheckCircle  size={28}/>}
        />
        <DonorCards
        title="Pending"
        value={stats.pending}
        icon={<Clock size={28}/>}
        />

    </div>
      </main>
      <DonorQuickActions/>
      <EmergencyRequests/>
      
    </DonorLayout>
  )
}

export default DonorDashboard
