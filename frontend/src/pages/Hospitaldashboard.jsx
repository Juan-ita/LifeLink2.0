import DashboardCard from '@/components/hospital/DashboardCard'
import Sidebar from '@/components/hospital/Sidebar'
import { Calendar, Droplets, ClipboardList, Users } from 'lucide-react'
import QuickActions from '@/components/hospital/QuickActions'
import RecentRequests from '@/components/hospital/RecentRequests'
import { useState, useEffect } from 'react'

import api from '@/services/api'

function Hospitaldashboard() {

  const [hospitalName, setHospitalName] = useState("");
  // Store dashboard statistics
  const [status, setStatus] = useState ({
    donors: 0,
    requests: 0,
    units: 0,
    appointments: 0,
  });

  //Run once when the dashboard loads
useEffect(() => {
    async function fetchStatus() {
        try {
            // Ask Django for the hospital dashboard statistics.
            const response = await api.get("analytics/");

            // Store the statistics returned by Django.
            setStatus({
                donors: response.data.total_donors,
                requests: response.data.total_requests,
                units: response.data.total_inventory_units,
                appointments: response.data.total_appointments,
            });

            // Get the currently logged-in user.
            const userResponse = await api.get("me/");

            // Display the logged-in hospital's username.
            setHospitalName(userResponse.data.username);

        } catch (error) {
            console.error("Failed to load hospital dashboard:", error);

            if (error.response?.data) {
                console.error("Django error:", error.response.data);
            }
        }
    }

    fetchStatus();
}, []);

  return (
    
    <div className='flex min-h-screen bg-gray-100'>
        <Sidebar/>
      <main className='flex-1 p-8'>
        <h1 className='text-3xl font-bold'>Hospital Dashboard</h1>
        <p className='text-gray-500 mt-2'>Welcome back, {hospitalName}</p>

        <div className='mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-6'>
          <DashboardCard 
          title="Registered Donors"
          value={status.donors}
          icon={<Users size={28}/>}
          />

          <DashboardCard 
          title="Blood Requests"
          value={status.requests}
          icon={<ClipboardList size={28}/>}
          />

          <DashboardCard 
          title="Blood Units"
          value={status.units}
          icon={<Droplets size={28}/>}
          />

          <DashboardCard 
          title="Appointments"
          value={status.appointments}
          icon={<Calendar size={28}/>}
          />
        </div>

        <QuickActions/>
        <RecentRequests/>
      </main>
    </div>
  )
}

export default Hospitaldashboard
