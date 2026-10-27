import React, { useEffect, useState } from 'react'
import api from '@/services/api'
import HospitalLayout from './HospitalLayout'

function HospitalNotifications() {
const [notifications, setNotifications] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


useEffect(() => {
    async function fetchNotifications() {
        try {
            // Fetch notifications belonging to the logged-in hospital.
            const response = await api.get('notifications/')

            // Support both regular arrays and paginated Django responses.
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results ?? []

            // Newest notifications appear first.
            setNotifications(
                [...data].sort(
                    (a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                )
            )
        } catch (err) {
            console.error(
                'Could not load hospital notifications:',
                err.response?.data || err
            )
            setError('Could not load notifications. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    fetchNotifications()
}, [])

return (
    <HospitalLayout>
        <h1 className="text-3xl font-bold">
            Notifications
        </h1>

        <p className="mt-2 text-gray-500">
            Updates related to your hospital account.
        </p>

        <div className="mt-8 space-y-4">
            {loading ? (
                <p className="text-gray-500">
                    Loading notifications...
                </p>
            ) : error ? (
                <p className="text-red-600">
                    {error}
                </p>
            ) : notifications.length === 0 ? (
                <p className="text-gray-500">
                    No notifications yet.
                </p>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="rounded-lg border bg-white p-4 shadow"
                    >
                        <p className="font-medium">
                            {notification.message}
                        </p>

                        {notification.created_at && (
                            <p className="mt-2 text-sm text-gray-500">
                                {new Date(
                                    notification.created_at
                                ).toLocaleString()}
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    </HospitalLayout>
)


}

export default HospitalNotifications
