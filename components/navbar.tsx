"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { ThemeToggler } from "@/components/theme-toggler"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          href="/dashboard" 
          className="flex items-center space-x-3 group"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <Logo size={36} />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform">
            SynthForce
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggler />
          <div className="h-8 w-px bg-border" />
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors"
              }
            }}
          />
        </div>
      </div>
    </nav>
  )
}

