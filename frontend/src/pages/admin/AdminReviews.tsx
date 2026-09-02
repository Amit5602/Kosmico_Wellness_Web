import { useState } from 'react';
import { useAdminReviews, useAdminUpdateReviewStatus } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/Button';
import { Star } from 'lucide-react';

export function AdminReviews() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading } = useAdminReviews(page, 20, statusFilter);
  const updateStatusMutation = useAdminUpdateReviewStatus();

  const handleApprove = (id: string, current: boolean) => {
    updateStatusMutation.mutate({ id, isApproved: !current });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif text-primary">Manage Reviews</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <select 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-main">Product</th>
                <th className="px-6 py-4 font-medium text-text-main">Review</th>
                <th className="px-6 py-4 font-medium text-text-main">User</th>
                <th className="px-6 py-4 font-medium text-text-main">Status</th>
                <th className="px-6 py-4 font-medium text-text-main text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">Loading...</td></tr>
              ) : data?.reviews?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No reviews found.</td></tr>
              ) : (
                data?.reviews?.map((review: any) => (
                  <tr key={review._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium max-w-[150px] truncate">
                      {review.product?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex mb-1">{renderStars(review.rating)}</div>
                      <div className="font-bold text-xs truncate mb-1">{review.title}</div>
                      <div className="text-xs text-text-muted truncate">{review.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-main">{review.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-text-muted">{review.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${review.isApproved ? 'text-green-600' : 'text-amber-600'}`}>
                        {review.isApproved ? 'APPROVED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        className={`py-1 px-3 text-xs ${review.isApproved ? 'text-amber-600 border-amber-600' : 'text-green-600 border-green-600'}`}
                        onClick={() => handleApprove(review._id, review.isApproved)}
                      >
                        {review.isApproved ? 'Reject' : 'Approve'}
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
