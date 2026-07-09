import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        email_token: {
          email,
          token
        }
      }
    });

    if (!resetToken) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json({ success: false, error: 'Reset token has expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in whichever table the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
    } else {
      const seller = await prisma.seller.findUnique({ where: { email } });
      if (seller) {
        await prisma.seller.update({
          where: { email },
          data: { password: hashedPassword }
        });
      } else {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
    }

    // Delete the token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json({ success: true, message: 'Password has been successfully reset' });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
