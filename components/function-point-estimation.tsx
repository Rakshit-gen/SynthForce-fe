"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Clock, DollarSign, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface FunctionPoint {
  function_name: string
  function_type: string
  complexity: string
  fp_count: number
  description?: string
}

interface FunctionPointEstimationProps {
  estimation?: {
    total_function_points?: number
    unadjusted_fp?: number
    value_adjustment_factor?: number
    adjusted_fp?: number
    function_points?: FunctionPoint[]
    estimated_hours?: number
    estimated_days?: number
    estimated_cost?: number
    hourly_rate?: number
  }
  className?: string
}

export function FunctionPointEstimation({ estimation, className }: FunctionPointEstimationProps) {
  if (!estimation) return null

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-500"
      case "low":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-yellow-500/20 text-yellow-500"
    }
  }

  const getFPTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      EI: "External Input",
      EO: "External Output",
      EQ: "External Inquiry",
      ILF: "Internal Logical File",
      EIF: "External Interface File",
    }
    return labels[type] || type
  }

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Function Point Estimation</CardTitle>
        </div>
        <CardDescription>IFPUG-based software estimation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total FP</p>
            <p className="text-2xl font-bold">{estimation.total_function_points || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Unadjusted FP</p>
            <p className="text-lg font-semibold">{estimation.unadjusted_fp || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">VAF</p>
            <p className="text-lg font-semibold">{estimation.value_adjustment_factor?.toFixed(2) || "1.00"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Adjusted FP</p>
            <p className="text-lg font-semibold">{estimation.adjusted_fp || 0}</p>
          </div>
        </div>

        {/* Effort Estimation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Hours</p>
              <p className="text-lg font-semibold">{estimation.estimated_hours?.toFixed(1) || "0"}h</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Days</p>
              <p className="text-lg font-semibold">{estimation.estimated_days?.toFixed(1) || "0"}d</p>
            </div>
          </div>
          {estimation.estimated_cost && (
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Cost</p>
                <p className="text-lg font-semibold">
                  ${estimation.estimated_cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Function Points Breakdown */}
        {estimation.function_points && estimation.function_points.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Function Points Breakdown</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {estimation.function_points.map((fp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-muted/30 border flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium">{fp.function_name}</p>
                      <Badge variant="outline" className="text-xs">
                        {getFPTypeLabel(fp.function_type)}
                      </Badge>
                      <Badge className={cn("text-xs", getComplexityColor(fp.complexity))}>
                        {fp.complexity}
                      </Badge>
                    </div>
                    {fp.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {fp.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold">{fp.fp_count} FP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

