import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data, error } = await supabase
    .from('products')
    .update({ category: 'Fabric Painting' })
    .eq('name', 'Fabric Painting On Custom Dress');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Fixed product category');
  }
}

fix();
