import { useState } from 'react';
import { Check, X, Star, Search } from 'lucide-react';
import { useGetAdminReviewsQuery, useUpdateReviewStatusMutation } from '@/api/apiSlice.js';
import { formatRelativeDate } from '@/utils/formatters.js';
import Badge from '@/components/ui/Badge.jsx';
import Button from '@/components/ui/Button.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { TableSkeleton } from '@/components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

function AdminReviews() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useGetAdminReviewsQuery({
    page, page_size: 15,
    ...(statusFilter ? { status: statusFilter } : {}),
  });
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewStatusMutation();

  const reviews = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 15) : 1;

  const handleUpdate = async (id, status) => {
    try {
      await updateReview({ id, status }).unwrap();
      toast.success(`Review ${status}`);
    } catch {
      toast.error('Failed to update review');
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-serif font-bold text-neutral-800">Review Moderation</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-100 p-4 flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400 bg-white"
        >
          <option value="">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={6} cols={5} /></div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {reviews.map((review) => (
              <div key={review.id} className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                          {review.user?.first_name?.[0] || 'U'}
                        </div>
                        <span className="text-sm font-medium text-neutral-800">
                          {review.user?.first_name} {review.user?.last_name}
                        </span>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}`} />
                        ))}
                      </div>
                      <Badge
                        variant={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'error' : 'warning'}
                      >
                        {review.status || 'pending'}
                      </Badge>
                    </div>

                    {review.product && (
                      <p className="text-xs text-primary-600 mb-1.5">
                        Product: <span className="font-medium">{review.product?.name || review.product}</span>
                      </p>
                    )}

                    {review.title && (
                      <p className="font-semibold text-neutral-800 text-sm mb-1">{review.title}</p>
                    )}
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">{review.body}</p>
                    <p className="text-xs text-neutral-400 mt-2">{formatRelativeDate(review.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => handleUpdate(review.id, 'approved')}
                      disabled={review.status === 'approved' || isUpdating}
                      leftIcon={<Check className="w-4 h-4" />}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleUpdate(review.id, 'rejected')}
                      disabled={review.status === 'rejected' || isUpdating}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-12 text-neutral-400">No reviews found</div>
            )}
          </div>
        )}
        <div className="px-4 py-3 border-t border-neutral-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
