'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  // Auto-redirect to main journal after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 animate-fade-in text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 glow-effect animate-soft-pulse">
              <Home className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground">welcome to your journal</h1>
            <p className="text-muted-foreground mt-2">your personal space for thoughts and feelings</p>
          </div>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Home className="w-4 h-4 mr-2" />
                enter your journal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
