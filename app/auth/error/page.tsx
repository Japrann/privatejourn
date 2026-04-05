import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 animate-fade-in text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">something went wrong</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {params?.error ? (
                <>we couldn&apos;t complete your request: {params.error}</>
              ) : (
                <>we couldn&apos;t complete your request. please try again.</>
              )}
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                try logging in
              </Button>
            </Link>
            
            <Link href="/auth/sign-up">
              <Button
                variant="outline"
                className="w-full border-border hover:bg-secondary"
              >
                create new account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
