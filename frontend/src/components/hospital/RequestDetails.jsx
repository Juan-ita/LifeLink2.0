import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'


import api from '@/services/api'

function RequestDetails() {
    //Get the document id from the url
    const {id} = useParams()

    //store the request
    const[request, setRequest] = useState(null)

useEffect(() => {
    async function fetchRequest() {
        try {
            // Get this specific blood request from Django.
            const response = await api.get(`blood-requests/${id}/`);

            // Store the request in state.
            setRequest(response.data);

        } catch (error) {
            console.error("Failed to load blood request:", error);

            if (error.response?.data) {
                console.error("Django error:", error.response.data);
            }
        }
    }

    fetchRequest();
}, [id]);

    if(!request){
        return(
            <div>
                <h1>Loading</h1>
            </div>
        )
    }
  return (
    <main className='p-8'>
      <Card className="mx-auto max-w-2xl shadow-lg bg-gray-100">
        <CardHeader>
            <CardTitle>
                Blood Request Details
            </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
            <p><strong>Request Details:</strong> {request.reason}</p>
            <p><strong>Blood Group:</strong>{request.blood_group}</p>
            <p><strong>Units:</strong> {request.units_request}</p>
            <p><strong>Urgency:</strong> {request.urgency}</p>
            <p><strong>Status:</strong> {request.status}</p>

            <Link to="/hospital/dashboard">
              <Button>
                Back to Dashboard
              </Button>
            </Link>
        </CardContent>
      </Card>
    </main>
  )
}

export default RequestDetails
