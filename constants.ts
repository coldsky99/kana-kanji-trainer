import React from 'react';
import { Achievement, UserData, Kanji } from './types';
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

export const KANJI_DATA: Kanji[] = [
    { kanji: '一', meaning: 'one', onyomi: 'イチ, イツ', kunyomi: 'ひと' },
    { kanji: '二', meaning: 'two', onyomi: 'ニ', kunyomi: 'ふた' },
    { kanji: '三', meaning: 'three', onyomi: 'サン', kunyomi: 'みっ' },
    { kanji: '四', meaning: 'four', onyomi: 'シ', kunyomi: 'よん, よ' },
    { kanji: '五', meaning: 'five', onyomi: 'ゴ', kunyomi: 'いつ' },
    { kanji: '六', meaning: 'six', onyomi: 'ロク', kunyomi: 'むっ' },
    { kanji: '七', meaning: 'seven', onyomi: 'シチ', kunyomi: 'なな' },
    { kanji: '八', meaning: 'eight', onyomi: 'ハチ', kunyomi: 'やっ' },
    { kanji: '九', meaning: 'nine', onyomi: 'キュウ, ク', kunyomi: 'ここの' },
    { kanji: '十', meaning: 'ten', onyomi: 'ジュウ', kunyomi: 'とお' },
    { kanji: '百', meaning: 'hundred', onyomi: 'ヒャク', kunyomi: '' },
    { kanji: '千', meaning: 'thousand', onyomi: 'セン', kunyomi: 'ち' },
    { kanji: '万', meaning: 'ten thousand', onyomi: 'マン, バン', kunyomi: '' },
    { kanji: '円', meaning: 'yen, circle', onyomi: 'エン', kunyomi: 'まる' },
    { kanji: '日', meaning: 'day, sun', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び, -か' },
    { kanji: '月', meaning: 'month, moon', onyomi: 'ゲツ, ガツ', kunyomi: 'つき' },
    { kanji: '火', meaning: 'fire', onyomi: 'カ', kunyomi: 'ひ' },
    { kanji: '水', meaning: 'water', onyomi: 'スイ', kunyomi: 'みず' },
    { kanji: '木', meaning: 'tree, wood', onyomi: 'モク, ボク', kunyomi: 'き, こ' },
    { kanji: '金', meaning: 'gold, money', onyomi: 'キン', kunyomi: 'かね' },
    { kanji: '土', meaning: 'earth, soil', onyomi: 'ド, ト', kunyomi: 'つち' },
    { kanji: '曜', meaning: 'weekday', onyomi: 'ヨウ', kunyomi: '' },
    { kanji: '本', meaning: 'book, basis', onyomi: 'ホン', kunyomi: 'もと' },
    { kanji: '人', meaning: 'person', onyomi: 'ジン, ニン', kunyomi: 'ひと' },
    { kanji: '今', meaning: 'now', onyomi: 'コン, キン', kunyomi: 'いま' },
    { kanji: '寺', meaning: 'temple', onyomi: 'ジ', kunyomi: 'てら' },
    { kanji: '時', meaning: 'time, hour', onyomi: 'ジ', kunyomi: 'とき' },
    { kanji: '半', meaning: 'half', onyomi: 'ハン', kunyomi: 'なか.ば' },
    { kanji: '刀', meaning: 'sword', onyomi: 'トウ', kunyomi: 'かたな' },
    { kanji: '分', meaning: 'minute, part', onyomi: 'フン, ブン, プン', kunyomi: 'わ.ける' },
    { kanji: '上', meaning: 'up, above', onyomi: 'ジョウ', kunyomi: 'うえ, あ.がる' },
    { kanji: '下', meaning: 'down, below', onyomi: 'カ, ゲ', kunyomi: 'した, さ.がる' },
    { kanji: '中', meaning: 'middle, inside', onyomi: 'チュウ', kunyomi: 'なか' },
    { kanji: '外', meaning: 'outside', onyomi: 'ガイ, ゲ', kunyomi: 'そと' },
    { kanji: '右', meaning: 'right', onyomi: 'ウ, ユウ', kunyomi: 'みぎ' },
    { kanji: '工', meaning: 'craft, construction', onyomi: 'コウ, ク', kunyomi: '' },
    { kanji: '左', meaning: 'left', onyomi: 'サ', kunyomi: 'ひだり' },
    { kanji: '前', meaning: 'before, front', onyomi: 'ゼン', kunyomi: 'まえ' },
    { kanji: '後', meaning: 'back, after', onyomi: 'ゴ, コウ', kunyomi: 'うし.ろ, あと' },
    { kanji: '午', meaning: 'noon', onyomi: 'ゴ', kunyomi: '' },
    { kanji: '門', meaning: 'gate', onyomi: 'モン', kunyomi: 'かど' },
    { kanji: '間', meaning: 'between', onyomi: 'カン, ケン', kunyomi: 'あいだ' },
    { kanji: '東', meaning: 'east', onyomi: 'トウ', kunyomi: 'ひがし' },
    { kanji: '西', meaning: 'west', onyomi: 'セイ, サイ', kunyomi: 'にし' },
    { kanji: '南', meaning: 'south', onyomi: 'ナン', kunyomi: 'みなみ' },
    { kanji: '北', meaning: 'north', onyomi: 'ホク', kunyomi: 'きた' },
    { kanji: '田', meaning: 'rice field', onyomi: 'デン', kunyomi: 'た' },
    { kanji: '力', meaning: 'power, strength', onyomi: 'リョク, リキ', kunyomi: 'ちから' },
    { kanji: '男', meaning: 'man, male', onyomi: 'ダン, ナン', kunyomi: 'おとこ' },
    { kanji: '女', meaning: 'woman, female', onyomi: 'ジョ, ニョ', kunyomi: 'おんな, め' },
    { kanji: '子', meaning: 'child', onyomi: 'シ, ス', kunyomi: 'こ' },
    { kanji: '学', meaning: 'learning', onyomi: 'ガク', kunyomi: 'まな.ぶ' },
    { kanji: '生', meaning: 'birth, life', onyomi: 'セイ, ショウ', kunyomi: 'い.きる, う.まれる' },
    { kanji: '先', meaning: 'ahead, previous', onyomi: 'セン', kunyomi: 'さき' },
    { kanji: '何', meaning: 'what', onyomi: 'カ', kunyomi: 'なに, なん' },
    { kanji: '父', meaning: 'father', onyomi: 'フ', kunyomi: 'ちち' },
    { kanji: '母', meaning: 'mother', onyomi: 'ボ', kunyomi: 'はは' },
    { kanji: '年', meaning: 'year', onyomi: 'ネン', kunyomi: 'とし' },
    { kanji: '去', meaning: 'to leave, past', onyomi: 'キョ, コ', kunyomi: 'さ.る' },
    { kanji: '毎', meaning: 'every', onyomi: 'マイ', kunyomi: 'ごと' },
    { kanji: '王', meaning: 'king', onyomi: 'オウ', kunyomi: '' },
    { kanji: '国', meaning: 'country', onyomi: 'コク', kunyomi: 'くに' },
    { kanji: '見', meaning: 'to see', onyomi: 'ケン', kunyomi: 'み.る' },
    { kanji: '行', meaning: 'to go', onyomi: 'コウ, ギョウ', kunyomi: 'い.く' },
    { kanji: '米', meaning: 'rice, America', onyomi: 'ベイ, マイ', kunyomi: 'こめ' },
    { kanji: '来', meaning: 'to come', onyomi: 'ライ', kunyomi: 'く.る' },
    { kanji: '良', meaning: 'good', onyomi: 'リョウ', kunyomi: 'よ.い' },
    { kanji: '食', meaning: 'to eat', onyomi: 'ショク', kunyomi: 'た.べる' },
    { kanji: '飲', meaning: 'to drink', onyomi: 'イン', kunyomi: 'の.む' },
    { kanji: '会', meaning: 'to meet', onyomi: 'カイ', kunyomi: 'あ.う' },
    { kanji: '耳', meaning: 'ear', onyomi: 'ジ', kunyomi: 'みみ' },
    { kanji: '聞', meaning: 'to listen', onyomi: 'ブン, モン', kunyomi: 'き.く' },
    { kanji: '言', meaning: 'to say', onyomi: 'ゲン, ゴン', kunyomi: 'い.う' },
    { kanji: '話', meaning: 'to speak', onyomi: 'ワ', kunyomi: 'はな.す' },
    { kanji: '立', meaning: 'to stand', onyomi: 'リツ', kunyomi: 'た.つ' },
    { kanji: '待', meaning: 'to wait', onyomi: 'タイ', kunyomi: 'ま.つ' },
    { kanji: '周', meaning: 'surroundings', onyomi: 'シュウ', kunyomi: 'まわ.り' },
    { kanji: '週', meaning: 'week', onyomi: 'シュウ', kunyomi: '' },
    { kanji: '大', meaning: 'big', onyomi: 'ダイ, タイ', kunyomi: 'おお.きい' },
    { kanji: '小', meaning: 'small', onyomi: 'ショウ', kunyomi: 'ちい.さい' },
    { kanji: '高', meaning: 'high, expensive', onyomi: 'コウ', kunyomi: 'たか.い' },
    { kanji: '安', meaning: 'cheap, ease', onyomi: 'アン', kunyomi: 'やす.い' },
    { kanji: '新', meaning: 'new', onyomi: 'シン', kunyomi: 'あたら.しい' },
    { kanji: '古', meaning: 'old', onyomi: 'コ', kunyomi: 'ふる.い' },
    { kanji: '元', meaning: 'origin, former', onyomi: 'ゲン, ガン', kunyomi: 'もと' },
    { kanji: '気', meaning: 'spirit, energy', onyomi: 'キ, ケ', kunyomi: '' },
    { kanji: '多', meaning: 'many, much', onyomi: 'タ', kunyomi: 'おお.い' },
    { kanji: '少', meaning: 'a little', onyomi: 'ショウ', kunyomi: 'すく.ない, すこ.し' },
    { kanji: '広', meaning: 'spacious, wide', onyomi: 'コウ', kunyomi: 'ひろ.い' },
    { kanji: '早', meaning: 'early', onyomi: 'ソウ', kunyomi: 'はや.い' },
    { kanji: '長', meaning: 'long, chief', onyomi: 'チョウ', kunyomi: 'なが.い' },
    { kanji: '明', meaning: 'bright, light', onyomi: 'メイ, ミョウ', kunyomi: 'あか.るい' },
    { kanji: '好', meaning: 'to like', onyomi: 'コウ', kunyomi: 'す.き' },
    { kanji: '友', meaning: 'friend', onyomi: 'ユウ', kunyomi: 'とも' },
    { kanji: '入', meaning: 'to enter', onyomi: 'ニュウ', kunyomi: 'はい.る, い.る' },
    { kanji: '出', meaning: 'to exit', onyomi: 'シュツ', kunyomi: 'で.る, だ.す' },
    { kanji: '市', meaning: 'city, market', onyomi: 'シ', kunyomi: 'いち' },
    { kanji: '町', meaning: 'town', onyomi: 'チョウ', kunyomi: 'まち' },
    { kanji: '村', meaning: 'village', onyomi: 'ソン', kunyomi: 'むら' },
    { kanji: '雨', meaning: 'rain', onyomi: 'ウ', kunyomi: 'あめ' },
    { kanji: '電', meaning: 'electricity', onyomi: 'デン', kunyomi: '' },
    { kanji: '車', meaning: 'car', onyomi: 'シャ', kunyomi: 'くるま' },
    { kanji: '馬', meaning: 'horse', onyomi: 'バ', kunyomi: 'うま' },
    { kanji: '駅', meaning: 'station', onyomi: 'エキ', kunyomi: '' },
    { kanji: '社', meaning: 'company, shrine', onyomi: 'シャ', kunyomi: 'やしろ' },
    { kanji: '校', meaning: 'school', onyomi: 'コウ', kunyomi: '' },
    { kanji: '店', meaning: 'shop', onyomi: 'テン', kunyomi: 'みせ' },
    { kanji: '銀', meaning: 'silver', onyomi: 'ギン', kunyomi: '' },
    { kanji: '病', meaning: 'sick', onyomi: 'ビョウ', kunyomi: 'や.まい' },
    { kanji: '院', meaning: 'institution', onyomi: 'イン', kunyomi: '' }
];

// Helper function for checking current streak
const checkStreak = (userData: UserData, requiredStreak: number): boolean => {
    const datesSet = new Set(userData.dailyProgress.map(d => d.date));
    if (datesSet.size < requiredStreak) return false;

    let currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    let streak = 0;
    
    const todayStr = currentDate.toISOString().split('T')[0];
    const yesterdayStr = new Date(currentDate.getTime() - oneDay).toISOString().split('T')[0];

    // Streak must be current, so it must include today or yesterday.
    if (datesSet.has(todayStr)) {
        streak = 1;
    } else if (datesSet.has(yesterdayStr)) {
        streak = 1;
        currentDate.setTime(currentDate.getTime() - oneDay); // Start check from yesterday
    } else {
        return false; // No current streak
    }

    // Count backwards from the starting date
    for (let i = 1; i < datesSet.size + 5; i++) { // Loop a bit more to be safe
        const prevDay = new Date(currentDate.getTime() - i * oneDay);
        const prevDayStr = prevDay.toISOString().split('T')[0];
        if (datesSet.has(prevDayStr)) {
            streak++;
        } else {
            break; // Streak broken
        }
    }
    
    return streak >= requiredStreak;
}


export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_steps_h',
        nameKey: 'achievements.first_steps_h.name',
        descriptionKey: 'achievements.first_steps_h.description',
        icon: React.createElement(StarIcon),
        condition: (userData: UserData) => Object.values(userData.hiraganaMastery).filter(m => m.level > 0).length >= 10,
    },
    {
        id: 'first_steps_k',
        nameKey: 'achievements.first_steps_k.name',
        descriptionKey: 'achievements.first_steps_k.description',
        icon: React.createElement(StarIcon),
        condition: (userData: UserData) => Object.values(userData.katakanaMastery).filter(m => m.level > 0).length >= 10,
    },
    {
        id: 'kanji_beginner',
        nameKey: 'achievements.kanji_beginner.name',
        descriptionKey: 'achievements.kanji_beginner.description',
        icon: React.createElement(BookOpenIcon),
        condition: (userData: UserData) => Object.values(userData.kanjiMastery).filter(m => m.level > 0).length >= 10,
    },
    {
        id: 'level_5',
        nameKey: 'achievements.level_5.name',
        descriptionKey: 'achievements.level_5.description',
        icon: React.createElement(TrophyIcon),
        condition: (userData: UserData) => userData.level >= 5,
    },
    {
        id: 'level_10',
        nameKey: 'achievements.level_10.name',
        descriptionKey: 'achievements.level_10.description',
        icon: React.createElement(TrophyIcon),
        condition: (userData: UserData) => userData.level >= 10,
    },
    {
        id: 'quick_learner',
        nameKey: 'achievements.quick_learner.name',
        descriptionKey: 'achievements.quick_learner.description',
        icon: React.createElement(BoltIcon),
        condition: (userData: UserData) => userData.dailyProgress.some(d => d.xp >= 100),
    },
    {
        id: 'consistent',
        nameKey: 'achievements.consistent.name',
        descriptionKey: 'achievements.consistent.description',
        icon: React.createElement(ChartBarIcon),
        condition: (userData: UserData) => checkStreak(userData, 3),
    },
    {
        id: 'persistent_learner',
        nameKey: 'achievements.persistent_learner.name',
        descriptionKey: 'achievements.persistent_learner.description',
        icon: React.createElement(ChartBarIcon),
        condition: (userData: UserData) => checkStreak(userData, 7),
    },
    {
        id: 'hiragana_master',
        nameKey: 'achievements.hiragana_master.name',
        descriptionKey: 'achievements.hiragana_master.description',
        icon: React.createElement(AcademicCapIcon),
        condition: (userData) => Object.values(userData.hiraganaMastery).filter(m => m.level > 0).length >= HIRAGANA_DATA.length,
    },
    {
        id: 'katakana_master',
        nameKey: 'achievements.katakana_master.name',
        descriptionKey: 'achievements.katakana_master.description',
        icon: React.createElement(AcademicCapIcon),
        condition: (userData) => Object.values(userData.katakanaMastery).filter(m => m.level > 0).length >= KATAKANA_DATA.length,
    },
    {
        id: 'kanji_adept',
        nameKey: 'achievements.kanji_adept.name',
        descriptionKey: 'achievements.kanji_adept.description',
        icon: React.createElement(BookOpenIcon),
        condition: (userData) => Object.values(userData.kanjiMastery).filter(m => m.level > 0).length >= 50,
    }
];