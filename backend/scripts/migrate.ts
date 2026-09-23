import { config } from '../src/config';
import { supabaseClient, isSupabaseConfigured } from '../src/config/supabase';

async function runMigration() {
  console.log('====================================================');
  console.log('   SYNAPSE – SUPABASE CLOUD MIGRATION RUNNER        ');
  console.log('====================================================');

  if (!isSupabaseConfigured() || !supabaseClient) {
    console.error('❌ Error: Supabase client is not configured. Check your SUPABASE_URL and SUPABASE_SECRET_KEY in backend/.env');
    process.exit(1);
  }

  console.log(`🔗 Connected to: ${config.supabase.url}`);

  // 1. Kiểm tra / Tạo Bucket Storage 'item-assets'
  console.log('\n📦 Step 1: Kiểm tra Bucket Storage "item-assets"...');
  try {
    const { data: buckets, error: listErr } = await supabaseClient.storage.listBuckets();
    if (listErr) {
      console.warn('⚠️ Không thể liệt kê buckets:', listErr.message);
    } else {
      const exists = buckets.some((b) => b.id === 'item-assets');
      if (!exists) {
        const { error: createErr } = await supabaseClient.storage.createBucket('item-assets', {
          public: true,
        });
        if (createErr) {
          console.error('❌ Lỗi tạo bucket:', createErr.message);
        } else {
          console.log('✅ Đã tạo thành công bucket "item-assets" (Public)');
        }
      } else {
        console.log('✅ Bucket "item-assets" đã tồn tại.');
      }
    }
  } catch (err) {
    console.warn('⚠️ Lỗi kiểm tra Storage:', err);
  }

  // 2. Kiểm tra các bảng cốt lõi
  console.log('\n🗄️ Step 2: Kiểm tra các bảng CSDL...');
  const tables = ['items', 'cultural_facts', 'cultural_rules', 'lookbooks'];
  for (const table of tables) {
    try {
      const { count, error } = await supabaseClient.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.warn(`⚠️ Bảng "${table}" chưa sẵn sàng:`, error.message);
      } else {
        console.log(`✅ Bảng "${table}" hoạt động tốt (${count ?? 0} bản ghi).`);
      }
    } catch (err) {
      console.warn(`⚠️ Bảng "${table}" gặp lỗi:`, err);
    }
  }

  console.log('\n🎉 Hoàn thành kiểm tra & đồng bộ CSDL Supabase!');
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
