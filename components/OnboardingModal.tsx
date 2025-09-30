

import React, { useState } from 'react';
import { useLocalization, type TranslationKey } from '../hooks/useLocalization';
import { StarIcon, LanguageIcon, ChartBarIcon, AcademicCapIcon } from './icons';

interface OnboardingModalProps {
    onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
    const { t } = useLocalization();
    const [step, setStep] = useState(0);

    const steps = [
        {
            titleKey: 'onboarding.step1.title',
            textKey: 'onboarding.step1.text',
            icon: <StarIcon className="text-5xl text-yellow-400" />
        },
        {
            titleKey: 'onboarding.step2.title',
            textKey: 'onboarding.step2.text',
            icon: <LanguageIcon className="text-5xl text-blue-400" />
        },
        {
            titleKey: 'onboarding.step3.title',
            textKey: 'onboarding.step3.text',
            icon: <ChartBarIcon className="text-5xl text-green-400" />
        },
        {
            titleKey: 'onboarding.step4.title',
            textKey: 'onboarding.step4.text',
            icon: <AcademicCapIcon className="text-5xl text-indigo-400" />
        },
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md text-center flex flex-col items-center">
                <div className="mb-6">{currentStep.icon}</div>
                <h2 className="text-2xl font-bold mb-4">{t(currentStep.titleKey as TranslationKey)}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8">{t(currentStep.textKey as TranslationKey)}</p>

                <div className="flex justify-center mb-6">
                    {steps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full mx-1 ${index === step ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full"
                >
                    {step === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
                </button>
            </div>
        </div>
    );
};

export default OnboardingModal;