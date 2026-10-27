import React, { useEffect, useState } from 'react'
import DonorLayout from '@/components/donor/DonorLayout'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'

function AvailableRequests() {
    // Stores blood requests retrieved from Django
    const [requests, setRequests] = useState([])

    // Tracks whether requests are still loading
    const [loading, setLoading] = useState(true)

    // Stores any error returned by the API
    const [error, setError] = useState('')

    // Allows navigation to the booking page
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchRequests() {
            try {
                setLoading(true)
                setError('')

                // Retrieve blood requests from the Django backend
                const response = await api.get('blood-requests/')

                // Support both regular arrays and paginated Django responses
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []

                // Save the requests in React state
                setRequests(data)
            } catch (error) {
                console.error('Error fetching blood requests:', error)

                setError(
                    'Unable to load blood requests. Please try again.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    return (
        <DonorLayout>
            <h1 className="text-3xl font-bold">
                Available Blood Requests
            </h1>

            {/* Display loading and error messages */}
            {loading && (
                <p className="mt-6 text-gray-500">
                    Loading blood requests...
                </p>
            )}

            {error && (
                <p className="mt-6 text-red-600">
                    {error}
                </p>
            )}

            {/* Blood requests table */}
            {!loading && !error && (
                <table className="mt-8 w-full border-collapse rounded-xl bg-white shadow-md">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">
                                Patient
                            </th>

                            <th className="p-4 text-left">
                                Blood Group
                            </th>

                            <th className="p-4 text-left">
                                County
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-6 text-center text-gray-500"
                                >
                                    No blood requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr
                                    key={request.id}
                                    className="border-b"
                                >
                                    <td className="p-4">
                                        {request.patientName ||
                                            request.patient_name ||
                                            request.patient?.name ||
                                            'Not provided'}
                                    </td>

                                    <td className="p-4">
                                        {request.bloodGroup ||
                                            request.blood_group ||
                                            'Not provided'}
                                    </td>

                                    <td className="p-4">
                                        {request.county ||
                                            request.hospital?.county ||
                                            'Not provided'}
                                    </td>

                                    <td className="p-4">
                                        {request.status}
                                    </td>

                                    <td className="p-4">
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/donor/book/${request.id}`
                                                )
                                            }
                                        >
                                            Donate
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </DonorLayout>
    )
}

export default AvailableRequests