import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from './ui/button'

function Navbar() {
  return (
    <nav className='border-b bg-white shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <Link to='/' className='flex items-center gap-2 text-2xl font-bold text-red-600'>
        <Heart className='h-7 w-7 fill-red-600'/>
        LifeLink
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          <Link to='/' className='font-medium transition hover:text-red-600'
          >
          Home
          </Link>

          <Link to='/about' className='font-medium transition hover:text-red-600'
          >
          About
          </Link>
        </div>

        <div className='flex-items-center gap-3'>
          <Link to='/login'>
          <Button variant='outline' asChild>
            Login
          </Button>
          </Link>

          <Link to='/hospitalregistration'>
          <Button >
            Register as Admin
          </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
