import React, { useState, useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';
import type { QuizQuestion } from '../types';
import { QuizType } from '../types';
import { KANJI_DATA, XP_PER_LESSON_COMPLETE } from '../constants';
import QuizModal from './QuizModal';

const KanjiView: React.FC = () => {
    const { userData, updateMastery, addXp } = useUserData();
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
            const primaryReading = kanji.reading.split('/')[0].trim();
            const options = [primaryReading];
            while (options.length < 4) {
                const randomKanji = KANJI_DATA[Math.floor(Math.random() * KANJI_DATA.length)];
                const randomReading = randomKanji.reading.split('/')[0].trim();
                if (!options.includes(randomReading)) {
                    options.push(randomReading);
                }
            }
            questions.push({
                id: `${kanji.kanji}-reading`,
                type: QuizType.KanjiToReading,
                question: kanji.kanji,
                options: options.sort(() => Math.random() - 0.5),
                correctAnswer: primaryReading,
            });
        });

        return questions.sort(() => Math.random() - 0.5).slice(0, 10);
    }, []);

    const handleQuizComplete = (correctAnswers: string[]) => {
        setIsQuizVisible(false);
        const answeredQuestions = new Set<string>();

        correctAnswers.forEach(id => {
            const question = quizQuestions.find(q => q.id === id);
            if (question && !answeredQuestions.has(question.question)) {
                updateMastery(masteryKey, question.question, true);
                answeredQuestions.add(question.question);
            }
        });

        const incorrectQuestions = quizQuestions.filter(q => !correctAnswers.includes(q.id));
        incorrectQuestions.forEach(question => {
             if (!answeredQuestions.has(question.question)) {
                updateMastery(masteryKey, question.question, false);
                answeredQuestions.add(question.question);
            }
        });

        if (correctAnswers.length > incorrectQuestions.length) {
            addXp(XP_PER_LESSON_COMPLETE);
        }
    };
    
    const getMasteryColor = (level: number) => {
        const colors = [
            'bg-slate-200 dark:bg-slate-700', 'bg-red-200 dark:bg-red-800',
            'bg-orange-200 dark:bg-orange-800', 'bg-yellow-200 dark:bg-yellow-800',
            'bg-lime-200 dark:bg-lime-800', 'bg-green-200 dark:bg-green-800',
        ];
        return colors[Math.min(level, colors.length - 1)];
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Kanji</h1>
                <button
                    onClick={() => setIsQuizVisible(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    disabled={quizQuestions.length === 0}
                >
                    Start Quiz
                </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-4">
                {KANJI_DATA.map(kanji => {
                    const mastery = masteryData[kanji.kanji]?.level || 0;
                    return (
                        <div key={kanji.kanji} className={`rounded-lg p-2 flex flex-col items-center justify-center aspect-square transition-all duration-300 ${getMasteryColor(mastery)}`}>
                            <div className="text-4xl font-serif">{kanji.kanji}</div>
                            <div className="text-xs text-center text-slate-600 dark:text-slate-300">{kanji.meaning}</div>
                        </div>
                    );
                })}
            </div>

            {isQuizVisible && (
                <QuizModal
                    questions={quizQuestions}
                    onComplete={handleQuizComplete}
                    onClose={() => setIsQuizVisible(false)}
                    title="Kanji Quiz"
                />
            )}
        </div>
    );
};

export default KanjiView;
