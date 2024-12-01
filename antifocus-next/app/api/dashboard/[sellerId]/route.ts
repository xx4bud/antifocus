import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    const body = await req.json();
    
    const { name } = body;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const shop = await prisma.seller.create({
      data: {
        name,
        userId,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Failed to create shop' },
        { status: 500 }
      );
    }

    if (userRole !== Role.ADMIN) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: Role.SELLER,
        },
      });
    }

    return NextResponse.json({
      message: 'Shop created successfully and role updated to seller',
      shopId: shop.id, // Tambahkan ini untuk mendapatkan ID toko
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const shop = await prisma.seller.findUnique({
      where: {
        id: params.sellerId,
        userId,
      },
    });

    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Shop found',
      shop,
      shopId: shop.id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
