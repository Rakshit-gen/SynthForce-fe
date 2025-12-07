"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Database, ArrowLeft, Calendar, Brain } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function MemoryViewerPage() {
  const searchParams = useSearchParams()
  const sessionIdParam = searchParams.get("sessionId") || ""

  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(sessionIdParam)
  const [memoryData, setMemoryData] = useState<any>(null)

  const loadMemory = async () => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Please provide a session ID",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await api.memory.get(sessionId)
      setMemoryData(response)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load memory",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sessionIdParam && sessionId) {
      loadMemory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdParam])

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case "short_term":
        return "bg-blue-500/20 text-blue-500"
      case "long_term":
        return "bg-purple-500/20 text-purple-500"
      case "episodic":
        return "bg-green-500/20 text-green-500"
      case "semantic":
        return "bg-yellow-500/20 text-yellow-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mt-4 mb-2">Memory Viewer</h1>
        <p className="text-muted-foreground">
          View conversation history and agent memories
        </p>
      </div>

      {/* Session ID Input */}
      <Card className="glass-effect mb-6">
        <CardHeader>
          <CardTitle>Load Memory</CardTitle>
          <CardDescription>Enter a session ID to view memories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="sessionId">Session ID</Label>
              <Input
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session ID"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadMemory} disabled={loading || !sessionId}>
                <Database className="mr-2 h-4 w-4" />
                Load
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSkeleton className="h-96" />
      ) : memoryData ? (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Memory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Memories</p>
                  <p className="text-2xl font-bold">{memoryData.total_memories}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Session ID</p>
                  <p className="text-sm font-mono">{memoryData.session_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline View */}
          <div className="space-y-6">
            {Object.entries(memoryData.memories_by_agent || {}).map(
              ([agentRole, memories]: [string, any]) => (
                <motion.div
                  key={agentRole}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass-effect">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <CardTitle className="capitalize">{agentRole}</CardTitle>
                        <Badge variant="secondary">
                          {memories.length} memories
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />

                        {/* Memory Entries */}
                        <div className="space-y-6">
                          {memories.map((memory: any, idx: number) => (
                            <motion.div
                              key={memory.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="relative pl-12"
                            >
                              {/* Timeline Dot */}
                              <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-primary border-2 border-background" />

                              <Card className="glass-effect hover:neon-border">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        className={getMemoryTypeColor(
                                          memory.memory_type
                                        )}
                                      >
                                        {memory.memory_type}
                                      </Badge>
                                      <span className="text-xs font-mono text-muted-foreground">
                                        {memory.key}
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatDate(memory.created_at)}</span>
                                    </div>
                                  </div>

                                  <div className="mt-2">
                                    <p className="text-sm font-medium mb-1">
                                      Content:
                                    </p>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                      {JSON.stringify(memory.content, null, 2)}
                                    </pre>
                                  </div>

                                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                    <span>
                                      Importance:{" "}
                                      {Math.round(memory.importance * 100)}%
                                    </span>
                                    <span>
                                      Accessed: {memory.access_count} times
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </div>
      ) : (
        <Card className="glass-effect">
          <CardContent className="py-20 text-center text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter a session ID and click Load to view memories</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

