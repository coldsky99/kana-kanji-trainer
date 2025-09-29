import React from 'react';
import { Achievement, UserData } from './types';
import { BookOpenIcon, StarIcon, TrophyIcon, BoltIcon, ChartBarIcon, AcademicCapIcon } from './components/icons';

export const XP_PER_LEVEL = 100;
export const XP_PER_LESSON_COMPLETE = 10;

export const SRS_LEVEL_DURATIONS_HOURS: { [key: number]: number } = {
    0: 0,
    1: 4,
    2: 8,
    3: 24, // 1 day
    4: 72, // 3 days
    5: 168, // 1 week
    6: 336, // 2 weeks
    7: 720, // 1 month
    8: 2160, // 3 months
};

export const HIRAGANA_DATA = [
    { kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' },
    { kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' },
    { kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' },
    { kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' },
    { kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' },
    { kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' },
    { kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' },
    { kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' },
    { kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' },
    { kana: 'わ', romaji: 'wa' }, { kana: 'を', romaji: 'wo' }, { kana: 'ん', romaji: 'n' },
];

export const KATAKANA_DATA = [
    { kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' },
    { kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' },
    { kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' },
    { kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' },
    { kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' },
    { kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' },
    { kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' },
    { kana: 'ヤ', romaji: 'ya' }, { kana: 'ユ', romaji: 'yu' }, { kana: 'ヨ', romaji: 'yo' },
    { kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' },
    { kana: 'ワ', romaji: 'wa' }, { kana: 'ヲ', romaji: 'wo' }, { kana: 'ン', romaji: 'n' },
];

export const KANJI_DATA = [
    { kanji: '日', meaning: 'day, sun', reading: 'nichi, jitsu / hi, -bi, -ka' },
    { kanji: '一', meaning: 'one', reading: 'ichi, itsu / hito-, hito.tsu' },
    { kanji: '国', meaning: 'country', reading: 'koku / kuni' },
    { kanji: '人', meaning: 'person', reading: 'jin, nin / hito' },
    { kanji: '年', meaning: 'year', reading: 'nen / toshi' },
    { kanji: '大', meaning: 'large, big', reading: 'dai, tai / oo-' },
    { kanji: '十', meaning: 'ten', reading: 'juu / tou, to' },
    { kanji: '二', meaning: 'two', reading: 'ni, ji / futa, futa.tsu' },
    { kanji: '本', meaning: 'book, present', reading: 'hon / moto' },
    { kanji: '中', meaning: 'in, inside, middle', reading: 'chuu / naka' },
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_steps_h',
        name: 'First Hiragana',
        description: 'Learn your first 10 Hiragana characters.',
        icon: React.createElement(StarIcon),
        condition: (userData: UserData) => Object.values(userData.hiraganaMastery).filter(m => m.level > 0).length >= 10,
    },
    {
        id: 'first_steps_k',
        name: 'First Katakana',
        description: 'Learn your first 10 Katakana characters.',
        icon: React.createElement(StarIcon),
        condition: (userData: UserData) => Object.values(userData.katakanaMastery).filter(m => m.level > 0).length >= 10,
    },
    {
        id: 'kanji_beginner',
        name: 'Kanji Beginner',
        description: 'Learn your first 5 Kanji.',
        icon: React.createElement(BookOpenIcon),
        condition: (userData: UserData) => Object.values(userData.kanjiMastery).filter(m => m.level > 0).length >= 5,
    },
    {
        id: 'level_5',
        name: 'Level 5!',
        description: 'Reach level 5.',
        icon: React.createElement(TrophyIcon),
        condition: (userData: UserData) => userData.level >= 5,
    },
    {
        id: 'quick_learner',
        name: 'Quick Learner',
        description: 'Earn 100 XP in a single day.',
        icon: React.createElement(BoltIcon),
        condition: (userData: UserData) => userData.dailyProgress.some(d => d.xp >= 100),
    },
    {
        id: 'consistent',
        name: 'Consistent Learner',
        description: 'Practice for 3 days in a row.',
        icon: React.createElement(ChartBarIcon),
        condition: (userData: UserData) => {
            if (userData.dailyProgress.length < 3) return false;
            const dates = userData.dailyProgress.map(d => new Date(d.date).getTime()).sort((a, b) => b - a);
            const today = new Date(new Date().toISOString().split('T')[0]).getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            const uniqueDates = [...new Set(dates)];
            if (uniqueDates.length < 3) return false;
            const hasTodayOrYesterday = uniqueDates.some(d => d === today || d === today - oneDay);
            if (!hasTodayOrYesterday) return false;
            
            let consecutive = 0;
            let lastDate = uniqueDates[0];
            for (let i = 1; i < uniqueDates.length; i++) {
                if (lastDate - uniqueDates[i] === oneDay) {
                    consecutive++;
                } else if (lastDate - uniqueDates[i] > oneDay) {
                    consecutive = 0;
                }
                lastDate = uniqueDates[i];
                if (consecutive >= 2) return true;
            }
            return false;
        },
    },
    {
        id: 'hiragana_master',
        name: 'Hiragana Master',
        description: 'Master all basic Hiragana.',
        icon: React.createElement(AcademicCapIcon),
        condition: (userData) => Object.keys(userData.hiraganaMastery).length >= HIRAGANA_DATA.length,
    }
];