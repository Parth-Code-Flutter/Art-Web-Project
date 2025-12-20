
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
    console.log('Testing connection to:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    try {
        const { data, error } = await supabase.from('test_connection').select('*').limit(1);
        if (error) {
            // It's expected to fail if table doesn't exist, but we check the error code.
            // If code is 401/403, auth is wrong.
            // If code is 404/PGRST typically connection is OK but table missing.
            console.log('Connection Response:', error.message, error.code);
            if (error.message.includes('JWT')) {
                console.log('FAIL: Invalid Key (JWT error)');
            } else if (error.code === 'PGRST204' || error.code === '42P01') {
                console.log('SUCCESS: Connected (Table missing is expected)');
            } else {
                console.log('Undetermined/Connected:', error.code);
            }
        } else {
            console.log('SUCCESS: Connected!');
        }
    } catch (err) {
        console.error('CRITICAL FAIL:', err);
    }
}

testConnection();
