import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DonorLayout from '@/components/donor/DonorLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

function BookAppointment() {
// Get the Django blood request ID from the URL.
const { id } = useParams()
const navigate = useNavigate()


const [date, setDate] = useState('')
const [time, setTime] = useState('')
const [loading, setLoading] = useState(false)

async function handleSubmit(event) {
    event.preventDefault()

    if (!date || !time) {
        alert('Please select a date and time.')
        return
    }

    // Combine the selected date and time into one ISO-compatible value.
    const appointmentDate = new Date(`${date}T${time}`)

    if (Number.isNaN(appointmentDate.getTime())) {
        alert('Please select a valid date and time.')
        return
    }

    if (appointmentDate <= new Date()) {
        alert('Please select a future date and time.')
        return
    }

    setLoading(true)

    try {
        // Get the selected blood request from Django.
        const requestResponse = await api.get(`blood-requests/${id}/`)
        const bloodRequest = requestResponse.data

        // Only stop bookings for requests that are closed.
         if (['FULFILLED', 'CANCELLED'].includes(bloodRequest.status)) {
             alert('This blood request is no longer accepting appointments.')
             return
         }

        // Get the logged-in donor's profile from Django.
        // The backend should expose this endpoint for the authenticated donor.
        const donorResponse = await api.get('donors/me/')
        const donor = donorResponse.data

        // Check the donor's age using their Django profile.
        const birthDate = new Date(donor.date_of_birth)
        const today = new Date()

        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDifference = today.getMonth() - birthDate.getMonth()

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--
        }

        if (age < 18) {
            alert('You must be at least 18 years old to donate.')
            return
        }

        // Create the appointment using Django database IDs.
        // The backend must verify the donor and hospital relationships.
        await api.post('appointments/', {
            donor: donor.id,
            blood_request: bloodRequest.id,
            hospital: bloodRequest.hospital,
            appointment_date: appointmentDate.toISOString(),
        })

        alert('Appointment booked successfully!')
        navigate('/donor/dashboard')
    } catch (error) {
        console.error('Appointment booking failed:', error.response?.data || error)

        const errorData = error.response?.data
        const errorMessage =
            typeof errorData === 'string'
                ? errorData
                : errorData
                    ? JSON.stringify(errorData)
                    : 'Could not book the appointment. Please try again.'

        alert(errorMessage)
    } finally {
        setLoading(false)
    }
}

return (
    <DonorLayout>
        <Card className="mx-auto max-w-lg">
            <CardHeader>
                <CardTitle>Book Donation Appointment</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label htmlFor="appointment-date">Date</Label>
                        <Input
                            id="appointment-date"
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="appointment-time">Time</Label>
                        <Input
                            id="appointment-time"
                            type="time"
                            value={time}
                            onChange={(event) => setTime(event.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Booking...' : 'Book Appointment'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </DonorLayout>
)


}

export default BookAppointment
