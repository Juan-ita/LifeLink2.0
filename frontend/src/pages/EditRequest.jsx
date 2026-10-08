import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import HospitalLayout from '@/components/hospital/HospitalLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import api from '@/services/api'

function EditRequest() {
    const {id} = useParams()
    const navigate = useNavigate()

    const [county, setCounty] = useState("")
    const [deadline, setDeadline] = useState("")
    const  [patientName, setPatientName] = useState("")
    const [bloodGroup, setBloodGroup] = useState("")
    const [units, setUnits] = useState("")
    const [urgency, setUrgency] = useState("")

    useEffect(() => {
      async function fetchRequest() {
        try {
            // Get the blood request from Django.
            const response = await api.get(`blood-requests/${id}/`);

            const data = response.data;

            // Fill the form with the request information.
            setBloodGroup(data.blood_group);
            setUnits(data.units_required);
            setUrgency(data.urgency);

            // Patient, county and deadline are currently stored
            // inside the reason field in our backend.

        } catch (error) {
            console.error("Failed to load blood request:", error);

            if (error.response?.data) {
                console.error("Django error:", error.response.data);
            }
        }
    }

    fetchRequest();
   }, [id]);

     async function handleSubmit(event) {
       event.preventDefault();

      try {
        // Update the blood request in Django.
        await api.patch(`blood-requests/${id}/`, {
            blood_group: bloodGroup.toUpperCase(),
            units_required: Number(units),
            urgency: urgency.toUpperCase(),
        });

        alert("Blood request updated!");

        // Return to the hospital dashboard.
        navigate("/hospital/dashboard");

     } catch (error) {
        console.error("Failed to update blood request:", error);

        if (error.response?.data) {
            console.error("Django error:", error.response.data);
        }

        alert("Failed to update blood request.");
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
                    onChange={(event) => setDeadline(event.target.value)}
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
