import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/input'
import api from '@/services/api'

function RecentRequests() {
    const [requests, setRequests] = useState([]);
    const navigate= useNavigate();
    const [search, setSearch] = useState("")

     
    useEffect(() => {
    async function fetchRequests() {
        try {
            // Get blood requests from our Django backend.
            const response = await api.get("blood-requests/");

            // Save the requests returned by Django.
            setRequests(response.data);

        } catch (error) {
            console.error("Failed to load blood requests:", error);

            if (error.response?.data) {
                console.error("Django error:", error.response.data);
            }
        }
    }

    fetchRequests();
    }, []);


    async function handleCancel(id) {
        if (!window.confirm("Are you sure you want to cancel this blood request?")) {
            return;
        }
    
        try {
            // Send a cancellation request to the Django backend.
            const response = await api.post(`blood-requests/${id}/cancel/`);
    
            // Update the request using the response returned by Django.
            setRequests((previousRequests) =>
                previousRequests.map((request) =>
                    request.id === id ? response.data : request
                )
            );
    
            alert("Blood request cancelled successfully!");
    
        } catch (error) {
            console.error("Failed to cancel request:", error);
    
            if (error.response?.data) {
                console.error("Django error:", error.response.data);
            }
    
            alert("Failed to cancel blood request.");
        }
    }


   
  return (
    <div className='mt-10 rounded-xl bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-2xl font-semibold'>
        Recent Blood Requests
      </h2>

    <Input
    placeholder = "Search by blood group"
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
             requests
               .filter((request)=> 
                 request.blood_group
                   .toLowerCase().includes(search.toLowerCase()))
             .map((request) => (
                <tr 
                key={request.id}
                className='border-b'>

                    <td className='py-4'>
                        {request.reason}
                    </td>

                    <td>
                        {request.blood_group}
                    </td>

                    <td>
                       <span className={`rounded-full px-3 py-1 text-sm
                        ${
                            request.status === "PENDING"
                            ?"bg-yellow-100 text-yellow-700"
                            :request.status === "APPROVED"
                            ?"bg-green-100 text-green-700"
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
                        onClick={() => handleCancel(request.id)}
                        disable={
                            request.status === "FULFILLED" ||
                            request.status === "CANCELLED"
                        }
                        >
                            Cancel
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
