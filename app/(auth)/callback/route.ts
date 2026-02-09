import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  let returnTo = requestUrl.searchParams.get('returnTo') || '/';

  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
    returnTo = '/';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(
        new URL(
          `/login?error=auth_failed&error_description=${encodeURIComponent(error.message)}`,
          request.url,
        ),
      );
    }
  }

  return NextResponse.redirect(new URL(returnTo, request.url));
}
