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
import { Play, Lightbulb, Download, ArrowLeft, Calendar, Calculator, Users, Menu, X } from "lucide-react"
import Link from "next/link"
import { useSimulationStore } from "@/store/simulation-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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
  const [showAgentsMobile, setShowAgentsMobile] = useState(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] w-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="border-b border-border/40 bg-background/50 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-2 mb-2 sm:mb-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              {/* Mobile Agent Button */}
              <Dialog open={showAgentsMobile} onOpenChange={setShowAgentsMobile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Users className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Active Agents</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
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
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text truncate">
                {simulationState?.name || "Simulation"}
              </h2>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Turn</span>
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    {simulationState?.current_turn || 0}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">/</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {simulationState?.max_turns || 50}
                  </span>
                </div>
                {simulationState?.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    simulationState.status === "active" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                    simulationState.status === "paused" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                    "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  }`}>
                    {simulationState.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link href={`/what-if?sessionId=${sessionId}`} className="flex-1 sm:flex-initial">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">What-If</span>
                <span className="sm:hidden">What-If</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              className="flex-1 sm:flex-initial hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="border-b px-2 sm:px-4 flex-shrink-0 overflow-x-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="messages" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Msgs</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" disabled={!latestTimeline} className="text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="estimation" disabled={!latestFP} className="text-xs sm:text-sm">
                <Calculator className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">FP Estimation</span>
                <span className="sm:hidden">FP</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="messages" className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 mt-0">
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
                          .replace(/&quot;/g, "&quot;")
                          .replace(/&ldquo;/g, "&ldquo;")
                          .replace(/&rdquo;/g, "&rdquo;")
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
              <p>No turns executed yet. Click &quot;Run Next Turn&quot; to start.</p>
            </div>
          )}

          <div ref={messagesEndRef} />
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 overflow-y-auto p-2 sm:p-4 mt-0">
            {latestTimeline ? (
              <ProjectTimeline timeline={latestTimeline} />
            ) : (
              <div className="text-center py-12 sm:py-20 text-muted-foreground">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base px-4">No timeline data available yet. Execute a turn to generate timeline.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="estimation" className="flex-1 overflow-y-auto p-2 sm:p-4 mt-0">
            {latestFP ? (
              <FunctionPointEstimation estimation={latestFP} />
            ) : (
              <div className="text-center py-12 sm:py-20 text-muted-foreground">
                <Calculator className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base px-4">No function point estimation available yet. Execute a turn to generate estimation.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Input Area - Always visible at bottom */}
        <div className="border-t border-border/40 p-3 sm:p-6 space-y-2 sm:space-y-3 bg-background/80 backdrop-blur-sm flex-shrink-0 shadow-lg">
          <div className="relative">
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
              className="pr-10 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base"
            />
            {userInput && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserInput("")}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>
          <Button
            onClick={handleNextTurn}
            disabled={executing || !canExecuteTurn}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {executing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
                <span className="hidden sm:inline">Executing...</span>
                <span className="sm:hidden">Running...</span>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Run Next Turn</span>
                <span className="sm:hidden">Next Turn</span>
              </>
            )}
          </Button>
          {!canExecuteTurn && simulationState && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-muted-foreground text-center p-2 rounded-lg bg-muted/50"
            >
              {simulationState.status === "completed" 
                ? "✅ All turns completed." 
                : simulationState.current_turn >= simulationState.max_turns
                ? "⚠️ Maximum turns reached."
                : simulationState.status && simulationState.status !== "active"
                ? `⏸️ Simulation status: ${simulationState.status}. Cannot execute turns.`
                : "⏳ Loading simulation state..."}
            </motion.p>
          )}
        </div>
      </div>

      {/* Side Panel - Agent Roles (Desktop) */}
      <div className="hidden lg:block w-80 border-l overflow-y-auto p-4 bg-background/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Active Agents
        </h3>
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

