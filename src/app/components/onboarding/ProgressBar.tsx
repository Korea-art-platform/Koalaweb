import { useTranslation } from 'react-i18next';
import type { OnboardingStep } from '@/app/pages/type'
interface ProgressBarProps {
  currentStep: OnboardingStep;
  onSkip: () => void;
}

const TOTAL_STEPS = 5;
const STEPS_ARRAY: OnboardingStep[] = ['welcome', 'nickname', 'address', 'preferences', 'notifications'];

export default function ProgressBar({ currentStep, onSkip }: ProgressBarProps) {
  const { t } = useTranslation('koala');
  const stepNumber = STEPS_ARRAY.indexOf(currentStep) + 1;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs tracking-wider text-gray-400 font-medium">
          {t('onboarding.stepOf', { current: stepNumber, total: TOTAL_STEPS })}
        </span>
        <button onClick={onSkip} className="text-xs tracking-wider text-gray-400 hover:text-black transition-colors">
          {currentStep === 'nickname' ? t('onboarding.skipLater') : t('onboarding.skip')}
        </button>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-koala-navy transition-all duration-500 ease-out"
          style={{ width: `${(stepNumber / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}
