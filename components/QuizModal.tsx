import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizType } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface QuizModalProps {
    questions: QuizQuestion[];
    onComplete: (correctAnswers: string[]) => void;
    onClose: () => void;
    title: string;
}

const QuizModal: React.FC<QuizModalProps> = ({ questions, onComplete, onClose, title }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
    const { t } = useLocalization();

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer

        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setCorrectAnswers(prev => [...prev, currentQuestion.id]);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };
    
    const handleFinish = () => {
        onComplete(correctAnswers);
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (currentQuestion && !showResults && !selectedAnswer) {
                 if (event.key >= '1' && event.key <= '4') {
                    const index = parseInt(event.key) - 1;
                    if (index < currentQuestion.options.length) {
                        handleAnswerSelect(currentQuestion.options[index]);
                    }
                }
            } else if (selectedAnswer && event.key === 'Enter') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentQuestion, selectedAnswer, showResults]);

    if (showResults) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('quiz.complete.title')}</h2>
                    <p className="text-lg mb-6">{t('quiz.complete.score', { correct: correctAnswers.length, total: questions.length })}</p>
                    <button
                        onClick={handleFinish}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full"
                    >
                        {t('quiz.complete.finish')}
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
             <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('quiz.noQuestions')}</h2>
                     <button
                        onClick={onClose}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full"
                    >
                        {t('quiz.close')}
                    </button>
                </div>
            </div>
        );
    }

    const getQuestionDisplay = () => {
        switch(currentQuestion.type) {
            case QuizType.KanjiToMeaning:
                 return <div className="text-center"><div className="text-6xl md:text-8xl font-bold mb-2">{currentQuestion.question}</div><p className="text-slate-500">{t('quiz.prompt.chooseMeaning')}</p></div>;
            case QuizType.KanjiToReading:
                return <div className="text-center"><div className="text-6xl md:text-8xl font-bold mb-2">{currentQuestion.question}</div><p className="text-slate-500">{t('quiz.prompt.chooseReading', { reading: currentQuestion.reading || 'reading' })}</p></div>;
            case QuizType.KanaToRomaji:
                return <div className="text-center"><div className="text-6xl md:text-8xl font-bold mb-2">{currentQuestion.question}</div><p className="text-slate-500">{t('quiz.prompt.chooseRomaji')}</p></div>;
            case QuizType.RomajiToKana:
                return (
                    <div className="text-center">
                        <div className="text-4xl md:text-6xl font-bold mb-2">{currentQuestion.question}</div>
                        <p className="text-slate-500">{t('quiz.prompt.chooseKana')}</p>
                    </div>
                );
            default:
                 return <div className="text-6xl md:text-8xl font-bold mb-6">{currentQuestion.question}</div>
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-2xl leading-none">&times;</button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-sm font-semibold text-slate-500">{currentQuestionIndex + 1} / {questions.length}</p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-8 flex items-center justify-center min-h-[150px] mb-6">
                    {getQuestionDisplay()}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer = option === currentQuestion.correctAnswer;
                        let buttonClass = 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600';
                        if (selectedAnswer) {
                            if (isSelected && !isCorrect) {
                                buttonClass = 'bg-red-500 text-white';
                            } else if (isCorrectAnswer) {
                                buttonClass = 'bg-green-500 text-white';
                            } else {
                                buttonClass = 'bg-slate-100 dark:bg-slate-700 opacity-50 cursor-not-allowed';
                            }
                        }
                        
                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={!!selectedAnswer}
                                className={`p-4 rounded-lg text-lg font-semibold transition-colors duration-200 text-center ${buttonClass}`}
                            >
                                {option} <span className="text-xs text-slate-400">({index+1})</span>
                            </button>
                        );
                    })}
                </div>

                {selectedAnswer && (
                     <button
                        onClick={handleNext}
                        className="bg-indigo-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        {currentQuestionIndex < questions.length - 1 ? t('quiz.next') : t('quiz.seeResults')} (Enter)
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizModal;