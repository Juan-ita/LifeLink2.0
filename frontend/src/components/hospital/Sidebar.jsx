import React, { useEffect, useState } from 'react'
import {LayoutDashboard,Droplets,ClipboardList,User,Users,LogOut,Calendar,} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '@/services/api'

function Sidebar() {
const navigate = useNavigate()
const location = useLocation()


const [notificationCount, setNotificationCount] = useState(0)

// Fetch hospital appointments and count those not yet read.
useEffect(() => {
    async function loadAppointments() {
        try {
            const response = await api.get('appointments/')

            // Support both regular arrays and paginated responses.
            const appointments = Array.isArray(response.data)
                ? response.data
                : response.data.results ?? []

            // Count appointments that have not been marked as read.
            const unreadAppointments = appointments.filter(
                (appointment) => appointment.notification_read === false
            )

            setNotificationCount(unreadAppointments.length)
        } catch (error) {
            console.error(
                'Could not load hospital appointments:',
                error.response?.data || error
            )
        }
    }

    loadAppointments()
}, [location.pathname])

// Log out of the Django-authenticated application.
function handleLogout() {
    const confirmLogout = window.confirm(
        'Are you sure you want to log out?'
    )

    if (!confirmLogout) return

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user')

    navigate('/login')
}

return (
    <aside className="w-64 min-h-screen rounded-lg bg-red-700 p-5 text-white">
        <h2 className="mb-10 text-2xl font-bold">
            LifeLink
        </h2>

        <nav className="space-y-3">
            <Link
                to="/hospital/dashboard"
                className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
            >
                <LayoutDashboard size={20} />
                Dashboard
            </Link>

            <Link
                to="/hospital/inventory"
                className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
            >
                <Droplets size={20} />
                Blood Inventory
            </Link>

            <Link
                to="/hospital/appointments"
                className="flex items-center justify-between gap-3 rounded p-3 hover:bg-red-800"
            >
                <span className="flex items-center gap-3">
                    <Calendar size={20} />
                    Appointments
                </span>

                {notificationCount > 0 && (
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-red-600">
                        {notificationCount}
                    </span>
                )}
            </Link>

            <Link
                to="/hospital/create-request"
                className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
            >
                <ClipboardList size={20} />
                Request Blood
            </Link>

            <Link
                to="/hospital/donors"
                className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
            >
                <Users size={20} />
                Donors
            </Link>

            {/* <Link
                to="/hospital/profile"
                className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
            >
                <User size={20} />
                Profile
            </Link> */}

            <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded p-3 text-left hover:bg-red-800"
            >
                <LogOut size={20} />
                Logout
            </button>
        </nav>
    </aside>
)


}

export default Sidebar
