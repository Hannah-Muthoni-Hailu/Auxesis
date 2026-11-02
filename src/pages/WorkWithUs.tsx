import { ArrowRight, Sprout, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import FarmerRegistrationForm from '@/components/FarmerRegistrationForm'
import { usePageMeta } from '@/lib/usePageMeta'

export default function WorkWithUs() {
  usePageMeta({
    title: 'Work with us',
    description:
      'Buy fresh Kenyan produce from Auxesis, or register your farm to grow for us. We grow, buy and connect produce to market.',
  })

  return (
    <section className="container-page py-14">
      <p className="eyebrow">Work with us</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Buy from us, or grow for us</h1>
      <p className="mt-4 max-w-3xl text-bark-soft">
        We grow, buy and connect Kenyan fresh produce to market. Tell us which side you are on and
        we will call you back.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[20rem_1fr] lg:items-start">
        <div className="card space-y-3 p-6">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-olive/10 text-olive-dark">
            <Store size={22} />
          </span>
          <h2 className="text-xl font-bold">I want to buy</h2>
          <p className="text-sm text-bark-soft">
            Traders, grocers, hotels and households. Tell us the produce, quantity and delivery
            point and we will send a quote.
          </p>
          <Link to="/quote" className="btn btn-primary w-full">
            Request a quote <ArrowRight size={18} />
          </Link>
        </div>

        <div id="farmers" className="scroll-mt-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-olive/10 text-olive-dark">
              <Sprout size={22} />
            </span>
            <div>
              <h2 className="text-xl font-bold">I am a farmer</h2>
              <p className="text-sm text-bark-soft">
                Register your farm. We buy at an agreed grade and price, and link you to buyers for
                crops we do not buy ourselves.
              </p>
            </div>
          </div>
          <FarmerRegistrationForm />
        </div>
      </div>
    </section>
  )
}
