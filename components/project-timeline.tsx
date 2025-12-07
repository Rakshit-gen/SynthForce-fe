"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface TaskSchedule {
  task_id: string
  task_name: string
  start_date?: string
  end_date?: string
  duration_days: number
  assigned_agent?: string
  status: string
  dependencies: string[]
  effort_hours: number
  completion_percentage: number
}

interface ProjectTimelineProps {
  timeline?: {
    project_start_date?: string
    project_end_date?: string
    total_duration_days?: number
    milestones?: Array<{ name: string; date: string; tasks: string[] }>
    tasks?: TaskSchedule[]
    critical_path?: string[]
    slack_days?: Record<string, number>
  }
  className?: string
}

export function ProjectTimeline({ timeline, className }: ProjectTimelineProps) {
  if (!timeline || !timeline.tasks || timeline.tasks.length === 0) return null

  const tasks = timeline.tasks || []
  const criticalPath = new Set(timeline.critical_path || [])
  const slackDays = timeline.slack_days || {}

  // Calculate timeline scale
  const startDate = useMemo(() => {
    if (timeline.project_start_date) {
      const date = new Date(timeline.project_start_date)
      return isNaN(date.getTime()) ? new Date() : date
    }
    return new Date()
  }, [timeline.project_start_date])

  const endDate = useMemo(() => {
    if (timeline.project_end_date) {
      const date = new Date(timeline.project_end_date)
      if (!isNaN(date.getTime())) return date
    }
    return new Date(startDate.getTime() + (timeline.total_duration_days || 0) * 24 * 60 * 60 * 1000)
  }, [timeline.project_end_date, timeline.total_duration_days, startDate])
  
  const totalDays = useMemo(() => {
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)))
  }, [startDate, endDate])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTaskPosition = (task: TaskSchedule) => {
    if (!task.start_date) return { left: 0, width: 0 }
    
    const taskStart = new Date(task.start_date)
    if (isNaN(taskStart.getTime())) return { left: 0, width: 0 }
    
    const daysFromStart = Math.max(0, (taskStart.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    const leftPercent = totalDays > 0 ? (daysFromStart / totalDays) * 100 : 0
    const widthPercent = totalDays > 0 ? (task.duration_days / totalDays) * 100 : 0
    
    return {
      left: Math.max(0, Math.min(100, leftPercent)),
      width: Math.max(2, Math.min(100, widthPercent)),
    }
  }

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Project Timeline</CardTitle>
        </div>
        <CardDescription>
          {timeline.total_duration_days?.toFixed(0) || 0} days • {tasks.length} tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="text-sm font-medium">
              {startDate ? formatDate(startDate) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="text-sm font-medium">
              {endDate ? formatDate(endDate) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{timeline.total_duration_days?.toFixed(0) || 0} days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Critical Path</p>
            <p className="text-sm font-medium">{criticalPath.size} tasks</p>
          </div>
        </div>

        {/* Gantt Chart Visualization */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-4">Task Schedule</p>
          <div className="space-y-2">
            {tasks.map((task) => {
              const position = getTaskPosition(task)
              const isCritical = criticalPath.has(task.task_id)
              const slack = slackDays[task.task_id] || 0
              
              return (
                <div key={task.task_id} className="relative">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">{task.task_name}</p>
                        {isCritical && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                        {slack > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {slack.toFixed(1)}d slack
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        {task.assigned_agent && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {task.assigned_agent}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.duration_days.toFixed(1)}d
                        </span>
                        <Badge
                          className={cn("text-xs", getStatusColor(task.status))}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Gantt Bar */}
                  <div className="relative h-8 bg-muted rounded overflow-hidden">
                    <div
                      className={cn(
                        "absolute h-full rounded transition-all",
                        getStatusColor(task.status),
                        isCritical && "ring-2 ring-red-500 ring-offset-1"
                      )}
                      style={{
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                        opacity: task.completion_percentage > 0 ? 0.7 : 1,
                      }}
                    >
                      {task.completion_percentage > 0 && (
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${task.completion_percentage}%` }}
                        />
                      )}
                    </div>
                    {task.start_date && task.end_date && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-foreground font-medium">
                        {task.duration_days.toFixed(1)}d
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Milestones */}
        {timeline.milestones && timeline.milestones.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Milestones</p>
            <div className="space-y-2">
              {timeline.milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{milestone.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.date ? formatDate(new Date(milestone.date)) : "N/A"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {milestone.tasks.length} tasks
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

