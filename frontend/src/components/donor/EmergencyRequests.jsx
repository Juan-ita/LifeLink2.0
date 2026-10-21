import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'

function EmergencyRequests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchRequests() {
            try {
                // Fetch approved blood requests from Django.
                const response = await api.get('blood-requests/')

                console.log("BLOOD REQUESTS RESPONSE:", response.data)

                // Django returns the requests as a list.
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results ?? []

                // Show only the three most recent approved requests.
                setRequests(
                    data
                        .filter(request => request.status === 'APPROVED')
                        .slice(0, 3)
                )
            } catch (error) {
                console.error('Failed to load emergency requests:', error)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [])

    return (
        <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    Emergency Blood Requests
                </h2>

                <Button
                    variant="outline"
                    onClick={() => navigate('/donor/requests')}
                >
                    View All
                </Button>
            </div>

            <div>
                {loading ? (
                    <p className="text-gray-500">
                        Loading blood requests...
                    </p>
                ) : error ? (
                    <p className="text-red-600">
                        Unable to load blood requests. Please try again.
                    </p>
                ) : requests.length === 0 ? (
                    <p className="text-gray-500">
                        No approved blood requests are available right now.
                    </p>
                ) : (
                    requests.map(request => {
                        // Patient and county are currently stored in Django's reason field rather than separate database fields.
                        const reason = request.reason ?? "";

                        // Extract the patient's name from the reason text.
                        const patientMatch = reason.match(
                          /Patient:\s*(.*?)\.\s*County:/
                        );
                        
                        // Extract the county from the reason text.
                        const countyMatch = reason.match(
                          /County:\s*(.*?)\.\s*Deadline:/
                        );

                        return (
                            <div
                                key={request.id}
                                className="rounded-xl border bg-white p-5 shadow-sm"
                            >
                                <h3 className="flex text-lg font-bold">
                                    {patientMatch?.[1] ?? 'Patient request'}
                                </h3>

                                <p className="text-gray-500">
                                    {countyMatch?.[1] ?? 'County not specified'}
                                </p>

                                <p className="mt-2 font-semibold text-red-600">
                                    {request.blood_group}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {request.units_required} units needed
                                </p>

                                <Button
                                    className="mt-4"
                                    onClick={() =>
                                        navigate(`/donor/book/${request.id}`)
                                    }
                                >
                                    Book Appointment
                                </Button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default EmergencyRequests

