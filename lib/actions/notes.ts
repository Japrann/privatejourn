"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Mood } from "@/lib/types"

export interface NoteInput {
  title: string
  content: string
  mood: Mood
  date: string
  isSpecial?: boolean
  isLetter?: boolean
  recipient?: string
}

export async function createNote(input: NoteInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: input.title,
      content: input.content,
      mood: input.mood,
      date: input.date,
      is_special: input.isSpecial || false,
      is_letter: input.isLetter || false,
      recipient: input.recipient || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "page")
  return { data }
}

export async function getNotes() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

export async function getNote(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function updateNote(id: string, input: Partial<NoteInput>) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title
  if (input.content !== undefined) updateData.content = input.content
  if (input.mood !== undefined) updateData.mood = input.mood
  if (input.date !== undefined) updateData.date = input.date
  if (input.isSpecial !== undefined) updateData.is_special = input.isSpecial
  if (input.isLetter !== undefined) updateData.is_letter = input.isLetter
  if (input.recipient !== undefined) updateData.recipient = input.recipient

  const { data, error } = await supabase
    .from("notes")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "page")
  return { data }
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "page")
  return { success: true }
}

export async function getRandomNote() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  // Get count first
  const { count } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (!count || count === 0) {
    return { data: null, error: "No notes found" }
  }

  // Get random offset
  const randomOffset = Math.floor(Math.random() * count)

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .range(randomOffset, randomOffset)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
