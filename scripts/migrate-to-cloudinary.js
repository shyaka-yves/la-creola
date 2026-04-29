/**
 * Migration script: Supabase Storage to Cloudinary
 * Instructions:
 * 1. Ensure .env.local has both SUPABASE and CLOUDINARY credentials.
 * 2. Run with settings: node scripts/migrate-to-cloudinary.js
 */

const { createClient } = require('@supabase/supabase-js');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const BUCKET = 'uploads';

if (!SUPABASE_URL || !SUPABASE_KEY || !CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Missing environment variables. Please check .env.local');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});

// Configure Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  console.log('🚀 Starting migration from Supabase Storage to Cloudinary...');

  // 1. List files in Supabase bucket
  const { data: supabaseFiles, error } = await supabase.storage.from(BUCKET).list();

  if (error) {
    console.error('Error listing Supabase files:', error.message);
    return;
  }

  const validFiles = (supabaseFiles || []).filter(f => f.name && !f.name.startsWith('.'));
  console.log(`Found ${validFiles.length} files to migrate.`);

  const urlMapping = new Map();

  for (const file of validFiles) {
    const oldUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file.name}`;
    console.log(`Processing: ${file.name}...`);

    try {
      // 2. Download from Supabase
      const { data, error: dlError } = await supabase.storage
        .from(BUCKET)
        .download(file.name);

      if (dlError) {
        console.error(`  ❌ Failed to download ${file.name}:`, dlError.message);
        continue;
      }

      const buffer = Buffer.from(await data.arrayBuffer());

      // 3. Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id: file.name.split('.')[0],
            resource_type: 'auto',
            folder: 'la-creola',
            use_filename: true,
            unique_filename: false,
            overwrite: true
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      console.log(`  ✅ Migrated: ${file.name} -> ${result.secure_url}`);
      urlMapping.set(oldUrl, result.secure_url);
    } catch (err) {
      console.error(`  ❌ Error migrating ${file.name}:`, err.message);
    }
  }

  console.log('\n🔄 Updating database URLs...');

  // Helper to replace URLs in text/objects
  const replaceUrls = (obj) => {
    if (typeof obj === 'string') {
      let next = obj;
      urlMapping.forEach((newUrl, oldUrl) => {
        if (next.includes(oldUrl)) {
          next = next.replace(oldUrl, newUrl);
        }
      });
      return next;
    }
    if (Array.isArray(obj)) {
      return obj.map(replaceUrls);
    }
    if (obj !== null && typeof obj === 'object') {
      const next = {};
      for (const k in obj) {
          next[k] = replaceUrls(obj[k]);
      }
      return next;
    }
    return obj;
  };

  // 4. Update Gallery
  console.log('- Updating Gallery table...');
  const { data: galleryItems } = await supabase.from('gallery').select('*');
  for (const item of galleryItems || []) {
      const newUrl = replaceUrls(item.image_url);
      if (newUrl !== item.image_url) {
          await supabase.from('gallery').update({ image_url: newUrl }).eq('id', item.id);
      }
  }

  // 5. Update Events
  console.log('- Updating Events table...');
  const { data: eventItems } = await supabase.from('events').select('*');
  for (const item of eventItems || []) {
      const newUrl = replaceUrls(item.image_url);
      if (newUrl !== item.image_url) {
          await supabase.from('events').update({ image_url: newUrl }).eq('id', item.id);
      }
  }

  // 6. Update Content table (JSON blob)
  console.log('- Updating Content table...');
  const { data: contentRows } = await supabase.from('content').select('*');
  for (const row of contentRows || []) {
      const newData = replaceUrls(row.data);
      await supabase.from('content').update({ data: newData }).eq('id', row.id);
  }

  console.log('\n✨ Migration and Database update complete!');
}

migrate();
