import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/firebase/FirebaseConfig';


function HospitalRegister() {

    //keeps track of the current registration step
    const [step, setStep] = useState(1)
    
    // Hospital Information
    const [hospitalName, setHospitalName] = useState("");
    const [facilityType, setFacilityType] = useState("");
    const [hospitalEmail, setHospitalEmail] = useState("");
    const [hospitalPhone, setHospitalPhone] = useState("");
    const [website, setWebsite] = useState("");
    
    // Location
    const [county, setCounty] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [address, setAddress] = useState("");
    
    // Legal Details
    const [licenseNumber, setLicenseNumber] = useState("");
    const [tin, setTin] = useState("");
    
    // Administrator
    const [adminName, setAdminName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [adminEmail, setAdminEmali] = useState("")
    
    // Password
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    async function handleSubmit (event){
        event.preventDefault();

        try{
            //Create the hospital admin acc in firebase Authentication
            const userCredential = 
            await createUserWithEmailAndPassword(
                auth, adminEmail, password
            );

            //Logged in admin
            const user = userCredential.user;

            //Hospital info
            const hospitalData = {
                hospitalName,
                facilityType,

                hospitalEmail,
                hospitalPhone,
                hospitalName,
                website,

                county,
                city, 
                postalCode,
                address,

                licenseNumber,
                tin,

                adminEmail,
                adminName,
                adminPhone,
                jobTitle,

                role: "hospital",

                uid: user.uid,

                createdAt: new Date()
            }
            //Save hospital to firebase
            await setDoc(
                doc(db, "users", user.uid),
                hospitalData
            );

             alert("Hospital registered successfully!")
             navigate("/login")

        } catch (error){
            console.error(error)
            alert(error.message)
        }
    }


  return (
    <main className='flex min-h-screen items-center justify-center bg-red-50 p-6'>
      <Card className="w-full max-w-xl">
        <CardHeader>
            <CardTitle>
                Hospital Registration
            </CardTitle>

            <CardDescription>
                Step {step} of 4
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}> 
                {/* Step 1 */}
                {step === 1 && (
                    <div className='space-y-5'>

                        {/* HospitalName */}
                        <div>
                            <Label>Hospital Name</Label>

                            <Input
                            className="mt-2"
                            value={hospitalName}
                            onChange={(e)=> setHospitalName(e.target.value)}
                            placeholder="Nairobi West Hospital."
                            />
                        </div>

                        {/* Facility Type */}
                        <div>
                            <Label>Facility Type</Label>

                            <select
                            className='w-full rounded-md border p-2 mt-2'
                            value={facilityType}
                            onChange={(e)=> setFacilityType(e.target.value)}
                            >
                                <option value="">Select Facility</option>
                                <option>General Hospital</option>
                                <option>Specialized Clinic</option>
                                <option>Maternity Hospital</option>
                                <option>Health Cener</option>
                            </select>
                        </div>

                        {/* Hospital Email */}
                        <div>
                            <Label>Hospital Email</Label>

                            <Input 
                            className="mt-2"
                            type="email"
                            value={hospitalEmail}
                            onChange={(e) => setHospitalEmail(e.target.value)}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label>Hospital Phone</Label>
                            <Input 
                            className="mt-2"
                            value={hospitalPhone}
                            type="tel"
                            onChange={(e) => setHospitalPhone (e.target.value)}
                            />
                        </div>

                        {/* Website */}
                        <div>
                           <Label>Website (optional)</Label>

                        <Input 
                        className="mt-2"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        /> 
                        </div>

                        <Button 
                        type="button"
                        className="w-full mt-5"
                        onClick={()=> setStep(2)}
                        >
                            Next
                        </Button>
                        
                    </div>
                )}
          

            {/* Step 2 */}
                {step === 2 && (
                    <div className='space-y-5'>

                        {/* County */}
                        <div>
                            <Label>County</Label>
                            <Input 
                            className="mt-2"
                            value={county}
                            onChange={(e) => setCounty(e.target.value)}
                            placeholder="Nairobi"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <Label>City</Label>
                            <Input 
                            className="mt-2"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Westlands"
                            />
                        </div>

                        {/* Postal code */}
                        <div>
                            <Label>Postal Code</Label>
                            <Input 
                            className="mt-2"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="00100"
                            />
                        </div>

                        {/* Physical Address */}
                        <div>
                            <Label>Physical Address</Label>
                            <Input 
                            className="mt-2"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Along Waiyaki Way..."
                            />
                        </div>

                        <div className='flex justify-between'>
                            <Button
                            type="button"
                            variant='outline'
                            onClick={() => setStep(1)}
                            >
                                Back
                            </Button>

                            <Button 
                            type='button'
                            onClick={()=> setStep(3)}
                            >
                                Next 
                            </Button>
                        </div>
                    </div>
                )}

            {/* Step 3 */}
            {step === 3 && (
                <div className='space-y-5'>

                    {/* license Number */}
                    <div>
                        <Label>Facility License Number</Label>

                        <Input
                        className="mt-2"
                        value={licenseNumber}
                        onChange={(e)=> setLicenseNumber(e.target.value)}
                        placeholder="LIC-2026-001"
                        />
                    </div>

                    {/* Business Registration /TIN */}
                    <div>
                        <Label>Business Registration /TIN</Label>

                        <Input
                        className="mt-2"
                        value={tin}
                        onChange={(e)=> setTin(e.target.value)}
                        placeholder="p051234567A"
                        />
                    </div>

                    {/* operating license */}
                    <div>
                       <Label>Operating License</Label>

                     <Input
                     className="mt-2"
                        type="file"
                        accept=".pdf"
                        />
                     <p className='mt-1 text-sm text-gray-500'>
                        Upload your current operating licence.
                    </p>   
                    </div>

                    <div className='flex justify-between'>
                        <Button 
                        type="button"
                        variant='outline'
                        onClick={() => setStep(2)}
                        >
                            Back
                        </Button>

                        <Button
                        type="buton"
                        onClick={()=> setStep(4)}
                        >
                            Next
                        </Button>
                    </div>
                     
                </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
                <div className='space-y-5'>

                    {/* Name */}
                    <div>
                        <Label>Administrator's Full name</Label>

                        <Input
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Dr."
                        />
                    </div>
                    <div>
                        <Label>Job Title</Label>

                        <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Medical Director"
                        />
                    </div>
                    <div>
                        <Label>Work Email</Label>

                        <Input
                        value={adminEmail}
                        onChange={(e) => setAdminEmali(e.target.value)}
                        placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <Label>Phone Number</Label>

                        <Input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="07xxxxxxxx"
                        />
                    </div>
                    <div>
                        <Label>Password</Label>

                        <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        />
                    </div>

                    <div>
                        <Label>Administrator's ID</Label>

                        <Input 
                        type="file"
                        accept=".pdf, .jpg, .png, .jpeg"
                        />
                    </div>

                    <div>
                        <Label>Authorization Letter</Label>

                        <Input
                        type="file"
                        accept=".pdf"
                        />
                    </div>

                    <div className='flex justify-between'>
                        <Button
                        type="button"
                        onClick={()=> setStep(3)}
                        >
                            Back
                        </Button>

                        <Button type="submit">
                            Create Hospital Account
                        </Button>
                    </div>
                </div>
            )}
              </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default HospitalRegister
