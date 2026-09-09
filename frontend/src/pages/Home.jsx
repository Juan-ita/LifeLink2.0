import React from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      {/*============================ HERO SECTION ===============================*/}
      <section className='flex min-h-[85vh] items-center justify-center bg-red-50 px-6'>

        <div className='max-w-3xl text-center'>
            <Heart className='mx-auto mb-6 h-14 w-14 fill-red-600 text=red-600'/>

            <h1 className='mb-6 text-5xl font-bold'>
                Connecting Blood Donors 
                <br/>
                with Lives in Need.
            </h1>
            <p className='mb-8 text-lg text-gray-600'>
                LifeLink helps hospitals connect with voluntary blood donors during emergencies, making the donation process
                faster, safer, and more organised.
            </p>

            <div className='flex justify-center gap-4'>
                <Button size='lg' asChild>
                    <Link to='/register'>
                       Become a Donor
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      {/* ======================== WHY DONATE============================================== */}
      <section className='bg-white px-6 py-20'>

        <div className='mx-auto max-w-6xl'>
            <h2 className='mb-4 text-center text-4xl font-bold'>
                Why Donate Blood?
            </h2>
            <p className='mx-auto mb-12 max-w-2xl text-center text-gray-600'>
                Every blood donation has the power to save lives and give hope to patients in need.
            </p>

                    {/* Information cards */}
            <div className='grid gap-8 md:grid-cols-3'>

                {/* Card 1 */}
                <div className='rounded-xl border p-6 shadow-sm'>
                    <h3 mb-3 text-xl font-semibold>
                        Save Lives
                    </h3>
                    <p className='text-gray-600'>
                        A single blood donation can help save up to three lives.
                    </p>
                </div>

                {/* Card 2 */}
                <div className='rounded-xl border p-6 shadow-sm'>
                    <h3 mb-3 text-xl font-semibold>
                        Support Hospitals
                    </h3>
                    <p className='text-gray-600'>
                       Help hospitals respond quickly during emergencies and surgeries.
                    </p>
                </div>

                {/* Card 3 */}
                <div className='rounded-xl border p-6 shadow-sm'>
                    <h3 mb-3 text-xl font-semibold>
                        Build Community
                    </h3>
                    <p className='text-gray-600'>
                        Join a network of donors committed to making a difference.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* ==================STATISTICS SECTION================================= */}
      <section className='bg-red-600 py-16 text-white'>

        <div className='mx-auto max-w-6xl gap-8 px-6 text-center grid md:grid-cols-3'>
            <div>
                <h2 className='text-5xl font-bold'>
                    500+
                </h2>
                <p className='mt-2'>
                    Registered Donors
                </p>
            </div>

            <div>
                <h2 className='text-5xl font-bold'>
                    30+
                </h2>
                <p className='mt-2'>
                    Partner Hospitals
                </p>
            </div>

            <div>
                <h2 className='text-5xl font-bold'>
                    1000+
                </h2>
                <p className='mt-2'>
                    Lives Impacted
                </p>
            </div>
        </div>
      </section>

      {/* ===================CALL TO ACTION====================================== */}
      <section className='bg-gray-100 px-6 py-20'>

        <div className='mx-auto max-w-3xl text-center'>
            <h2 className='mb-6 text-4xl font-bold'>
                Be Someone's LifeLine Today
            </h2>
            <p className='mb-8 text-gray-600'>
                Join our growing community of voluntary blood donors and help save lives during emergencies.
            </p>

            <Button size='lg' asChild>
                <Link to="/register">
                Register as a Donor
                </Link>
            </Button>
        </div>
      </section>
    </main>
  )
}

export default Home
