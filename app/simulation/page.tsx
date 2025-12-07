"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useSimulationStore } from "@/store/simulation-store"
import { Rocket } from "lucide-react"

const agentRoles = [
  { value: "ceo", label: "CEO" },
  { value: "pm", label: "Product Manager" },
  { value: "engineering_lead", label: "Engineering Lead" },
  { value: "designer", label: "Designer" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
]

export default function NewSimulationPage() {
  const router = useRouter()
  const { addSimulation } = useSimulationStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scenario: "",
    maxTurns: 50,
    temperature: 0.7,
    enableMemory: true,
    enableAnalytics: true,
    selectedAgents: ["ceo", "pm", "engineering_lead", "designer"],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.scenario.trim()) {
      toast({
        title: "Error",
        description: "Please provide a scenario",
        variant: "destructive",
      })
      return
    }

    if (formData.selectedAgents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one agent",
        variant: "destructive",
      })
      return
    }

    // Validate numeric values
    const maxTurns = formData.maxTurns || 50
    const temperature = formData.temperature || 0.7

    if (isNaN(maxTurns) || maxTurns < 1 || maxTurns > 500) {
      toast({
        title: "Error",
        description: "Max turns must be between 1 and 500",
        variant: "destructive",
      })
      return
    }

    if (isNaN(temperature) || temperature < 0 || temperature > 2) {
      toast({
        title: "Error",
        description: "Temperature must be between 0 and 2",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      console.log("Starting simulation with config:", {
        scenario: formData.scenario.substring(0, 100) + "...",
        max_turns: maxTurns,
        agents: formData.selectedAgents,
        temperature: temperature,
      })

      const response = await api.simulations.start({
        scenario: formData.scenario,
        name: formData.name || undefined,
        description: formData.description || undefined,
        config: {
          max_turns: maxTurns,
          agents: formData.selectedAgents,
          temperature: temperature,
          enable_memory: formData.enableMemory,
          enable_analytics: formData.enableAnalytics,
        },
      })

      console.log("Simulation started:", response.session_id)

      addSimulation({
        session_id: response.session_id,
        name: formData.name,
        description: formData.description,
        scenario: formData.scenario,
        status: response.status,
        current_turn: 0,
        max_turns: maxTurns,
        created_at: response.created_at,
        updated_at: response.created_at,
      })

      toast({
        title: "Success",
        description: "Simulation started successfully",
      })

      router.push(`/simulation/${response.session_id}`)
    } catch (error: any) {
      console.error("Failed to start simulation:", error)
      toast({
        title: "Error",
        description: error.message || error.error || "Failed to start simulation. Please check your API connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Start New Simulation</h1>
        <p className="text-muted-foreground mb-8">
          Configure your simulation scenario and agents
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Give your simulation a name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Q2 Feature Launch Planning"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A simulation to plan the Q2 feature launch..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Scenario</CardTitle>
              <CardDescription>Describe the scenario you want to simulate</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="scenario"
                value={formData.scenario}
                onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                placeholder="We need to launch a new product feature within 3 months. The team needs to coordinate on design, development, and marketing..."
                rows={8}
                required
              />
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure simulation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxTurns">Max Turns</Label>
                  <Input
                    id="maxTurns"
                    type="number"
                    min={1}
                    max={500}
                    value={formData.maxTurns || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      const numValue = value === "" ? 50 : parseInt(value, 10)
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 500) {
                        setFormData({ ...formData, maxTurns: numValue })
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={formData.temperature || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      const numValue = value === "" ? 0.7 : parseFloat(value)
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 2) {
                        setFormData({ ...formData, temperature: numValue })
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <Label>Select Agents</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {agentRoles.map((role) => (
                    <div key={role.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={role.value}
                        checked={formData.selectedAgents.includes(role.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedAgents: [...formData.selectedAgents, role.value],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              selectedAgents: formData.selectedAgents.filter((a) => a !== role.value),
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={role.value} className="cursor-pointer">
                        {role.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="memory">Enable Memory</Label>
                  <p className="text-sm text-muted-foreground">
                    Agents will remember past interactions
                  </p>
                </div>
                <Switch
                  id="memory"
                  checked={formData.enableMemory}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, enableMemory: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track agent behavior and decisions
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={formData.enableAnalytics}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, enableAnalytics: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" variant="neon" className="neon-glow" disabled={loading}>
              {loading ? (
                "Starting..."
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

