import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '@/firebase/FirebaseConfig'
import { getDoc, doc } from 'firebase/firestore'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'


function RequestDetails() {
    //Get the document id from the url
    const {id} = useParams()

    //store the request
    const[request, setRequest] = useState(null)

    useEffect(()=>{
        async function fetchRequest(){
            try{
                const docRef = doc(db, "bloodRequests", id);// goes to blood requests collection and finds the document whose ID matches the URL
                const docSnap = await getDoc(docRef);// reads only the one document
                if(docSnap.exists()){
                    setRequest({
                        id: docSnap.id,
                        ...docSnap.data()
                    })
                }
            }catch(error){
                console.log(error)
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
            <p><strong>Patient:</strong> {request.patientName}</p>
            <p><strong>Blood Group:</strong>{request.bloodGroup}</p>
            <p><strong>Units:</strong> {request.units}</p>
            <p><strong>Urgency:</strong> {request.urgency}</p>
            <p><strong>County:</strong> {request.county}</p>
            <p><strong>Deadline:</strong> {request.deadline}</p>

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
