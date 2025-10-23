export default function InfoCard({ children, className = "", ...props }) {
  return (
    <div className={`relative overflow-hidden group flex justify-center items-center w-full bg-white rounded-lg shadow-xl min-w-[260px] border-yellow-500 border-l-6 transition-all duration-200 ease-in-out ${className}`} {...props}>
      {/* Bordi animati superiore e inferiore */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-yellow-500 transform scale-x-0 origin-left transition-transform duration-800 ease-out group-hover:scale-x-100 z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-yellow-500 transform scale-x-0 origin-left transition-transform duration-800 ease-out group-hover:scale-x-100 z-10"></div>

      {children}
    </div>
  )
}
