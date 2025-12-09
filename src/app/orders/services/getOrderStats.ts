/**
 * Get Order Stats Service
 * Retrieves order statistics for a business or user
 */

import { ValidationError } from '../../../core/errors/index.js';
import { ApiResponse } from '../../../core/interfaces/index.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus, PaymentStatus } from '../interfaces/order.interface.js';

/**
 * Order statistics result
 */
export interface OrderStats {
  /** Total number of orders */
  totalOrders: number;
  /** Orders by status */
  byStatus: Record<string, number>;
  /** Orders by payment status */
  byPaymentStatus: Record<string, number>;
  /** Total revenue (from paid orders) */
  totalRevenue: number;
  /** Average order value */
  averageOrderValue: number;
  /** Total items sold */
  totalItemsSold: number;
}

/**
 * Options for getOrderStats
 */
export interface GetOrderStatsOptions {
  /** Business ID to filter by */
  businessId?: string;
  /** User ID to filter by */
  userId?: string;
  /** Start date for stats period */
  startDate?: Date;
  /** End date for stats period */
  endDate?: Date;
}

/**
 * Get order statistics
 *
 * @param options - Filter options
 * @returns Order statistics
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const stats = await getOrderStats({
 *   businessId: 'uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * console.log(`Total revenue: ${stats.data.totalRevenue}`);
 * ```
 */
export const getOrderStats = async (
  options: GetOrderStatsOptions = {}
): Promise<ApiResponse<OrderStats>> => {
  try {
    const { businessId, userId, startDate, endDate } = options;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (businessId) {
      filter.businessId = businessId;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        (filter.createdAt as Record<string, Date>).$gte = startDate;
      }
      if (endDate) {
        (filter.createdAt as Record<string, Date>).$lte = endDate;
      }
    }

    // Get total orders
    const totalOrders = await OrderModel.countDocuments(filter);

    // Get orders by status
    const statusCounts = await OrderModel.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byStatus: Record<string, number> = {};
    for (const status of Object.values(OrderStatus)) {
      byStatus[status] = 0;
    }
    for (const item of statusCounts) {
      byStatus[item._id] = item.count;
    }

    // Get orders by payment status
    const paymentStatusCounts = await OrderModel.aggregate([
      { $match: filter },
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
    ]);

    const byPaymentStatus: Record<string, number> = {};
    for (const status of Object.values(PaymentStatus)) {
      byPaymentStatus[status] = 0;
    }
    for (const item of paymentStatusCounts) {
      byPaymentStatus[item._id] = item.count;
    }

    // Get revenue stats (only from paid orders)
    const revenueStats = await OrderModel.aggregate([
      {
        $match: {
          ...filter,
          paymentStatus: PaymentStatus.PAID,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: { $size: '$items' } },
        },
      },
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const paidOrdersCount = revenueStats[0]?.totalOrders || 0;
    const totalItemsSold = revenueStats[0]?.totalItemsSold || 0;
    const averageOrderValue = paidOrdersCount > 0 ? totalRevenue / paidOrdersCount : 0;

    const stats: OrderStats = {
      totalOrders,
      byStatus,
      byPaymentStatus,
      totalRevenue,
      averageOrderValue,
      totalItemsSold,
    };

    return {
      success: true,
      data: stats,
      message: 'Order statistics retrieved successfully',
    };
  } catch (error) {
    throw new ValidationError(
      'Error getting Order statistics',
      error instanceof Error ? error.message : String(error)
    );
  }
};
