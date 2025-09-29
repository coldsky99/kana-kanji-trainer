import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const translations = {
    en: {
      "header.dashboard": "Dashboard",
      "header.level": "Level",
      "header.charactersLearned": "characters learned",
      "dashboard.welcome": "Welcome back!",
      "dashboard.hiraganaLearned": "Hiragana Learned",
      "dashboard.katakanaLearned": "Katakana Learned",
      "dashboard.kanjiLearned": "Kanji Learned",
      "dashboard.achievements": "Achievements",
      "dashboard.module.learnHiragana.title": "Learn Hiragana",
      "dashboard.module.learnHiragana.description": "Start with the basic Japanese phonetic script.",
      "dashboard.module.learnKatakana.title": "Learn Katakana",
      "dashboard.module.learnKatakana.description": "Learn the script for foreign words and emphasis.",
      "dashboard.module.learnKanji.title": "Learn Kanji",
      "dashboard.module.learnKanji.description": "Begin your journey into Chinese characters.",
      "dashboard.module.wordBuilder.title": "Word Builder",
      "dashboard.module.wordBuilder.description": "Form words with the characters you've learned.",
      "dashboard.module.sentencePractice.title": "Sentence Practice",
      "dashboard.module.sentencePractice.description": "Read and understand Japanese sentences.",
      "dashboard.unlockProgress": "Unlock Progress",
      "dashboard.weeklyXP": "Weekly XP Progress",
      "achievements.title": "Achievements",
      "achievements.first_steps_h.name": "First Hiragana",
      "achievements.first_steps_h.description": "Learn your first 10 Hiragana characters.",
      "achievements.first_steps_k.name": "First Katakana",
      "achievements.first_steps_k.description": "Learn your first 10 Katakana characters.",
      "achievements.kanji_beginner.name": "Kanji Beginner",
      "achievements.kanji_beginner.description": "Learn your first 10 Kanji.",
      "achievements.level_5.name": "Level 5!",
      "achievements.level_5.description": "Reach level 5.",
      "achievements.quick_learner.name": "Quick Learner",
      "achievements.quick_learner.description": "Earn 100 XP in a single day.",
      "achievements.consistent.name": "Consistent Learner",
      "achievements.consistent.description": "Practice for 3 days in a row.",
      "achievements.hiragana_master.name": "Hiragana Master",
      "achievements.hiragana_master.description": "Master all basic Hiragana.",
      "kanaView.startQuiz": "Start Quiz",
      "kanaView.quizTitle": "{kanaType} Quiz",
      "kanjiView.title": "JLPT N5 Kanji",
      "kanjiView.startQuiz": "Start Quiz",
      "kanjiView.quizTitle": "Kanji Quiz",
      "flashcard.meaning": "Meaning",
      "flashcard.onyomi": "On'yomi",
      "flashcard.kunyomi": "Kun'yomi",
      "flashcard.none": "None",
      "wordBuilder.title": "Word Builder",
      "wordBuilder.comingSoon": "This feature is coming soon! You'll be able to construct words using the Hiragana, Katakana, and Kanji you've learned.",
      "sentencePractice.title": "Sentence Practice",
      "sentencePractice.comingSoon": "Coming soon! Practice reading and understanding Japanese sentences, from simple to complex, to build your comprehension skills.",
      "quiz.complete.title": "Quiz Complete!",
      "quiz.complete.score": "You scored {correct} out of {total}!",
      "quiz.complete.finish": "Finish",
      "quiz.noQuestions": "No questions available",
      "quiz.close": "Close",
      "quiz.prompt.chooseMeaning": "Choose the correct meaning.",
      "quiz.prompt.chooseReading": "Choose the correct {reading}.",
      "quiz.prompt.chooseRomaji": "Choose the correct romaji.",
      "quiz.prompt.chooseKana": "Choose the correct kana.",
      "quiz.next": "Next",
      "quiz.seeResults": "See Results",
      "footer.message": "Nihongo Master - Your journey to fluency starts here."
    },
    id: {
      "header.dashboard": "Dasbor",
      "header.level": "Level",
      "header.charactersLearned": "karakter dipelajari",
      "dashboard.welcome": "Selamat datang kembali!",
      "dashboard.hiraganaLearned": "Hiragana Dipelajari",
      "dashboard.katakanaLearned": "Katakana Dipelajari",
      "dashboard.kanjiLearned": "Kanji Dipelajari",
      "dashboard.achievements": "Pencapaian",
      "dashboard.module.learnHiragana.title": "Belajar Hiragana",
      "dashboard.module.learnHiragana.description": "Mulai dengan aksara fonetik dasar Jepang.",
      "dashboard.module.learnKatakana.title": "Belajar Katakana",
      "dashboard.module.learnKatakana.description": "Pelajari aksara untuk kata-kata asing dan penekanan.",
      "dashboard.module.learnKanji.title": "Belajar Kanji",
      "dashboard.module.learnKanji.description": "Mulailah perjalanan Anda ke dalam karakter Cina.",
      "dashboard.module.wordBuilder.title": "Penyusun Kata",
      "dashboard.module.wordBuilder.description": "Bentuk kata-kata dengan karakter yang telah Anda pelajari.",
      "dashboard.module.sentencePractice.title": "Latihan Kalimat",
      "dashboard.module.sentencePractice.description": "Baca dan pahami kalimat-kalimat bahasa Jepang.",
      "dashboard.unlockProgress": "Progres Membuka",
      "dashboard.weeklyXP": "Progres XP Mingguan",
      "achievements.title": "Pencapaian",
      "achievements.first_steps_h.name": "Hiragana Pertama",
      "achievements.first_steps_h.description": "Pelajari 10 karakter Hiragana pertamamu.",
      "achievements.first_steps_k.name": "Katakana Pertama",
      "achievements.first_steps_k.description": "Pelajari 10 karakter Katakana pertamamu.",
      "achievements.kanji_beginner.name": "Pemula Kanji",
      "achievements.kanji_beginner.description": "Pelajari 10 Kanji pertamamu.",
      "achievements.level_5.name": "Level 5!",
      "achievements.level_5.description": "Mencapai level 5.",
      "achievements.quick_learner.name": "Pembelajar Cepat",
      "achievements.quick_learner.description": "Dapatkan 100 XP dalam satu hari.",
      "achievements.consistent.name": "Pembelajar Konsisten",
      "achievements.consistent.description": "Berlatih selama 3 hari berturut-turut.",
      "achievements.hiragana_master.name": "Master Hiragana",
      "achievements.hiragana_master.description": "Kuasai semua Hiragana dasar.",
      "kanaView.startQuiz": "Mulai Kuis",
      "kanaView.quizTitle": "Kuis {kanaType}",
      "kanjiView.title": "Kanji JLPT N5",
      "kanjiView.startQuiz": "Mulai Kuis",
      "kanjiView.quizTitle": "Kuis Kanji",
      "flashcard.meaning": "Arti",
      "flashcard.onyomi": "On'yomi",
      "flashcard.kunyomi": "Kun'yomi",
      "flashcard.none": "Tidak ada",
      "wordBuilder.title": "Penyusun Kata",
      "wordBuilder.comingSoon": "Fitur ini akan segera hadir! Anda akan dapat membuat kata-kata menggunakan Hiragana, Katakana, dan Kanji yang telah Anda pelajari.",
      "sentencePractice.title": "Latihan Kalimat",
      "sentencePractice.comingSoon": "Segera hadir! Berlatih membaca dan memahami kalimat bahasa Jepang, dari yang sederhana hingga kompleks, untuk membangun keterampilan pemahaman Anda.",
      "quiz.complete.title": "Kuis Selesai!",
      "quiz.complete.score": "Skor Anda {correct} dari {total}!",
      "quiz.complete.finish": "Selesai",
      "quiz.noQuestions": "Tidak ada pertanyaan yang tersedia",
      "quiz.close": "Tutup",
      "quiz.prompt.chooseMeaning": "Pilih arti yang benar.",
      "quiz.prompt.chooseReading": "Pilih bacaan {reading} yang benar.",
      "quiz.prompt.chooseRomaji": "Pilih romaji yang benar.",
      "quiz.prompt.chooseKana": "Pilih kana yang benar.",
      "quiz.next": "Berikutnya",
      "quiz.seeResults": "Lihat Hasil",
      "footer.message": "Nihongo Master - Perjalanan Anda menuju kelancaran dimulai di sini."
    }
};

type Language = keyof typeof translations;

interface LocalizationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('nihongoMasterLanguage') as Language;
        if (savedLang && translations[savedLang]) {
            setLanguage(savedLang);
        }
    }, []);

    const setLanguageAndSave = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('nihongoMasterLanguage', lang);
    };

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
        let translation = (translations[language] as any)[key] || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
        }

        return translation;
    }, [language]);

    // Fix: Replaced JSX with React.createElement because .ts files cannot contain JSX, which was causing parsing errors.
    return React.createElement(LocalizationContext.Provider, { value: { language, setLanguage: setLanguageAndSave, t } }, children);
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
