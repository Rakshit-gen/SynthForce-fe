"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function MessageSkeleton() {
  return (
    <div className="mb-4 space-y-3">
      <LoadingSkeleton className="h-20 w-full" />
      <LoadingSkeleton className="h-16 w-3/4 ml-auto" />
      <LoadingSkeleton className="h-20 w-full" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="h-6 w-1/3" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CardSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

