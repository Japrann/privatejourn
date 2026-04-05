import { supabase } from './supabase'
import { Note } from './types'

export const notesService = {
  // Check if Supabase is available
  isAvailable(): boolean {
    return supabase !== null
  },

  // Fetch all notes
  async fetchNotes(): Promise<Note[]> {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform database field names back to frontend format
      return (data || []).map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        mood: note.mood,
        date: note.date,
        isSpecial: note.is_special,
        isLetter: note.is_letter,
        recipient: note.recipient,
        isPublic: note.is_public,
        createdAt: note.created_at,
      }))
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw error
    }
  },

  // Create a new note
  async createNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    try {
      // Transform frontend field names to database format
      const newNote = {
        id: Date.now().toString(),
        title: note.title || '',
        content: note.content || '',
        mood: note.mood || 'calm',
        date: note.date || new Date().toISOString().split('T')[0],
        is_special: Boolean(note.isSpecial),
        is_letter: Boolean(note.isLetter),
        recipient: note.recipient || null,
        is_public: Boolean(note.isPublic),
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase error:', error.message);
        throw error
      }
      
      // Transform database field names back to frontend format
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        date: data.date,
        isSpecial: data.is_special,
        isLetter: data.is_letter,
        recipient: data.recipient,
        isPublic: data.is_public,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error('❌ Error creating note:', error)
      throw error
    }
  },

  // Update a note
  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    try {
      // Transform frontend field names to database format
      const dbUpdates: any = {}
      if (updates.title !== undefined) dbUpdates.title = updates.title
      if (updates.content !== undefined) dbUpdates.content = updates.content
      if (updates.mood !== undefined) dbUpdates.mood = updates.mood
      if (updates.date !== undefined) dbUpdates.date = updates.date
      if (updates.isSpecial !== undefined) dbUpdates.is_special = updates.isSpecial
      if (updates.isLetter !== undefined) dbUpdates.is_letter = updates.isLetter
      if (updates.recipient !== undefined) dbUpdates.recipient = updates.recipient
      if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic

      const { data, error } = await supabase
        .from('notes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Transform database field names back to frontend format
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        date: data.date,
        isSpecial: data.is_special,
        isLetter: data.is_letter,
        recipient: data.recipient,
        isPublic: data.is_public,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  },

  // Delete a note
  async deleteNote(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  },

  // Fetch a single public note by ID
  async fetchPublicNote(id: string): Promise<Note | null> {
    if (!supabase) {
      console.warn('Supabase not configured, returning null')
      return null
    }
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, note doesn't exist or isn't public
          return null
        }
        throw error
      }

      // Transform database field names back to frontend format
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        date: data.date,
        isSpecial: data.is_special,
        isLetter: data.is_letter,
        recipient: data.recipient,
        isPublic: data.is_public,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error('Error fetching public note:', error)
      throw error
    }
  },

  // Fetch all public notes
  async fetchPublicNotes(): Promise<Note[]> {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        mood: note.mood,
        date: note.date,
        isSpecial: note.is_special,
        isLetter: note.is_letter,
        recipient: note.recipient,
        isPublic: note.is_public,
        createdAt: note.created_at,
      }))
    } catch (error) {
      console.error('Error fetching public notes:', error)
      throw error
    }
  }
}
