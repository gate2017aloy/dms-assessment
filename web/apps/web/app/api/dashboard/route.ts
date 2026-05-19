import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalAlerts,
      criticalAlerts,
      investigatingAlerts,
      falsePositives,
      severityGroup,
      statusGroup,
      categoryGroup,
      alertsTime
    ] = await Promise.all([
      prisma.alert.count(),
      prisma.alert.count({ where: { severity: 'critical' } }),
      prisma.alert.count({ where: { status: 'investigating' } }),
      prisma.alert.count({ where: { status: 'false_positive' } }),
      prisma.alert.groupBy({
        by: ['severity'],
        _count: { severity: true }
      }),
      prisma.alert.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.alert.groupBy({
        by: ['category'],
        _count: { category: true }
      }),
      prisma.alert.findMany({
        select: {
          timestamp: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      }),
    ]);

    // Format Severity Distribution
    const severityMap: Record<string, number> = {
      info: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    severityGroup.forEach((g) => {
      if (g.severity) severityMap[g.severity] = g._count.severity;
    });
    const severityDistribution = Object.entries(severityMap).map(([name, value]) => ({
      name,
      value
    }));

    // Format Status Distribution
    const statusMap: Record<string, number> = {
      new: 0,
      investigating: 0,
      resolved: 0,
      false_positive: 0
    };
    statusGroup.forEach((g) => {
      if (g.status) statusMap[g.status] = g._count.status;
    });
    const statusDistribution = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value
    }));

    // Format Category Distribution
    const categoryMap: Record<string, number> = {
      malware: 0,
      phishing: 0,
      unauthorized_access: 0,
      data_exfiltration: 0,
      policy_violation: 0,
      suspicious_login: 0
    };
    categoryGroup.forEach((g) => {
      if (g.category) categoryMap[g.category] = g._count.category;
    });
    const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));

    // Format Alerts over Time
    const countsByDay: Record<string, number> = {};
    alertsTime.forEach((a) => {
      if (a.timestamp) {
        const isoStr = a.timestamp.toISOString();
        if (isoStr) {
          const dateStr = isoStr.split('T')[0];
          if (dateStr) {
            countsByDay[dateStr] = (countsByDay[dateStr] ?? 0) + 1;
          }
        }
      }
    });
    
    const alertsOverTime = Object.entries(countsByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalAlerts,
      criticalAlerts,
      investigatingAlerts,
      falsePositives,
      severityDistribution,
      statusDistribution,
      categoryDistribution,
      alertsOverTime,
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching dashboard statistics' },
      { status: 500 }
    );
  }
}
