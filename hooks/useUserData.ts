import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData, CharacterMastery } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, SRS_LEVEL_DURATIONS_HOURS } from '../constants';
import { useAuth } from './useAuth';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, type FirestoreError } from 'firebase/firestore';

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
    updateMastery: (category: keyof UserData, key: string, correct: boolean) => Promise<void>;
    isLoading: boolean;
    completeOnboarding: () => Promise<void>;
    resetUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setUserData(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        // Use the v9 modular doc function to get a document reference.
        const userDocRef = doc(db, 'users', user.uid);
        
        // Use the v9 modular onSnapshot function to listen for real-time updates.
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data() as UserData);
            } else {
                const newUserProfile: UserData = {
                    ...initialUserData,
                    uid: user.uid,
                    displayName: user.displayName || 'Anonymous User',
                    photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'A'}`,
                };
                // Use the v9 modular setDoc function to create the document.
                setDoc(userDocRef, newUserProfile).then(() => {
                    setUserData(newUserProfile);
                }).catch((error: FirestoreError) => console.error("Error creating user document:", error.code, error.message));
            }
            setIsLoading(false);
        }, (error: FirestoreError) => {
            console.error("Error listening to user document:", error.code, error.message);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addXp = useCallback(async (amount: number): Promise<string[]> => {
        if (!user || !userData) return [];
        
        // Use the v9 modular doc function to get a document reference.
        const userDocRef = doc(db, 'users', user.uid);
        let newAchievements: string[] = [];

        const today = new Date().toISOString().split('T')[0];
        const newDailyProgress = [...userData.dailyProgress];
        let todayProgress = newDailyProgress.find(d => d.date === today);

        if (todayProgress) {
            todayProgress.xp += amount;
        } else {
            newDailyProgress.push({ date: today, xp: amount });
        }

        let newXp = userData.xp + amount;
        let newLevel = userData.level;
        while (newXp >= XP_PER_LEVEL) {
            newXp -= XP_PER_LEVEL;
            newLevel++;
        }

        const dataWithNewTotals = {
            ...userData,
            xp: newXp,
            level: newLevel,
            dailyProgress: newDailyProgress,
        };

        ACHIEVEMENTS.forEach(ach => {
            if (!dataWithNewTotals.achievements.includes(ach.id) && ach.condition(dataWithNewTotals)) {
                newAchievements.push(ach.nameKey);
                dataWithNewTotals.achievements.push(ach.id);
            }
        });

        // Use the v9 modular updateDoc function to update the document.
        await updateDoc(userDocRef, {
            xp: newXp,
            level: newLevel,
            dailyProgress: newDailyProgress,
            achievements: dataWithNewTotals.achievements
        });

        return newAchievements;
    }, [user, userData]);

    const updateMastery = useCallback(async (category: keyof UserData, key: string, correct: boolean) => {
        if (!user || !userData) return;
        if (typeof category !== 'string' || !category.endsWith('Mastery')) return;

        const masteryCategory = userData[category as keyof Pick<UserData, 'hiraganaMastery' | 'katakanaMastery' | 'kanjiMastery' | 'wordMastery' | 'sentenceMastery'>] as CharacterMastery;
        const currentMastery = masteryCategory[key] || { level: 0, lastReviewed: null, nextReview: null };
        const now = new Date();

        let newLevel = currentMastery.level;
        if (correct) {
            newLevel = Math.min(newLevel + 1, Object.keys(SRS_LEVEL_DURATIONS_HOURS).length - 1);
        } else {
            newLevel = Math.max(newLevel - 1, 0);
        }
        
        const nextReviewDate = new Date(now.getTime() + (SRS_LEVEL_DURATIONS_HOURS[newLevel] || 0) * 60 * 60 * 1000);
        
        const newMasteryItem = {
            level: newLevel,
            lastReviewed: now.toISOString(),
            nextReview: nextReviewDate.toISOString()
        };

        // Use the v9 modular doc and updateDoc functions.
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            [`${category}.${key}`]: newMasteryItem
        });
    }, [user, userData]);
    
    const completeOnboarding = useCallback(async () => {
        if (!user) return;
        // Use the v9 modular doc and updateDoc functions.
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { hasCompletedOnboarding: true });
    }, [user]);

    const resetUserData = useCallback(async () => {
        if (!user) return;
        // Use the v9 modular doc and setDoc functions.
        const userDocRef = doc(db, 'users', user.uid);
        const freshData: UserData = {
            ...initialUserData,
            uid: user.uid,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'A'}`,
        };
        await setDoc(userDocRef, freshData);
    }, [user]);

    return React.createElement(UserDataContext.Provider, { value: { userData, addXp, updateMastery, isLoading, completeOnboarding, resetUserData } }, children);
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};