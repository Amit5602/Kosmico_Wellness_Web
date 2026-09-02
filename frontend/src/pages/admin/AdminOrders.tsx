import { formatINR } from '../../utils/currency';
import { useState } from 'react';
import { useAdminOrders, useAdminUpdateOrderStatus } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/Button';

export function AdminOrders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading } = useAdminOrders(page, 20, statusFilter, search);
  const updateStatusMutation = useAdminUpdateOrderStatus();

  const handleStatusUpdate = (id: string, currentStatus: string) => {
    const newStatus = prompt('Enter new status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED):', currentStatus);
    if (newStatus && newStatus !== currentStatus) {
      updateStatusMutation.mutate({ id, status: newStatus.toUpperCase() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif text-primary">Manage Orders</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search by Order Number..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-4 py-2 flex-1 max-w-sm"
        />
        <select 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-main">Order #</th>
                <th className="px-6 py-4 font-medium text-text-main">Customer</th>
                <th className="px-6 py-4 font-medium text-text-main">Total</th>
                <th className="px-6 py-4 font-medium text-text-main">Payment</th>
                <th className="px-6 py-4 font-medium text-text-main">Status</th>
                <th className="px-6 py-4 font-medium text-text-main text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">Loading...</td></tr>
              ) : data?.orders?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">No orders found.</td></tr>
              ) : (
                data?.orders?.map((order: any) => (
                  <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div>{order.user?.name || 'Guest'}</div>
                      <div className="text-xs text-text-muted">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4">{formatINR(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold uppercase">{order.orderStatus}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        className="py-1 px-3 text-xs"
                        onClick={() => handleStatusUpdate(order._id, order.orderStatus)}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data?.meta?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="flex items-center px-4 text-sm text-text-muted">Page {page} of {data.meta.pages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))} disabled={page >= data.meta.pages}>Next</Button>
        </div>
      )}
    </div>
  );
}
