// Firebase functions
import { collection, addDoc } from 'firebase/firestore';
// firebade data
import { db } from '@/firebase/FirebaseConfig';
import { useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import HospitalLayout from './HospitalLayout';
import Sidebar from './Sidebar';

function CreateRequest() {
    const[county, setCounty] = useState("")
    const[deadline, setDedline] = useState("")
    const [patientName, setPatientName] = useState("")
    const[bloodGroup, setBloodGroup] = useState("")
    const[units, setUnits] = useState("")
    const[urgency, setUrgency] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(event){
    event.preventDefault();
    try{
        await addDoc(collection(db, "bloodRequests"), {
        patientName,
        bloodGroup,
        units,
        urgency,
        county,
        deadline,
        status: urgency,

        //Save the date the request was created
        createdAt: new Date(),
        });

        // Error messages
if(patientName.trim()===""){
    alert("Patient name is required.")
    return;
}
if(bloodGroup.trim() === ""){
    alert("Blood group is required.")
    return
}
if(units.trim() ===""){
    alert("Units needed is required.")
    return
}
if(urgency.trim() ===""){
    alert("urgency is required.")
    return
}
if(county.trim() ===""){
    alert("County is required.")
    return
}
if(deadline.trim() ===""){
    alert("Dealine is required.")
    return
}

        //Let the user know it works
        alert("Blood request created successfully!")

        //Clear form
        setPatientName("")
        setBloodGroup("")
        setUnits("")
        setUrgency("")
        setCounty("")
        setDedline("")

        navigate("/hospital/dashboard")

    }catch(error){
        console.error(error)
        alert("Something went wrong.")
        return;
    }
}



  return (
    
    <HospitalLayout className='p-8 '>  
      <Card className="mx-auto max-w-2xl">
         <CardHeader>
            <CardTitle>
                Create Blood Request
            </CardTitle>
        </CardHeader>

        <CardContent>
            <form onSubmit={handleSubmit} className='space-y-5'>
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
                    value={units}
                    onChange={(event) => setUnits(event.target.value)}
                    placeholder="2"
                    />
                </div>
                <div>
                    <Label>Urgency</Label>

                    <Input 
                    value={urgency}
                    onChange={(event) => setUrgency(event.target.value)}
                    placeholder="Low"
                    />
                </div>
                <div>
                    <Label>County</Label>

                    <Input 
                    value={county}
                    onChange={(event) => setCounty(event.target.value)}
                    placeholder="Nairobi"
                    />
                </div>
                <div>
                    <Label>Deadline</Label>

                    <Input 
                    type="date"
                    value={deadline}
                    onChange={(event) => setDedline(event.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full">
                    Create Request
                </Button>
            </form>
        </CardContent>
      </Card>         
      
    </HospitalLayout>
  )
}

export default CreateRequest
