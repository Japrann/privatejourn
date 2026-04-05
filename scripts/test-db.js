// Test database connection and table existence
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kxruefhcrbdrtyjcvhee.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZoFhGBTFG-7d1AM7Cwvdmg_pce8Wjab';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('notes').select('count').single();
    
    if (error) {
      console.error('❌ Database error:', error);
      
      if (error.code === 'PGRST116') {
        console.log('💡 The "notes" table does not exist. You need to set up the database schema.');
        console.log('');
        console.log('📋 To fix this:');
        console.log('1. Go to: https://kxruefhcrbdrtyjcvhee.supabase.co');
        console.log('2. Navigate to "SQL Editor"');
        console.log('3. Copy and run the commands from supabase-schema.sql');
        console.log('');
        console.log('🔧 Quick setup commands:');
        console.log('CREATE TABLE notes (');
        console.log('  id TEXT PRIMARY KEY,');
        console.log('  title TEXT NOT NULL,');
        console.log('  content TEXT NOT NULL,');
        console.log('  mood TEXT NOT NULL CHECK (mood IN (\'happy\', \'tired\', \'overthinking\', \'missing\', \'calm\')),');
        console.log('  date TEXT NOT NULL,');
        console.log('  is_special BOOLEAN DEFAULT FALSE,');
        console.log('  is_letter BOOLEAN DEFAULT FALSE,');
        console.log('  recipient TEXT,');
        console.log('  is_public BOOLEAN DEFAULT FALSE,');
        console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
        console.log(');');
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('📊 Notes count:', data);
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testDatabase();
