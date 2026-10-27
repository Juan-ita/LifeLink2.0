import React, { useEffect, useState } from 'react'
import api from '@/services/api'
import DonorLayout from './DonorLayout'

function MyAppointments() {
const [appointments, setAppointments] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


// Load appointments belonging to the logged-in donor from Django.
async function fetchAppointments() {
    try {
        setError('')

        const response = await api.get('appointments/')
        const data = Array.isArray(response.data)
            ? response.data
            : response.data.results || []

        setAppointments(data)
    } catch (err) {
        console.error('Failed to load appointments:', err.response?.data || err)
        setError(
            err.response?.data?.detail ||
            'Could not load your appointments. Please try again.'
        )
    } finally {
        setLoading(false)
    }
}

useEffect(() => {
    fetchAppointments()
}, [])

// Cancel a pending appointment through Django.
async function cancelAppointment(id) {
    const confirmed = window.confirm(
        'Are you sure you want to cancel this appointment?'
    )

    if (!confirmed) return

    try {
        // The backend must expose this action before cancellation can work.
        await api.post(`appointments/${id}/cancel/`)

        await fetchAppointments()
        alert('Appointment cancelled successfully.')
    } catch (err) {
        console.error('Failed to cancel appointment:', err.response?.data || err)
        alert(
            err.response?.data?.detail ||
            'Could not cancel this appointment.'
        )
    }
}

// Display readable appointment statuses.
function getStatusStyle(status) {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700'
        case 'SCHEDULED':
            return 'bg-green-100 text-green-700'
        case 'COMPLETED':
            return 'bg-blue-100 text-blue-700'
        case 'CANCELLED':
        case 'MISSED':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

if (loading) {
    return (
        <DonorLayout>
            <p>Loading your appointments...</p>
        </DonorLayout>
    )
}

return (
    <DonorLayout>
        <h1 className="text-3xl font-bold">My Appointments</h1>

        {error && (
            <p className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
                {error}
            </p>
        )}

        <div className="mt-8 space-y-5">
            {!error && appointments.length === 0 ? (
                <p className="text-gray-500">
                    You have no appointments yet.
                </p>
            ) : (
                appointments.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >
                        <h2 className="text-xl font-bold">
                            {appointment.hospital_name || 'Hospital appointment'}
                        </h2>

                        <p className="mt-2">
                            <strong>Blood group:</strong>{' '}
                            {appointment.donor_blood_group || 'Not specified'}
                        </p>

                        <p>
                            <strong>Date and time:</strong>{' '}
                            {appointment.appointment_date
                                ? new Date(appointment.appointment_date).toLocaleString()
                                : 'Not specified'}
                        </p>

                        <p className="mt-3">
                            <strong>Recipient:</strong>{' '}
                            {appointment.blood_request_details?.recipient_name ||
                                'Not provided'}
                        </p>

                        <p>
                            <strong>Requested blood group:</strong>{' '}
                            {appointment.blood_request_details?.blood_group ||
                                'Not specified'}
                        </p>

                        <p>
                            <strong>Units required:</strong>{' '}
                            {appointment.blood_request_details?.units_required ??
                                'Not specified'}
                        </p>

                        <span
                            className={`mt-4 inline-block rounded-full px-3 py-1 text-sm ${getStatusStyle(appointment.status)}`}
                        >
                            {appointment.status || 'UNKNOWN'}
                        </span>

                        <p className="mt-4 text-sm text-gray-600">
                            {appointment.status === 'SCHEDULED'
                                ? 'Your appointment has been approved. Please contact the hospital if you need to confirm the arrangements.'
                                : appointment.status === 'PENDING'
                                ? 'Your appointment is awaiting hospital approval.'
                                : appointment.status === 'CANCELLED'
                                ? 'This appointment has been cancelled.'
                                : appointment.status === 'COMPLETED'
                                ? 'This appointment has been completed. Thank you for donating!'
                                : appointment.status === 'MISSED'
                                ? 'This appointment was marked as missed.'
                                : 'Check with the hospital for further details.'}
                        </p>

                        {appointment.status === 'PENDING' && (
                            <button
                                onClick={() => cancelAppointment(appointment.id)}
                                className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Cancel Appointment
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    </DonorLayout>
)


}

export default MyAppointments
