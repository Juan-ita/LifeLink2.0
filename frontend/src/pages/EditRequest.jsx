import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '@/firebase/FirebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import HospitalLayout from '@/components/hospital/HospitalLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function EditRequest() {
    const {id} = useParams()
    const navigate = useNavigate()

    const[county, setCounty] = useState("")
    const[deadline, setDedline] = useState("")
    const [patientName, setPatientName] = useState("")
    const[bloodGroup, setBloodGroup] = useState("")
    const[units, setUnits] = useState("")
    const[urgency, setUrgency] = useState("")

    useEffect(()=> {
        async function fetchRequest(){
            const docRef = doc(db, "bloodRequests", id);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()){
                const data = docSnap.data();

                setPatientName(data.patientName)
                setBloodGroup(data.bloodGroup)
                setUnits(data.units)
                setUrgency(data.urgency)
                setCounty(data.county)
                setDedline(data.deadline)
            }
        }
        fetchRequest()
    }, [id])

    async function handleSubmit(event){
        event.preventDefault();
        try{
            await updateDoc(doc(db, "bloodRequests", id), {
                patientName,
                bloodGroup,
                units,
                urgency,
                county,
                deadline,
            });
            alert("Blood request updated!");
            navigate("/hospital/dashboard");
        }catch(error) {
            console.error(error)
        }
    }
  return (
    <HospitalLayout className="p-3">
        <form onSubmit={handleSubmit} className='space-y-5 p-5'>
                <div>
                    <Label>Patient</Label>

                    <Input 
                    className="p-6 mt-2"
                    value={patientName}
                    onChange={(event) => setPatientName(event.target.value)}
                    placeholder="Enter patient name"
                    />
                </div>

                <div>
                    <Label>Blood Group</Label>

                    <Input 
                    className="p-6 mt-2"
                    value={bloodGroup}
                    onChange={(event) => setBloodGroup(event.target.value)}
                    placeholder="Example: A+"
                    />
                </div>
                <div>
                    <Label>Units Needed</Label>

                    <Input 
                    className="p-6 mt-2"
                    value={units}
                    onChange={(event) => setUnits(event.target.value)}
                    placeholder="2"
                    />
                </div>
                <div>
                    <Label>Urgency</Label>

                    <Input 
                    className="p-6 mt-2"
                    value={urgency}
                    onChange={(event) => setUrgency(event.target.value)}
                    placeholder="Urgent"
                    />
                </div>
                <div>
                    <Label>County</Label>

                    <Input
                    className="p-6 mt-2" 
                    value={county}
                    onChange={(event) => setCounty(event.target.value)}
                    placeholder="Nairobi"
                    />
                </div>
                <div>
                    <Label>Deadline</Label>

                    <Input 
                    className="p-6 mt-2"
                    type="date"
                    value={deadline}
                    onChange={(event) => setDedline(event.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full p-6">
                    Update Request
                </Button>
            </form>
      
    </HospitalLayout>
  )
}

export default EditRequest
