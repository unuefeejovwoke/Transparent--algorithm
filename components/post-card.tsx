"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { postStorage, type Post } from "@/lib/posts"
import { RankingExplanation } from "@/components/ranking-explanation"
import { Heart, MessageCircle, Share, MoreHorizontal, TrendingUp, Clock, Users, Send, Info } from "lucide-react"

interface PostCardProps {
  post: Post
  showScores: boolean
  onPostUpdate: () => void
}

export function PostCard({ post, showScores, onPostUpdate }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)
  const [showRankingExplanation, setShowRankingExplanation] = useState(false)

  const isLiked = user ? post.likes.includes(user.id) : false
  const canInteract = !!user

  const handleLike = () => {
    if (!user) return
    postStorage.toggleLike(post.id, user.id)
    onPostUpdate()
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !commentContent.trim() || isCommenting) return

    setIsCommenting(true)
    try {
      postStorage.addComment(post.id, user.id, user.name, commentContent.trim())
      setCommentContent("")
      onPostUpdate()
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsCommenting(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <>
      <Card className="relative">
        {showScores && post.algorithmScore && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowRankingExplanation(true)}
              title="Why was this ranked here?"
            >
              <Info className="h-3 w-3" />
            </Button>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Score: {post.algorithmScore}
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {post.authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{post.authorName}</div>
              <div className="text-sm text-muted-foreground">{formatTimestamp(post.timestamp)}</div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {showScores && post.factors && (
            <div className="p-3 bg-muted rounded-lg space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Algorithm factors for this post</div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Recency: {post.factors.recency}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3" />
                  <span>Engagement: {post.factors.engagement}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>Affinity: {post.factors.affinity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>Trending: {post.factors.trending}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${isLiked ? "text-red-500" : ""}`}
                onClick={handleLike}
                disabled={!canInteract}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {post.likes.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                {post.comments.length}
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled>
                <Share className="h-4 w-4" />
                {post.shares}
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="space-y-4 pt-4 border-t">
              {/* Add Comment Form */}
              {canInteract && (
                <form onSubmit={handleComment} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="min-h-[60px] resize-none"
                      maxLength={200}
                    />
                    <Button type="submit" size="sm" disabled={!commentContent.trim() || isCommenting}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="font-semibold text-sm">{comment.authorName}</div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 ml-3">
                        {formatTimestamp(comment.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showRankingExplanation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <RankingExplanation post={post} onClose={() => setShowRankingExplanation(false)} />
        </div>
      )}
    </>
  )
}
