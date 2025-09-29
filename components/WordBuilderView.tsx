

import React from 'react';
import { StarIcon } from './icons';
import { useLocalization } from '../hooks/useLocalization';

const WordBuilderView: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[50vh]">
            <StarIcon className="text-6xl text-yellow-400 mb-4" />
            <h1 className="text-3xl font-bold mb-2">{t('wordBuilder.title')}</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                {t('wordBuilder.comingSoon')}
            </p>
        </div>
    );
};

export default WordBuilderView;