import DonorLayout from '@/components/donor/DonorLayout'
import { Heart, Clipboard, CheckCircle, Clock, Calendar } from 'lucide-react'
import DonorCards from '@/components/donor/DonorCards'
import { db, auth } from '@/firebase/FirebaseConfig'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import DonorQuickActions from '@/components/donor/DonorQuickActions'
import EmergencyRequests from '@/components/donor/EmergencyRequests'

function DonorDashboard() {
  const [donor, setDonor] = useState(null)
  const [stats, setStats] = useState({
    requests: 0,
    appointments: 0,
    approved: 0,
    pending: 0,

  })

  useEffect(()=>{
    async function fetchStats(){
      try {
        //Get all blood requests
        const requestSnapshot = await getDocs(
          collection(db, "bloodRequests")
        );

        //Get all appointments
        const appointmentsSnapshots = await getDocs(
          collection(db, "appointments")
        );

        //Get only this donor's appointment
        const myAppointments = appointmentsSnapshots.docs.filter((doc)=>
        doc.data().donorId === auth.currentUser.uid)

        //Count approved appointments
        const approved = myAppointments.filter(
          (doc) => doc.data().status === "Approved"
        )

        //count pending appointments
        const pending = myAppointments.filter(
          (doc)=> doc.data().status=== "Pending"
        ) 

        setStats({
          requests: requestSnapshot.size,
          appointments: myAppointments.length,
          approved: approved.length,
          pending: pending.length,
        })

         const donorSnap = await getDoc(
      doc(db, "users", auth.currentUser.uid)
    )
    if(donorSnap.exists()){
      setDonor(donorSnap.data())
    }
      }catch(error){
        console.error(error)
      }
      
    }
    fetchStats()
  }, [])
  return (
    <DonorLayout>
        <main className='flex-1 p-8'>
         <h1 className='text-3xl font-bold'>
            Welcome Back, {donor?.fullName}
        </h1> 
         <p className='mt-2 text-gray-500'>
         Ready to make another life-saving donation?
         </p>

    <div className='mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-6'>
        <DonorCards
        title="Available Requests"
        value={stats.requests}
        icon={<Clipboard size={28}/>}
        />

        <DonorCards
        title="My Appointments"
        value={stats.appointments}
        icon={<Calendar size={28}/>}
        />
        <DonorCards
        title="Approved"
        value={stats.approved}
        icon={<CheckCircle  size={28}/>}
        />
        <DonorCards
        title="Pending"
        value={stats.pending}
        icon={<Clock size={28}/>}
        />

    </div>
      </main>
      <DonorQuickActions/>
      <EmergencyRequests/>
      
    </DonorLayout>
  )
}

export default DonorDashboard
