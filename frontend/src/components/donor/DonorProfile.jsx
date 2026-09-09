import React from 'react'
import { useState, useEffect } from 'react'
import { auth, db } from '@/firebase/FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import DonorLayout from './DonorLayout'
import { onAuthStateChanged } from 'firebase/auth'

function DonorProfile() {

    const [donor, setDonor] = useState(null);

    useEffect(() => {
        async function fetchDonor(){
            //Make sure the donor is logged in
            if (!auth.currentUser) return;

            //reference to the logged-in donor
            const docRef = doc(db, "users", auth.currentUser.uid)

            //Get donor data
            const docSnap = await getDoc(docRef)

            console.log(auth.currentUser.uid);
            console.log(docSnap.data());

            //if donor exists
            if(docSnap.exists()){
                setDonor(docSnap.data())
                console.log(docSnap.data())
            }
            

        }
        fetchDonor()
    }, [])

    //loading state
    if(!donor){
        return(
            <DonorLayout>
                <p>Loading...</p>
            </DonorLayout>
        )
    }
  return (
    <DonorLayout>
      <Card className="max-w-3xl">
        <CardHeader>
            <CardTitle className="font-bold text-xl">
                {donor.fullName}
            </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
            <div>
                <strong>Email:</strong> {donor.email}
            </div>

            <div>
                <strong>Phone:</strong> {donor.phoneNumber}
            </div>

            <div>
                <strong>Blood Group:</strong> {donor.bloodGroup}
            </div>

            <div>
                <strong>Gender:</strong> {donor.gender}
            </div>

            <div>
                <strong>Date of Birth:</strong> {donor.birth}
            </div>

            <div>
                <strong>County:</strong> {donor.county}
            </div>

            <div>
                <strong>Weight:</strong> {donor.weight} kg
            </div>

        </CardContent>

        <div className='p-8'>
        </div>
      </Card>
    </DonorLayout>
  )
}

export default DonorProfile
