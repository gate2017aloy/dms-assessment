import { dashboardData } from '../data/dashboard.data.js';

/**
 * Service layer for Dashboard operations.
 * Fetches raw data and transforms it into the response shape.
 */
export const dashboardService = {
  /**
   * Get formatted dashboard statistics.
   */
  async getStats() {
    const raw = await dashboardData.fetchRawStats();

    // Format Severity Distribution
    const severityMap: Record<string, number> = {
      info: 0, low: 0, medium: 0, high: 0, critical: 0,
    };
    raw.severityGroup.forEach((g) => {
      if (g.severity) severityMap[g.severity] = g._count.severity;
    });
    const severityDistribution = Object.entries(severityMap).map(([name, value]) => ({
      name, value,
    }));

    // Format Status Distribution
    const statusMap: Record<string, number> = {
      new: 0, investigating: 0, resolved: 0, false_positive: 0,
    };
    raw.statusGroup.forEach((g) => {
      if (g.status) statusMap[g.status] = g._count.status;
    });
    const statusDistribution = Object.entries(statusMap).map(([name, value]) => ({
      name, value,
    }));

    // Format Category Distribution
    const categoryMap: Record<string, number> = {
      malware: 0, phishing: 0, unauthorized_access: 0,
      data_exfiltration: 0, policy_violation: 0, suspicious_login: 0,
    };
    raw.categoryGroup.forEach((g) => {
      if (g.category) categoryMap[g.category] = g._count.category;
    });
    const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({
      name, value,
    }));

    // Format Alerts over Time
    const countsByDay: Record<string, number> = {};
    raw.alertTimestamps.forEach((a) => {
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

    return {
      totalAlerts: raw.totalAlerts,
      criticalAlerts: raw.criticalAlerts,
      investigatingAlerts: raw.investigatingAlerts,
      falsePositives: raw.falsePositives,
      severityDistribution,
      statusDistribution,
      categoryDistribution,
      alertsOverTime,
    };
  },
};
