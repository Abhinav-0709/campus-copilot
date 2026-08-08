import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function ensureBucket(bucketName: string) {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucketName);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
      });
    }
  } catch (e) {
    console.warn(`Bucket check note (${bucketName}):`, e);
  }
}

export async function uploadFileToStorage(
  bucketName: string,
  filePath: string,
  fileData: Buffer | Uint8Array | Blob,
  contentType: string
): Promise<string> {
  await ensureBucket(bucketName);

  const { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, fileData, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`Storage Upload Error [${bucketName}]:`, error);
    throw new Error(error.message || 'File storage upload failed');
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
