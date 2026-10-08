import { useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import HospitalLayout from './HospitalLayout';

import api from '@/services/api';

function CreateRequest() {
    const[county, setCounty] = useState("")
    const[deadline, setDeadline] = useState("")
    const [patientName, setPatientName] = useState("")
    const[bloodGroup, setBloodGroup] = useState("")
    const[units, setUnits] = useState("")
    const[urgency, setUrgency] = useState("")

    const navigate = useNavigate()

async function handleSubmit(event){
    event.preventDefault();
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

try{
     // Send the blood request to our Django backend.
    // The hospital is identified automatically from the logged-in hospital account.
    await api.post("blood-requests/", {

        //Blood group requested by the patient
        blood_group: bloodGroup.toUpperCase(),

        // Convert the units from text to a number
        units_required: Number(units),

        // Django expects NORMAL, URGENCY, CRITICAL
        urgency: urgency.toUpperCase(),

        // Store the extra form information in the request reason
        reason: `Patient: ${patientName}. County: ${county}. Deadline: ${deadline}.`,
    })

    // Let the user know the request was created
    alert("Blood request created successfully!");

    // Clear the form
    setPatientName("");
    setBloodGroup("");
    setUnits("");
    setUrgency("");
    setCounty("")
    setDeadline("");

    // Reset the form fields to their empty values.
    event.target.reset();

    // Return to the dashboard
    navigate('/hospital/dashboard')

    }catch(error){
        // Show the full error in the browser console
        console.error("Failed to create blood request:", error);

        // Show a userful message to the user
        if(error.response?.data){
            console.error("Django error:", error.response.data);
    }
    alert("Something went wrong while creating the blood request.")
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
                    onChange={(event) => setDeadline(event.target.value)}
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
