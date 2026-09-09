import { HeartHandshake, Droplets, Hospital, Users } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-red-600 py-20 text-center text-white">
        <h1 className="text-5xl font-bold">
          About LifeLink
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg">
          Connecting blood donors with hospitals to save lives through
          faster, smarter and more reliable blood donation.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-8 py-20 md:grid-cols-2">

        <div>
          <h2 className="mb-5 text-3xl font-bold">
            Who We Are
          </h2>

          <p className="leading-8 text-gray-600">
            LifeLink is a blood donation management platform that helps
            hospitals quickly find eligible blood donors during emergencies.
            It reduces delays, improves communication and makes blood donation
            easier for everyone.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <HeartHandshake className="h-44 w-44 text-red-600" />
        </div>

      </section>

      <section className="bg-white py-20">

        <h2 className="mb-12 text-center text-3xl font-bold">
          Our Mission
        </h2>

        <p className="mx-auto max-w-4xl text-center leading-8 text-gray-600">
          To create a reliable bridge between hospitals and volunteer donors,
          ensuring that no patient loses their life because blood could not
          be found in time.
        </p>

      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-8 py-20 md:grid-cols-3">

        <div className="rounded-xl bg-white p-8 shadow">

          <Droplets className="mb-4 h-12 w-12 text-red-600"/>

          <h3 className="mb-3 text-xl font-bold">
            Blood Requests
          </h3>

          <p className="text-gray-600">
            Hospitals create emergency blood requests which become instantly
            available to registered donors.
          </p>

        </div>

        <div className="rounded-xl bg-white p-8 shadow">

          <Users className="mb-4 h-12 w-12 text-red-600"/>

          <h3 className="mb-3 text-xl font-bold">
            Volunteer Donors
          </h3>

          <p className="text-gray-600">
            Donors browse requests, book appointments and receive updates
            directly from hospitals.
          </p>

        </div>

        <div className="rounded-xl bg-white p-8 shadow">

          <Hospital className="mb-4 h-12 w-12 text-red-600"/>

          <h3 className="mb-3 text-xl font-bold">
            Hospitals
          </h3>

          <p className="text-gray-600">
            Hospitals manage blood requests, appointments and donor
            communication from one dashboard.
          </p>

        </div>

      </section>

      <section className="bg-red-600 px-8 py-20 text-center text-white">

        <h2 className="text-4xl font-bold">
          Every Donation Saves a Life 
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg">
          By bringing hospitals and donors together, LifeLink helps ensure
          that blood is available whenever and wherever it is needed.
        </p>

      </section>

    </div>
  );
}

export default About;