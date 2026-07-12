import { NextResponse } from 'next/server';

/**
 * IndexNow Key Verification Route
 *
 * When a search engine receives an IndexNow submission, it verifies the key
 * by requesting the key location URL. This route serves the key as plain text
 * at the well-known path: /api/indexnow/<key>
 *
 * The key is read from NEXT_PUBLIC_INDEXNOW_KEY. If the environment variable
 * is not set or the dynamic segment doesn't match the configured key, a 404
 * is returned.
 */

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const configuredKey = process.env.NEXT_PUBLIC_INDEXNOW_KEY;

  if (!configuredKey) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { key } = await params;

  if (key !== configuredKey) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return new NextResponse(configuredKey, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
