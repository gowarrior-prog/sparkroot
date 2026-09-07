import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

export async function GET() {
  try {
    const [totalUsers, totalOrders, totalProducts, recentOrders, allOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      prisma.order.findMany({
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const chartData = new Array(10).fill(0);
    if (allOrders.length > 0) {
      allOrders.forEach((order, index) => {
        const bucket = Math.min(Math.floor((index / allOrders.length) * 10), 9);
        chartData[bucket] += order.total;
      });
    }

    const revenue = await prisma.order.aggregate({ _sum: { total: true } });
    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: revenue._sum.total || 0,
      recentOrders,
      chartData
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
