import React from 'react'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import DonorLayout from '@/components/donor/DonorLayout'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function AvailableRequests() {

    //Stores blood requests from firebase
    const [requests, setRequests] = useState([])

    //Allows navigation to another page
    const navigate = useNavigate();

    useEffect (() => {
        async function fetchRequests(){
            //Read every document inside the bloodrequests collection
            const querySnapshot = await getDocs(
                collection(db, "bloodRequests")
            );
            //convert FireBase documents into a normal array
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
             //save the requests into stae
            setRequests(data)
        }
       

         //Call the function
         fetchRequests()   
    }, [])
  return (
    <DonorLayout>
      <h1 className='text-3xl font-bold'>
        Available Blood Requests
      </h1>

      {/* Table */}
      <table className='mt-8 w-full border-collapse rounded-xl bg-white shadow-md'>
        <thead>
            <tr className='border-b'>
                <th className='p-4 text-left'>
                    patient
                </th>
                <th className='p-4 text-left'>
                    Blood Group
                </th>
                <th className='p-4 text-left'>
                    County
                </th>
                <th className='p-4 text-left'>
                    Urgency
                </th>
                <th className='p-4 text-left'>
                    Action
                </th>
            </tr>
        </thead>

        <tbody>
            {/* loop through every request */}
            {requests.length === 0?(
                <tr>
                    <td 
                    colSpan="5"
                    className='py-6 text-center text-gray-500'>
                        No blood requests found
                    </td>
                </tr>
            ):(
            requests.map((request) => (
                <tr 
                key={request.id}
                className='border-b'>

                    <td className='p-4'>
                        {request.patientName}
                    </td>

                    <td>
                        {request.bloodGroup}
                    </td>

                    <td>
                        {request.county}
                    </td>

                    <td>
                        {request.status}
                    </td>

                    <td>
                        <Button onClick={() => navigate(`/donor/book/${request.id}`)}>
                            Donate
                        </Button>
                    </td>
                </tr>
            )))}
        </tbody>
      </table>
    </DonorLayout>
  )
}

export default AvailableRequests
