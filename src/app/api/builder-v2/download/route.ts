import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateResumePDF } from '@/lib/pdfGenerator';
import { logErrorServer } from '@/lib/logErrorServer';

export const runtime = 'nodejs';
export const maxDuration = 60;

const InputSchema = z.object({
  filename:   z.string().min(1),
  resumeData: z.record(z.string(), z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const body  = await request.json();
    const input = InputSchema.parse(body);
    const pdfBuffer = await generateResumePDF(input.resumeData);
    const filename  = `${input.filename.replace(/\s+/g, '_')}_Resume.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length':      pdfBuffer.length.toString(),
        'Cache-Control':       'no-cache',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, message: error.issues[0].message },
        { status: 400 },
      );
    }
    console.error('PDF download failed:', error);
    await logErrorServer(error, { route: '/api/builder-v2/download' });
    return Response.json(
      { success: false, message: 'PDF generation failed' },
      { status: 500 },
    );
  }
}
