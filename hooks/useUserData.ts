import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData, CharacterMastery, MasteryItem } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, SRS_LEVEL_DURATIONS_HOURS } from '../constants';

const USER_DATA_STORAGE_KEY = 'nihongoMasterUserData';

const createInitialUserData = (): UserData => ({
    uid: 'local-user',
    displayName: 'Learner',
    photoURL: '', // This field is no longer used for display but kept for type consistency.
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
    updateMasteryAndAddXp: (
        category: keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery'>, 
        updates: { key: string, correct: boolean }[],
        xpToAdd: number
    ) => Promise<void>;
    isLoading: boolean;
    completeOnboarding: () => Promise<void>;
    resetUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load data from localStorage on initial mount
    useEffect(() => {
        setIsLoading(true);
        try {
            const savedData = localStorage.getItem(USER_DATA_STORAGE_KEY);
            if (savedData) {
                setUserData(JSON.parse(savedData));
            } else {
                setUserData(createInitialUserData());
            }
        } catch (error) {
            console.error("Error loading data from localStorage, resetting user data.", error);
            setUserData(createInitialUserData());
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (userData && !isLoading) {
            try {
                localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
            } catch (error) {
                console.error("Failed to save user data to localStorage:", error);
            }
        }
    }, [userData, isLoading]);

    const updateMasteryAndAddXp = useCallback(async (
        category: keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery'>, 
        updates: { key: string, correct: boolean }[],
        xpToAdd: number
    ) => {
        setUserData(currentUserData => {
            if (!currentUserData) return null;

            // --- Mastery Update Logic ---
            const newMasteryData: CharacterMastery = { ...(currentUserData[category] as CharacterMastery) };
            updates.forEach(({ key, correct }) => {
                const currentItem: MasteryItem = newMasteryData[key] || { level: 0, lastReviewed: null, nextReview: null };
                
                let newLevel: number;
                if (correct) {
                    newLevel = Math.min(currentItem.level + 1, 8);
                } else {
                    newLevel = Math.max(0, currentItem.level - 2);
                }

                const reviewIntervalHours = SRS_LEVEL_DURATIONS_HOURS[newLevel];
                const nextReviewDate = new Date();
                nextReviewDate.setHours(nextReviewDate.getHours() + reviewIntervalHours);
                
                newMasteryData[key] = {
                    level: newLevel,
                    lastReviewed: new Date().toISOString(),
                    nextReview: nextReviewDate.toISOString()
                };
            });

            let processedData: UserData = { ...currentUserData, [category]: newMasteryData };

            // --- XP and Level Up Logic ---
            if (xpToAdd > 0) {
                const newTotalXp = (processedData.level - 1) * XP_PER_LEVEL + processedData.xp + xpToAdd;
                const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
                const xpForNextLevel = newTotalXp % XP_PER_LEVEL;
                
                const today = new Date().toISOString().split('T')[0];
                const newDailyProgress = [...processedData.dailyProgress];
                const todayProgressIndex = newDailyProgress.findIndex(d => d.date === today);

                if (todayProgressIndex > -1) {
                    newDailyProgress[todayProgressIndex] = { ...newDailyProgress[todayProgressIndex], xp: newDailyProgress[todayProgressIndex].xp + xpToAdd };
                } else {
                    newDailyProgress.push({ date: today, xp: xpToAdd });
                }

                processedData = {
                    ...processedData,
                    xp: xpForNextLevel,
                    level: newLevel,
                    dailyProgress: newDailyProgress,
                };
            }

            // --- Achievement Check Logic ---
            const newAchievements: string[] = [];
            ACHIEVEMENTS.forEach(ach => {
                if (!processedData.achievements.includes(ach.id) && ach.condition(processedData)) {
                    newAchievements.push(ach.id);
                }
            });

            if (newAchievements.length > 0) {
                 processedData.achievements = [...processedData.achievements, ...newAchievements];
            }

            return processedData;
        });
    }, []);

    const completeOnboarding = useCallback(async () => {
        setUserData(currentUserData => {
            if (!currentUserData) return null;
            return { ...currentUserData, hasCompletedOnboarding: true };
        });
    }, []);

    const resetUserData = useCallback(async () => {
        setUserData(createInitialUserData());
    }, []);

    return React.createElement(UserDataContext.Provider, { value: { userData, updateMasteryAndAddXp, isLoading, completeOnboarding, resetUserData } }, children);
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};