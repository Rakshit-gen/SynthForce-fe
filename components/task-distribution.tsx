"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  task_name: string
  description: string
  completion_chance: number
  estimated_effort_hours?: number
  dependencies?: string[]
  priority?: number
}

interface TaskDistributionProps {
  tasks: Task[]
  className?: string
}

export function TaskDistribution({ tasks, className }: TaskDistributionProps) {
  if (!tasks || tasks.length === 0) return null

  const getPriorityColor = (priority?: number) => {
    if (!priority) return "bg-gray-500"
    if (priority >= 9) return "bg-red-500"
    if (priority >= 7) return "bg-orange-500"
    return "bg-blue-500"
  }

  const getCompletionColor = (chance: number) => {
    if (chance >= 0.8) return "text-green-500"
    if (chance >= 0.6) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="space-y-2 p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium">
                    {task.task_name
                      .replace(/\*\*/g, "")
                      .replace(/\*/g, "")
                      .replace(/__/g, "")
                      .replace(/_/g, "")
                      .replace(/^#+\s*/, "")
                      .replace(/`/g, "")
                      .replace(/\/\//g, "")
                      .replace(/\//g, "")
                      .trim()}
                  </h4>
                  {task.priority && (
                    <Badge
                      className={cn("text-xs", getPriorityColor(task.priority))}
                    >
                      P{task.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description
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
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Completion Chance</span>
                <span className={cn("font-medium", getCompletionColor(task.completion_chance))}>
                  {Math.round(task.completion_chance * 100)}%
                </span>
              </div>
              <Progress value={task.completion_chance * 100} className="h-1.5" />
            </div>

            {task.estimated_effort_hours && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estimated Effort</span>
                <span className="font-medium">{task.estimated_effort_hours}h</span>
              </div>
            )}

            {task.dependencies && task.dependencies.length > 0 && (
              <div className="pt-1 border-t">
                <p className="text-xs text-muted-foreground mb-1">Dependencies:</p>
                <div className="flex flex-wrap gap-1">
                  {task.dependencies.map((dep, depIdx) => (
                    <Badge key={depIdx} variant="outline" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

