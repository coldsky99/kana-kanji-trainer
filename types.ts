import React from 'react';

export enum AppView {
    Dashboard = 'dashboard',
    Hiragana = 'hiragana',
    Katakana = 'katakana',
    Kanji = 'kanji',
    Words = 'words',
    Sentences = 'sentences',
}

export enum KanaType {
    Hiragana = 'hiragana',
    Katakana = 'katakana',
}

export enum QuizType {
    KanaToRomaji = 'kana-to-romaji',
    RomajiToKana = 'romaji-to-kana',
    KanjiToReading = 'kanji-to-reading',
    KanjiToMeaning = 'kanji-to-meaning',
}

export interface MasteryItem {
    level: number;
    lastReviewed: string | null;
    nextReview: string | null;
}

export type CharacterMastery = {
    [key: string]: MasteryItem;
};

export interface DailyProgress {
    date: string;
    xp: number;
}

export interface UserData {
    uid: string;
    displayName: string;
    photoURL: string;
    level: number;
    xp: number;
    hiraganaMastery: CharacterMastery;
    katakanaMastery: CharacterMastery;
    kanjiMastery: CharacterMastery;
    wordMastery: CharacterMastery;
    sentenceMastery: CharacterMastery;
    achievements: string[];
    dailyProgress: DailyProgress[];
    hasCompletedOnboarding: boolean;
}

export interface QuizQuestion {
    id: string;
    type: QuizType;
    question: string;
    options: string[];
    correctAnswer: string;
    meaning?: string;
    reading?: string;
}

export interface Achievement {
    id: string;
    nameKey: string;
    descriptionKey: string;
    icon: React.ReactNode;
    condition: (userData: UserData) => boolean;
}

export interface Kanji {
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
}
// FIX: Add and export the LeaderboardEntry interface.
export interface LeaderboardEntry {
  rank: number;
  id: string;
  displayName: string;
  photoUrl: string;
  level: number;
  xp: number;
}
