import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function MemoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pt-16 min-h-screen">
          {children}
        </main>
      </div>
      <Toaster />
    </>
  )
}

