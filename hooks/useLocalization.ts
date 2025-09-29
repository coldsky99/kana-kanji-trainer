
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData } from '../types';

const translations = {
  en: {
    'header.dashboard': 'Dashboard',
    'header.level': 'Level',
    'header.characters': 'Characters',
    'dashboard.welcome': 'Welcome Back!',
    'dashboard.hiragana': 'Hiragana',
    'dashboard.katakana': 'Katakana',
    'dashboard.kanji': 'Kanji',
    'dashboard.achievements': 'Achievements',
    'dashboard.module.learnHiragana.title': 'Learn Hiragana',
    'dashboard.module.learnHiragana.description': 'Master the basic Japanese phonetic script.',
    'dashboard.module.learnKatakana.title': 'Learn Katakana',
    'dashboard.module.learnKatakana.description': 'Learn the script for foreign words.',
    'dashboard.module.learnKanji.title': 'Learn Kanji',
    'dashboard.module.learnKanji.description': 'Start learning the essential logographic characters.',
    'dashboard.module.wordBuilder.title': 'Word Builder',
    'dashboard.module.wordBuilder.description': 'Form words with the characters you\'ve learned.',
    'dashboard.module.sentencePractice.title': 'Sentence Practice',
    'dashboard.module.sentencePractice.description': 'Read and understand Japanese sentences.',
    'dashboard.weeklyXP': 'Weekly XP',
    'dashboard.unlockProgress': 'Unlock Progress',
    'achievements.title': 'Achievements',
    'achievements.first_steps_h.name': 'Hiragana First Steps',
    'achievements.first_steps_h.description': 'Learn your first 10 Hiragana characters.',
    'achievements.first_steps_k.name': 'Katakana First Steps',
    'achievements.first_steps_k.description': 'Learn your first 10 Katakana characters.',
    'achievements.kanji_beginner.name': 'Kanji Beginner',
    'achievements.kanji_beginner.description': 'Learn your first 10 Kanji.',
    'achievements.level_5.name': 'Level 5 Reached',
    'achievements.level_5.description': 'Achieve level 5.',
    'achievements.quick_learner.name': 'Quick Learner',
    'achievements.quick_learner.description': 'Earn 100 XP in a single day.',
    'achievements.consistent.name': 'Consistent Learner',
    'achievements.consistent.description': 'Study for 3 days in a row.',
    'achievements.hiragana_master.name': 'Hiragana Master',
    'achievements.hiragana_master.description': 'Learn all Hiragana characters.',
    'kanaView.startQuiz': 'Start Quiz',
    'kanaView.quizTitle': '{kanaType} Quiz',
    'kanjiView.title': 'JLPT N5 Kanji',
    'kanjiView.startQuiz': 'Start Quiz',
    'kanjiView.quizTitle': 'Kanji Quiz',
    'flashcard.meaning': 'Meaning',
    'flashcard.onyomi': 'On\'yomi',
    'flashcard.kunyomi': 'Kun\'yomi',
    'flashcard.none': 'None',
    'wordBuilder.title': 'Word Builder',
    'wordBuilder.comingSoon': 'This feature is coming soon! Keep mastering characters to unlock it.',
    'sentencePractice.title': 'Sentence Practice',
    'sentencePractice.comingSoon': 'This feature is coming soon! Keep mastering characters to unlock it.',
    'quiz.complete.title': 'Quiz Complete!',
    'quiz.complete.score': 'You scored {correct} out of {total}.',
    'quiz.complete.finish': 'Finish',
    'quiz.noQuestions': 'No questions available for this quiz yet.',
    'quiz.close': 'Close',
    'quiz.prompt.chooseMeaning': 'Choose the correct meaning',
    'quiz.prompt.chooseReading': 'Choose the {reading} reading',
    'quiz.prompt.chooseRomaji': 'Choose the correct Romaji',
    'quiz.prompt.chooseKana': 'Choose the correct Kana',
    'quiz.next': 'Next',
    'quiz.seeResults': 'See Results',
    'onboarding.step1.title': 'Welcome to Nihongo Master!',
    'onboarding.step1.text': 'Your journey to mastering Japanese starts here. Let\'s take a quick tour.',
    'onboarding.step2.title': 'Learning Modules',
    'onboarding.step2.text': 'Start with Hiragana, then move on to Katakana and Kanji. New sections will unlock as you progress.',
    'onboarding.step3.title': 'Track Your Progress',
    'onboarding.step3.text': 'The dashboard shows your stats, weekly XP, and achievements. Stay motivated by watching your skills grow!',
    'onboarding.step4.title': 'Ready to Start?',
    'onboarding.step4.text': 'We recommend starting with Hiragana. Click on the module to begin your first lesson. Good luck!',
    'onboarding.next': 'Next',
    'onboarding.finish': 'Let\'s Go!',
    'tooltips.wordsLocked': 'Complete 100% of Hiragana, 100% of Katakana, and 20% of Kanji to unlock.',
    'tooltips.sentencesLocked': 'Complete 100% of Hiragana, 100% of Katakana, and 50% of Kanji to unlock.',
  },
  id: {
    'header.dashboard': 'Dasbor',
    'header.level': 'Level',
    'header.characters': 'Karakter',
    'dashboard.welcome': 'Selamat Datang Kembali!',
    'dashboard.hiragana': 'Hiragana',
    'dashboard.katakana': 'Katakana',
    'dashboard.kanji': 'Kanji',
    'dashboard.achievements': 'Pencapaian',
    'dashboard.module.learnHiragana.title': 'Belajar Hiragana',
    'dashboard.module.learnHiragana.description': 'Kuasai aksara fonetik dasar Jepang.',
    'dashboard.module.learnKatakana.title': 'Belajar Katakana',
    'dashboard.module.learnKatakana.description': 'Pelajari aksara untuk kata-kata asing.',
    'dashboard.module.learnKanji.title': 'Belajar Kanji',
    'dashboard.module.learnKanji.description': 'Mulai pelajari karakter logografis yang penting.',
    'dashboard.module.wordBuilder.title': 'Penyusun Kata',
    'dashboard.module.wordBuilder.description': 'Bentuk kata dengan karakter yang telah Anda pelajari.',
    'dashboard.module.sentencePractice.title': 'Latihan Kalimat',
    'dashboard.module.sentencePractice.description': 'Baca dan pahami kalimat bahasa Jepang.',
    'dashboard.weeklyXP': 'XP Mingguan',
    'dashboard.unlockProgress': 'Progres Membuka',
    'achievements.title': 'Pencapaian',
    'achievements.first_steps_h.name': 'Langkah Pertama Hiragana',
    'achievements.first_steps_h.description': 'Pelajari 10 karakter Hiragana pertamamu.',
    'achievements.first_steps_k.name': 'Langkah Pertama Katakana',
    'achievements.first_steps_k.description': 'Pelajari 10 karakter Katakana pertamamu.',
    'achievements.kanji_beginner.name': 'Pemula Kanji',
    'achievements.kanji_beginner.description': 'Pelajari 10 Kanji pertamamu.',
    'achievements.level_5.name': 'Mencapai Level 5',
    'achievements.level_5.description': 'Capai level 5.',
    'achievements.quick_learner.name': 'Pelajar Cepat',
    'achievements.quick_learner.description': 'Dapatkan 100 XP dalam satu hari.',
    'achievements.consistent.name': 'Pelajar Konsisten',
    'achievements.consistent.description': 'Belajar selama 3 hari berturut-turut.',
    'achievements.hiragana_master.name': 'Master Hiragana',
    'achievements.hiragana_master.description': 'Pelajari semua karakter Hiragana.',
    'kanaView.startQuiz': 'Mulai Kuis',
    'kanaView.quizTitle': 'Kuis {kanaType}',
    'kanjiView.title': 'Kanji JLPT N5',
    'kanjiView.startQuiz': 'Mulai Kuis',
    'kanjiView.quizTitle': 'Kuis Kanji',
    'flashcard.meaning': 'Arti',
    'flashcard.onyomi': 'On\'yomi',
    'flashcard.kunyomi': 'Kun\'yomi',
    'flashcard.none': 'Tidak ada',
    'wordBuilder.title': 'Penyusun Kata',
    'wordBuilder.comingSoon': 'Fitur ini akan segera hadir! Terus kuasai karakter untuk membukanya.',
    'sentencePractice.title': 'Latihan Kalimat',
    'sentencePractice.comingSoon': 'Fitur ini akan segera hadir! Terus kuasai karakter untuk membukanya.',
    'quiz.complete.title': 'Kuis Selesai!',
    'quiz.complete.score': 'Skor Anda {correct} dari {total}.',
    'quiz.complete.finish': 'Selesai',
    'quiz.noQuestions': 'Belum ada pertanyaan untuk kuis ini.',
    'quiz.close': 'Tutup',
    'quiz.prompt.chooseMeaning': 'Pilih arti yang benar',
    'quiz.prompt.chooseReading': 'Pilih bacaan {reading}',
    'quiz.prompt.chooseRomaji': 'Pilih Romaji yang benar',
    'quiz.prompt.chooseKana': 'Pilih Kana yang benar',
    'quiz.next': 'Berikutnya',
    'quiz.seeResults': 'Lihat Hasil',
    'onboarding.step1.title': 'Selamat Datang di Nihongo Master!',
    'onboarding.step1.text': 'Perjalanan Anda menguasai bahasa Jepang dimulai di sini. Mari kita lihat tur singkatnya.',
    'onboarding.step2.title': 'Modul Pembelajaran',
    'onboarding.step2.text': 'Mulailah dengan Hiragana, lalu lanjutkan ke Katakana dan Kanji. Bagian baru akan terbuka seiring kemajuan Anda.',
    'onboarding.step3.title': 'Lacak Kemajuan Anda',
    'onboarding.step3.text': 'Dasbor menunjukkan statistik, XP mingguan, dan pencapaian Anda. Tetap termotivasi dengan melihat keterampilan Anda berkembang!',
    'onboarding.step4.title': 'Siap Memulai?',
    'onboarding.step4.text': 'Kami merekomendasikan untuk memulai dengan Hiragana. Klik modul untuk memulai pelajaran pertama Anda. Semoga berhasil!',
    'onboarding.next': 'Lanjut',
    'onboarding.finish': 'Ayo Mulai!',
    'tooltips.wordsLocked': 'Selesaikan 100% Hiragana, 100% Katakana, dan 20% Kanji untuk membuka.',
    'tooltips.sentencesLocked': 'Selesaikan 100% Hiragana, 100% Katakana, dan 50% Kanji untuk membuka.',
  },
};

