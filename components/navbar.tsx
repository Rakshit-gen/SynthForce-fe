"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { ThemeToggler } from "@/components/theme-toggler"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Brain className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold gradient-text">SynthWork</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggler />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  )
}

