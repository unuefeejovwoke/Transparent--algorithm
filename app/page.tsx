import SiteNav from "@/components/site-nav"

export const metadata = {
  title: "Transparent Algorithm",
  description: "Test ranking signals with a clear, safe sandbox",
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a href="/" className="font-semibold">Transparent Algorithm</a>
          <SiteNav />
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Tune signals. See impacts in real time.
          </h1>
          <p className="text-muted-foreground">
            Adjust weights for recency, engagement, affinity, and trending. Watch the feed, analytics, and policy panels update instantly.
          </p>
          <div className="flex gap-3">
            <a href="/dashboard" className="px-5 py-3 rounded-md bg-primary text-primary-foreground">Open dashboard</a>
            <a href="/auth" className="px-5 py-3 rounded-md border">Get started</a>
          </div>
          <p className="text-xs text-muted-foreground">Safe demo environment. No production risk.</p>
        </div>

        <div className="rounded-xl border p-4">
          <div className="grid gap-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Scoring controls</p>
              <p className="text-sm text-muted-foreground">Edit factors and document changes.</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Live analytics</p>
              <p className="text-sm text-muted-foreground">Track CTR, dwell time, and fairness stats.</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Policy guardrails</p>
              <p className="text-sm text-muted-foreground">Apply transparency notes and moderation checks.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature title="Transparent scoring" text="Expose every factor behind ranked items." />
          <Feature title="Replay and compare" text="Snapshot settings and compare outcomes." />
          <Feature title="Database ready" text="Swap local storage for a real database anytime." />
        </div>
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold">Open the demo dashboard</h2>
          <p className="text-muted-foreground">Use preset users and posts. Tweak the knobs. Review the results.</p>
          <div className="flex gap-3">
            <a href="/dashboard" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Open dashboard</a>
            <a href="/auth" className="px-4 py-2 rounded-md border">Sign in</a>
          </div>
        </div>
      </section>
    </main>
  )
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
