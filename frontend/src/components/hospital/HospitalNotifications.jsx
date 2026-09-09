import React from 'react'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import HospitalLayout from './HospitalLayout'

function HospitalNotifications() {
    const [notifications, setNotifications] = useState([])

    useEffect(()=>{
        async function fetchNotifications(){
            const snapShot = await getDocs(
                collection(db, "notifications")
            );
            const data = snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setNotifications(data.reverse())
        }
        fetchNotifications()
    }, [])
  return (
    <HospitalLayout>
      <h1 className='text-3xl font-bold'>
        Notification
      </h1>

      <div className='mt-8 space-y-4'>
        {notifications.length === 0 ? (
            <p className='text-gray-500'>
                No notifications yet
            </p>
        ):(
            notifications.map((notification) => (
                <div 
                key={notification.id}
                className='rounded-lg border bg-white p-4 shadow'
                >
                    <p className='font-medium'>
                        {notification.message}
                    </p>
                </div>
            ))
        )}
      </div>
    </HospitalLayout>
  )
}

export default HospitalNotifications
