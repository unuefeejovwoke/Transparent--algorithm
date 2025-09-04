export interface Post {
  id: string
  authorId: string
  authorName: string
  content: string
  timestamp: string
  likes: string[] // Array of user IDs who liked
  comments: Comment[]
  shares: number
  algorithmScore?: number
  factors?: {
    recency: number
    engagement: number
    affinity: number
    trending: number
  }
}

export interface Comment {
  id: string
  authorId: string
  authorName: string
  content: string
  timestamp: string
  likes: string[]
}

// Post storage using localStorage
export const postStorage = {
  getPosts: (): Post[] => {
    if (typeof window === "undefined") return []
    const posts = localStorage.getItem("social_posts")
    return posts ? JSON.parse(posts) : []
  },

  savePosts: (posts: Post[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("social_posts", JSON.stringify(posts))
  },

  createPost: (authorId: string, authorName: string, content: string): Post => {
    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      authorId,
      authorName,
      content,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: 0,
    }

    const posts = postStorage.getPosts()
    posts.unshift(post) // Add to beginning
    postStorage.savePosts(posts)

    return post
  },

  toggleLike: (postId: string, userId: string): boolean => {
    const posts = postStorage.getPosts()
    const postIndex = posts.findIndex((p) => p.id === postId)

    if (postIndex === -1) return false

    const post = posts[postIndex]
    const likeIndex = post.likes.indexOf(userId)

    if (likeIndex === -1) {
      post.likes.push(userId)
    } else {
      post.likes.splice(likeIndex, 1)
    }

    postStorage.savePosts(posts)
    return likeIndex === -1 // Return true if liked, false if unliked
  },

  addComment: (postId: string, authorId: string, authorName: string, content: string): Comment => {
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      authorId,
      authorName,
      content,
      timestamp: new Date().toISOString(),
      likes: [],
    }

    const posts = postStorage.getPosts()
    const postIndex = posts.findIndex((p) => p.id === postId)

    if (postIndex !== -1) {
      posts[postIndex].comments.push(comment)
      postStorage.savePosts(posts)
    }

    return comment
  },

  calculateAlgorithmScore: (post: Post, currentUserId: string): Post => {
    const now = new Date()
    const postTime = new Date(post.timestamp)
    const hoursAgo = (now.getTime() - postTime.getTime()) / (1000 * 60 * 60)

    // Calculate factors
    const recency = Math.max(0, 100 - hoursAgo * 5) // Decreases over time
    const engagement = Math.min(100, (post.likes.length * 2 + post.comments.length * 3) * 2)
    const affinity = post.authorId === currentUserId ? 100 : Math.random() * 100 // Simplified
    const trending = Math.min(100, post.shares * 10 + engagement * 0.5)

    const algorithmScore = Math.round(recency * 0.35 + engagement * 0.3 + affinity * 0.2 + trending * 0.15)

    return {
      ...post,
      algorithmScore,
      factors: {
        recency: Math.round(recency),
        engagement: Math.round(engagement),
        affinity: Math.round(affinity),
        trending: Math.round(trending),
      },
    }
  },
}

