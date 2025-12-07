"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Rocket, Crown } from "lucide-react"
import { SignInButton } from "@clerk/nextjs"

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for individuals and small teams",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Up to 10 simulations per month",
      "5 agents per simulation",
      "Basic analytics",
      "Email support",
      "Community access",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing teams and advanced use cases",
    icon: <Rocket className="h-6 w-6" />,
    features: [
      "Unlimited simulations",
      "Unlimited agents",
      "Advanced analytics",
      "Priority support",
      "What-if analysis",
      "Memory viewer",
      "Export capabilities",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Everything in Professional",
      "Custom agent configurations",
      "Dedicated support",
      "SLA guarantee",
      "On-premise deployment",
      "Custom integrations",
      "Training & onboarding",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            simulation features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 neon-glow">
                  Most Popular
                </Badge>
              )}
              <Card
                className={`glass-effect h-full flex flex-col ${
                  plan.popular
                    ? "neon-border scale-105"
                    : "hover:neon-border transition-all"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-primary">{plan.icon}</div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <SignInButton mode="modal">
                    <Button
                      variant={plan.popular ? "neon" : "outline"}
                      className={`w-full ${plan.popular ? "neon-glow" : ""}`}
                    >
                      Get Started
                    </Button>
                  </SignInButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I change plans later?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes
                  will be reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! All plans come with a 14-day free trial. No credit card
                  required.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for
                  Enterprise plans.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

