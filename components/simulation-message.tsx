"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils"
import { Brain, MessageSquare, ChevronDown, ChevronUp, BarChart3, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"
import { AgentMetrics } from "@/components/agent-metrics"
import { TaskDistribution } from "@/components/task-distribution"

interface SimulationMessageProps {
  agentRole: string
  response: string
  reasoning?: string
  actionsProposed?: string[]
  confidence?: number
  turnNumber?: number
  timestamp?: string
  metrics?: any
  taskDistribution?: any[]
  className?: string
}

export function SimulationMessage({
  agentRole,
  response,
  reasoning,
  actionsProposed = [],
  confidence = 0.8,
  turnNumber,
  timestamp,
  metrics,
  taskDistribution,
  className,
}: SimulationMessageProps) {
  const [showMetrics, setShowMetrics] = useState(false)
  const [showTasks, setShowTasks] = useState(false)

  // Clean text by removing markdown formatting
  const cleanText = (text: string): string => {
    return text
      // Remove markdown headers
      .replace(/^#+\s*/gm, "")
      // Remove bold/italic markers
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .replace(/_/g, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`/g, "")
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      // Remove slashes used for emphasis
      .replace(/\/\//g, "")
      .replace(/\//g, "")
      // Remove bullet markers but keep content
      .replace(/^[-*•]\s+/gm, "")
      // Remove numbered list markers but keep content
      .replace(/^\d+\.\s+/gm, "")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  }

  // Format response text for better readability
  const formatResponse = (text: string) => {
    // Clean the text first
    const cleanedText = cleanText(text)
    
    // Split by lines
    const lines = cleanedText.split("\n")
    const formatted: React.ReactNode[] = []
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      
      // Skip empty lines (but add spacing)
      if (!trimmed) {
        if (idx > 0 && idx < lines.length - 1) {
          formatted.push(<br key={idx} />)
        }
        return
      }
      
      // Regular paragraph - all text is now clean
      formatted.push(
        <p key={idx} className="text-sm mb-2 leading-relaxed">
          {trimmed}
        </p>
      )
    })
    
    return formatted.length > 0 ? formatted : <p className="text-sm leading-relaxed">{cleanedText}</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className={cn("mb-6", className)}
    >
      <Card className="glass-effect hover:border-primary/30 transition-all duration-300 group shadow-md hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <motion.div 
                  className="p-3 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-primary/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Brain className="h-5 w-5 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20 blur-md"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base capitalize text-foreground group-hover:text-primary transition-colors">
                    {agentRole.replace(/_/g, " ")}
                  </span>
                  {turnNumber && (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      Turn {turnNumber}
                    </Badge>
                  )}
                </div>
                {timestamp && (
                  <span className="text-xs text-muted-foreground mt-0.5 block">
                    {formatRelativeTime(timestamp)}
                  </span>
                )}
              </div>
            </div>
            {confidence && (
              <Badge 
                variant="secondary" 
                className="text-xs font-semibold bg-primary/10 text-primary border-primary/20"
              >
                {Math.round(confidence * 100)}%
              </Badge>
            )}
          </div>

          {/* Formatted Response */}
          <div className="mb-3 prose prose-sm max-w-none dark:prose-invert">
            {formatResponse(response)}
          </div>

          {/* Action Buttons */}
          {(metrics || taskDistribution) && (
            <div className="flex gap-2 mb-4 pt-3 border-t border-border/50">
              {metrics && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMetrics(!showMetrics)}
                  className="text-xs hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Metrics
                  {showMetrics ? (
                    <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                  )}
                </Button>
              )}
              {taskDistribution && taskDistribution.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTasks(!showTasks)}
                  className="text-xs hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
                >
                  <ListTodo className="h-3.5 w-3.5 mr-1.5" />
                  Tasks ({taskDistribution.length})
                  {showTasks ? (
                    <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Metrics Panel */}
          {showMetrics && metrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <AgentMetrics metrics={metrics} />
            </motion.div>
          )}

          {/* Task Distribution Panel */}
          {showTasks && taskDistribution && taskDistribution.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <TaskDistribution tasks={taskDistribution} />
            </motion.div>
          )}

          {reasoning && (
            <div className="mt-3 p-3 rounded-md bg-muted/50 border-l-2 border-primary">
              <p className="text-xs font-medium mb-1">Reasoning:</p>
              <p className="text-xs text-muted-foreground">{cleanText(reasoning)}</p>
            </div>
          )}

          {actionsProposed.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actionsProposed.map((action, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {cleanText(action)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

