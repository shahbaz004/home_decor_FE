import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { useGetAdminCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '@/api/apiSlice.js';
import { formatDate, formatPrice } from '@/utils/formatters.js';
import { couponSchema } from '@/utils/validators.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Modal from '@/components/ui/Modal.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { TableSkeleton } from '@/components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

function CouponForm({ coupon, onSuccess, onClose }) {
  const isEdit = !!coupon;
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: coupon || { discount_type: 'percentage', is_active: true },
  });

  const discountType = watch('discount_type');

  const onSubmit = async (data) => {
    const payload = { ...data, discount_value: Number(data.discount_value), min_order_value: data.min_order_value ? Number(data.min_order_value) : undefined };
    try {
      if (isEdit) {
        await updateCoupon({ id: coupon.id, ...payload }).unwrap();
        toast.success('Coupon updated!');
      } else {
        await createCoupon(payload).unwrap();
        toast.success('Coupon created!');
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to save coupon');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Coupon Code" required placeholder="SUMMER20" error={errors.code?.message} className="uppercase" {...register('code')} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-neutral-700 block mb-1">Discount Type</label>
          <select {...register('discount_type')} className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
        <Input
          label={discountType === 'percentage' ? 'Discount %' : 'Discount Amount (₹)'}
          type="number"
          required
          error={errors.discount_value?.message}
          {...register('discount_value')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Min Order Value (₹)" type="number" placeholder="0" {...register('min_order_value')} />
        <Input label="Max Uses" type="number" placeholder="Unlimited" {...register('max_uses')} />
      </div>
      <Input label="Expiry Date" type="date" {...register('expiry_date')} />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('is_active')} className="rounded" />
        <span className="text-sm">Active</span>
      </label>
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isCreating || isUpdating}>
          {isEdit ? 'Update Coupon' : 'Create Coupon'}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function AdminCoupons() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { data, isLoading, refetch } = useGetAdminCouponsQuery({ page, page_size: 15 });
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 15) : 1;

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteCoupon(id).unwrap();
      toast.success('Coupon deleted');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-neutral-800">Coupons</h1>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => { setEditingCoupon(null); setShowModal(true); }}>
          Add Coupon
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={6} cols={6} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['Code', 'Discount', 'Min Order', 'Uses', 'Expiry', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary-500" />
                        <span className="font-mono font-bold text-neutral-800">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-800">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : formatPrice(coupon.discount_value)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {coupon.min_order_value ? formatPrice(coupon.min_order_value) : '—'}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {coupon.used_count || 0} / {coupon.max_uses || '∞'}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">
                      {coupon.expiry_date ? formatDate(coupon.expiry_date) : 'No expiry'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={coupon.is_active ? 'success' : 'default'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="xs" variant="ghost" onClick={() => { setEditingCoupon(coupon); setShowModal(true); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="xs" variant="ghost" className="text-red-500" onClick={() => handleDelete(coupon.id, coupon.code)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-400">No coupons found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-neutral-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <Modal open={showModal} onOpenChange={setShowModal} title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}>
        <CouponForm coupon={editingCoupon} onSuccess={refetch} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}

export default AdminCoupons;
