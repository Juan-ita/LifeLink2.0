import React from 'react'
import { useEffect, useState } from 'react'
import { auth, db } from '@/firebase/FirebaseConfig'
import { collection, getDocs, doc, updateDoc} from 'firebase/firestore'
import DonorLayout from './DonorLayout'

function MyAppointments() {
    //store the donor's appointment
    const [appointments, setAppointments] = useState([]);

    useEffect (() => {
        async function fetchAppointments(){
            //Get all appiontments
         const querySnapshot = await getDocs (
            collection(db, "appointments")
         );

         //Keep only the logged in donor's appointment
         const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }))
         .filter(
            (appointment)=> appointment.donorId === auth.currentUser.uid
         );

         //Mark notifications as read
         for (const appointment of data){
            if(!appointment.notificationRead){
                await updateDoc(
                    doc(db, "appointments", appointment.id),
                    {
                        notificationRead: true,
                    }
                )
                //update local object
                appointment.notificationRead = true;
            }
         }

         //save appointments
         setAppointments(data)
        }
        fetchAppointments()
         
    }, []);

     async function cancelAppointment(id){
            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this appointment?"
            )
            if(!confirmCancel)return;

            try{
                await updateDoc(doc(db, "appointments", id), {
                    status: "Cancelled",
                })

                //Update the page immediately
                setAppointments((previousAppointments) => 
                previousAppointments.map((appointment) => appointment.id === id
               ?{...appointment, status: "Cancelled"}
                 : appointment)
                )
                
                 alert("Appointment cancelled successfully.")
            } catch (error){
                console.error(error);
                alert ("Failed to cancel appointment.")
            }
        }
  return (
    <DonorLayout>
      <h1 className='text-3xl font-bold'>
        My Appointments 
      </h1>

      <div className='mt-8 space-y-5'>
        {appointments.length === 0? (
            <p className='text-gray-500'> 
                You have no appointments
            </p>
        ): (
            appointments.map((appointment) => (
                <div 
                key={appointment.id}
                className='rounded-xl bg-white p-6 shadow'
                >

                    {/* patient */}
                    <h2 className='text-xl font-bold'>
                        {appointment.patientName}
                    </h2>

                    {/* Blood group */}
                    <p className='text-red-600 font-semibold'>
                        {appointment.bloodGroup}
                    </p>

                    {/* Date */}
                    <p className='mt-2'>
                        {appointment.appointmentDate}
                    </p>

                    {/* Time */}
                    <p>
                        {appointment.appointmentTime}
                    </p>

                    <span 
                    className={`mt-4 inline-block rounded-full px-3 py-1 text-sm ${
                        appointment.satus === "Pending"
                        ?"bg-yellow-100 text-yellow-700"
                        :appointment.satus === "Approved"
                        ?"bg-green-100 text-green-700"
                        :"bg-red-100 text-red-700"
                    }`}
                    >
                        {appointment.status}
                    </span>

                    {/* Hospital message */}
                    <p className='mt-4 text-sm text-gray-600'>
                        {appointment.status === "Approved"
                        ? "Your appointment has been approved. Please arrive 15 minutes early."
                        :appointment.status === "Rejected"
                        ? "Unfortunately your appointment was not approved. Thank you for volunteering."
                        :"Your appointment is awaiting hospital approval." 
                         }
                        {appointment.status === "Pending" && (
                            <button 
                            onClick={() => cancelAppointment(appointment.id)}
                            className='mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                            >
                                Cancel Appointment
                            </button>
                        )}
                      
                    </p>
                </div>
            ))
        )}
      </div>
    </DonorLayout>
  )
}

export default MyAppointments
