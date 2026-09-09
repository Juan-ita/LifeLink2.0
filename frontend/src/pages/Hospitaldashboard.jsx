import DashboardCard from '@/components/hospital/DashboardCard'
import Sidebar from '@/components/hospital/Sidebar'
import { Calendar, Droplets, ClipboardList, Users } from 'lucide-react'
import QuickActions from '@/components/hospital/QuickActions'
import RecentRequests from '@/components/hospital/RecentRequests'
import { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase/FirebaseConfig'

function Hospitaldashboard() {

  const [hospitalName, setHospitalName] = useState("");
  // Store dashboard statistics
  const [status, setStatus] = useState ({
    donors: 0,
    requests: 0,
    units: 0,
    appointments: 0,
  });

  //Run once when the dashboard loads
  useEffect(()=>{
    async function fetchStatus (){
      try{
        //get all blood requests
        const requestsSnapshot = await getDocs(
          collection(db, "bloodRequests")
        );
        //Get all blood inventory
        const inventorySnapshot = await getDocs(
          collection(db, "bloodInventory")
        );
        const usersSnapshot = await getDocs(
          collection(db, "users")
        )
        const appointmentsSnapshot = await getDocs(
          collection(db, "appointments")
        )
        //variable to store total blood units
        let totalUnits = 0;

        //loop through every inventory document
        inventorySnapshot.forEach((doc) => {

          //Add the units from each document
          totalUnits += Number(doc.data().units|| 0);
        })
        //count only users whose role in donor
        const donorCount = usersSnapshot.docs.filter(
          (doc)=>doc.data().role === "donor"
        ).length


       //Read hospital profile
        const hospitalRef = doc(db, "users", auth.currentUser.uid)
        const hospitalSnap = await getDoc(hospitalRef);

        if(hospitalSnap.exists()){
          setHospitalName(hospitalSnap.data().hospitalName)
        }


        //update the dashboard cards
        setStatus({
          donors: donorCount,

          //Number of vlood requests
          requests: requestsSnapshot.size,

          //total blood units available
          units: totalUnits,

          appointments: appointmentsSnapshot.size,
        })
      } catch(error){
        console.error(error);
      }
    }
    //call the function
    fetchStatus()
  }, [])
  return (
    
    <div className='flex min-h-screen bg-gray-100'>
        <Sidebar/>
      <main className='flex-1 p-8'>
        <h1 className='text-3xl font-bold'>Hospital Dashboard</h1>
        <p className='text-gray-500 mt-2'>Welcome back, {hospitalName}</p>

        <div className='mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-6'>
          <DashboardCard 
          title="Registered Donors"
          value={status.donors}
          icon={<Users size={28}/>}
          />

          <DashboardCard 
          title="Blood Requests"
          value={status.requests}
          icon={<ClipboardList size={28}/>}
          />

          <DashboardCard 
          title="Blood Units"
          value={status.units}
          icon={<Droplets size={28}/>}
          />

          <DashboardCard 
          title="Appointments"
          value={status.appointments}
          icon={<Calendar size={28}/>}
          />
        </div>

        <QuickActions/>
        <RecentRequests/>
      </main>
    </div>
  )
}

export default Hospitaldashboard
