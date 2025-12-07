"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentCardProps {
  role: string
  name: string
  description?: string
  capabilities?: string[]
  priority?: number
  isActive?: boolean
  className?: string
}

const roleIcons: Record<string, React.ReactNode> = {
  ceo: <Brain className="h-5 w-5" />,
  pm: <Target className="h-5 w-5" />,
  engineering_lead: <Zap className="h-5 w-5" />,
  designer: <Users className="h-5 w-5" />,
}

export function AgentCard({
  role,
  name,
  description,
  capabilities = [],
  priority = 0,
  isActive = true,
  className,
}: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("glass-effect hover:neon-border transition-all", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {roleIcons[role] || <Brain className="h-5 w-5" />}
              <CardTitle className="text-lg">{name}</CardTitle>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {role}
            </Badge>
          </div>
          {description && (
            <CardDescription className="mt-2">{description}</CardDescription>
          )}
        </CardHeader>
        {capabilities.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {capabilities.slice(0, 3).map((cap, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {cap}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}

