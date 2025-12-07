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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mb-4", className)}
    >
      <Card className="glass-effect hover:neon-border transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold capitalize">{agentRole.replace(/_/g, " ")}</span>
                  {turnNumber && (
                    <Badge variant="outline" className="text-xs">
                      Turn {turnNumber}
                    </Badge>
                  )}
                </div>
                {timestamp && (
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(timestamp)}
                  </span>
                )}
              </div>
            </div>
            {confidence && (
              <Badge variant="secondary" className="text-xs">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            )}
          </div>

          {/* Formatted Response */}
          <div className="mb-3 prose prose-sm max-w-none dark:prose-invert">
            {formatResponse(response)}
          </div>

          {/* Action Buttons */}
          {(metrics || taskDistribution) && (
            <div className="flex gap-2 mb-3">
              {metrics && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMetrics(!showMetrics)}
                  className="text-xs"
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Metrics
                  {showMetrics ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  )}
                </Button>
              )}
              {taskDistribution && taskDistribution.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTasks(!showTasks)}
                  className="text-xs"
                >
                  <ListTodo className="h-3 w-3 mr-1" />
                  Tasks ({taskDistribution.length})
                  {showTasks ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
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

