import React, { useState, useMemo, useEffect } from 'react';
import type { QuizQuestion } from '../types';
import { KanaType, QuizType } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA, XP_PER_LESSON_COMPLETE } from '../constants';
import QuizModal from './QuizModal';
import { SpeakerIcon } from './icons';
import { useUserData } from '../hooks/useUserData';
import { useLocalization } from '../hooks/useLocalization';

interface KanaViewProps {
    kanaType: KanaType;
}

const KanaView: React.FC<KanaViewProps> = ({ kanaType }) => {
    const [isQuizVisible, setIsQuizVisible] = useState(false);
    const [playingChar, setPlayingChar] = useState<string | null>(null);
    const [japaneseVoice, setJapaneseVoice] = useState<SpeechSynthesisVoice | null>(null);
    const { userData, updateMastery, addXp } = useUserData();
    const { t } = useLocalization();
    
    const kanaData = kanaType === KanaType.Hiragana ? HIRAGANA_DATA : KATAKANA_DATA;
    const masteryKey = kanaType === KanaType.Hiragana ? 'hiraganaMastery' : 'katakanaMastery';
    
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            const jaVoice = voices.find(voice => voice.lang === 'ja-JP');
            if (jaVoice) {
                setJapaneseVoice(jaVoice);
            } else {
                 const jaVoiceAlt = voices.find(voice => voice.lang.startsWith('ja'));
                 setJapaneseVoice(jaVoiceAlt || null);
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const playAudio = (character: string) => {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported in this browser.');
            return;
        }
        
        if (!japaneseVoice) {
            console.warn('Japanese voice for text-to-speech not found or not loaded yet.');
            return;
        }

        try {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(character);
            utterance.voice = japaneseVoice;
            utterance.lang = japaneseVoice.lang;
            utterance.rate = 0.8;
            
            setPlayingChar(character);

            utterance.onend = () => setPlayingChar(null);
            
            utterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror:', event);
                setPlayingChar(null);
            };
            
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error playing audio:', error);
            setPlayingChar(null);
        }
    };
    
    const quizQuestions = useMemo((): QuizQuestion[] => {
        const questions: QuizQuestion[] = [];
        if (kanaData.length < 4) return [];

        const shuffledKana = [...kanaData].sort(() => 0.5 - Math.random());
        for (let i = 0; i < Math.min(10, shuffledKana.length); i++) {
            const char = shuffledKana[i];
            const options = [char.romaji];
            while (options.length < 4) {
                const randomChar = kanaData[Math.floor(Math.random() * kanaData.length)];
                if (!options.includes(randomChar.romaji)) {
                    options.push(randomChar.romaji);
                }
            }
            questions.push({
                id: `${char.kana}-to-romaji`,
                type: QuizType.KanaToRomaji,
                question: char.kana,
                options: options.sort(() => 0.5 - Math.random()),
                correctAnswer: char.romaji,
            });
        }
        
        for (let i = 0; i < Math.min(10, shuffledKana.length); i++) {
            const char = shuffledKana[i];
            const options = [char.kana];
            while (options.length < 4) {
                const randomChar = kanaData[Math.floor(Math.random() * kanaData.length)];
                if (!options.includes(randomChar.kana)) {
                    options.push(randomChar.kana);
                }
            }
            questions.push({
                id: `${char.romaji}-to-kana`,
                type: QuizType.RomajiToKana,
                question: char.romaji,
                options: options.sort(() => 0.5 - Math.random()),
                correctAnswer: char.kana,
            });
        }
        
        return questions.sort(() => 0.5 - Math.random());
    }, [kanaData]);
    
    const handleQuizComplete = (correctAnswers: string[]) => {
        setIsQuizVisible(false);
        const answeredQuestions = new Set<string>();

        quizQuestions.forEach(q => {
            const isCorrect = correctAnswers.includes(q.id);
            const character = q.type === QuizType.KanaToRomaji ? q.question : q.correctAnswer;
            
            if (!answeredQuestions.has(character)) {
                 updateMastery(masteryKey, character, isCorrect);
                 answeredQuestions.add(character);
            }
        });

        if (correctAnswers.length > (quizQuestions.length - correctAnswers.length)) {
            addXp(XP_PER_LESSON_COMPLETE);
        }
    };
    
    const getMasteryLevel = (character: string): number => {
        return userData[masteryKey]?.[character]?.level || 0;
    };

    const getMasteryColor = (level: number): string => {
        if (level === 0) return 'bg-transparent';
        if (level <= 2) return 'bg-red-500';
        if (level <= 4) return 'bg-yellow-500';
        if (level <= 6) return 'bg-green-400';
        return 'bg-indigo-500';
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
                    {kanaType === 'hiragana' ? t('dashboard.module.learnHiragana.title') : t('dashboard.module.learnKatakana.title')}
                </h1>
                <button
                    onClick={() => setIsQuizVisible(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                    disabled={quizQuestions.length === 0}
                >
                    {t('kanaView.startQuiz')}
                </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-3 md:gap-4">
                {kanaData.map((character) => {
                    const masteryLevel = getMasteryLevel(character.kana);
                    const masteryColor = getMasteryColor(masteryLevel);
                    const isPlaying = playingChar === character.kana;

                    return (
                        <div
                            key={character.kana}
                            onClick={() => playAudio(character.kana)}
                            onTouchStart={(e) => { e.preventDefault(); playAudio(character.kana); }}
                            className={`relative bg-white dark:bg-slate-800 rounded-lg shadow p-2 text-center cursor-pointer transition-all duration-200 aspect-square flex flex-col justify-evenly items-center ${isPlaying ? 'ring-2 ring-indigo-500 scale-110 z-10' : 'hover:scale-105'}`}
                        >
                            <div className="absolute top-1.5 right-1.5 text-slate-400 dark:text-slate-500">
                                <SpeakerIcon className="w-3.5 h-3.5" />
                            </div>
                            
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
                                    {character.kana}
                                </div>
                                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {character.romaji}
                                </div>
                            </div>
                            
                            <div className="w-full">
                                <div className="h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${masteryColor} transition-all duration-300`}
                                        style={{ width: `${(masteryLevel / 8) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {isQuizVisible && (
                <QuizModal
                    questions={quizQuestions}
                    onComplete={handleQuizComplete}
                    onClose={() => setIsQuizVisible(false)}
                    title={t('kanaView.quizTitle', { kanaType: kanaType.charAt(0).toUpperCase() + kanaType.slice(1) })}
                />
            )}
        </div>
    );
};

export default KanaView;