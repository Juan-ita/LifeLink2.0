import { useEffect, useState } from 'react'
import HospitalLayout from '@/components/hospital/HospitalLayout'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

function HospitalAppointments() {
const [appointments, setAppointments] = useState([])
const [loading, setLoading] = useState(true)
const [updatingId, setUpdatingId] = useState(null)

// Load appointments belonging to the logged-in hospital.
async function fetchAppointments() {
try {
   const response = await api.get('appointments/')
   const data = Array.isArray(response.data)
   ? response.data
   : response.data.results ?? []
   
   
     setAppointments(data)
} catch (error) {
  console.error(
    'Could not load hospital appointments:',
    error.response?.data || error
  )
  alert('Could not load appointments. Please check your login and try again.')
} finally {
  setLoading(false)
}


}

useEffect(() => {
 fetchAppointments()
}, [])

// Approve or reject a booking using the Django API.
async function updateAppointmentStatus(id, decision) {
setUpdatingId(id)


try {
  const endpoint = decision === 'approve' ? 'approve/' : 'reject/'

  const response = await api.post(`appointments/${id}/${endpoint}`)

  // Update the displayed appointment with the backend response.
  setAppointments((previous) =>
    previous.map((appointment) =>
      appointment.id === id ? response.data : appointment
    )
  )

  alert(
    decision === 'approve'
      ? 'Appointment approved!'
      : 'Appointment rejected.'
  )
} catch (error) {
  console.error(
    'Could not update appointment:',
    error.response?.data || error
  )

  const detail = error.response?.data?.detail
  alert(detail || 'Could not update the appointment. Please try again.')
} finally {
  setUpdatingId(null)
}


}

// Convert Django's ISO date into a readable date and time.
function formatDate(value) {
if (!value) return 'Not specified'


const date = new Date(value)

if (Number.isNaN(date.getTime())) return value

return date.toLocaleString()


}

return ( <HospitalLayout> <main className="flex-1 p-6"> <h1 className="text-3xl font-bold">Donor Appointments</h1>


    <p className="mt-2 text-gray-500">
      Review donor bookings and confirm appointments.
    </p>

    <div className="mt-8 space-y-5">
      {loading ? (
        <div className="rounded-xl bg-white p-6 text-center shadow-md">
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow-md">
          No appointments found.
        </div>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-xl bg-white p-6 shadow-md"
          >
            <h2 className="text-xl font-bold">
               {appointment.donor_name || `Donor ID: ${appointment.donor}`}
              </h2>
              
              <p>Email: {appointment.donor_email || 'Not provided'}</p>
              
              <p>Phone: {appointment.donor_phone || 'Not provided'}</p>


              <div className="mt-3 space-y-1 text-gray-700">
                <p>
                  <strong>Recipient:</strong>{' '}
                  {appointment.blood_request_details?.recipient_name || 'Name not provided'}
                </p>
              
                <p>
                  <strong>Requested blood group:</strong>{' '}
                  {appointment.blood_request_details?.blood_group || 'Not specified'}
                </p>
              
                <p>
                  <strong>Units required:</strong>{' '}
                  {appointment.blood_request_details?.units_required ?? 'Not specified'}
                </p>
              
                <p>
                  <strong>Urgency:</strong>{' '}
                  {appointment.blood_request_details?.urgency || 'Not specified'}
                </p>
              
                <p>
                  <strong>Request ID:</strong> {appointment.blood_request ?? 'Not specified'}
                </p>
              </div>



            <p className="mt-2 text-gray-700">
              Appointment date: {formatDate(appointment.appointment_date)}
            </p>

            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${
                appointment.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700'
                  : appointment.status === 'SCHEDULED'
                    ? 'bg-green-100 text-green-700'
                    : appointment.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-600'
              }`}
            >
              {appointment.status}
            </span>

            {appointment.status === 'PENDING' && (
              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={updatingId === appointment.id}
                  onClick={() =>
                    updateAppointmentStatus(appointment.id, 'approve')
                  }
                >
                  {updatingId === appointment.id
                    ? 'Updating...'
                    : 'Approve'}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={updatingId === appointment.id}
                  onClick={() =>
                    updateAppointmentStatus(appointment.id, 'reject')
                  }
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </main>
</HospitalLayout>


)
}

export default HospitalAppointments
