import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const returnTo = requestUrl.searchParams.get('returnTo') || '/';

  const getSafeRedirectPath = (path: string): string => {
    if (!path.startsWith('/') || path.startsWith('//')) return '/';

    try {
      const decodedPath = decodeURIComponent(path);
      if (decodedPath.includes('\\') || /[\x00-\x1F\x7F]/.test(decodedPath)) {
        return '/';
      }
    } catch {
      return '/';
    }
    return path;
  };

  const safeReturnTo = getSafeRedirectPath(returnTo);

  try {
    if (!code) {
      console.error('No code provided in auth callback');
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error.message);
      return NextResponse.redirect(
        new URL(
          `/login?error=auth_failed&error_description=${encodeURIComponent(error.message)}`,
          request.url,
        ),
      );
    }

    return NextResponse.redirect(new URL(safeReturnTo, request.url));
  } catch (err) {
    console.error('Unexpected error in callback:', err);
    return NextResponse.redirect(new URL('/login?error=internal_error', request.url));
  }
}
