"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ThemeToggler } from "@/components/theme-toggler"
import { useThemeStore } from "@/store/theme-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Trash2, User, Palette } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { user } = useUser()
  const { theme, setTheme } = useThemeStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteAccount = () => {
    // Frontend only - backend API optional
    toast({
      title: "Account Deletion",
      description: "Account deletion requested. Please contact support for assistance.",
    })
    setDeleteDialogOpen(false)
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>
                Your account details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  value={user?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>User ID</Label>
                <Input value={user?.id || ""} disabled className="bg-muted font-mono text-xs" />
              </div>
              <div>
                <Label>Created At</Label>
                <Input
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : ""
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Theme Settings</CardTitle>
              </div>
              <CardDescription>
                Customize your application appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(value: "light" | "dark") => setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Quick Toggle</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle theme quickly from anywhere
                  </p>
                </div>
                <ThemeToggler />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-effect border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all associated data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

