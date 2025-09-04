"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { adminConfigStorage, type AlgorithmConfig } from "@/lib/admin-config"
import { Shield, Plus, X, Save } from "lucide-react"

export function ContentModerationPanel() {
  const [config, setConfig] = useState<AlgorithmConfig | null>(null)
  const [newKeyword, setNewKeyword] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const currentConfig = adminConfigStorage.getConfig()
    setConfig(currentConfig)
  }, [])

  const handleModerationChange = (key: keyof AlgorithmConfig["contentModeration"], value: any) => {
    if (!config) return

    const newConfig = {
      ...config,
      contentModeration: {
        ...config.contentModeration,
        [key]: value,
      },
    }
    setConfig(newConfig)
    setHasChanges(true)
  }

  const addKeyword = () => {
    if (!config || !newKeyword.trim()) return

    const keywords = [...config.contentModeration.flaggedKeywords, newKeyword.trim().toLowerCase()]
    handleModerationChange("flaggedKeywords", keywords)
    setNewKeyword("")
  }

  const removeKeyword = (keyword: string) => {
    if (!config) return

    const keywords = config.contentModeration.flaggedKeywords.filter((k) => k !== keyword)
    handleModerationChange("flaggedKeywords", keywords)
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
            <Shield className="h-5 w-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>Configure automatic content moderation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Moderation</Label>
              <p className="text-sm text-muted-foreground">Automatically flag content with flagged keywords</p>
            </div>
            <Switch
              checked={config.contentModeration.autoModeration}
              onCheckedChange={(value) => handleModerationChange("autoModeration", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Approval</Label>
              <p className="text-sm text-muted-foreground">All posts must be approved before publishing</p>
            </div>
            <Switch
              checked={config.contentModeration.requireApproval}
              onCheckedChange={(value) => handleModerationChange("requireApproval", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Post Length</Label>
            <Input
              type="number"
              value={config.contentModeration.maxPostLength}
              onChange={(e) => handleModerationChange("maxPostLength", Number.parseInt(e.target.value) || 500)}
              min={100}
              max={2000}
            />
            <p className="text-sm text-muted-foreground">Characters allowed per post</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Keywords</CardTitle>
          <CardDescription>Words that trigger automatic moderation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addKeyword()}
            />
            <Button onClick={addKeyword} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {config.contentModeration.flaggedKeywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {config.contentModeration.flaggedKeywords.length === 0 && (
            <p className="text-sm text-muted-foreground">No flagged keywords configured</p>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={!hasChanges}>
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )
}
