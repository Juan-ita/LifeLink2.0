// import React from 'react'
// import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

import api from '@/services/api';

function InventoryTable({inventory, setInventory}) {

//     useEffect(() => {
//         async function fetchInventory() {
//           try {
//             // Get this hospital's inventory from Django.
//             const response = await api.get("inventory/");

//              setInventory(response.data);
//           } catch (error) {
//              console.error("Failed to load inventory:", error);

//              if (error.response?.data) {
//                 console.error("Django error:", error.response.data);
//           }
//       }
//    }
//         fetchInventory();
//     }, []);


    async function handleDelete(id) {
      if (!window.confirm("Are you sure you want to delete this inventory?")) {
          return;
      }
  
      try {
          // Delete the inventory record from Django.
          await api.delete(`inventory/${id}/`);
  
          // Remove it from the table immediately.
          setInventory(
              inventory.filter((item) => item.id !== id)
          );
  
          alert("Inventory deleted successfully!");
      } catch (error) {
          console.error("Failed to delete inventory:", error);
  
          if (error.response?.data) {
              console.error("Django error:", error.response.data);
          }
  
          alert("Failed to delete inventory.");
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
                <th className='py-3 text-left'>Last Updated</th>
                <th className='py-3 text-left'>Action</th>
            </tr>
        </thead>

        <tbody>
            {inventory.length === 0? (
                <tr>
                    <td 
                    colSpan="4"
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
                            {item.blood_group}
                        </td>

                        <td>
                            {item.units_available}
                        </td>

                        <td>
                            {new Date(item.updated_at).toLocaleString()}
                        </td>

                        <td>

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
                       </td>
                        

                    </tr>
                ))
            )}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
