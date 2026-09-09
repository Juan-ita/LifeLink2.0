import React from 'react'
import { useEffect, useState } from 'react'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase/FirebaseConfig'
import { Button } from '../ui/button'

function InventoryTable() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        async function fetchInventory(){
            try {
                const querySnapshot = await getDocs(
                    collection(db, "bloodInventory")
                );
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setInventory(data);
            } catch(error){
                console.error(error)
            }
        }
        fetchInventory();
    }, []);

     async function handleDelete(id){
            if (!window.confirm("Are you sure u want to delete this request?")){
                return
            }
            try{
                //Delete the document from firebase
                await deleteDoc(doc(db, "bloodInventory", id)) //doc(------) points the specific document inside the bloodRequests collection.
    
                //Remove the deleted request from the table
                setInventory(
                    inventory.filter((request) => request.id !== id) //updates the table immediately without refreshing the page
                )
                alert("Inventory deleted successfully!")
            }catch(error){
                console.error(error)
                alert("Failed to delete request.")
            }
        }

  return (
    <div className='mt-10 rounded-xl bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-2xl font-semibold'>
        Current Inventory
      </h2>

      <table className='w-full border-collapse'>
        <thead>
            <tr className='border-b'>
                <th className='py-3 text-left'>Blood Group</th>
                <th className='py-3 text-left'>Units</th>
                <th className='py-3 text-left'>Expiry Date</th>
                <th className='py-3 text-left'>Status</th>
                <th className='py-3 text-left'>Action</th>
            </tr>
        </thead>

        <tbody>
            {inventory.length === 0? (
                <tr>
                    <td 
                    colSpan="5"
                    className='py-6 text-center text-gray-500'>
                        No Inventory found
                    </td>
                </tr>
            ):(
                inventory.map((item) => (
                    <tr 
                    key={item.id}
                    className='border-b'>
                        <td className='py-4'>
                            {item.bloodGroup}
                        </td>

                        <td>
                            {item.units}
                        </td>

                        <td>
                            {item.expiryDate}
                        </td>

                        <td>
                            <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-700'>
                                {item.status}
                            </span>

                           </td> 
                           <div className='flex justify-between mt-2'>
                             <Button variant='outline'
                        size='sm'>
                            Edit
                        </Button>

                        <Button 
                        className="bg-red-500 cursor-pointer hover:bg-red-600 text-white"
                        variant='outline'
                        size='sm'
                        onClick={() => handleDelete(item.id)}>
                            Delete
                        </Button>
                           </div>
                       
                        

                    </tr>
                ))
            )}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
