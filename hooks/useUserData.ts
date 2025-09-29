
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData, CharacterMastery } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, SRS_LEVEL_DURATIONS_HOURS } from '../constants';

const initialUserData: UserData = {
    level: 1,
    xp: 0,
    hiraganaMastery: {},
    katakanaMastery: {},
    kanjiMastery: {},
    wordMastery: {},
    sentenceMastery: {},
    achievements: [],
    dailyProgress: [],
};

interface UserDataContextType {
    userData: UserData;
    addXp: (amount: number) => string[];
    updateMastery: (category: keyof UserData, key: string, correct: boolean) => void;
    isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>(initialUserData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('nihongoMasterUserData');
            if (savedData) {
                setUserData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem('nihongoMasterUserData', JSON.stringify(userData));
            } catch (error) {
                console.error("Failed to save user data to localStorage", error);
            }
        }
    }, [userData, isLoading]);
    
    const addXp = useCallback((amount: number): string[] => {
        let newAchievements: string[] = [];
        setUserData(prevData => {
            const today = new Date().toISOString().split('T')[0];
            const newDailyProgress = [...prevData.dailyProgress];
            let todayProgress = newDailyProgress.find(d => d.date === today);

            if (todayProgress) {
                todayProgress.xp += amount;
            } else {
                newDailyProgress.push({ date: today, xp: amount });
            }

            let newXp = prevData.xp + amount;
            let newLevel = prevData.level;
            while (newXp >= XP_PER_LEVEL) {
                newXp -= XP_PER_LEVEL;
                newLevel++;
            }

            const updatedData = {
                ...prevData,
                xp: newXp,
                level: newLevel,
                dailyProgress: newDailyProgress,
            };

            ACHIEVEMENTS.forEach(ach => {
                if (!updatedData.achievements.includes(ach.id) && ach.condition(updatedData)) {
                    newAchievements.push(ach.name);
                    updatedData.achievements.push(ach.id);
                }
            });

            return updatedData;
        });
        return newAchievements;
    }, []);

    const updateMastery = useCallback((category: keyof UserData, key: string, correct: boolean) => {
        // Fix: Added a type check to ensure `category` is a string before calling `endsWith`.
        if (typeof category === 'string' && category.endsWith('Mastery')) {
            setUserData(prevData => {
                const masteryCategory = prevData[category as keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery' | 'wordMastery' | 'sentenceMastery'>] as CharacterMastery;
                const currentMastery = masteryCategory[key] || { level: 0, lastReviewed: null, nextReview: null };
                const now = new Date();

                let newLevel = currentMastery.level;
                if (correct) {
                    newLevel = Math.min(newLevel + 1, Object.keys(SRS_LEVEL_DURATIONS_HOURS).length - 1);
                } else {
                    newLevel = Math.max(newLevel - 1, 0);
                }
                
                const nextReviewDate = new Date(now.getTime() + (SRS_LEVEL_DURATIONS_HOURS[newLevel] || 0) * 60 * 60 * 1000);
                
                const newMastery = {
                    ...masteryCategory,
                    [key]: {
                        level: newLevel,
                        lastReviewed: now.toISOString(),
                        nextReview: nextReviewDate.toISOString()
                    }
                };

                return { ...prevData, [category]: newMastery };
            });
        }
    }, []);


    // Fix: Replaced JSX with React.createElement because .ts files cannot contain JSX, which was causing parsing errors.
    return React.createElement(UserDataContext.Provider, { value: { userData, addXp, updateMastery, isLoading } }, children);
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
