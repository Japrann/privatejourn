// Test creating a note directly
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kxruefhcrbdrtyjcvhee.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZoFhGBTFG-7d1AM7Cwvdmg_pce8Wjab';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCreateNote() {
  console.log('🧪 Testing note creation...');
  
  try {
    const testNote = {
      id: Date.now().toString(),
      title: 'Test Note',
      content: 'This is a test note created via script',
      mood: 'calm',
      date: new Date().toISOString().split('T')[0],
      is_special: false,
      is_letter: false,
      recipient: null,
      is_public: false,
      created_at: new Date().toISOString(),
    };

    console.log('📝 Creating note:', testNote);

    const { data, error } = await supabase
      .from('notes')
      .insert([testNote])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating note:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Suggest fixes based on error code
      if (error.code === 'PGRST204') {
        console.log('\n💡 PGRST204 Error - This usually means:');
        console.log('1. Row Level Security (RLS) is blocking the operation');
        console.log('2. The table exists but policies don\'t allow inserts');
        console.log('\n🔧 Quick fix - Disable RLS:');
        console.log('ALTER TABLE notes DISABLE ROW LEVEL SECURITY;');
      }
    } else {
      console.log('✅ Note created successfully!');
      console.log('📊 Created note:', data);
      
      // Test reading it back
      const { data: notes, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .limit(5);
        
      if (fetchError) {
        console.error('❌ Error fetching notes:', fetchError);
      } else {
        console.log(`📚 Found ${notes.length} notes in database`);
        notes.forEach(note => {
          console.log(`- ${note.title} (${note.mood})`);
        });
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testCreateNote();
