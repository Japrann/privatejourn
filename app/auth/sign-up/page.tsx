'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Feather, Eye, EyeOff } from 'lucide-react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Auto-redirect to main journal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulate account creation and redirect
    setTimeout(() => {
      window.location.href = '/auth/sign-up-success'
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 glow-effect">
              <Feather className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">create your journal space</h1>
            <p className="text-muted-foreground mt-2">your personal corner for thoughts and memories</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-sm">
                email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-sm">
                password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="create a secret key"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border focus:ring-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeat-password" className="text-muted-foreground text-sm">
                confirm password
              </Label>
              <Input
                id="repeat-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="repeat your secret key"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="bg-input border-border focus:ring-primary/50"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center animate-fade-in">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-effect"
              disabled={isLoading}
            >
              {isLoading ? 'creating space...' : 'begin journaling'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            already have a space?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              enter here
            </Link>
          </p>
        </div>

        <p className="text-center text-muted-foreground/50 text-xs mt-8">
          your words will be safe here
        </p>
      </div>
    </div>
  )
}
