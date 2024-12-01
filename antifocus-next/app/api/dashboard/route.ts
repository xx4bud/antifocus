'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { name } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const existingSeller = await prisma.seller.findFirst({
      where: {
        userId,
      },
    });

    if (existingSeller) {
      return NextResponse.json(
        { message: 'User already has a store' },
        { status: 409 }
      );
    }

    const seller = await prisma.seller.create({
      data: {
        name,
        userId,
      },
    });

    if (session?.user?.role !== Role.ADMIN) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: Role.SELLER,
        },
      });
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.log('POST /api/dashboard', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
