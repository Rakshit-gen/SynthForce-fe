"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSkeleton, DashboardSkeleton } from "@/components/loading-skeleton"
import { PlusCircle, Play, Pause, Trash2, ArrowRight } from "lucide-react"
import { useSimulationStore } from "@/store/simulation-store"
import { api } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded, userId } = useAuth()
  const { activeSimulations, setActiveSimulations, removeSimulation } = useSimulationStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/")
    }
  }, [isLoaded, userId, router])

  useEffect(() => {
    loadSimulations()
  }, [])

  const loadSimulations = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch simulations from an API endpoint
      // For now, we'll use mock data or empty array
      setActiveSimulations([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load simulations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (sessionId: string) => {
    try {
      await api.simulations.delete(sessionId)
      removeSimulation(sessionId)
      toast({
        title: "Success",
        description: "Simulation deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete simulation",
        variant: "destructive",
      })
    }
  }

  const handlePause = async (sessionId: string) => {
    try {
      await api.simulations.pause(sessionId)
      toast({
        title: "Success",
        description: "Simulation paused",
      })
      loadSimulations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause simulation",
        variant: "destructive",
      })
    }
  }

  const handleResume = async (sessionId: string) => {
    try {
      await api.simulations.resume(sessionId)
      toast({
        title: "Success",
        description: "Simulation resumed",
      })
      loadSimulations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resume simulation",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your active simulations
          </p>
        </div>
        <Link href="/simulation">
          <Button variant="neon" className="neon-glow">
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New Simulation
          </Button>
        </Link>
      </div>

      {activeSimulations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Card className="glass-effect max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Active Simulations</CardTitle>
              <CardDescription>
                Get started by creating your first simulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/simulation">
                <Button variant="neon" className="w-full neon-glow">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Start Simulation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSimulations.map((sim, idx) => (
            <motion.div
              key={sim.session_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-effect hover:neon-border h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{sim.name || "Untitled Simulation"}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {sim.description || sim.scenario.substring(0, 100)}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sim.status === "active" ? "bg-green-500/20 text-green-500" :
                      sim.status === "paused" ? "bg-yellow-500/20 text-yellow-500" :
                      sim.status === "completed" ? "bg-blue-500/20 text-blue-500" :
                      "bg-red-500/20 text-red-500"
                    }`}>
                      {sim.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Turn</span>
                      <span className="font-medium">{sim.current_turn} / {sim.max_turns}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">{formatRelativeTime(sim.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/simulation/${sim.session_id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                    </Link>
                    {sim.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePause(sim.session_id)}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : sim.status === "paused" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResume(sim.session_id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(sim.session_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

