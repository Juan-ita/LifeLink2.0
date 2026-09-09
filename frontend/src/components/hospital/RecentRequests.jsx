import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { useNavigate } from 'react-router-dom'
import { tr } from 'date-fns/locale';
import { Input } from '../ui/input'

function RecentRequests() {
    const [requests, setRequests] = useState([]);
    const navigate= useNavigate();
    const [search, setSearch] = useState("")

    useEffect(()=>{
        async function fetchRequests(){
            const querySnapshot = await getDocs( //getDocs reads every document in the bloodRequests collection
                collection(db, "bloodRequests")
            );

            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()//doc.data gets the data inside each document
            }));
            setRequests(data); //stores the results in state
        }
        fetchRequests()
    }, [])

    async function handleDelete(id){
        if (!window.confirm("Are you sure u want to delete this request?")){
            return
        }
        try{
            //Delete the document from firebase
            await deleteDoc(doc(db, "bloodRequests", id)) //doc(------) points the specific document inside the bloodRequests collection.

            //Remove the deleted request from the table
            setRequests(
                requests.filter((request) => request.id !== id) //updates the table immediately without refreshing the page
            )
            alert("Blood request deleted successfully!")
        }catch(error){
            console.error(error)
            alert("Failed to delete rwquest.")
        }
    }
   
  return (
    <div className='mt-10 rounded-xl bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-2xl font-semibold'>
        Recent Blood Requests
      </h2>

    <Input
    placeholder = "Search by patient name"
    value={search}
    onChange = {(e) => setSearch(e.target.value)}
    className="mb-5"
    />
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='py-3 text-left'>
                Patient
            </th>

            <th className='py-3 text-left'>
                Blood Group
            </th>

            <th className='py-3 text-left'>
                Status
            </th>

            <th className='py-3 text-left'>
                Action
            </th>
        </tr>  
        </thead>

        <tbody>
            {requests.length === 0? (
                <tr>
                    <td colSpan="4"
                    className='py-6 text-center text-gray-500'>
                        no blood requests found.
                    </td>
                </tr>
            ):(
             requests.filter((request)=> request.patientName.toLowerCase().includes(search.toLowerCase()))
             .map((request) => (
                <tr 
                key={request.id}
                className='border-b'>

                    <td className='py-4'>
                        {request.patientName}
                    </td>

                    <td>
                        {request.bloodGroup}
                    </td>

                    <td>
                       <span className={`rounded-full px-3 py-1 text-sm
                        ${
                            request.status === "Pending"
                            ?"bg-yellow-100 text-yellow-700"
                            :request.status === "Approved"
                            ?"bg-green-100 text-green-700"
                            :request.status === "Urgent"
                            ?"bg-red-100 text-red-700"
                            :"bg-gray-100 text-gray-700"
                        }`}>
                        {request.status}
                    </span>  
                    </td>

                    <td>
                        <div className='flex gap-20'>
                         <Button 
                         onClick={() => navigate(`/hospital/request/${request.id}`)}
                         variant='outline' 
                         size='sm' 
                         className="cursor-pointer">
                            view
                        </Button>   

                        <Button 
                        variant='destructive'
                        size='sm'
                        className="cursor-pointer bg-red-500 text-white shadow-md hover:bg-red-600"
                        onClick={() => handleDelete(request.id)}
                        >
                            Delete
                        </Button>

                        <Button
                        variant='secondary'
                        size='sm'
                        onClick={() => navigate(`/hospital/request/edit/${request.id}`)}
                        >
                            Edit
                        </Button>
                        </div>
                        
                    </td>
                </tr>
            ))
            )
            }
        </tbody>
      </table>
    </div>
  )
}

export default RecentRequests
