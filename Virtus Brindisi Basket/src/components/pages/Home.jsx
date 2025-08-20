import Navbar from "../UI elems/Navbar"
import Hero from "../UI elems/Hero"
import Carousel from "../UI elems/Carousel"
import NewsSection from "../UI elems/NewsSection"
import Results from "../UI elems/Results"
import Palmares from "../UI elems/Palmares"
import CallToAction from "../UI elems/CallToAction"
import Footer from "../UI elems/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="w-full max-w-screen overflow-x-hidden">
        <Hero />
        <Carousel />
        <NewsSection />
        <Results />
        <Palmares />
        <CallToAction />
        <Footer />
      </div>
    </>
  )
}
