import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToStorage } from '@/lib/storage';
import { checkRateLimit } from '@/lib/rate-limiter';
import { validateFileUpload } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'file_upload', { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'submissions';
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const fileVal = validateFileUpload(file);
    if (!fileVal.isValid) {
      return NextResponse.json({ error: fileVal.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${sanitizedFileName}`;

    const publicUrl = await uploadFileToStorage(
      bucket,
      filePath,
      buffer,
      file.type || 'application/octet-stream'
    );

    // Audit Log for file upload
    await logAuditEvent({
      actorId: 'UploadUser',
      action: 'FILE_UPLOAD',
      resource: 'Storage',
      resourceId: filePath,
      metadata: { bucket, fileName: file.name, size: file.size, mimeType: file.type },
    });

    return NextResponse.json({
      success: true,
      publicUrl,
      fileName: file.name,
      filePath,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('Storage Upload Route Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'File upload failed' : error.message },
      { status: 500 }
    );
  }
}
