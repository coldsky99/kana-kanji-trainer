import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData, CharacterMastery } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, SRS_LEVEL_DURATIONS_HOURS } from '../constants';
import { useAuth, type NetlifyUser } from './useAuth';

const initialUserData: Omit<UserData, 'uid' | 'displayName' | 'photoURL'> = {
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
};

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
    const { user, isInitialized: authInitialized } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = useCallback(async (netlifyUser: NetlifyUser) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/db/users/${netlifyUser.id}`, {
                headers: { Authorization: `Bearer ${netlifyUser.token.access_token}` },
            });

            if (response.status === 404) {
                const newUserProfile: Omit<UserData, keyof typeof initialUserData> = {
                    uid: netlifyUser.id,
                    displayName: netlifyUser.user_metadata.full_name || 'Anonymous User',
                    photoURL: netlifyUser.user_metadata.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${netlifyUser.user_metadata.full_name || 'A'}`,
                };
                
                const createResponse = await fetch('/api/db/users', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${netlifyUser.token.access_token}`
                    },
                    body: JSON.stringify({
                        id: newUserProfile.uid,
                        email: netlifyUser.email,
                        displayName: newUserProfile.displayName,
                        photoURL: newUserProfile.photoURL,
                    }),
                });
                
                if (!createResponse.ok) throw new Error('Failed to create user profile');
                const createdUser = await createResponse.json();
                setUserData(createdUser);

            } else if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authInitialized) {
            if (user) {
                fetchUserData(user);
            } else {
                setUserData(null);
                setIsLoading(false);
            }
        }
    }, [user, authInitialized, fetchUserData]);

    const addXp = useCallback(async (amount: number): Promise<string[]> => {
        if (!user || !userData) return [];

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

        setUserData(updatedData); // Optimistic update

        try {
            await fetch(`/api/db/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token.access_token}`,
                },
                body: JSON.stringify({
                    level: updatedData.level,
                    xp: updatedData.xp,
                    dailyProgress: updatedData.dailyProgress,
                    achievements: updatedData.achievements,
                }),
            });
        } catch (error) {
            console.error("Failed to sync XP:", error);
        }

        return newAchievements;
    }, [user, userData]);

    const updateMastery = useCallback(async (category: keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery'>, key: string, correct: boolean) => {
        if (!user || !userData) return;
        
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
        setUserData(updatedData); // Optimistic update

        try {
            await fetch(`/api/db/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token.access_token}`,
                },
                body: JSON.stringify({ [category]: updatedMastery }),
            });
        } catch (error) {
            console.error("Failed to sync mastery:", error);
        }
    }, [user, userData]);

    const completeOnboarding = useCallback(async () => {
         if (!user || !userData) return;
        
        const updatedData = { ...userData, hasCompletedOnboarding: true };
        setUserData(updatedData);

        try {
            await fetch(`/api/db/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token.access_token}`,
                },
                body: JSON.stringify({ hasCompletedOnboarding: true }),
            });
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
        }
    }, [user, userData]);

    const resetUserData = useCallback(async () => {
       if (!user || !userData) return;

        const dataToReset = {
            ...initialUserData,
        };

        const updatedData = {
            ...userData,
            ...dataToReset,
        };
        setUserData(updatedData);

         try {
            await fetch(`/api/db/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token.access_token}`,
                },
                body: JSON.stringify(dataToReset),
            });
        } catch (error) {
            console.error("Failed to reset user data:", error);
        }
    }, [user, userData]);

    return React.createElement(UserDataContext.Provider, { value: { userData, addXp, updateMastery, isLoading, completeOnboarding, resetUserData } }, children);
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
