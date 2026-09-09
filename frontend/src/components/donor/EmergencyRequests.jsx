import React from 'react'
import { useState, useEffect } from 'react'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

function EmergencyRequests() {

    const [requests, setRequest] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchRequests(){
            const snapShot = await getDocs(
                collection(db, "bloodRequests")
            )

            const data = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            //Show only 3 requests
            setRequest(data.slice(0,3))
        }
        fetchRequests()
    }, [])
  return (
    <div className='mt-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
            Emergency Blood Requests
        </h2>

        <Button
        variant='outline'
        onClick={()=> navigate("/donor/requests")}
        >
            View All
        </Button>
      </div>

      <div>
        {requests.map(request => (
            <div
            key={request.id}
            className='rounded-xl border bg-white p-5 shadow-sm'
            >
                <h3 className='text-lg font-bold flex'> 
                  {request.patientName}
                </h3>

                <p className='text-gray-500'>
                    {request.county}
                </p>

                <p className='mt-2 text-red-600 font-semibold'>
                    {request.bloodGroup}
                </p>

                <Button
                className="mt-4"
                onClick={()=> navigate(`/donor/book/${request.id}`)}
                >
                    Book Appointment
                </Button>
            </div>
        ))}
      </div>
    </div>
  )
}

export default EmergencyRequests
