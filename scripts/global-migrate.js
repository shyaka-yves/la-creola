const { createClient } = require('@supabase/supabase-js');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) process.env[k] = envConfig[k];

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function globalMigrate() {
  console.log('🌍 Starting Global Migration to Cloudinary...');
  console.log('This will find ANY image/video URL and move it to Cloudinary.');

  const uploadedUrls = new Map();

  async function uploadToCloudinary(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('res.cloudinary.com')) return url;
    if (uploadedUrls.has(url)) return uploadedUrls.get(url);

    // Filter out obvious non-media
    if (url.startsWith('https://www.google.com/maps')) return url;

    console.log(`  Processing URL: ${url.substring(0, 50)}...`);
    try {
      // Cloudinary can upload directly from a URL
      const result = await cloudinary.uploader.upload(url, {
        folder: 'la-creola',
        resource_type: 'auto'
      });
      
      console.log(`    ✅ Success: ${result.secure_url}`);
      uploadedUrls.set(url, result.secure_url);
      return result.secure_url;
    } catch (err) {
      console.error(`    ❌ Failed to upload ${url.substring(0, 30)}:`, err.message);
      return url; // Fallback to original
    }
  }

  async function processValue(val) {
    if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('/uploads'))) {
      // If it's a relative /uploads path, we assume it's from Supabase
      const fullUrl = val.startsWith('/') 
        ? `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads${val}` 
        : val;
      return await uploadToCloudinary(fullUrl);
    }
    if (Array.isArray(val)) {
      const next = [];
      for (const item of val) next.push(await processValue(item));
      return next;
    }
    if (val !== null && typeof val === 'object') {
      const next = {};
      for (const k in val) next[k] = await processValue(val[k]);
      return next;
    }
    return val;
  }

  // 1. Gallery
  console.log('\nProcessing Gallery...');
  const { data: gallery } = await supabase.from('gallery').select('*');
  for (const item of gallery || []) {
    const newUrl = await processValue(item.image_url);
    if (newUrl !== item.image_url) {
      await supabase.from('gallery').update({ image_url: newUrl }).eq('id', item.id);
    }
  }

  // 2. Events
  console.log('\nProcessing Events...');
  const { data: events } = await supabase.from('events').select('*');
  for (const item of events || []) {
    const newUrl = await processValue(item.image_url);
    if (newUrl !== item.image_url) {
      await supabase.from('events').update({ image_url: newUrl }).eq('id', item.id);
    }
  }

  // 3. Content
  console.log('\nProcessing Content JSON...');
  const { data: content } = await supabase.from('content').select('*');
  for (const row of content || []) {
    const newData = await processValue(row.data);
    await supabase.from('content').update({ data: newData }).eq('id', row.id);
  }

  console.log('\n✨ Global Migration Complete!');
}

globalMigrate();
