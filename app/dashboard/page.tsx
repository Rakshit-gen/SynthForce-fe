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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-12">
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight gradient-text">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and monitor your active simulations
            </p>
          </div>
          <Link href="/simulation">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Start New Simulation
            </Button>
          </Link>
        </motion.div>

      {activeSimulations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <Card className="glass-effect max-w-lg mx-auto card-hover border-2 border-dashed">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <PlusCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">No Active Simulations</CardTitle>
              <CardDescription className="text-base">
                Get started by creating your first simulation. Watch AI agents collaborate and make decisions in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/simulation">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Your First Simulation
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <Card className="glass-effect card-hover h-full flex flex-col group border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="mb-2 text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {sim.name || "Untitled Simulation"}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {sim.description || sim.scenario.substring(0, 100)}
                      </CardDescription>
                    </div>
                    <motion.span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        sim.status === "active" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" :
                        sim.status === "paused" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                        sim.status === "completed" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30" :
                        "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {sim.status}
                    </motion.span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-0">
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{sim.current_turn}</span>
                        <span className="text-sm text-muted-foreground">/</span>
                        <span className="text-sm text-muted-foreground">{sim.max_turns}</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(sim.current_turn / sim.max_turns) * 100}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Created {formatRelativeTime(sim.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/simulation/${sim.session_id}`} className="flex-1">
                      <Button 
                        variant="default" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                    </Link>
                    {sim.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePause(sim.session_id)}
                        className="hover:bg-amber-500/10 hover:border-amber-500/50"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : sim.status === "paused" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResume(sim.session_id)}
                        className="hover:bg-emerald-500/10 hover:border-emerald-500/50"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sim.session_id)}
                      className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
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
    </div>
  )
}

