import { Check, Loader2 } from 'lucide-react';
import type { ApplicationStep } from '@/types';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: ApplicationStep[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isPending = step.status === 'pending';

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative flex-1">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && 'bg-primary-950 text-white ring-4 ring-primary-100 animate-pulse-soft',
                  isPending && 'bg-neutral-200 text-neutral-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center',
                  isCompleted && 'text-green-600',
                  isCurrent && 'text-primary-950',
                  isPending && 'text-neutral-400'
                )}
              >
                {step.name}
              </span>
              {step.completedAt && (
                <span className="text-[10px] text-neutral-400 mt-0.5">
                  {step.completedAt}
                </span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 -mt-6',
                  isCompleted ? 'bg-green-500' : 'bg-neutral-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
