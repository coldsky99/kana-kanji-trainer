
import React, { useState, useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';
import type { KanaType as KanaEnumType, QuizQuestion } from '../types';
import { KanaType, QuizType } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA, XP_PER_LESSON_COMPLETE } from '../constants';
import QuizModal from './QuizModal';
import { SpeakerIcon } from './icons';

interface KanaViewProps {
    kanaType: KanaEnumType;
}

const KanaView: React.FC<KanaViewProps> = ({ kanaType }) => {
    const { userData, updateMastery, addXp } = useUserData();
    const [isQuizVisible, setIsQuizVisible] = useState(false);

    const kanaData = kanaType === KanaType.Hiragana ? HIRAGANA_DATA : KATAKANA_DATA;
    const masteryData = kanaType === KanaType.Hiragana ? userData.hiraganaMastery : userData.katakanaMastery;
    const masteryKey = kanaType === KanaType.Hiragana ? 'hiraganaMastery' : 'katakanaMastery';

    const quizQuestions = useMemo((): QuizQuestion[] => {
        const questions: QuizQuestion[] = [];
        
        // Kana to Romaji questions
        kanaData.forEach(kana => {
            const options = [kana.romaji];
            while (options.length < 4) {
                const randomKana = kanaData[Math.floor(Math.random() * kanaData.length)];
                if (!options.includes(randomKana.romaji)) {
                    options.push(randomKana.romaji);
                }
            }
            questions.push({
                id: kana.kana,
                type: QuizType.KanaToRomaji,
                question: kana.kana,
                options: options.sort(() => Math.random() - 0.5),
                correctAnswer: kana.romaji,
            });
        });

        // Romaji to Kana questions
         kanaData.forEach(kana => {
            const options = [kana.kana];
            while (options.length < 4) {
                const randomKana = kanaData[Math.floor(Math.random() * kanaData.length)];
                if (!options.includes(randomKana.kana)) {
                    options.push(randomKana.kana);
                }
            }
            questions.push({
                id: kana.romaji,
                type: QuizType.RomajiToKana,
                question: kana.romaji,
                options: options.sort(() => Math.random() - 0.5),
                correctAnswer: kana.kana,
            });
        });

        return questions.sort(() => Math.random() - 0.5);
    }, [kanaData]);
    
    const handleQuizComplete = (correctAnswers: string[]) => {
        setIsQuizVisible(false);
        const incorrectAnswers = quizQuestions
            .filter(q => !correctAnswers.includes(q.id))
            .map(q => q.type === QuizType.KanaToRomaji ? q.question : q.correctAnswer);

        correctAnswers.forEach(id => {
            const question = quizQuestions.find(q => q.id === id);
            const kana = question?.type === QuizType.KanaToRomaji ? question.question : question?.correctAnswer;
            if (kana) updateMastery(masteryKey, kana, true);
        });

        incorrectAnswers.forEach(kana => updateMastery(masteryKey, kana, false));

        if (correctAnswers.length > incorrectAnswers.length) {
            addXp(XP_PER_LESSON_COMPLETE);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold capitalize">{kanaType}</h1>
                <button 
                    onClick={() => setIsQuizVisible(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Start Quiz
                </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 md:gap-4">
                {kanaData.map(kana => {
                    const mastery = masteryData[kana.kana]?.level || 0;
                    const colors = [
                        'bg-slate-200 dark:bg-slate-700',
                        'bg-red-200 dark:bg-red-800',
                        'bg-orange-200 dark:bg-orange-800',
                        'bg-yellow-200 dark:bg-yellow-800',
                        'bg-lime-200 dark:bg-lime-800',
                        'bg-green-200 dark:bg-green-800',
                    ];

                    return (
                        <div key={kana.kana} className={`relative rounded-lg p-2 flex flex-col items-center justify-center aspect-square transition-all duration-300 ${colors[mastery]}`}>
                            <div className="text-4xl">{kana.kana}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">{kana.romaji}</div>
                            <button onClick={() => speak(kana.kana)} className="absolute top-1 right-1 text-slate-500 hover:text-indigo-500 text-xs">
                                <SpeakerIcon />
                            </button>
                        </div>
                    );
                })}
            </div>

            {isQuizVisible && (
                <QuizModal 
                    questions={quizQuestions} 
                    onComplete={handleQuizComplete} 
                    onClose={() => setIsQuizVisible(false)}
                    title={`${kanaType.charAt(0).toUpperCase() + kanaType.slice(1)} Quiz`}
                />
            )}
        </div>
    );
};

export default KanaView;
