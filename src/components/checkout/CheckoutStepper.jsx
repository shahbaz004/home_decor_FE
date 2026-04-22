import { Check } from 'lucide-react';
import { cn } from '@/utils/cn.js';

const STEPS = [
  { id: 1, label: 'Address', description: 'Delivery address' },
  { id: 2, label: 'Shipping', description: 'Shipping method' },
  { id: 3, label: 'Payment', description: 'Payment details' },
  { id: 4, label: 'Review', description: 'Order review' },
];

function CheckoutStepper({ currentStep }) {
  return (
    <div className="relative">
      {/* Connector Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
        <div
          className="h-full bg-primary-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 bg-white',
                  isCompleted
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : isActive
                    ? 'border-primary-500 text-primary-600 ring-4 ring-primary-100'
                    : 'border-neutral-200 text-neutral-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p className={cn('text-xs font-semibold', isActive ? 'text-primary-600' : isCompleted ? 'text-primary-500' : 'text-neutral-400')}>
                  {step.label}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Label */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-semibold text-neutral-800">
          Step {currentStep}: {STEPS[currentStep - 1]?.label}
        </p>
        <p className="text-xs text-neutral-500">{STEPS[currentStep - 1]?.description}</p>
      </div>
    </div>
  );
}

export default CheckoutStepper;
