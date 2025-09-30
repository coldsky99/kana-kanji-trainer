import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Fix: Import firebase v8 namespaced object to access Firestore types.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import type { UserData, CharacterMastery } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, SRS_LEVEL_DURATIONS_HOURS } from '../constants';
import { useAuth } from './useAuth';
import { db } from '../firebase';
// Fix: Remove v9 modular imports and define FirestoreError for v8.
type FirestoreError = firebase.firestore.FirestoreError;

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
        // Fix: Use v8 syntax to get a document reference.
        const userDocRef = db.collection('users').doc(user.uid);
        
        // Fix: Use v8 syntax for onSnapshot.
        const unsubscribe = userDocRef.onSnapshot((docSnap) => {
            if (docSnap.exists) {
                setUserData(docSnap.data() as UserData);
            } else {
                const newUserProfile: UserData = {
                    ...initialUserData,
                    uid: user.uid,
                    displayName: user.displayName || 'Anonymous User',
                    photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'A'}`,
                };
                // Fix: Use v8 syntax for setDoc.
                userDocRef.set(newUserProfile).then(() => {
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
        
        // Fix: Use v8 syntax to get a document reference.
        const userDocRef = db.collection('users').doc(user.uid);
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

        // Fix: Use v8 syntax for updateDoc.
        await userDocRef.update({
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

        // Fix: Use v8 syntax to get a document reference.
        const userDocRef = db.collection('users').doc(user.uid);
        // Fix: Use v8 syntax for updateDoc with a dynamic key.
        await userDocRef.update({
            [`${category}.${key}`]: newMasteryItem
        });
    }, [user, userData]);
    
    const completeOnboarding = useCallback(async () => {
        if (!user) return;
        // Fix: Use v8 syntax to get a document reference.
        const userDocRef = db.collection('users').doc(user.uid);
        // Fix: Use v8 syntax for updateDoc.
        await userDocRef.update({ hasCompletedOnboarding: true });
    }, [user]);

    const resetUserData = useCallback(async () => {
        if (!user) return;
        // Fix: Use v8 syntax to get a document reference.
        const userDocRef = db.collection('users').doc(user.uid);
        const freshData: UserData = {
            ...initialUserData,
            uid: user.uid,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'A'}`,
        };
        // Fix: Use v8 syntax for setDoc.
        await userDocRef.set(freshData);
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