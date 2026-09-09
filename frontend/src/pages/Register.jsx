import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '@/firebase/FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

function Register() {
    // store the user's full name
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [bloodGroup, setBloodGroup] = useState("")
    const [county, setCounty] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [birth, setBirth] = useState("")
    const [weight, setWeight] = useState("")
    const [gender, setGender] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    
    async function handleSubmit(event){
      event.preventDefault();
      setError("");

      const birthDate = new Date(birth)
      const today = new Date()

       let age = today.getFullYear() - birthDate.getFullYear();

         const monthDifference = today.getMonth() - birthDate.getMonth();

         if(
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
         ){
            age--;
         }
         if (age < 18){
            setError("You must be atleast 18 years old to donate.")
            return;
         }

         // Check weight
         if (Number(weight) < 50){
            setError("You must weigh at least 50kg to donate blood.")
            return;
         }

      if(fullName.trim() === ""){
        setError("Full name required.")
        return;
      }
      if(email.trim() === ""){
        setError("Email is required.")
        return;
      }
      if(bloodGroup.trim() === ""){
        setError("Blood Group is Requires.")
        return;
      }
      if(county.trim() === ""){
        setError("County is required.")
        return;
      }
      if(phoneNumber.trim() === ""){
        setError("Phone number is required.")
        return;
      }
      if(birth.trim() === ""){
        setError("Birth date is required.")
        return;
      }
      if(weight.trim() === ""){
        setError("Weight is required.")
        return;
      }
      if(gender.trim() === ""){
        setError("Gender is required.")
        return;
      }
      if(password.length < 8){
        setError("Password must be atleast 8 characters.")
        return;
      }
      if(password !== confirmPassword){
        setError("Passwords do not match.")
        return;
      }

      try{
        //create firebase account
        const userCredential = await createUserWithEmailAndPassword(
          auth, email, password
        );

        const user = userCredential.user;

        //save donor information in firestore
        const userData = {
          fullName,
          email,
          bloodGroup,
          county,
          phoneNumber,
          birth,
          weight,
          gender,
          role: "donor",
          uid: user.uid,
          lastDonation: null,
          createdAt: new Date(),  
        }

         await setDoc(doc(db, "users", user.uid), userData)
         localStorage.setItem(
          "user",
          JSON.stringify(userData)
         );

         navigate("/registration-success")

      }catch (error) {
        console.error(error);
        setError(error.message)
      }
     
    }
  return (
    <main className='flex min-h-screen items-center justify-center bg-red-50 p-6'>
      <Card className="w-full max-w-md">
        <CardHeader>

          <CardTitle>
            Create Your Account
          </CardTitle>

          <CardDescription className="text-sm">
            Join LifeLink and become a blood donor.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p className='mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600'>{error}</p>
          )}
          <form onSubmit={handleSubmit} className='space-y-5'>

            {/* Name */}
            <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
            className="mt-2"
             id="fullName"
             type="text"
             placeholder="Enter your full name"
             value={fullName}
             onChange={(event) => setFullName(event.target.value)}/>
          </div>

          {/* Email */}
            <div>
            <Label htmlFor="email"> Email</Label>
            <Input
            className="mt-2"
             id="email"
             type="email"
             placeholder="@gmail.com"
             value={email}
             onChange={(event) => setEmail(event.target.value)}/>
          </div>

          {/* Password */}
            <div>
            <Label htmlFor="password"> Password</Label>
            <Input
            className="mt-2"
             id="password"
             type="password"
             placeholder="Create a Password"
             value={password}
             onChange={(event) => setPassword(event.target.value)}/>
          </div>

          {/* confirm password */}
            <div>
            <Label htmlFor="confirmPassword"> confirm Password</Label>
            <Input
            className="mt-2"
             id="confirmPassword"
             type="password"
             value={confirmPassword}
             onChange={(event) => setConfirmPassword(event.target.value)}/>
          </div>

            <div>
            <Label htmlFor="bloodGroup"> Blood Group </Label>
            <Input
            className="mt-2"
             id="bloodGroup"
             placeholder="Example: O+"
             value={bloodGroup}
             onChange={(event) => setBloodGroup(event.target.value)}/>
          </div>

            <div>
            <Label htmlFor="county">County</Label>
            <Input
            className="mt-2"
             id="county"
             placeholder="Nairobi"
             value={county}
             onChange={(event) => setCounty(event.target.value)}/>
          </div>

            <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
            className="mt-2"
             id="phoneNumber"
             type="tel"
             placeholder="07********"
             value={phoneNumber}
             onChange={(event) => setPhoneNumber(event.target.value)}/>
          </div>

            <div>
            <Label htmlFor="birth">Date of Birth</Label>
            <Input
            className="mt-2"
             id="birth"
             type="date"
             value={birth}
             onChange={(event) => setBirth(event.target.value)}/>
          </div>

            <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
            className="mt-2"
             id="weight"
             type="number"
             placeholder="kg"
             value={weight}
             onChange={(event) => setWeight(event.target.value)}/>
          </div>
            <div>
            <Label htmlFor="gender">Gender</Label>
            <select 
             className="mt-2 w-full rounded-md border p-2"
             id="gender"
             value={gender}
             onChange={(event) => setGender(event.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

         <Button type="submit" className="w-full" >
            Register            
            </Button>
          

          <div className='mt-4 text-center'> 
            <p className='text-sm text-gray-600'>
              Already have an account?
              <Link to="/login" className="ml-1 font-semibold text-red-600 hover:underline">
              Login
              </Link>
            </p>
          </div>
          </form>
          
        </CardContent>
      </Card>
      
    </main>
  )
}

export default Register
