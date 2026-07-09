import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists in either table
    const user = await prisma.user.findUnique({ where: { email } });
    const seller = await prisma.seller.findUnique({ where: { email } });

    if (!user && !seller) {
      // Don't reveal that the email does not exist for security
      return NextResponse.json({ success: true, message: 'If that email is in our database, we will send you a link to reset your password.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    // In a real application, send the email here using Nodemailer, Resend, or SendGrid
    console.log(`[DEV MODE] Password reset link for ${email}: http://localhost:3000/reset-password?token=${token}&email=${email}`);

    return NextResponse.json({ success: true, message: 'If that email is in our database, we will send you a link to reset your password.' });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
