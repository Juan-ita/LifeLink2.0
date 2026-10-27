import React, { useEffect, useState } from 'react'
import api from '@/services/api'
import HospitalLayout from './HospitalLayout'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'

function HospitalDonors() {
const [donors, setDonors] = useState([])
const [search, setSearch] = useState('')
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


useEffect(() => {
    async function fetchDonors() {
        try {
            // Retrieve the donor directory from Django.
            const response = await api.get('donors/directory/')

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results ?? []

            setDonors(data)
        } catch (err) {
            console.error(
                'Could not load registered donors:',
                err.response?.data || err
            )
            setError('Could not load registered donors.')
        } finally {
            setLoading(false)
        }
    }

    fetchDonors()
}, [])

// Search by username, blood group, email, or phone number.
const filteredDonors = donors.filter((donor) => {
    const searchText = search.toLowerCase()

    return [
        donor.username,
        donor.blood_group,
        donor.email,
        donor.phone,
    ].some((value) =>
        String(value ?? '').toLowerCase().includes(searchText)
    )
})

return (
    <HospitalLayout>
        <h1 className="text-3xl font-bold">
            Registered Donors
        </h1>

        <p className="mt-2 text-gray-500">
            View registered blood donors and their availability.
        </p>

        <Input
            className="mt-6"
            placeholder="Search by name, blood group, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                <p className="text-gray-500">
                    Loading registered donors...
                </p>
            ) : error ? (
                <p className="text-red-600">
                    {error}
                </p>
            ) : filteredDonors.length === 0 ? (
                <p className="text-gray-500">
                    No matching donors found.
                </p>
            ) : (
                filteredDonors.map((donor) => (
                    <Card key={donor.id}>
                        <CardContent className="space-y-2 pt-6">
                            <h2 className="text-xl font-bold">
                                {donor.username}
                            </h2>

                            <p>
                                <strong>Blood group:</strong>{' '}
                                {donor.blood_group}
                            </p>

                            <p>
                                <strong>Phone:</strong>{' '}
                                {donor.phone || 'Not provided'}
                            </p>

                            <p>
                                <strong>Email:</strong>{' '}
                                {donor.email || 'Not provided'}
                            </p>

                            <p>
                                <strong>Availability:</strong>{' '}
                                {donor.is_available
                                    ? 'Available'
                                    : 'Unavailable'}
                            </p>

                            {donor.latitude != null &&
                                donor.longitude != null && (
                                    <p className="text-sm text-gray-500">
                                        GPS location available
                                    </p>
                                )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    </HospitalLayout>
)


}

export default HospitalDonors
