"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AccentColor, AmbientMode } from "@/lib/types"

export interface SettingsInput {
  journalName?: string
  accentColor?: AccentColor
  ambientMode?: AmbientMode
  pinCode?: string | null
}

export async function getSettings() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { 
      data: {
        journalName: "my quiet place",
        accentColor: "purple" as AccentColor,
        ambientMode: "none" as AmbientMode,
        pinCode: null
      }, 
      error: null 
    }
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error) {
    // If no settings exist yet, return defaults
    return { 
      data: {
        journalName: "my quiet place",
        accentColor: "purple" as AccentColor,
        ambientMode: "none" as AmbientMode,
        pinCode: null
      }, 
      error: null 
    }
  }

  return { 
    data: {
      journalName: data.journal_name || "my quiet place",
      accentColor: (data.accent_color || "purple") as AccentColor,
      ambientMode: (data.ambient_mode || "none") as AmbientMode,
      pinCode: data.pin_code || null
    }, 
    error: null 
  }
}

export async function updateSettings(input: SettingsInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const updateData: Record<string, unknown> = {}
  if (input.journalName !== undefined) updateData.journal_name = input.journalName
  if (input.accentColor !== undefined) updateData.accent_color = input.accentColor
  if (input.ambientMode !== undefined) updateData.ambient_mode = input.ambientMode
  if (input.pinCode !== undefined) updateData.pin_code = input.pinCode

  // Try to update first
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      ...updateData
    }, {
      onConflict: "user_id"
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "page")
  return { data }
}

export async function verifyPin(pin: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { valid: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("pin_code")
    .eq("user_id", user.id)
    .single()

  if (error || !data?.pin_code) {
    return { valid: true, error: null } // No pin set, allow access
  }

  return { valid: data.pin_code === pin, error: null }
}
