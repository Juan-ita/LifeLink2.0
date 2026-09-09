import HospitalLayout from '@/components/hospital/HospitalLayout'
import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import InventoryTable from '@/components/hospital/InventoryTable'

function BloodInventory() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [units, setUnits] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  async function handleSubmit(event){
    event.preventDefault();

    if(
      bloodGroup.trim() === "" ||
      units.trim() === "" ||
      expiryDate.trim() === ""
    ){
      alert("Please fill in all fields.");
      return;
    }
    try{
      await addDoc(collection(db, "bloodInventory"),{
        bloodGroup,
        units: Number(units),
        expiryDate,
        status: "Available",
        createdAt: new Date(),
      })
      alert("Blood added successfully!");

      setBloodGroup("")
      setUnits("")
      setExpiryDate("")

    } catch(error){
      console.error(error);
      alert("Something went wrong.")
    }
  }
  return (
    <HospitalLayout>
      <h1 className='text-3xl font-bold'>
        Blood Inventory
      </h1>
      <p className='mt-2 text-gray-500'>
        Manage available blood units.
      </p>

      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>
          Add Blood Inventory
        </CardTitle>
        </CardHeader>

        <CardContent>
          <form 
          onSubmit={handleSubmit}
          className='space-y-5'>
            <div>
              <Label>Blood Group</Label>
              <Input 
              className="p-5 mt-2"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              placeholder="Example: O+"/>
            </div>

            <div>
              <Label>Units Available</Label>
              <Input 
              className="p-5 mt-2"
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="10"/>
            </div>
            <div>

              <Label>Expiry Date</Label>
              <Input 
              className="p-5 mt-2"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}/>
            </div>

            <Button type="submit" className="w-full">
              Add Inventory
            </Button>
          </form>
        </CardContent>
       </Card>

       <InventoryTable/>
    </HospitalLayout>
  )
}

export default BloodInventory
