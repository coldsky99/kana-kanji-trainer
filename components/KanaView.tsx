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

        // The voices list is loaded asynchronously.
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
            // Cancel any ongoing speech to prevent overlap
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(character);
            utterance.voice = japaneseVoice;
            utterance.lang = japaneseVoice.lang;
            utterance.rate = 0.8;
            
            setPlayingChar(character);

            utterance.onend = () => {
                setPlayingChar(null);
            };
            
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

        // Generate 10 Kana-to-Romaji questions
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
        
        // Generate 10 Romaji-to-Kana questions
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
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                    {kanaType === 'hiragana' ? t('dashboard.module.learnHiragana.title') : t('dashboard.module.learnKatakana.title')}
                </h1>
                <button
                    onClick={() => setIsQuizVisible(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    disabled={quizQuestions.length === 0}
                >
                    {t('kanaView.startQuiz')}
                </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {kanaData.map((character) => {
                    const masteryLevel = getMasteryLevel(character.kana);
                    const isPlaying = playingChar === character.kana;

                    return (
                        <div
                            key={character.kana}
                            onClick={() => playAudio(character.kana)}
                            onTouchStart={(e) => { e.preventDefault(); playAudio(character.kana); }}
                            className={`relative bg-white dark:bg-slate-800 rounded-lg shadow p-2 text-center cursor-pointer transition-all duration-200 aspect-square flex flex-col justify-center items-center ${isPlaying ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                        >
                            <div className="absolute top-1 right-1 text-slate-300 dark:text-slate-600">
                                <SpeakerIcon className="w-3 h-3" />
                            </div>
                            
                            <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                                {character.kana}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                {character.romaji}
                            </div>
                            
                            <div className="absolute bottom-1 w-[calc(100%-8px)] h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                                <div 
                                    className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                                    style={{ width: `${(masteryLevel / 8) * 100}%` }}
                                ></div>
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