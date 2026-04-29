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

async function repair() {
  console.log('🔍 Fetching all resources from Cloudinary...');
  
  const resources = [];
  let nextCursor = null;

  try {
    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'la-creola/',
        max_results: 500,
        next_cursor: nextCursor
      });
      resources.push(...res.resources);
      nextCursor = res.next_cursor;
    } while (nextCursor);

    console.log(`Found ${resources.length} files in Cloudinary.`);

    const replaceUrl = (oldUrl) => {
      if (!oldUrl || typeof oldUrl !== 'string') return oldUrl;
      if (!oldUrl.includes('supabase.co')) return oldUrl;
      
      const filename = oldUrl.split('/').pop().split('?')[0];
      const nameWithoutExt = filename.split('.')[0];
      
      // Find matching resource in Cloudinary
      // Cloudinary might have changed the extension or added a version prefix
      const match = resources.find(r => r.public_id === `la-creola/${nameWithoutExt}`);
      if (match) {
        return match.secure_url;
      }
      return oldUrl;
    };

    const processObject = (obj) => {
      if (typeof obj === 'string') return replaceUrl(obj);
      if (Array.isArray(obj)) return obj.map(processObject);
      if (obj !== null && typeof obj === 'object') {
        const next = {};
        for (const k in obj) next[k] = processObject(obj[k]);
        return next;
      }
      return obj;
    };

    // 1. Update Gallery
    console.log('Update Gallery...');
    const { data: gallery } = await supabase.from('gallery').select('*');
    for (const item of gallery || []) {
      const newUrl = replaceUrl(item.image_url);
      if (newUrl !== item.image_url) {
        console.log(`  Updating ${item.id} -> ${newUrl}`);
        await supabase.from('gallery').update({ image_url: newUrl }).eq('id', item.id);
      }
    }

    // 2. Update Events
    console.log('Update Events...');
    const { data: events } = await supabase.from('events').select('*');
    for (const item of events || []) {
      const newUrl = replaceUrl(item.image_url);
      if (newUrl !== item.image_url) {
        console.log(`  Updating ${item.id} -> ${newUrl}`);
        await supabase.from('events').update({ image_url: newUrl }).eq('id', item.id);
      }
    }

    // 3. Update Content
    console.log('Update Content...');
    const { data: content } = await supabase.from('content').select('*');
    for (const row of content || []) {
      const newData = processObject(row.data);
      console.log(`  Updating ${row.id}`);
      await supabase.from('content').update({ data: newData }).eq('id', row.id);
    }

    console.log('✅ Repair complete!');
  } catch (err) {
    console.error('Error during repair:', err);
  }
}

repair();
