
import React from 'react';
import { BookOpenIcon } from './icons';

const SentenceView: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[50vh]">
            <BookOpenIcon className="text-6xl text-blue-400 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Sentence Practice</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                Coming soon! Practice reading and understanding Japanese sentences, from simple to complex, to build your comprehension skills.
            </p>
        </div>
    );
};

export default SentenceView;
