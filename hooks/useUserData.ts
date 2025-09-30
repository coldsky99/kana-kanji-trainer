import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData, CharacterMastery } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, SRS_LEVEL_DURATIONS_HOURS } from '../constants';

const USER_DATA_STORAGE_KEY = 'nihongoMasterUserData';

const createInitialUserData = (): UserData => ({
    uid: 'local-user',
    displayName: 'Learner',
    photoURL: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3e%3cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3e%3c/svg%3e",
    level: 1,
    xp: 0,
    hiraganaMastery: {},
    katakanaMastery: {},
    kanjiMastery: {},
    wordMastery: {},
    sentenceMastery: {},
    achievements: [],
    dailyProgress: [],
    hasCompletedOnboarding: false,
});


interface UserDataContextType {
    userData: UserData | null;
    addXp: (amount: number) => Promise<string[]>;
    updateMastery: (category: keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery'>, key: string, correct: boolean) => Promise<void>;
    isLoading: boolean;
    completeOnboarding: () => Promise<void>;
    resetUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);
        try {
            const savedData = localStorage.getItem(USER_DATA_STORAGE_KEY);
            if (savedData) {
                setUserData(JSON.parse(savedData));
            } else {
                const newUserData = createInitialUserData();
                localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUserData));
                setUserData(newUserData);
            }
        } catch (error) {
            console.error("Error loading data from localStorage, resetting user data.", error);
            const newUserData = createInitialUserData();
            localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUserData));
            setUserData(newUserData);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const saveUserData = useCallback((data: UserData) => {
        try {
            localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save user data to localStorage:", error);
        }
    }, []);


    const addXp = useCallback(async (amount: number): Promise<string[]> => {
        if (!userData) return [];

        const newTotalXp = (userData.level - 1) * XP_PER_LEVEL + userData.xp + amount;
        const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
        const xpForNextLevel = newTotalXp % XP_PER_LEVEL;
        
        const today = new Date().toISOString().split('T')[0];
        const newDailyProgress = [...userData.dailyProgress];
        const todayProgressIndex = newDailyProgress.findIndex(d => d.date === today);

        if (todayProgressIndex > -1) {
            newDailyProgress[todayProgressIndex] = { ...newDailyProgress[todayProgressIndex], xp: newDailyProgress[todayProgressIndex].xp + amount };
        } else {
            newDailyProgress.push({ date: today, xp: amount });
        }

        const updatedData: UserData = {
            ...userData,
            xp: xpForNextLevel,
            level: newLevel,
            dailyProgress: newDailyProgress,
        };

        const newAchievements: string[] = [];
        ACHIEVEMENTS.forEach(ach => {
            if (!updatedData.achievements.includes(ach.id) && ach.condition(updatedData)) {
                newAchievements.push(ach.id);
                updatedData.achievements.push(ach.id);
            }
        });

        setUserData(updatedData);
        saveUserData(updatedData);

        return newAchievements;
    }, [userData, saveUserData]);

    const updateMastery = useCallback(async (category: keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery'>, key: string, correct: boolean) => {
        if (!userData) return;
        
        const masteryData = userData[category] as CharacterMastery;
        const currentItem = masteryData[key] || { level: 0, lastReviewed: null, nextReview: null };
        
        if (correct) {
            currentItem.level = Math.min(currentItem.level + 1, 8);
        } else {
            currentItem.level = Math.max(0, currentItem.level - 2);
        }

        currentItem.lastReviewed = new Date().toISOString();
        const reviewIntervalHours = SRS_LEVEL_DURATIONS_HOURS[currentItem.level];
        const nextReviewDate = new Date();
        nextReviewDate.setHours(nextReviewDate.getHours() + reviewIntervalHours);
        currentItem.nextReview = nextReviewDate.toISOString();

        const updatedMastery = { ...masteryData, [key]: currentItem };
        const updatedData = { ...userData, [category]: updatedMastery };
        setUserData(updatedData);
        saveUserData(updatedData);

    }, [userData, saveUserData]);

    const completeOnboarding = useCallback(async () => {
         if (!userData) return;
        
        const updatedData = { ...userData, hasCompletedOnboarding: true };
        setUserData(updatedData);
        saveUserData(updatedData);

    }, [userData, saveUserData]);

    const resetUserData = useCallback(async () => {
        const newUserData = createInitialUserData();
        setUserData(newUserData);
        saveUserData(newUserData);
    }, [saveUserData]);

    return React.createElement(UserDataContext.Provider, { value: { userData, addXp, updateMastery, isLoading, completeOnboarding, resetUserData } }, children);
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};