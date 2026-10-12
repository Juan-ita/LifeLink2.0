import HospitalLayout from '@/components/hospital/HospitalLayout'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import InventoryTable from '@/components/hospital/InventoryTable'

import api from '@/services/api'

function BloodInventory() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [units, setUnits] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  async function handleSubmit(event) {
    event.preventDefault();

    if (
        bloodGroup.trim() === "" ||
        units.trim() === ""
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        // Send the inventory information to Django.
        await api.post("inventory/", {
            blood_group: bloodGroup.toUpperCase(),
            units_available: Number(units),
            expiry_date: expiryDate,
        });

        alert("Blood added successfully!");

        // Clear the form.
        setBloodGroup("");
        setUnits("");
        setExpiryDate("");

        await fetchInventory();

    } catch (error) {
        console.error("Failed to add inventory:", error);

        if (error.response?.data) {
            console.error("Django error:", error.response.data);
        }

        alert("Something went wrong while adding inventory.");
    }
 }

 const [inventory, setInventory] = useState([]);

 //Fetch inventory records from django
 async function fetchInventory(){
  try{
    const response = await api.get("inventory/");
    setInventory(response.data);

  } catch(error){
    console.error("Failed to load inventory:", error);
  }

 }

 //Fetch inventory when the page firsts loads.
 useEffect(() => {
  fetchInventory();
 }, []);

  

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

       <InventoryTable 
          inventory ={inventory}
          setInventory={setInventory}
          />
    </HospitalLayout>
  )
  }


export default BloodInventory
