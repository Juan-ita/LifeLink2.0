import React from 'react'
import { useEffect, useState } from 'react'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import HospitalLayout from '@/components/hospital/HospitalLayout'
import { Button } from '@/components/ui/button'
import { doc, updateDoc } from 'firebase/firestore'

function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);

  async function updateAppointmentStatus(id, status){
    try{
      //find the appointment document
      const appointmentRef = doc(db, "appointments", id)

      //update its status
      await updateDoc(appointmentRef, {
        status: status,
      });

      //update the page without refreshing
      setAppointments((previousAppointments) => previousAppointments.map((appointment) =>
        appointment.id === id ?{...appointment, status: status}
        :appointment
      
      ))
      alert(`Appointment ${status}!`)
    }catch (error){
      console.error(error);
      alert("Failed to update appointment.")
    }
  }

  useEffect(() => {
    async function fetchAppointments(){

      //Read every appointment
      const querySnapshot = await getDocs(
        collection(db, "appointments")
      );

      //convert firebase documents into a normal array
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      for (const appointment of data) {
  if (!appointment.notificationRead) {
    await updateDoc(
      doc(db, "appointments", appointment.id),
      {
        notificationRead: true,
      }
    );

    appointment.notificationRead = true;
  }
}

      setAppointments(data);
    }
    fetchAppointments()
  }, [])
  return (
    <HospitalLayout>
      <h1 className='text-3xl font-bold'>
        Donor Appointments
      </h1>

      <div className='mt-8 space-y-5'>
        {appointments.length === 0? (
          <div className='rounded-xl bg-white p-6 text-center shadow-md'>
            No appointments found
          </div>
        ):(
          appointments.map((appointment) => (
            <div 
            key={appointment.id}
            className='rounded-xl bg-white p-6 shadow-md'>
              <h2 className='text-xl font-bold'>
               Donor: {appointment.donorName}
              </h2>
              <p className='text-gray-700 flex'>
                  {appointment.patientName}
                  </p>

                  <p className='mt-3 font-semibold text-red-600 flex gap-2'>
                    <h2 className='font-black text-black'>Recipient's Blood Group:</h2> {appointment.bloodGroup}
                  </p>
                  
                  <p className='flex'>
                     <h2 className='font-black'>Date:</h2>{appointment.appointmentDate}
                  </p>

                  <p className='flex'>
                    <h2 className='font-black'>Time:</h2> {appointment.appointmentTime}
                  </p>

                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${
                    appointment.status === "Pending"
                    ?"bg-yellow-100 text-yellow-700"
                    :appointment.status === "Approved"
                    ?"bg-green-100 text-green-700"
                    :"bg-red-100 text-red-500"
                  }`}>
                    {appointment.status}
                  </span>

                  {appointment.status === "Pending" && (
                     <div className='flex gap-3'>
                      <Button
                      size='sm'
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateAppointmentStatus(appointment.id, "Approved")}
                      >
                        Approve
                      </Button>

                      <Button
                      size='sm'
                      variant='destructive'
                      onClick={()=>updateAppointmentStatus(appointment.id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                 
            </div>
          ))
        )}
      </div>
  </HospitalLayout>
  )
}

export default HospitalAppointments
