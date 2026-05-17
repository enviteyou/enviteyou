import Sidebar from '@/components/ui/sidebar'
import "../(site)/globals.css"
export const metadata = { title: 'Admin' }

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
