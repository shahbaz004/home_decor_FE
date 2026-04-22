import { Check, Truck, Zap, Clock } from 'lucide-react';
import { formatPrice } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';
import { cn } from '@/utils/cn.js';
import { useDispatch } from 'react-redux';
import { setShipping } from '@/store/slices/cartSlice.js';

const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: '5-7 business days',
    price: 99,
    icon: Truck,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: '2-3 business days',
    price: 249,
    icon: Zap,
  },
  {
    id: 'same_day',
    name: 'Same Day Delivery',
    description: 'Order by 12 PM (selected cities)',
    price: 499,
    icon: Clock,
  },
  {
    id: 'free',
    name: 'Free Standard Shipping',
    description: '7-10 business days (orders above ₹2000)',
    price: 0,
    icon: Truck,
    condition: 'Available on orders above ₹2,000',
  },
];

function ShippingStep({ selectedMethod, onSelect, onNext, onBack, cartTotal }) {
  const dispatch = useDispatch();

  const availableMethods = SHIPPING_METHODS.filter(
    (m) => m.id !== 'free' || cartTotal >= 2000
  );

  const handleSelect = (method) => {
    onSelect(method);
    dispatch(setShipping(method.price));
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-neutral-800 mb-5">Choose Shipping Method</h2>

      <div className="space-y-3 mb-6">
        {availableMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod?.id === method.id;

          return (
            <button
              key={method.id}
              onClick={() => handleSelect(method)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  isSelected ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                )}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-800">{method.name}</p>
                    <p className={cn('font-bold', isSelected ? 'text-primary-600' : 'text-neutral-800')}>
                      {method.price === 0 ? 'FREE' : formatPrice(method.price)}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500 mt-0.5">{method.description}</p>
                  {method.condition && (
                    <p className="text-xs text-green-600 mt-0.5">{method.condition}</p>
                  )}
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={!selectedMethod} size="lg">
          Continue to Payment →
        </Button>
      </div>
    </div>
  );
}

export default ShippingStep;
