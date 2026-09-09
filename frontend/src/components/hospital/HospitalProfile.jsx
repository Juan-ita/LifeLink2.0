import React from 'react'
import { useState, useEffect } from 'react'
import { auth, db } from '@/firebase/FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import HospitalLayout from './HospitalLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

function HospitalProfile() {
    const [hospital, setHospital] = useState(null)

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(async(user) =>{
            //if nobody is logged in, stop
            if(!user) return;

            //find this hospital i firebase
            const docRef = doc(db, "users", user.uid);
            //get hospital document
            const docSnap = await getDoc(docRef)

            //if document exists, save in state
            if(docSnap.exists()){
                setHospital(docSnap.data())
            }
        })
        return()=> unsubscribe()
    }, [])

    if(!hospital){
        return(
            <HospitalLayout>
                <p>Loading...</p>
            </HospitalLayout>
        )
    }
  return (
    <HospitalLayout>
      <Card className="max-w-3xl">
        <CardHeader>
            <CardTitle>
                {hospital.hospitalName}
            </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5"> 
            <div>
                <strong>Facility Type:</strong> {hospital.facilityType}
            </div>
            <div>
                <strong>Hospital Email:</strong> {hospital.hospitalEmail}
            </div>
            <div>
                <strong>Phone:</strong> {hospital.hospitalPhone}
            </div>
            <div>
                <strong>Website:</strong> {hospital.website}
            </div>
            <div>
                <strong>County:</strong> {hospital.county}
            </div>
            <div>
                <strong>City:</strong> {hospital.city}
            </div>
            <div>
                <strong>Address:</strong> {hospital.address}
            </div>
            <div>
                <strong>License Number</strong> {hospital.licenseNumber}
            </div>
            <div>
                <strong>Administrator:</strong> {hospital.adminName}
            </div>
            <div>
                <strong>Job Title:</strong> {hospital.jobTitle}
            </div>
            <div>
                <strong>Admin Email:</strong> {hospital.adminEmail}
            </div>
            <div>
                <strong>Admin Phone:</strong> {hospital.adminPhone}
            </div>
        </CardContent>
      </Card>
    </HospitalLayout>
  )
}

export default HospitalProfile
