"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { useAuth } from "@/contexts/auth-context"
import { postStorage, type Post } from "@/lib/posts"

export function ContentFeed() {
  const [showScores, setShowScores] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const { user } = useAuth()

  const loadPosts = () => {
    const allPosts = postStorage.getPosts()

    // Calculate algorithm scores for each post
    const postsWithScores = allPosts.map((post) => (user ? postStorage.calculateAlgorithmScore(post, user.id) : post))

    // Sort by algorithm score if available, otherwise by timestamp
    postsWithScores.sort((a, b) => {
      if (a.algorithmScore && b.algorithmScore) {
        return b.algorithmScore - a.algorithmScore
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    setPosts(postsWithScores)
  }

  useEffect(() => {
    loadPosts()
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Feed</h2>
        <Button variant="outline" size="sm" onClick={() => setShowScores(!showScores)}>
          {showScores ? "Hide" : "Show"} Algorithm Scores
        </Button>
      </div>

      {/* Create Post Component */}
      <CreatePost onPostCreated={loadPosts} />

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} showScores={showScores} onPostUpdate={loadPosts} />)
        )}
      </div>
    </div>
  )
}
