"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { LineChartComponent, BarChartComponent, PieChartComponent } from "@/components/charts"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WhatIfPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId") || ""

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [formData, setFormData] = useState({
    sessionId: sessionId,
    name: "",
    description: "",
    modificationType: "context",
    target: "",
    change: "",
    numTurns: 3,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.sessionId) {
      toast({
        title: "Error",
        description: "Please provide a session ID",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await api.simulations.whatIf({
        session_id: formData.sessionId,
        name: formData.name || undefined,
        description: formData.description || undefined,
        modifications: [
          {
            type: formData.modificationType,
            target: formData.target,
            change: JSON.parse(formData.change || "{}"),
            description: formData.description,
          },
        ],
        num_turns_to_simulate: formData.numTurns,
      })

      setResults(response)
      toast({
        title: "Success",
        description: "What-if analysis completed",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze scenario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const chartData = results
    ? results.predicted_outcomes.map((outcome: any) => ({
        name: `Turn ${outcome.turn}`,
        value: outcome.probability * 100,
      }))
    : []

  const riskData = results
    ? results.predicted_outcomes.flatMap((outcome: any) =>
        outcome.risk_factors.map((risk: string, idx: number) => ({
          name: `Turn ${outcome.turn} - Risk ${idx + 1}`,
          value: 1,
        }))
      )
    : []

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mt-4 mb-2">What-If Scenario Analysis</h1>
        <p className="text-muted-foreground">
          Explore alternative scenarios and predict outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Configure Scenario</CardTitle>
              <CardDescription>
                Define modifications to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="sessionId">Session ID</Label>
                  <Input
                    id="sessionId"
                    value={formData.sessionId}
                    onChange={(e) =>
                      setFormData({ ...formData, sessionId: e.target.value })
                    }
                    placeholder="Enter session ID"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">Scenario Name (Optional)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Budget Increase Scenario"
                  />
                </div>

                <div>
                  <Label htmlFor="modificationType">Modification Type</Label>
                  <Select
                    value={formData.modificationType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, modificationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="context">Context</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="scenario">Scenario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData({ ...formData, target: e.target.value })
                    }
                    placeholder="budget"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="change">Change (JSON)</Label>
                  <Textarea
                    id="change"
                    value={formData.change}
                    onChange={(e) =>
                      setFormData({ ...formData, change: e.target.value })
                    }
                    placeholder='{"amount": 500000, "currency": "USD"}'
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="numTurns">Number of Turns to Simulate</Label>
                  <Input
                    id="numTurns"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.numTurns || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      const numValue = value === "" ? 3 : parseInt(value, 10)
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
                        setFormData({
                          ...formData,
                          numTurns: numValue,
                        })
                      }
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="neon"
                  className="w-full neon-glow"
                  disabled={loading}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {loading ? "Analyzing..." : "Run Analysis"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <LoadingSkeleton className="h-96" />
          ) : results ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Overall Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{results.recommendation}</p>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Confidence: {Math.round(results.overall_confidence * 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <LineChartComponent
                data={chartData}
                title="Predicted Outcomes"
                description="Probability of outcomes over turns"
              />

              {results.predicted_outcomes.map((outcome: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Turn {outcome.turn}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{outcome.summary}</p>
                      <div>
                        <p className="text-xs font-medium mb-1">Key Changes:</p>
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                          {outcome.key_changes.map((change: string, i: number) => (
                            <li key={i}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </>
          ) : (
            <Card className="glass-effect">
              <CardContent className="py-20 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Run an analysis to see results here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

