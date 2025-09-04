"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { adminConfigStorage, type AlgorithmConfig } from "@/lib/admin-config"
import { authStorage, type User } from "@/lib/auth"
import { Users, Settings, Save, Shield, UserIcon } from "lucide-react"

export function UserManagementPanel() {
  const [config, setConfig] = useState<AlgorithmConfig | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const currentConfig = adminConfigStorage.getConfig()
    const allUsers = authStorage.getUsers()
    setConfig(currentConfig)
    setUsers(allUsers)
  }, [])

  const handleUserSettingChange = (key: keyof AlgorithmConfig["userSettings"], value: any) => {
    if (!config) return

    const newConfig = {
      ...config,
      userSettings: {
        ...config.userSettings,
        [key]: value,
      },
    }
    setConfig(newConfig)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!config) return
    adminConfigStorage.saveConfig(config)
    setHasChanges(false)
  }

  if (!config) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            User Settings
          </CardTitle>
          <CardDescription>Configure platform-wide user settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Max Posts Per Hour</Label>
            <Input
              type="number"
              value={config.userSettings.maxPostsPerHour}
              onChange={(e) => handleUserSettingChange("maxPostsPerHour", Number.parseInt(e.target.value) || 10)}
              min={1}
              max={100}
            />
            <p className="text-sm text-muted-foreground">Rate limit for user posts</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Anonymous Users</Label>
              <p className="text-sm text-muted-foreground">Allow users to browse without signing in</p>
            </div>
            <Switch
              checked={config.userSettings.allowAnonymous}
              onCheckedChange={(value) => handleUserSettingChange("allowAnonymous", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Verification Required</Label>
              <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
            </div>
            <Switch
              checked={config.userSettings.verificationRequired}
              onCheckedChange={(value) => handleUserSettingChange("verificationRequired", value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>View and manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-3 w-3 mr-1" />
                        User
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            ))}

            {users.length === 0 && <p className="text-center text-muted-foreground py-8">No users found</p>}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={!hasChanges}>
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )
}
