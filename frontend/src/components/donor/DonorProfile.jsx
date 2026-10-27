import React, { useEffect, useState } from 'react'
import api from '@/services/api'
import DonorLayout from './DonorLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

function DonorProfile() {
const [donor, setDonor] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [saving, setSaving] = useState(false)
const [success, setSuccess] = useState('')


// Editable fields supported by the Django donor profile.
const [form, setForm] = useState({
    blood_group: '',
    date_of_birth: '',
    phone: '',
    latitude: '',
    longitude: '',
    is_available: true,
})

// Fetch the logged-in donor's profile from Django.
useEffect(() => {
    async function fetchDonor() {
        try {
            const response = await api.get('donors/me/')
            const data = response.data

            setDonor(data)
            setForm({
                blood_group: data.blood_group || '',
                date_of_birth: data.date_of_birth || '',
                phone: data.phone || '',
                latitude: data.latitude ?? '',
                longitude: data.longitude ?? '',
                is_available: data.is_available ?? true,
            })
        } catch (err) {
            console.error('Failed to load donor profile:', err.response?.data || err)
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Could not load your profile.'
            )
        } finally {
            setLoading(false)
        }
    }

    fetchDonor()
}, [])

function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((previous) => ({
        ...previous,
        [name]: type === 'checkbox' ? checked : value,
    }))
}

// Save editable profile fields using Django PATCH.
async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
        const payload = {
            blood_group: form.blood_group,
            date_of_birth: form.date_of_birth,
            phone: form.phone,
            latitude: form.latitude === '' ? null : Number(form.latitude),
            longitude: form.longitude === '' ? null : Number(form.longitude),
            is_available: form.is_available,
        }

        const response = await api.patch('donors/me/', payload)

        setDonor(response.data)
        setSuccess('Your profile has been updated successfully.')
    } catch (err) {
        console.error('Failed to update donor profile:', err.response?.data || err)
        setError(
            typeof err.response?.data === 'object'
                ? Object.entries(err.response.data)
                    .map(([field, messages]) =>
                        `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
                    )
                    .join(' | ')
                : 'Could not save your profile.'
        )
    } finally {
        setSaving(false)
    }
}

if (loading) {
    return (
        <DonorLayout>
            <p>Loading your profile...</p>
        </DonorLayout>
    )
}

if (!donor) {
    return (
        <DonorLayout>
            <h1 className="text-3xl font-bold">My Donor Profile</h1>
            <p className="mt-4 text-red-600">{error}</p>
        </DonorLayout>
    )
}

return (
    <DonorLayout>
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    My Donor Profile
                </CardTitle>
                <p className="text-sm text-gray-500">
                    Username: {donor.username}
                </p>
            </CardHeader>

            <CardContent>
                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1 block font-medium">
                            Blood Group
                        </label>
                        <select
                            name="blood_group"
                            value={form.blood_group}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border p-2"
                        >
                            <option value="">Select blood group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={form.date_of_birth}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border p-2"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-medium">
                                Latitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                                className="w-full rounded-md border p-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">
                                Longitude
                            </label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                                className="w-full rounded-md border p-2"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="is_available"
                            checked={form.is_available}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <span>
                            I am available to receive blood donation requests
                        </span>
                    </label>

                    <div className="space-y-1 text-sm text-gray-600">
                        <p>
                            <strong>Last Donation:</strong>{' '}
                            {donor.last_donation_date || 'Not recorded'}
                        </p>
                        <p>
                            <strong>Next Eligible Date:</strong>{' '}
                            {donor.next_eligible_date || 'Not recorded'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </CardContent>
        </Card>
    </DonorLayout>
)


}

export default DonorProfile
