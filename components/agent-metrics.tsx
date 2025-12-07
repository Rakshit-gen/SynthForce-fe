"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Award, Zap, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentMetricsProps {
  metrics?: {
    productivity_score?: number
    collaboration_score?: number
    quality_score?: number
    engagement_level?: number
    tasks_completed?: number
    tasks_in_progress?: number
    tasks_blocked?: number
    response_time_ms?: number
  }
  className?: string
}

export function AgentMetrics({ metrics, className }: AgentMetricsProps) {
  if (!metrics) return null

  const metricItems = [
    {
      label: "Productivity",
      value: metrics.productivity_score || 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Collaboration",
      value: metrics.collaboration_score || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Quality",
      value: metrics.quality_score || 0,
      icon: Award,
      color: "text-purple-500",
    },
    {
      label: "Engagement",
      value: metrics.engagement_level || 0,
      icon: Zap,
      color: "text-yellow-500",
    },
  ]

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {metricItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Icon className={cn("h-3 w-3", item.color)} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-medium">{Math.round(item.value * 100)}%</span>
                </div>
                <Progress value={item.value * 100} className="h-2" />
              </div>
            )
          })}
        </div>

        {/* Task Status */}
        {(metrics.tasks_completed !== undefined ||
          metrics.tasks_in_progress !== undefined ||
          metrics.tasks_blocked !== undefined) && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Task Status</p>
            <div className="flex flex-wrap gap-2">
              {metrics.tasks_completed !== undefined && metrics.tasks_completed > 0 && (
                <Badge variant="default" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {metrics.tasks_completed} Completed
                </Badge>
              )}
              {metrics.tasks_in_progress !== undefined && metrics.tasks_in_progress > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {metrics.tasks_in_progress} In Progress
                </Badge>
              )}
              {metrics.tasks_blocked !== undefined && metrics.tasks_blocked > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {metrics.tasks_blocked} Blocked
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Response Time */}
        {metrics.response_time_ms && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Response Time</span>
              <span className="font-medium">{metrics.response_time_ms}ms</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

