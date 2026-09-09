import React from 'react'
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import HospitalLayout from './HospitalLayout'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'


function HospitalDonors() {
    const [donors, setDonor] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function fetchDonors(){

            //Read every user
            const snapShot = await getDocs(
                collection(db, "users")
            );

            //keep only donors
            const donorList = snapShot.docs.map((doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter((user)=> user.role === "donor")

            //save donors
            setDonor(donorList)
        }
        fetchDonors()
    }, [])
  return (
    <HospitalLayout>
      <h1 className='text-3xl font-bold'>
        Registered Donors
      </h1>

      <p className='text-gray-500 mt-2'>
        View all registered blood donors
      </p>

      <Input 
      className="mt-6"
      placeholder="Search donor..."
      value={search}
      onChange={(e)=> setSearch(e.target.value)}
      />

      <div className='mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
        {donors.filter((donor) => donor.fullName ?.toLowerCase().includes(search.toLowerCase())
    ).map((donor) => (
        <Card key={donor.id}>
            <CardContent className="space-y-2 pt-6">
                <h2 className='text-xl font-bold'>
                    {donor.fullName}
                </h2>

                <p>
                    {donor.bloodGroup}
                </p>
                <p>
                    {donor.county}
                </p>
                <p>
                    {donor.phoneNumber}
                </p>
                <p>
                    {donor.email}
                </p>
            </CardContent>
        </Card>
    ))}
      </div>
    </HospitalLayout>
  )
}

export default HospitalDonors
