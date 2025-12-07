"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SimulationMessage } from "@/components/simulation-message"
import { LoadingSkeleton, MessageSkeleton } from "@/components/loading-skeleton"
import { AgentCard } from "@/components/agent-card"
import { FunctionPointEstimation } from "@/components/function-point-estimation"
import { ProjectTimeline } from "@/components/project-timeline"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Play, Lightbulb, Download, ArrowLeft, Calendar, Calculator } from "lucide-react"
import Link from "next/link"
import { useSimulationStore } from "@/store/simulation-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SimulationState {
  session_id: string
  name?: string
  description?: string
  scenario: string
  status: string
  current_turn: number
  max_turns: number
  created_at: string
  updated_at: string
  config?: {
    max_turns?: number
    agents?: string[]
    temperature?: number
    enable_memory?: boolean
    enable_analytics?: boolean
  }
}

interface SimulationNextResponse {
  session_id: string
  turn_number: number
  coordinator_summary: string
  agent_responses: Array<{
    agent_role: string
    response: string
    reasoning?: string
    actions_proposed?: string[]
    confidence?: number
    metrics?: any
    task_distribution?: any[]
  }>
  project_timeline?: any
  function_point_estimation?: any
}

interface Turn {
  turn_number: number
  coordinator_summary: string
  agent_responses: Array<{
    agent_role: string
    response: string
    reasoning?: string
    actions_proposed?: string[]
    confidence?: number
    metrics?: any
    task_distribution?: any[]
  }>
  timestamp?: string
  project_timeline?: any
  function_point_estimation?: any
}

