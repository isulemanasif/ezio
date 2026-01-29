const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local') // Fixed typo
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
    const BUCKET_NAME = 'posts'

    console.log(`Checking storage bucket: ${BUCKET_NAME}...`)

    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.error('Error listing buckets:', listError)
        return
    }

    const bucketExists = buckets.find(b => b.name === BUCKET_NAME)

    if (!bucketExists) {
        console.log(`Creating bucket '${BUCKET_NAME}'...`)
        const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 52428800 // 50MB
        })

        if (error) {
            console.error('Error creating bucket:', error)
            return
        }
        console.log(`Bucket '${BUCKET_NAME}' created successfully!`)
    } else {
        console.log(`Bucket '${BUCKET_NAME}' already exists.`)
    }

    console.log('Storage setup complete!')
}

setupStorage()
