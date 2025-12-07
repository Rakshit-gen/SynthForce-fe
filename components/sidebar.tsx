"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  MessageSquare,
  Lightbulb,
  Database,
  Settings,
  PlusCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulation", label: "Simulation", icon: MessageSquare },
  { href: "/what-if", label: "What-If", icon: Lightbulb },
  { href: "/memory", label: "Memory", icon: Database },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
      <div className="flex flex-col flex-grow border-r bg-background overflow-y-auto">
        <div className="flex flex-col flex-grow pt-5 pb-4">
          <div className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

