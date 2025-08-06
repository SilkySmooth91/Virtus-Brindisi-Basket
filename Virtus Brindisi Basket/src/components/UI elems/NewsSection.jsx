import InfoCard from "./InfoCard"

export default function NewsSection() {
  return (
    <div className="w-full bg-black py-8 px-4 md:px-8 lg:h-screen">
      <h2 className="text-5xl md:text-7xl font-bold uppercase text-white mb-6">
        Ultime <span className="text-yellow-400">News</span></h2>
      <div className="flex flex-col md:flex-row justify-center gap-6 lg:h-[calc(100vh-200px)]">
          <InfoCard />
          <InfoCard />
      </div>
    </div>
  )
}
