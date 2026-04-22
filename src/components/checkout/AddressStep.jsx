import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, MapPin, Check } from 'lucide-react';
import { useGetAddressesQuery, useCreateAddressMutation } from '@/api/apiSlice.js';
import { addressSchema } from '@/utils/validators.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import { ListSkeleton } from '@/components/ui/Skeleton.jsx';
import { cn } from '@/utils/cn.js';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry',
];

function NewAddressForm({ onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  });
  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const onSubmit = async (data) => {
    try {
      const result = await createAddress(data).unwrap();
      toast.success('Address saved!');
      onSuccess?.(result);
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to save address');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
      <h3 className="font-semibold text-neutral-800 mb-4">Add New Address</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" required error={errors.full_name?.message} {...register('full_name')} />
        <Input label="Phone Number" type="tel" required error={errors.phone?.message} {...register('phone')} />
        <Input label="Street Address" required error={errors.address_line1?.message} {...register('address_line1')} containerClassName="sm:col-span-2" />
        <Input label="Apartment / Suite (Optional)" error={errors.address_line2?.message} {...register('address_line2')} containerClassName="sm:col-span-2" />
        <Input label="City" required error={errors.city?.message} {...register('city')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">State <span className="text-red-500">*</span></label>
          <select {...register('state')} className="rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 bg-white">
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
        </div>
        <Input label="PIN Code" required error={errors.postal_code?.message} {...register('postal_code')} />
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="is_default" {...register('is_default')} className="rounded" />
          <label htmlFor="is_default" className="text-sm text-neutral-600">Set as default address</label>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <Button type="submit" isLoading={isLoading}>Save Address</Button>
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

function AddressStep({ selectedAddress, onSelect, onNext }) {
  const [showForm, setShowForm] = useState(false);
  const { data: addressesData, isLoading } = useGetAddressesQuery();
  const addresses = addressesData?.results || addressesData || [];

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-neutral-800 mb-5">Select Delivery Address</h2>

      {isLoading ? (
        <ListSkeleton count={2} />
      ) : (
        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => onSelect(addr)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                selectedAddress?.id === addr.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className={cn('w-5 h-5 mt-0.5 flex-shrink-0', selectedAddress?.id === addr.id ? 'text-primary-600' : 'text-neutral-400')} />
                  <div>
                    <p className="font-semibold text-neutral-800">{addr.full_name}</p>
                    <p className="text-sm text-neutral-600 mt-0.5">
                      {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">+91 {addr.phone}</p>
                    {addr.is_default && (
                      <span className="inline-block mt-1.5 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                {selectedAddress?.id === addr.id && (
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showForm ? (
        <NewAddressForm
          onSuccess={(addr) => { setShowForm(false); onSelect(addr); }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-neutral-300 rounded-xl p-4 flex items-center justify-center gap-2 text-neutral-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Address
        </button>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedAddress}
          size="lg"
          rightIcon={<span>→</span>}
        >
          Continue to Shipping
        </Button>
      </div>
    </div>
  );
}

export default AddressStep;
