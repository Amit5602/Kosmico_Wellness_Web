import { formatINR } from '../utils/currency';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useOrders } from '../hooks/useOrders';

export const Orders = () => {
  const { data, isLoading, isError } = useOrders({ page: 1, limit: 20 });

  if (isLoading) return <div className="py-32 text-center">Loading your orders...</div>;
  if (isError) return <div className="py-32 text-center text-error">Failed to load orders.</div>;

  const orders = data?.orders || [];

  return (
    <div className="bg-background min-h-screen py-12">
      <Container>
        <h1 className="font-serif text-4xl font-bold text-primary mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <h2 className="text-2xl font-serif text-primary mb-4">You have no orders yet</h2>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-neutral-50/50 border-b border-border text-sm font-medium text-text-muted uppercase tracking-wider">
              <div className="col-span-3">Order Number</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            
            <ul className="divide-y divide-border">
              {orders.map((order: any) => (
                <li key={order._id} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 w-full font-medium text-text-main">
                    <span className="md:hidden text-text-muted text-sm mr-2">Order:</span>
                    {order.orderNumber}
                  </div>
                  
                  <div className="col-span-3 w-full text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>

                  <div className="col-span-2 w-full">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                      ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                        order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="col-span-2 w-full md:text-right font-medium">
                    <span className="md:hidden text-text-muted text-sm mr-2">Total:</span>
                    {formatINR(order.total)}
                  </div>

                  <div className="col-span-2 w-full md:text-right">
                    <Link to={`/orders/${order.orderNumber}`}>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">View Details</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
};
