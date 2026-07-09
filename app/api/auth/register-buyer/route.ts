import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { fullName, email, mobile, password } = await request.json();

    if (!fullName || !email || !mobile || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists in User table
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }
    
    // Check if user exists in Seller table (duplicate email constraint)
    const existingSeller = await prisma.seller.findUnique({ where: { email } });
    if (existingSeller) {
      return NextResponse.json({ success: false, error: 'Email already registered as a Seller' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        role: 'BUYER',
        name: fullName,
        email,
        phone: mobile,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });

  } catch (error: any) {
    console.error('Buyer Registration error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
