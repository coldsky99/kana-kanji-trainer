
import React from 'react';
import { StarIcon } from './icons';

const WordBuilderView: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[50vh]">
            <StarIcon className="text-6xl text-yellow-400 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Word Builder</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                This feature is coming soon! You'll be able to construct words using the Hiragana, Katakana, and Kanji you've learned.
            </p>
        </div>
    );
};

export default WordBuilderView;
