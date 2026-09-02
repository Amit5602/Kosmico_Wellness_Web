import { formatINR } from '../../utils/currency';
import { useAdminAnalytics } from '../../hooks/useAdmin';
import { Users, Package, ShoppingBag, DollarSign, Star } from 'lucide-react';

export function AdminDashboard() {
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading) return <div className="py-12 text-center">Loading dashboard...</div>;
  if (!analytics) return <div className="py-12 text-center text-error">Failed to load analytics</div>;

  const stats = [
    { name: 'Total Revenue', value: formatINR(analytics.totalRevenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Orders', value: analytics.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Products', value: analytics.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Total Reviews', value: analytics.totalReviews, icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold font-serif text-primary">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-text-main mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-text-muted">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Order Status Distribution</h2>
          <div className="space-y-4">
            {Object.entries(analytics.orderStatusDistribution || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-main">{status}</span>
                <span className="text-sm font-bold bg-neutral-100 px-3 py-1 rounded-full">{count as number}</span>
              </div>
            ))}
            {Object.keys(analytics.orderStatusDistribution || {}).length === 0 && (
              <div className="text-text-muted text-sm py-4">No order data available.</div>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Payment Status Distribution</h2>
          <div className="space-y-4">
            {Object.entries(analytics.paymentStatusDistribution || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-main">{status}</span>
                <span className="text-sm font-bold bg-neutral-100 px-3 py-1 rounded-full">{count as number}</span>
              </div>
            ))}
            {Object.keys(analytics.paymentStatusDistribution || {}).length === 0 && (
              <div className="text-text-muted text-sm py-4">No payment data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
