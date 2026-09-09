import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clipboard, User } from 'lucide-react'
import { Button } from '../ui/button'

function DonorQuickActions() {

    const navigate = useNavigate()
  return (
    <div className='mt-10'>
        <h2 className='mb-4 text-2xl font-semibold'>
            Quick Actions
        </h2>

        <div className='flex flex-wrap gap-4'>
            {/* find blood request */}
            <Button 
            onClick={()=> navigate("/donor/requests")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
                <Clipboard size={18}/>
                Find Blood Requests
            </Button>

            <Button
            onClick={() => navigate("/donor/appointemts")}
            variant='outline'
            className="flex items-center gap-2"
            >
                <Calendar size={18}/>
                My Appointments
            </Button>

            <Button
            onClick={()=> navigate("/donor/profile")}
            variant='outline'
            className="flex items-center gap-2"
            >
                <User/>
                My Profile
            </Button>
        </div>
    </div>
  )
}

export default DonorQuickActions
