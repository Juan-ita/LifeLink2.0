import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Droplets, Calendar, User, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '@/services/api'

function DonorSidebar() {
const [notificationCount, setNotificationCount] = useState(0)
const navigate = useNavigate()
const location = useLocation()

// Refresh the unread notification count whenever the donor changes pages.
useEffect(() => {
async function loadNotifications() {
try {
const response = await api.get('notifications/')

    const notifications = Array.isArray(response.data)
      ? response.data
      : response.data.results ?? []

    const unreadNotifications = notifications.filter(
      (notification) => notification.is_read === false
    )

    setNotificationCount(unreadNotifications.length)
  } catch (error) {
    console.error(
      'Could not load donor notifications:',
      error.response?.data || error
    )
  }
}

loadNotifications()

}, [location.pathname])

// Log out using the JWT-based Django authentication setup.
async function handleLogout() {
const confirmLogout = window.confirm(
'Are you sure you want to log out?'
)


if (!confirmLogout) return

try {
  // Remove the JWT tokens used by the Django API.
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_role')
  localStorage.removeItem('user')

  alert('Logged out successfully')
  navigate('/login')
} catch (error) {
  console.error('Logout failed:', error)
  alert('Failed to log out.')
}


}

return ( 
<aside className="w-64 min-h-screen bg-red-700 p-5 text-white"> 
  <h2 className="mb-10 text-2xl font-bold">
     LifeLink </h2>


  <nav className="space-y-5">
    {/* Dashboard */}
    <Link
      to="/donor/dashboard"
      className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
    >
      <LayoutDashboard />
      Dashboard
    </Link>

    {/* Blood requests */}
    <Link
      to="/donor/requests"
      className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
    >
      <Droplets />
      Blood Requests
    </Link>

    {/* My appointments and unread notification badge */}
    <Link
      to="/donor/appointments"
      className="flex items-center justify-between gap-3 rounded p-3 hover:bg-red-800"
    >
      <span className="flex items-center gap-3">
        <Calendar />
        My Appointments
      </span>

      {notificationCount > 0 && (
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-red-600">
          {notificationCount}
        </span>
      )}
    </Link>

    {/* Profile */}
    <Link
      to="/donor/profile"
      className="flex items-center gap-3 rounded p-3 hover:bg-red-800"
    >
      <User />
      Profile
    </Link>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded p-3 hover:bg-red-800"
    >
      <LogOut />
      Logout
    </button>
  </nav>
</aside>


)
}

export default DonorSidebar
