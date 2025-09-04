"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { postStorage } from "@/lib/posts"
import { PlusCircle, ImageIcon, Smile } from "lucide-react"

interface CreatePostProps {
  onPostCreated: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const { user } = useAuth()

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Sign in to create posts and interact with content</p>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isPosting) return

    setIsPosting(true)

    try {
      postStorage.createPost(user.id, user.name, content.trim())
      setContent("")
      onPostCreated()
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Create Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-2">{content.length}/500 characters</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" disabled>
                <ImageIcon className="h-4 w-4" />
                Photo
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled>
                <Smile className="h-4 w-4" />
                Emoji
              </Button>
            </div>

            <Button type="submit" disabled={!content.trim() || isPosting}>
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
