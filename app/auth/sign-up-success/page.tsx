'use client'

import { useEffect } from 'react'
import { Feather, Mail } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Page() {
  // Auto-redirect to main journal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 animate-fade-in text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 glow-effect animate-soft-pulse">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">journal created</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              your personal space is ready for your thoughts.
              <br />
              click below to begin writing.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground/70 text-sm">
              didn&apos;t receive it? check your spam folder.
            </p>
            
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="w-full border-border hover:bg-secondary"
              >
                back to login
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground/50">
          <Feather className="w-4 h-4" />
          <span className="text-xs">your quiet place awaits your thoughts</span>
        </div>
      </div>
    </div>
  )
}