type Language = 'en' | 'id';
// Fix: Export TranslationKey to be used in other components.
export type TranslationKey = keyof typeof translations.en;
const supportedLanguages: Language[] = ['en', 'id'];

interface LocalizationContextType {
  language: Language;
  t: (key: TranslationKey, replacements?: { [key: string]: string }) => string;
  changeLanguage: (language: Language) => void;
  showLanguageSelection: boolean;
  isInitialized: boolean;
  supportedLanguages: Language[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('nihongoMasterLanguage') as Language;
    if (savedLang && supportedLanguages.includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (supportedLanguages.includes(browserLang as Language)) {
        setLanguage(browserLang as Language);
      } else {
        setShowLanguageSelection(true);
      }
    }
    setIsInitialized(true);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('nihongoMasterLanguage', lang);
    if (showLanguageSelection) {
      setShowLanguageSelection(false);
    }
  };

  const t = useCallback((key: TranslationKey, replacements?: { [key: string]: string }) => {
    let translation = translations[language][key] || translations.en[key];
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{${rKey}}`, replacements[rKey]);
      });
    }
    return translation;
  }, [language]);

  const value = { language, t, changeLanguage, showLanguageSelection, isInitialized, supportedLanguages };

  return React.createElement(LocalizationContext.Provider, { value }, children);
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
