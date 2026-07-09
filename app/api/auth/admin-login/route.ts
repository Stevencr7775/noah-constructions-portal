import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Check User table for ADMIN or SUPER_ADMIN
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }

      await setSession({
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      });

      return NextResponse.json({ success: true, role: user.role });
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials or unauthorized' }, { status: 401 });

  } catch (error: any) {
    console.error('Admin Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
