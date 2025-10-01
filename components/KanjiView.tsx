import React, { useState, useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useLocalization } from '../hooks/useLocalization';
import type { QuizQuestion, Kanji } from '../types';
import { QuizType } from '../types';
import { KANJI_DATA, XP_PER_LESSON_COMPLETE } from '../constants';
import QuizModal from './QuizModal';
import Flashcard from './Flashcard';

const KanjiCardBack: React.FC<{ kanji: Kanji }> = ({ kanji }) => {
    const { t } = useLocalization();
    return (
        <div className="text-left w-full h-full p-3 flex flex-col justify-center space-y-2 text-sm">
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{t('flashcard.meaning')}</p>
                <p className="font-medium text-base">{kanji.meaning}</p>
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{t('flashcard.onyomi')}</p>
                <p className="font-medium text-base">{kanji.onyomi}</p>
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{t('flashcard.kunyomi')}</p>
                <p className="font-medium text-base">{kanji.kunyomi || t('flashcard.none')}</p>
            </div>
        </div>
    );
};

const KanjiView: React.FC = () => {
    const { userData, updateMasteryAndAddXp } = useUserData();
    const { t } = useLocalization();
    const [isQuizVisible, setIsQuizVisible] = useState(false);

    const masteryData = userData.kanjiMastery;
    const masteryKey = 'kanjiMastery';

    const quizQuestions = useMemo((): QuizQuestion[] => {
        const questions: QuizQuestion[] = [];
        if (KANJI_DATA.length < 4) return [];

        // Kanji to Meaning questions
        KANJI_DATA.forEach(kanji => {
            const options = [kanji.meaning];
            while (options.length < 4) {
                const randomKanji = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
                if (!options.includes(randomKanji.meaning)) {
                    options.push(randomKanji.meaning);
                }
            }
            questions.push({
                id: `${kanji.kanji}-meaning`,
                type: QuizType.KanjiToMeaning,
                question: kanji.kanji,
                options: options.sort(() => Math.random() - 0.5),
                correctAnswer: kanji.meaning,
            });
        });

        // Kanji to Reading questions
        KANJI_DATA.forEach(kanji => {
            const onyomiReadings = kanji.onyomi ? kanji.onyomi.split(/,|、| /).filter(r => r && r !== '-') : [];
            const kunyomiReadings = kanji.kunyomi ? kanji.kunyomi.split(/,|、| /).map(r => r.split('.')[0]).filter(r => r && r !== '-') : [];
            const allReadings = [...onyomiReadings, ...kunyomiReadings];

            if (allReadings.length === 0) return;

            const correctReading = allReadings[Math.floor(Math.random() * allReadings.length)];
            const isOnyomi = onyomiReadings.includes(correctReading);
            
            const options = [correctReading];
            while (options.length < 4) {
                const randomKanji = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
                const randomOnyomi = randomKanji.onyomi ? randomKanji.onyomi.split(/,|、| /).filter(r => r && r !== '-') : [];
                const randomKunyomi = randomKanji.kunyomi ? randomKanji.kunyomi.split(/,|、| /).map(r => r.split('.')[0]).filter(r => r && r !== '-') : [];
                const allRandomReadings = [...randomOnyomi, ...randomKunyomi];
                if (allRandomReadings.length > 0) {
                    const randomReading = allRandomReadings[Math.floor(Math.random() * allRandomReadings.length)];
                    if (randomReading && !options.includes(randomReading)) {
                        options.push(randomReading);
                    }
                }
            }

            questions.push({
                id: `${kanji.kanji}-reading-${correctReading}`,
                type: QuizType.KanjiToReading,
                question: kanji.kanji,
                options: options.sort(() => Math.random() - 0.5),
                correctAnswer: correctReading,
                reading: isOnyomi ? "On'yomi" : "Kun'yomi"
            });
        });

        return questions.sort(() => Math.random() - 0.5).slice(0, 20);
    }, []);

    const handleQuizComplete = (correctAnswers: string[]) => {
        setIsQuizVisible(false);
        
        const updates = quizQuestions.map(q => {
            const isCorrect = correctAnswers.includes(q.id);
            return { key: q.question, correct: isCorrect };
        });

        const xpGained = correctAnswers.length > (quizQuestions.length - correctAnswers.length) ? XP_PER_LESSON_COMPLETE : 0;
        
        updateMasteryAndAddXp(masteryKey, updates, xpGained);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">{t('kanjiView.title')}</h1>
                <button
                    onClick={() => setIsQuizVisible(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                    disabled={quizQuestions.length === 0}
                >
                    {t('kanjiView.startQuiz')}
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {KANJI_DATA.map(kanjiData => {
                    const mastery = masteryData[kanjiData.kanji]?.level || 0;
                    return (
                        <div key={kanjiData.kanji} className="aspect-[3/4]">
                            <Flashcard
                                front={
                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                        <p className="text-6xl sm:text-7xl lg:text-8xl">{kanjiData.kanji}</p>
                                        <div className="absolute bottom-2 w-full px-2">
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                                                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(mastery / 5) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                back={ <KanjiCardBack kanji={kanjiData} /> }
                            />
                        </div>
                    );
                })}
            </div>

            {isQuizVisible && (
                <QuizModal
                    questions={quizQuestions}
                    onComplete={handleQuizComplete}
                    onClose={() => setIsQuizVisible(false)}
                    title={t('kanjiView.quizTitle')}
                />
            )}
        </div>
    );
};

export default KanjiView;