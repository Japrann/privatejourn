'use client'

import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, use } from 'react'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = use(searchParams)

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
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">redirecting to journal...</h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Taking you to your personal space in a moment...
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Home className="w-4 h-4 mr-2" />
                go to journal now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
