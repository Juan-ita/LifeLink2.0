import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
// import { signInWithEmailAndPassword } from "firebase/auth"
// import { auth, googleProvider, db } from "@/firebase/FirebaseConfig"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { doc, getDoc } from "firebase/firestore"
import api from "../services/api"

function Login() {
    const [username, setUsername] = useState("");
    const[password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    

    async function handleSubmit(event){
        event.preventDefault();
        setError("");

        if(username.trim() === ""){
            setError("Username required.")
            return;
        }
        if(password.trim() === ""){
            setError("Password is required.")
            return;
        }

        try{
            setLoading(true)

            // send the login details to django
            const response = await api.post("token/", {
                username: username,
                password: password,
            })

             // Get the JWT token returned by Django
             const {access, refresh} = response.data

             // Store the tokens returned by Django
             localStorage.setItem("access_token", access)
             localStorage.setItem("refresh_token", refresh)

             console.log("Django login successful")

             // Ask Django who just logged in
             const userResponse = await api.get("me/")

             const user = userResponse.data

             // Store the user's role so other parts of the app can use it
             localStorage.setItem("user_role", user.role)

             console.log("Logged in user:", user)

             // Send the user to the correct dashboard
             if (user.role === 'DONOR'){
                navigate("/donor/dashboard")
             } else if (user.role === 'HOSPITAL'){
                navigate("/hospital/dashboard")
             } else if (user.role === 'REQUESTER'){
                navigate('/')
             } else if( user.role === 'ADMIN'){
                navigate('/hospital/dashboard')
             } else {
                navigate('/')
             }
            

        }catch(error){
            console.error("Login failed:", error)

            if (error.response?.status === 401){
                setError("Invalid username or password.")
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
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
                  <Label htmlFor="username"> Username</Label>
                  <Input
                   className="mt-2"
                   id="username"
                   type="text"
                   placeholder="Enter username"
                   value={username}
                   onChange={(event) => setUsername(event.target.value)}/>
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
             <Button type="submit" 
             className="w-full mt-3"
             disabled={loading}
             >
                {loading ? "Logging in ..." : "Login"}
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

                </form>
               
            </CardContent>
      
      </Card>
    </main>
  )
}


export default Login
