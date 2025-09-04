"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { adminConfigStorage, type AlgorithmConfig } from "@/lib/admin-config"
import { Clock, Heart, Users, TrendingUp, Save, RotateCcw } from "lucide-react"

export function AlgorithmConfigPanel() {
  const [config, setConfig] = useState<AlgorithmConfig | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const currentConfig = adminConfigStorage.getConfig()
    setConfig(currentConfig)
  }, [])

  const handleWeightChange = (key: keyof AlgorithmConfig["weights"], value: number[]) => {
    if (!config) return

    const newConfig = {
      ...config,
      weights: {
        ...config.weights,
        [key]: value[0],
      },
    }
    setConfig(newConfig)
    setHasChanges(true)
  }

  const handleTransparencyChange = (key: keyof AlgorithmConfig["transparency"], value: boolean) => {
    if (!config) return

    const newConfig = {
      ...config,
      transparency: {
        ...config.transparency,
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

  const handleReset = () => {
    const defaultConfig = adminConfigStorage.getConfig()
    setConfig(defaultConfig)
    setHasChanges(false)
  }

  if (!config) return <div>Loading...</div>

  const totalWeight = Object.values(config.weights).reduce((sum, weight) => sum + weight, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Weights</CardTitle>
          <CardDescription>Configure how different factors influence content ranking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recency Weight
                </Label>
                <span className="text-sm text-muted-foreground">{config.weights.recency}%</span>
              </div>
              <Slider
                value={[config.weights.recency]}
                onValueChange={(value) => handleWeightChange("recency", value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Engagement Weight
                </Label>
                <span className="text-sm text-muted-foreground">{config.weights.engagement}%</span>
              </div>
              <Slider
                value={[config.weights.engagement]}
                onValueChange={(value) => handleWeightChange("engagement", value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Affinity Weight
                </Label>
                <span className="text-sm text-muted-foreground">{config.weights.affinity}%</span>
              </div>
              <Slider
                value={[config.weights.affinity]}
                onValueChange={(value) => handleWeightChange("affinity", value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Weight
                </Label>
                <span className="text-sm text-muted-foreground">{config.weights.trending}%</span>
              </div>
              <Slider
                value={[config.weights.trending]}
                onValueChange={(value) => handleWeightChange("trending", value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Total weight: {totalWeight}% (weights are normalized during calculation)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transparency Settings</CardTitle>
          <CardDescription>Control what users can see about the algorithm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Algorithm Scores</Label>
              <p className="text-sm text-muted-foreground">Display algorithm scores on posts</p>
            </div>
            <Switch
              checked={config.transparency.showAlgorithmScores}
              onCheckedChange={(value) => handleTransparencyChange("showAlgorithmScores", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow User Customization</Label>
              <p className="text-sm text-muted-foreground">Let users adjust their algorithm preferences</p>
            </div>
            <Switch
              checked={config.transparency.allowUserCustomization}
              onCheckedChange={(value) => handleTransparencyChange("allowUserCustomization", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Explanations</Label>
              <p className="text-sm text-muted-foreground">Display why content was shown to users</p>
            </div>
            <Switch
              checked={config.transparency.showExplanations}
              onCheckedChange={(value) => handleTransparencyChange("showExplanations", value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}
