import { NextRequest } from 'next/server';
import { jsPDF } from 'jspdf';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { text, filename = 'cover-letter' } = await request.json() as {
      text?: string;
      filename?: string;
    };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json({ success: false, message: 'No text provided' }, { status: 400 });
    }

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageW      = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginTop  = 24;
    const marginRight= 20;
    const lineHeight = 7;
    const maxWidth   = pageW - marginLeft - marginRight;

    doc.setFont('times', 'normal');
    doc.setFontSize(11.5);

    const lines = doc.splitTextToSize(text.trim(), maxWidth) as string[];

    let y = marginTop;
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(line, marginLeft, y);
      y += lineHeight;
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const safeFilename = filename.replace(/[^a-z0-9_-]/gi, '_');

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}.pdf"`,
        'Content-Length':      pdfBuffer.length.toString(),
        'Cache-Control':       'no-cache',
      },
    });
  } catch (err) {
    console.error('Cover letter PDF generation failed:', err);
    return Response.json({ success: false, message: 'PDF generation failed' }, { status: 500 });
  }
}