export default function SimulationWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const { setCurrentSession } = useSimulationStore()
  
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null)
  const [turns, setTurns] = useState<Turn[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [userInput, setUserInput] = useState("")
  const [activeTab, setActiveTab] = useState("messages")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get latest timeline and FP estimation
  const latestTimeline = turns.length > 0 ? turns[turns.length - 1]?.project_timeline : null
  const latestFP = turns.length > 0 ? turns[turns.length - 1]?.function_point_estimation : null

  useEffect(() => {
    if (sessionId) {
      setCurrentSession(sessionId)
      loadSimulation()
      loadAgents()
      startPolling()
    }

    return () => {
      stopPolling()
    }
  }, [sessionId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [turns])

  let pollingInterval: NodeJS.Timeout | null = null

  const startPolling = () => {
    pollingInterval = setInterval(() => {
      loadSimulation()
    }, 5000) // Poll every 5 seconds
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
    }
  }

  const loadSimulation = async () => {
    try {
      const state = await api.simulations.getState(sessionId) as SimulationState
      setSimulationState(state)
      console.log("Simulation state loaded:", {
        status: state?.status,
        current_turn: state?.current_turn,
        max_turns: state?.max_turns,
      })
      
      // If simulation is active and we have no turns, the button should be enabled
      // Load turns from state (in a real app, you'd fetch turns separately)
      // For now, we'll simulate turns from agent_responses
    } catch (error) {
      console.error("Failed to load simulation:", error)
      toast({
        title: "Error",
        description: "Failed to load simulation state",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAgents = async () => {
    try {
      const response = await api.agents.list() as { agents: any[] }
      setAgents(response.agents)
    } catch (error) {
      console.error("Failed to load agents:", error)
    }
  }

  const handleNextTurn = async () => {
    if (executing) return

    try {
      setExecuting(true)
      const response = await api.simulations.next({
        session_id: sessionId,
        user_input: userInput || undefined,
      }) as SimulationNextResponse

      const newTurn: Turn = {
        turn_number: response.turn_number,
        coordinator_summary: response.coordinator_summary,
        agent_responses: response.agent_responses,
        timestamp: new Date().toISOString(),
        project_timeline: response.project_timeline,
        function_point_estimation: response.function_point_estimation,
      }

      setTurns([...turns, newTurn])
      setUserInput("")
      loadSimulation()
      
      // Switch to timeline tab if available
      if (response.project_timeline) {
        setActiveTab("timeline")
      }

      toast({
        title: "Turn Executed",
        description: `Turn ${response.turn_number} completed`,
      })
    } catch (error: any) {
      const errorMessage = error.detail || error.message || "Failed to execute turn"
      const isRateLimit = errorMessage.toLowerCase().includes("rate limit")
      
      toast({
        title: isRateLimit ? "Rate Limit Exceeded" : "Error",
        description: errorMessage,
        variant: "destructive",
        duration: isRateLimit ? 10000 : 5000, // Show rate limit errors longer
      })
      
      console.error("Failed to execute turn:", error)
    } finally {
      setExecuting(false)
    }
  }

  const handleExport = () => {
    const data = {
      simulation: simulationState,
      turns: turns,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `simulation-${sessionId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <MessageSkeleton />
      </div>
    )
  }

  // Check if simulation can execute turns
  const canExecuteTurn = simulationState && 
    (!simulationState.status || simulationState.status === "active") &&
    simulationState.current_turn < simulationState.max_turns

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h2 className="text-2xl font-bold mt-2">
              {simulationState?.name || "Simulation"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Turn {simulationState?.current_turn || 0} / {simulationState?.max_turns || 50}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/what-if?sessionId=${sessionId}`}>
              <Button variant="outline">
                <Lightbulb className="mr-2 h-4 w-4" />
                What-If
              </Button>
            </Link>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="border-b px-4 flex-shrink-0">
            <TabsList>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="timeline" disabled={!latestTimeline}>
                <Calendar className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="estimation" disabled={!latestFP}>
                <Calculator className="h-4 w-4 mr-2" />
                FP Estimation
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="messages" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
          {simulationState && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Scenario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{simulationState.scenario}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {turns.map((turn) => (
            <div key={turn.turn_number}>
              {turn.agent_responses.map((agentResponse, idx) => (
                <SimulationMessage
                  key={idx}
                  agentRole={agentResponse.agent_role}
                  response={agentResponse.response}
                  reasoning={agentResponse.reasoning}
                  actionsProposed={agentResponse.actions_proposed}
                  confidence={agentResponse.confidence}
                  turnNumber={turn.turn_number}
                  timestamp={turn.timestamp}
                  metrics={agentResponse.metrics}
                  taskDistribution={agentResponse.task_distribution}
                />
              ))}
              {turn.coordinator_summary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-4"
                >
                  <Card className="glass-effect border-primary/20">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium mb-2">Coordinator Summary:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {turn.coordinator_summary
                          .replace(/\*\*/g, "")
                          .replace(/\*/g, "")
                          .replace(/__/g, "")
                          .replace(/_/g, "")
                          .replace(/^#+\s*/gm, "")
                          .replace(/```[\s\S]*?```/g, "")
                          .replace(/`/g, "")
                          .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
                          .replace(/\/\//g, "")
                          .replace(/\//g, "")
                          .replace(/^[-*•]\s+/gm, "")
                          .replace(/^\d+\.\s+/gm, "")
                          .trim()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          ))}

          {turns.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No turns executed yet. Click "Run Next Turn" to start.</p>
            </div>
          )}

          <div ref={messagesEndRef} />
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 overflow-y-auto p-4 mt-0">
            {latestTimeline ? (
              <ProjectTimeline timeline={latestTimeline} />
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No timeline data available yet. Execute a turn to generate timeline.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="estimation" className="flex-1 overflow-y-auto p-4 mt-0">
            {latestFP ? (
              <FunctionPointEstimation estimation={latestFP} />
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No function point estimation available yet. Execute a turn to generate estimation.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Input Area - Always visible at bottom */}
        <div className="border-t p-4 space-y-2 bg-background flex-shrink-0">
          <Input
            placeholder="Add user input (optional)..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !executing) {
                e.preventDefault()
                handleNextTurn()
              }
            }}
            disabled={executing}
          />
          <Button
            onClick={handleNextTurn}
            disabled={executing || !canExecuteTurn}
            variant="neon"
            className="w-full neon-glow"
          >
            <Play className="mr-2 h-5 w-5" />
            {executing ? "Executing..." : "Run Next Turn"}
          </Button>
          {!canExecuteTurn && simulationState && (
            <p className="text-xs text-muted-foreground text-center">
              {simulationState.status === "completed" 
                ? "All turns completed." 
                : simulationState.current_turn >= simulationState.max_turns
                ? "Maximum turns reached."
                : simulationState.status && simulationState.status !== "active"
                ? `Simulation status: ${simulationState.status}. Cannot execute turns.`
                : "Loading simulation state..."}
            </p>
          )}
        </div>
      </div>

      {/* Side Panel - Agent Roles */}
      <div className="hidden lg:block w-80 border-l overflow-y-auto p-4">
        <h3 className="text-lg font-semibold mb-4">Active Agents</h3>
        <div className="space-y-4">
          {agents
            .filter((agent) =>
              simulationState?.config?.agents?.includes(agent.role.value)
            )
            .map((agent) => (
              <AgentCard
                key={agent.id}
                role={agent.role.value}
                name={agent.name}
                description={agent.description}
                capabilities={agent.capabilities}
                priority={agent.priority}
                isActive={agent.is_active}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

