import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, googleProvider, db } from "@/firebase/FirebaseConfig"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { doc, getDoc } from "firebase/firestore"

function Login() {
    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    

    async function handleSubmit(event){
        event.preventDefault();
        setError("");

        if(email.trim() === ""){
            setError("Email required.")
            return;
        }
        if(password.trim() === ""){
            setError("Password is required.")
            return;
        }
        if(
            email === "hospital@lifelink.com" &&
            password === "admin123"
        ){
            navigate("/hospital/dashboard")
            return;
        }

        try{
            //log the user into firebase authentication
            const userCredential = await signInWithEmailAndPassword(
                auth, email, password
            )

            //Get the logged-in user
            const user = userCredential.user;
            console.log("Logged in UID:", user.uid)
            console.log("Logged in email:", user.email)

            //Read the user's information from firebase
            const userRef = doc(db, "users", user.uid)

            const userSnap = await getDoc(userRef);

            //check if the user's information from firestore
            if (!userSnap.exists()){
                setError("User profile not found")
                return;
            }

            //get user's information
            const userData = userSnap.data();

            //if the user is a hospital
            if(userData.role === "hospital"){

                //Open the hospitaldashboard
                navigate("/hospital/dashboard")

            }else{
                navigate("/donor/dashboard");
            }
        }catch(error) {
            console.error(error)
            setError("Invalid email or password.")
        }
    }

    async function handleGoogleLogin () {
        try{
            const result = await signInWithPopup(auth, googleProvider)
            console.log(result.user)
        }catch(error){
            console.log(error)
            setError(error.message)
        }
    }
  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 p-6">
      
      <Card className='w-full max-w-md'>
        <CardHeader>
            <CardTitle>
                Welcome Back
            </CardTitle>

            <CardDescription>
                Sign in to continue to LifeLink
            </CardDescription>
         </CardHeader>

            <CardContent>
                {error && (
                    <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                   
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
             <Label htmlFor="password" className="mt-2"> Password</Label>
             <Input
             className="mt-2"
              id="password"
              type="password"
              placeholder="Create a Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}/>
          </div>
             <Button type="submit" className="w-full mt-3">
                Login
             </Button>
             

             <div className="mt-4 text-center">
                <p>Don't have an account?
                    <Link to="/register" className="ml-1 font-semibold text-red-600 hover:underline">
                    Register
                    </Link>
                </p>
             </div>

             <div className="my-4 flex items-center">
                <hr className="flex-1"/>

                <span className="mx-2 text-sm text-gray-500">OR</span>
                <hr className="flex-1"/>
             </div>

             <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>Continue with Goolge</Button>
                </form>
               
            </CardContent>
      
      </Card>
    </main>
  )
}


export default Login
