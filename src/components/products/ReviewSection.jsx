import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/slices/authSlice.js';
import { useGetProductReviewsQuery, useCreateReviewMutation } from '@/api/apiSlice.js';
import { reviewSchema } from '@/utils/validators.js';
import { formatRelativeDate } from '@/utils/formatters.js';
import StarRating, { RatingBar } from '@/components/ui/StarRating.jsx';
import Button from '@/components/ui/Button.jsx';
import { Textarea } from '@/components/ui/Input.jsx';
import Input from '@/components/ui/Input.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { ListSkeleton } from '@/components/ui/Skeleton.jsx';

function ReviewCard({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-50 rounded-xl p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
            {review.user?.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              {review.user?.first_name} {review.user?.last_name}
            </p>
            <p className="text-xs text-neutral-400">{formatRelativeDate(review.created_at)}</p>
          </div>
        </div>
        <StarRating value={review.rating} readonly size="sm" />
      </div>

      {review.title && (
        <h4 className="font-semibold text-neutral-800 text-sm mb-1">{review.title}</h4>
      )}
      <p className="text-sm text-neutral-600 leading-relaxed">{review.body}</p>

      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((img, i) => (
            <img
              key={i}
              src={typeof img === 'string' ? img : (img.image || img.url)}
              alt={`Review photo ${i + 1}`}
              className="w-14 h-14 rounded-lg object-cover border border-neutral-200"
            />
          ))}
        </div>
      )}

      {review.helpful_count > 0 && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-400">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{review.helpful_count} found this helpful</span>
        </div>
      )}
    </motion.div>
  );
}

function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: '', body: '' },
  });
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    try {
      await createReview({ productId, ...data, rating }).unwrap();
      toast.success('Review submitted successfully!');
      reset();
      setRating(0);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="font-serif font-semibold text-neutral-800 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary-600" />
        Write a Review
      </h3>

      <div className="mb-4">
        <label className="text-sm font-medium text-neutral-700 block mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating === 0 && <p className="text-xs text-neutral-400 mt-1">Click to rate</p>}
      </div>

      <Input
        label="Review Title"
        placeholder="Summarize your experience..."
        error={errors.title?.message}
        {...register('title')}
        containerClassName="mb-4"
      />

      <Textarea
        label="Your Review"
        placeholder="Tell others what you think about this product..."
        rows={4}
        error={errors.body?.message}
        {...register('body')}
        containerClassName="mb-5"
        required
      />

      <Button type="submit" isLoading={isLoading} fullWidth>
        Submit Review
      </Button>
    </form>
  );
}

function ReviewSection({ productId }) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const { data, isLoading } = useGetProductReviewsQuery({ productId, page, page_size: 5 });
  const reviews = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 5) : 1;

  const avgRating = data?.average_rating || 0;
  const ratingBreakdown = data?.rating_breakdown || {};

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-neutral-800">
          Customer Reviews
        </h2>
        {isAuthenticated && (
          <Button
            variant={showForm ? 'ghost' : 'outline'}
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      {data && (
        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-primary-50 rounded-2xl mb-6">
          <div className="text-center sm:text-left flex-shrink-0">
            <div className="text-5xl font-bold text-neutral-800 font-serif">
              {avgRating.toFixed(1)}
            </div>
            <StarRating value={avgRating} readonly size="md" className="justify-center sm:justify-start mt-2" />
            <p className="text-sm text-neutral-500 mt-1">{data.count} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                rating={star}
                count={ratingBreakdown[star] || 0}
                total={data.count}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <ReviewForm productId={productId} onSuccess={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthenticated && (
        <p className="text-sm text-neutral-500 bg-neutral-50 rounded-xl p-4 mb-6">
          <a href="/login" className="text-primary-600 hover:underline">Login</a> to write a review
        </p>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <ListSkeleton count={3} />
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-8"
        />
      )}
    </div>
  );
}

export default ReviewSection;
