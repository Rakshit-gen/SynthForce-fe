"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  Zap,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Network,
  Cpu,
} from "lucide-react"
import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Multi-Agent Intelligence",
    description: "Simulate complex workforce scenarios with AI agents that think, debate, and collaborate.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-Time Simulation",
    description: "Watch agents interact in real-time as they work through scenarios and make decisions.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Role-Based Agents",
    description: "CEO, PM, Engineering Lead, Designer, and more - each with unique perspectives and capabilities.",
  },
  {
    icon: <Network className="h-6 w-6" />,
    title: "What-If Analysis",
    description: "Explore alternative scenarios and predict outcomes before making critical decisions.",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Memory System",
    description: "Agents remember past interactions and build context over time for more realistic simulations.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Advanced Analytics",
    description: "Track agent behavior, decision patterns, and simulation outcomes with detailed insights.",
  },
]

const faqs = [
  {
    question: "What is a synthetic workforce simulator?",
    answer: "A synthetic workforce simulator uses AI agents to simulate real-world workforce scenarios, allowing you to test strategies, explore what-if scenarios, and understand team dynamics before implementing changes.",
  },
  {
    question: "How do the AI agents work?",
    answer: "Each agent has a specific role (CEO, PM, Engineer, etc.) with unique capabilities and perspectives. They interact, debate, and collaborate to solve problems just like a real team would.",
  },
  {
    question: "Can I customize the agents?",
    answer: "Yes! You can configure agent roles, personalities, and capabilities to match your specific use case and organizational structure.",
  },
  {
    question: "What kind of scenarios can I simulate?",
    answer: "You can simulate product launches, team restructuring, strategic planning, crisis management, and any other workforce scenario you can imagine.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block"
            >
              <Image src="/icon.svg" alt="SynthForce" width={100} height={100} />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Synthetic Workforce</span>
              <br />
              <span className="text-foreground">Simulator</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Simulate complex workforce scenarios with AI agents that think,
              debate, and collaborate in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton mode="modal">
                <Button size="lg" className="neon-glow" variant="neon">
                  Launch Simulator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Agent Ecosystem */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {["CEO", "PM", "Engineer", "Designer"].map((role, idx) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass-effect rounded-lg p-4 text-center neon-border"
              >
                <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to simulate and analyze workforce scenarios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="glass-effect hover:neon-border h-full">
                  <CardHeader>
                    <div className="text-primary mb-2">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of teams using synthetic workforce simulation to
              make better decisions.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" variant="neon" className="neon-glow">
                Launch Simulator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SynthForce</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SynthForce. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

