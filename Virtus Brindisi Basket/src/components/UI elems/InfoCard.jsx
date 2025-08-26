export default function InfoCard({ children, className = "", ...props }) {
  return (
    <div className={`flex justify-center items-center w-full h-full bg-white rounded-lg shadow-xl min-w-[260px] border-yellow-500 border-l-6 hover:scale-105 transition-all duration-200 ease-in-out ${className}`} {...props}>
        {children}
    </div>
  )
}
