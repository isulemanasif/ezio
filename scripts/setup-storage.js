const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local to get Supabase credentials
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
    const match = envFile.match(new RegExp(`${name}=([^\\s]+)`));
    return match ? match[1] : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
    console.log('🚀 Setting up Eziogram Storage...');

    // 1. Create Bucket
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
    });

    if (bucketError) {
        if (bucketError.message.includes('already exists')) {
            console.log('✅ Bucket "avatars" already exists.');
        } else {
            console.error('❌ Error creating bucket:', bucketError.message);
            console.log('\nTip: If you get "Project not found" or "Unauthorized", double check your .env.local keys.');
            return;
        }
    } else {
        console.log('✅ Bucket "avatars" created successfully.');
    }

    console.log('\n🎉 Storage setup check complete! Try uploading your profile picture now.');
}

setup();
