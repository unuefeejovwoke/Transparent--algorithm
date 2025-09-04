import AuthScreen from "@/components/auth/auth-screen"

export const metadata = {
  title: "Sign in",
  description: "Authenticate to use the dashboard",
}

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-6">
        <AuthScreen defaultMode="login" />
      </div>
    </main>
  )
}
