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

async function fix() {
  try {
    const filename = '1772804907105-268cdeac594424eda270.pdf';
    const oldSupabasePdf = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${filename}`;
    
    console.log(`Uploading PDF from ${oldSupabasePdf} as raw...`);
    
    const res = await cloudinary.uploader.upload(oldSupabasePdf, {
      resource_type: 'raw',
      folder: 'la-creola',
      public_id: 'menu-official-raw'
    });
    
    console.log('New Raw URL:', res.secure_url);
    
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('id', 'default')
      .single();
      
    if (contentError) throw contentError;

    const newData = content.data;
    newData.menu.pdfUrl = res.secure_url;
    
    const { error: updateError } = await supabase
      .from('content')
      .update({ data: newData })
      .eq('id', 'default');
      
    if (updateError) throw updateError;
    
    console.log('✅ Database updated successfully!');
  } catch (err) {
    console.error('❌ Error fixing PDF:', err);
  }
}

fix();
