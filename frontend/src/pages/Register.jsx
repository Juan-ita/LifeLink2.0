import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import api from '@/services/api'

function Register() {
  // Account information
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Donor information
  const [bloodGroup, setBloodGroup] = useState('')
  const [county, setCounty] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birth, setBirth] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('')

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    // Prevent duplicate submissions while the request is processing.
    if (isLoading) return

    // Check required fields before calculating age or weight.
    if (
      !username.trim() ||
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !bloodGroup ||
      !county.trim() ||
      !phoneNumber.trim() ||
      !birth ||
      !weight ||
      !gender
    ) {
      setError('Please fill in all the fields.')
      return
    }

    // Check the donor's age.
    const birthDate = new Date(`${birth}T00:00:00`)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age-- // substracts one from age
    }

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
      setError('Please enter a valid date of birth.')
      return
    }

    if (age < 18) {
      setError('You must be at least 18 years old to register as a donor.')
      return
    }

    // Basic form validation.
    if (Number(weight) < 50) {
      setError('Your entered weight does not meet the current donor screening requirement.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setIsLoading(true)

      // Send registration details to Django, not Firebase.
      const response = await api.post('register/', {
        username: username.trim(),
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phoneNumber.trim(),
        blood_group: bloodGroup,
        date_of_birth: birth,
      })

      // Django creates the account and returns JWT tokens.
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user_role', response.data.user.role)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Continue to the existing registration success page.
      navigate('/registration-success')
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err)

      const data = err.response?.data

      // Show useful Django validation messages where available.
      if (data && typeof data === 'object') {
        const messages = Object.entries(data).flatMap(([field, value]) => {
          const details = Array.isArray(value) ? value : [value]

          return details.map((message) => {
            if (typeof message !== 'string') {
              return `${field}: ${JSON.stringify(message)}`
            }

            return field === 'detail' || field === 'message'
              ? message
              : `${field}: ${message}`
          })
        })

        setError(
          messages.length
            ? messages.join(' ')
            : 'Registration failed. Please try again.'
        )
      } else {
        setError('Unable to connect to the server. Please check that Django is running.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription className="text-sm">
            Join LifeLink and become a blood donor.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username is the unique login name. */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                className="mt-2"
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* Full name is kept separately for hospital records. */}
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                className="mt-2"
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                className="mt-2"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                className="mt-2"
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                className="mt-2"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <select
                className="mt-2 w-full rounded-md border p-2"
                id="bloodGroup"
                value={bloodGroup}
                onChange={(event) => setBloodGroup(event.target.value)}
                required
              >
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <Label htmlFor="county">County</Label>
              <Input
                className="mt-2"
                id="county"
                placeholder="Nairobi"
                value={county}
                onChange={(event) => setCounty(event.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                className="mt-2"
                id="phoneNumber"
                type="tel"
                placeholder="07********"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                autoComplete="tel"
                required
              />
            </div>

            <div>
              <Label htmlFor="birth">Date of Birth</Label>
              <Input
                className="mt-2"
                id="birth"
                type="date"
                value={birth}
                onChange={(event) => setBirth(event.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                className="mt-2"
                id="weight"
                type="number"
                min="1"
                placeholder="Weight in kg"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                className="mt-2 w-full rounded-md border p-2"
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-1 font-semibold text-red-600 hover:underline"
                >
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
