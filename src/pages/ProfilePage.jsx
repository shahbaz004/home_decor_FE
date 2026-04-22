import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Package, MapPin, Heart, Key, Edit2, Plus, Trash2, Check, Star } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { selectCurrentUser } from '@/store/slices/authSlice.js';
import { setUser } from '@/store/slices/authSlice.js';
import {
  useGetProfileQuery, useUpdateProfileMutation, useGetOrdersQuery,
  useGetAddressesQuery, useDeleteAddressMutation, useGetWishlistQuery,
} from '@/api/apiSlice.js';
import { formatPrice, formatDate, formatOrderStatus } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import { StatusBadge } from '@/components/ui/Badge.jsx';
import { ListSkeleton } from '@/components/ui/Skeleton.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { Link } from 'react-router-dom';

function ProfileInfo() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [editing, setEditing] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await updateProfile(data).unwrap();
      dispatch(setUser(result));
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-5 mb-8 p-6 bg-primary-50 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-2xl font-bold flex-shrink-0">
          {user?.first_name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="font-bold text-neutral-800 text-xl">{user?.first_name} {user?.last_name}</h3>
          <p className="text-neutral-500 text-sm">{user?.email}</p>
          <p className="text-xs text-primary-600 font-medium mt-1 capitalize">{user?.role || 'Customer'}</p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" error={errors.first_name?.message} {...register('first_name')} />
            <Input label="Last Name" error={errors.last_name?.message} {...register('last_name')} />
          </div>
          <Input label="Phone" type="tel" {...register('phone')} />
          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>Save Changes</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {[
            { label: 'First Name', value: user?.first_name },
            { label: 'Last Name', value: user?.last_name },
            { label: 'Email', value: user?.email },
            { label: 'Phone', value: user?.phone || 'Not set' },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-4 py-3 border-b border-neutral-100 last:border-0 text-sm">
              <span className="text-neutral-500 w-28 flex-shrink-0">{label}</span>
              <span className="text-neutral-800 font-medium">{value || '—'}</span>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            leftIcon={<Edit2 className="w-4 h-4" />}
            className="mt-4"
          >
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}

function OrdersList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOrdersQuery({ page, page_size: 8 });
  const orders = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 8) : 1;

  if (isLoading) return <ListSkeleton count={5} />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="font-semibold text-neutral-700 mb-2">No orders yet</h3>
        <p className="text-neutral-400 text-sm mb-5">Start shopping to see your orders here.</p>
        <Link to="/products"><Button size="sm">Shop Now</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/profile/orders/${order.id}`}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 hover:border-primary-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-800 text-sm">#{order.order_number || order.id}</p>
              <p className="text-xs text-neutral-500">{formatDate(order.created_at)} · {order.items?.length || 0} items</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-neutral-800">{formatPrice(order.total_amount)}</p>
              <StatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
    </div>
  );
}

function AddressesList() {
  const { data, isLoading } = useGetAddressesQuery();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const addresses = data?.results || data || [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteAddress(id).unwrap();
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  if (isLoading) return <ListSkeleton count={2} />;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white border border-neutral-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span className="font-semibold text-neutral-800 text-sm">{addr.full_name}</span>
              </div>
              {addr.is_default && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Default</span>
              )}
            </div>
            <p className="text-sm text-neutral-600">{addr.address_line1}</p>
            <p className="text-sm text-neutral-600">{addr.city}, {addr.state} {addr.postal_code}</p>
            <p className="text-sm text-neutral-500 mt-1">+91 {addr.phone}</p>
            <div className="flex gap-2 mt-3">
              <Button size="xs" variant="ghost" onClick={() => handleDelete(addr.id)} isLoading={isDeleting} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/checkout">
        <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Add New Address
        </Button>
      </Link>
    </div>
  );
}

function ProfilePage({ tab }) {
  const defaultTab = tab || 'profile';

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-8">My Account</h1>

        <Tabs.Root defaultValue={defaultTab}>
          <Tabs.List className="flex flex-wrap gap-1 bg-white rounded-2xl p-1.5 border border-neutral-100 mb-8 shadow-sm">
            {[
              { value: 'profile', label: 'Profile', icon: User },
              { value: 'orders', label: 'Orders', icon: Package },
              { value: 'addresses', label: 'Addresses', icon: MapPin },
              { value: 'wishlist', label: 'Wishlist', icon: Heart },
            ].map(({ value, label, icon: Icon }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=inactive]:text-neutral-600 data-[state=inactive]:hover:bg-neutral-100"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
            <Tabs.Content value="profile"><ProfileInfo /></Tabs.Content>
            <Tabs.Content value="orders"><OrdersList /></Tabs.Content>
            <Tabs.Content value="addresses"><AddressesList /></Tabs.Content>
            <Tabs.Content value="wishlist">
              <Link to="/wishlist">
                <Button variant="outline" leftIcon={<Heart className="w-4 h-4" />}>View Full Wishlist</Button>
              </Link>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}

export default ProfilePage;
