import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export interface AuthSession {
  userId: string;
  email: string;
  role: Role;
  name?: string;
}

export async function getAuthSession(req: NextRequest): Promise<AuthSession | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const userMeta = user.user_metadata || {};
  let role: Role = (userMeta.role as Role) || 'student';

  // Double-check profile from Prisma if available
  try {
    const dbProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true, name: true },
    });
    if (dbProfile) {
      role = dbProfile.role;
    }
  } catch (e) {
    // Fallback to metadata
  }

  return {
    userId: user.id,
    email: user.email || '',
    role,
    name: userMeta.name,
  };
}

export function authorizeRole(
  session: AuthSession | null,
  allowedRoles: Role[]
): { isAuthorized: boolean; response?: NextResponse } {
  if (!session) {
    return {
      isAuthorized: false,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  if (session.role !== 'admin' && !allowedRoles.includes(session.role)) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: 'Forbidden: Insufficient privileges' },
        { status: 403 }
      ),
    };
  }

  return { isAuthorized: true };
}
