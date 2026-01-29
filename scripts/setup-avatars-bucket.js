const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
    const BUCKET_NAME = 'avatars'

    console.log(`Checking storage bucket: ${BUCKET_NAME}...`)

    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.error('Error listing buckets:', listError)
        console.log('You might need to create the bucket manually in Supabase Dashboard.')
        return
    }

    const bucketExists = buckets.find(b => b.name === BUCKET_NAME)

    if (!bucketExists) {
        console.log(`Creating bucket '${BUCKET_NAME}'...`)
        const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/*', 'image/svg+xml'],
            fileSizeLimit: 5242880 // 5MB
        })

        if (error) {
            console.error('Error creating bucket:', error)
            return
        }
        console.log(`Bucket '${BUCKET_NAME}' created successfully!`)
    } else {
        console.log(`Bucket '${BUCKET_NAME}' already exists.`)
    }

    console.log('Avatars storage setup complete!')
}

setupStorage()
