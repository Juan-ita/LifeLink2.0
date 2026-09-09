import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { useNavigate, useParams } from 'react-router-dom'
import DonorLayout from '@/components/donor/DonorLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { auth } from '@/firebase/FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

function BookAppointment() {
    //gets the request ID from the URL
    const {id} = useParams();
    const navigate = useNavigate()

    //store the appointment date
    const [date, setDate] = useState("")
    //store the appointment time
    const [time, setTime] = useState("")    

    async function handleSubmit(event){
        console.log("Current user:", auth.currentUser)

        if(!auth.currentUser){
            alert("No user is logged in.")
            return;
        }
        console.log("UDI:", auth.currentUser.uid)

        event.preventDefault();

        //check if the data is empty
        if(date.trim() === ""){
            alert("Please select a date.")
            return;
        }
        if(time.trim() === ""){
            alert("Please select a time.")
            return;
        }
        try{
            
        const requestRef = doc(db, "bloodRequests", id);
        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()){
            alert("Blood request not found.")
            return;
        }
        //store blood data
        const request = requestSnap.data()

        console.log("Logged in user:",
            auth.currentUser)
        console.log("Current UID:", auth.currentUser.uid)    

        const donorRef = doc(db, "users", auth.currentUser.uid)
        const donorSnap = await getDoc(donorRef);

        console.log("Donor exists:", donorSnap.exists())

        if(!donorSnap.exists()){
            alert("Donor profile not found.")
            return;
        }
        // Check age
        const donor = donorSnap.data()
         const birthDate = new Date(donor.birth);
         const today = new Date();

         let age = today.getFullYear() - birthDate.getFullYear();

         const monthDifference = today.getMonth() - birthDate.getMonth();

         if(
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
         ){
            age--;
         }
         if (age < 18){
            alert("You must be atleast 18 years old to donate.")
            return;
         }

         // Check weight
         if (Number(donor.weight) < 50){
            alert("You must weigh at least 50kg to donate blood.")
            return;
         }

        console.log(donor);
        console.log(request)
            //Save the appointment in firebase
            await addDoc(collection(db, "appointments"), {
                //blood request
                requestId: id,
                patientName: request.patientName,
                bloodGroup: request.bloodGroup,
                county: request.county,

                //donor details
               donorId: auth.currentUser.uid,
               donorName: donor.fullName,
               donorEmail: auth.currentUser.email,
               donorBloodGroup: donor.bloodGroup,
               donorCounty: donor.county,
               donorPhone: donor.phoneNumber,

                //Appointment details
                appointmentDate : date,
                appointmentTime: time,

                //Default appointment status
                status: "Pending",

                //notification has not been opened yet
                notificationRead: false,
                
                //Date created
                createAt: new Date(),
            });
            //Let the donor know it worked
            alert("Appointment booked successfully!")
            navigate("/donor/dashboard")

            await addDoc(collection(db, "notifications"), {
            message: `${donor.fullName} booked a donation appointment.`,
            createdAt: new Date()
        })

        } catch(error){
            console.error(error);
            alert(error.message)
        }

        
    }
  return (
    <DonorLayout>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
            <CardTitle>
                Book Donation Appointment
            </CardTitle>
        </CardHeader>

        <CardContent>
            <form 
            onSubmit={handleSubmit}
            className='space-y-5'>
                <div>
                    <Label>Date</Label>
                    <Input 
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    />
                </div>

                <div>
                    <Label>Time</Label>

                    <Input 
                    type="time"
                    value={time}
                    onChange={(event)=> setTime(event.target.value)}
                    />
                </div>

                <Button
                type="submit"
                className="w-full">
                    Book Appointment
                </Button>
            </form>
        </CardContent>
      </Card>
    </DonorLayout>
  )
}

export default BookAppointment