// Sample posts for demo purposes
export const initializeSamplePosts = (): void => {
  if (typeof window === "undefined") return

  console.log("[v0] Initializing sample posts...")
  console.log("[v0] Clearing existing posts and creating fresh sample data")

  const samplePosts: Post[] = [
    {
      id: "sample-1",
      authorId: "user@test.com", // Matches actual login user
      authorName: "Alex Chen",
      content:
        "Just tried this new coffee shop downtown and their matcha latte is incredible! ☕ The barista even made latte art that looked like a tiny cat. Sometimes it's the small things that make your day better.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: ["admin@test.com", "user2@test.com"],
      comments: [
        {
          id: "comment-1",
          authorId: "admin@test.com",
          authorName: "Admin User",
          content: "I love that place! Their pastries are amazing too.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          likes: ["user@test.com"],
        },
      ],
      shares: 3,
    },
    {
      id: "sample-2",
      authorId: "admin@test.com", // Matches actual admin user
      authorName: "Admin User",
      content:
        "Finally finished reading 'The Seven Husbands of Evelyn Hugo' and I'm emotionally destroyed in the best way possible. 📚 Anyone have recommendations for what to read next? I need something equally captivating!",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: ["user@test.com", "user2@test.com", "user3@test.com"],
      comments: [
        {
          id: "comment-2",
          authorId: "user@test.com",
          authorName: "Alex Chen",
          content: "Try 'The Midnight Library' - it's incredible!",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          likes: ["admin@test.com"],
        },
        {
          id: "comment-3",
          authorId: "user2@test.com",
          authorName: "Sarah Kim",
          content: "I second that recommendation! Also check out 'Klara and the Sun'",
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          likes: [],
        },
      ],
      shares: 1,
    },
    {
      id: "sample-3",
      authorId: "user2@test.com",
      authorName: "Sarah Kim",
      content:
        "Spent the weekend hiking in the mountains and the views were absolutely breathtaking! 🏔️ There's something so peaceful about being disconnected from technology and just enjoying nature. Highly recommend the trail at Bear Creek if anyone's looking for a good hike.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes: ["user@test.com", "admin@test.com", "user3@test.com", "user4@test.com"],
      comments: [
        {
          id: "comment-4",
          authorId: "user@test.com",
          authorName: "Alex Chen",
          content: "That sounds amazing! I need to get out more often.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          likes: ["user2@test.com", "admin@test.com"],
        },
      ],
      shares: 5,
    },
    {
      id: "sample-4",
      authorId: "user3@test.com",
      authorName: "Emma Thompson",
      content:
        "My sourdough starter is finally thriving after weeks of trial and error! 🍞 Made my first successful loaf today and it actually has those beautiful holes and a crispy crust. Baking has become my new meditation.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likes: ["admin@test.com", "user@test.com"],
      comments: [],
      shares: 2,
    },
    {
      id: "sample-5",
      authorId: "user4@test.com",
      authorName: "David Park",
      content:
        "Just watched the most incredible sunset from my balcony. The sky was painted in shades of orange and pink that no camera could capture. 🌅 Sometimes I forget to slow down and appreciate these simple moments of beauty.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes: ["user@test.com", "admin@test.com", "user2@test.com", "user3@test.com"],
      comments: [
        {
          id: "comment-5",
          authorId: "user@test.com",
          authorName: "Alex Chen",
          content: "Those are the best kind of moments!",
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          likes: ["user4@test.com"],
        },
      ],
      shares: 4,
    },
    {
      id: "sample-6",
      authorId: "user@test.com",
      authorName: "Alex Chen",
      content:
        "Learning to play guitar at 28 and my fingers are definitely not happy with me! 🎸 But there's something magical about finally getting a chord progression right. Any tips for a complete beginner?",
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      likes: ["user2@test.com", "user4@test.com"],
      comments: [
        {
          id: "comment-6",
          authorId: "user4@test.com",
          authorName: "David Park",
          content: "Practice little and often! Your calluses will build up soon.",
          timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
          likes: ["user@test.com"],
        },
      ],
      shares: 1,
    },
    {
      id: "sample-7",
      authorId: "admin@test.com",
      authorName: "Admin User",
      content:
        "My cat has decided that my laptop keyboard is the perfect napping spot, especially during important video calls. 🐱 Working from home has its challenges, but I wouldn't trade these furry interruptions for anything!",
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      likes: ["user@test.com", "user3@test.com", "user4@test.com"],
      comments: [
        {
          id: "comment-7",
          authorId: "user3@test.com",
          authorName: "Emma Thompson",
          content: "Cats always know the worst possible timing! 😂",
          timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
          likes: ["admin@test.com"],
        },
      ],
      shares: 3,
    },
    {
      id: "sample-8",
      authorId: "user2@test.com",
      authorName: "Sarah Kim",
      content:
        "Tried making homemade pizza for the first time and let's just say... ordering takeout exists for a reason! 🍕 The dough was more like concrete, but hey, at least I learned something new today.",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      likes: ["user@test.com", "admin@test.com"],
      comments: [],
      shares: 2,
    },
  ]

  postStorage.savePosts(samplePosts)
  console.log("[v0] Sample posts created successfully:", samplePosts.length)
}
