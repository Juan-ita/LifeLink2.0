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
    scheduled: 0,
    completed: 0,

  })
useEffect(() => {
  async function fetchDashboardData() {
    try {
      // Fetch the donor's profile, blood requests, and appointments from Django.
      const [donorResponse, requestsResponse, appointmentsResponse] =
        await Promise.all([
          api.get("me/"),
          api.get("blood-requests/"),
          api.get("appointments/"),
        ]);

      // Django may return a plain list or a paginated response.
      const requests = Array.isArray(requestsResponse.data)
        ? requestsResponse.data
        : requestsResponse.data.results ?? [];

      const appointments = Array.isArray(appointmentsResponse.data)
        ? appointmentsResponse.data
        : appointmentsResponse.data.results ?? [];

      // Only count blood requests that donors can currently respond to.
      const availableRequests = requests.filter(
        request => ['PENDING', 'APPROVED'].includes(request.status)

      );

      // Count appointments using Django's Appointment.Status choices.
      const scheduledAppointments = appointments.filter(
        (appointment) => appointment.status === "SCHEDULED"
      );

      const completedAppointments = appointments.filter(
        (appointment) => appointment.status === "COMPLETED"
      );

      setDonor(donorResponse.data);

      setStats({
        requests: availableRequests.length,
        appointments: appointments.length,
        scheduled: scheduledAppointments.length,
        completed: completedAppointments.length,
      });
    } catch (error) {
      console.error("Could not load donor dashboard:", error);
    }
  }

  fetchDashboardData();
}, []);
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
        value={stats.scheduled}
        icon={<CheckCircle  size={28}/>}
        />
        <DonorCards
        title="Pending"
        value={stats.completed}
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
