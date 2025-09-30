

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const translations = {
  en: {
    'header.dashboard': 'Dashboard',
    'header.level': 'Level',
    'header.characters': 'chars learned',
    'header.logout': 'Logout',
    'login.title': 'Welcome to Nihongo Master',
    'login.subtitle': 'Sign in to save your progress and join the leaderboard.',
    'login.googleButton': 'Sign in with Google',
    'dashboard.welcome': 'Welcome back, {name}!',
    'dashboard.level': 'Level',
    'dashboard.xp': 'XP',
    'dashboard.progress': 'Progress to next level',
    'dashboard.achievements': 'Achievements',
    'dashboard.modules': 'Learning Modules',
    'dashboard.module.learnHiragana.title': 'Learn Hiragana',
    'dashboard.module.learnHiragana.description': 'Master the basic Japanese phonetic script.',
    'dashboard.module.learnKatakana.title': 'Learn Katakana',
    'dashboard.module.learnKatakana.description': 'Learn the script used for foreign words.',
    'dashboard.module.learnKanji.title': 'Learn Kanji',
    'dashboard.module.learnKanji.description': 'Start learning the essential characters.',
    'dashboard.module.buildWords.title': 'Word Builder',
    'dashboard.module.buildWords.description': 'Combine kana and kanji to form words.',
    'dashboard.module.practiceSentences.title': 'Sentence Practice',
    'dashboard.module.practiceSentences.description': 'Construct and understand basic sentences.',
    'dashboard.locked': 'Locked',
    'dashboard.stats.level': 'Level',
    'dashboard.stats.xp': 'Experience',
    'dashboard.stats.streak': 'Daily Streak',
    'dashboard.stats.characters': 'Characters Learned',
    'dashboard.progress.toNextLevel': 'Progress to next level',
    'dashboard.achievements.title': 'My Achievements',
    'dashboard.achievements.none': "You haven't earned any achievements yet. Keep learning!",
    'dashboard.unlocks.hint.words': 'Unlock by mastering all Hiragana, all Katakana, and 20% of Kanji.',
    'dashboard.unlocks.hint.sentences': 'Unlock by mastering all Hiragana, all Katakana, and 50% of Kanji.',
    'kanaView.startQuiz': 'Start Quiz',
    'kanaView.quizTitle': '{kanaType} Quiz',
    'flashcard.meaning': 'Meaning',
    'flashcard.onyomi': "On'yomi (Chinese Reading)",
    'flashcard.kunyomi': "Kun'yomi (Japanese Reading)",
    'flashcard.none': 'None',
    'kanjiView.title': 'Kanji Study',
    'kanjiView.startQuiz': 'Start Quiz',
    'kanjiView.quizTitle': 'Kanji Quiz',
    'wordBuilder.title': 'Word Builder',
    'wordBuilder.comingSoon': "This feature is coming soon! Expand your vocabulary by combining characters you've learned.",
    'sentencePractice.title': 'Sentence Practice',
    'sentencePractice.comingSoon': 'This feature is coming soon! Learn grammar and construct sentences to improve your fluency.',
    'quiz.complete.title': 'Quiz Complete!',
    'quiz.complete.score': 'You scored {correct} out of {total}.',
    'quiz.complete.finish': 'Finish',
    'quiz.noQuestions': 'No questions available.',
    'quiz.close': 'Close',
    'quiz.prompt.chooseMeaning': 'Choose the correct meaning.',
    'quiz.prompt.chooseReading': 'Choose the correct {reading} reading.',
    'quiz.prompt.chooseRomaji': 'Choose the correct romaji.',
    'quiz.prompt.chooseKana': 'Choose the correct kana.',
    'quiz.next': 'Next',
    'quiz.seeResults': 'See Results',
    'onboarding.step1.title': 'Welcome to Nihongo Master!',
    'onboarding.step1.text': 'Start your journey to learn Japanese, from basic characters to complex sentences.',
    'onboarding.step2.title': 'Learn at Your Own Pace',
    'onboarding.step2.text': 'Master hiragana, katakana, and kanji with interactive lessons and quizzes.',
    'onboarding.step3.title': 'Track Your Progress',
    'onboarding.step3.text': 'Our SRS system helps you remember what you learn. Gain XP, level up, and earn achievements!',
    'onboarding.step4.title': 'Ready to Begin?',
    'onboarding.step4.text': "Let's start your Japanese learning adventure!",
    'onboarding.finish': "Let's Go!",
    'onboarding.next': 'Next',
    'achievements.first_steps_h.name': 'Hiragana First Steps',
    'achievements.first_steps_h.description': 'Learn your first 10 hiragana.',
    'achievements.first_steps_k.name': 'Katakana First Steps',
    'achievements.first_steps_k.description': 'Learn your first 10 katakana.',
    'achievements.kanji_beginner.name': 'Kanji Beginner',
    'achievements.kanji_beginner.description': 'Learn your first 10 kanji.',
    'achievements.level_5.name': 'Level 5 Reached',
    'achievements.level_5.description': 'Reach level 5.',
    'achievements.quick_learner.name': 'Quick Learner',
    'achievements.quick_learner.description': 'Earn 100 XP in a single day.',
    'achievements.consistent.name': 'Consistent Learner',
    'achievements.consistent.description': 'Maintain a 3-day streak.',
    'achievements.hiragana_master.name': 'Hiragana Master',
    'achievements.hiragana_master.description': 'Learn all basic hiragana characters.',
    'dashboard.settings.title': 'Settings',
    'dashboard.settings.reset.title': 'Reset Application Data',
    'dashboard.settings.reset.button': 'Reset Progress',
    'dashboard.settings.reset.description': 'This will delete all your learning data, including XP, levels, and achievements. This action is irreversible.',
    'resetModal.title': 'Are you absolutely sure?',
    'resetModal.warning': 'This will permanently delete all your progress. This action cannot be undone.',
    'resetModal.cancel': 'Cancel',
    'resetModal.confirm': 'Yes, delete my data',
    'leaderboard.title': 'Leaderboard',
    'leaderboard.rank': 'Rank',
    'leaderboard.player': 'Player',
    'leaderboard.level': 'Level',
    'leaderboard.xp': 'XP',
    'leaderboard.empty': 'Be the first to get on the leaderboard!',
    'leaderboard.loading': 'Loading Leaderboard...',
  },
  id: {
    'header.dashboard': 'Dasbor',
    'header.level': 'Level',
    'header.characters': 'karakter dipelajari',
    'header.logout': 'Keluar',
    'login.title': 'Selamat Datang di Nihongo Master',
    'login.subtitle': 'Masuk untuk menyimpan progres dan bergabung di papan peringkat.',
    'login.googleButton': 'Masuk dengan Google',
    'dashboard.welcome': 'Selamat datang kembali, {name}!',
    'dashboard.level': 'Level',
    'dashboard.xp': 'XP',
    'dashboard.progress': 'Progres ke level berikutnya',
    'dashboard.achievements': 'Pencapaian',
    'dashboard.modules': 'Modul Pembelajaran',
    'dashboard.module.learnHiragana.title': 'Belajar Hiragana',
    'dashboard.module.learnHiragana.description': 'Kuasai aksara fonetik dasar Jepang.',
    'dashboard.module.learnKatakana.title': 'Belajar Katakana',
    'dashboard.module.learnKatakana.description': 'Pelajari aksara untuk kata-kata asing.',
    'dashboard.module.learnKanji.title': 'Belajar Kanji',
    'dashboard.module.learnKanji.description': 'Mulai pelajari karakter-karakter penting.',
    'dashboard.module.buildWords.title': 'Penyusun Kata',
    'dashboard.module.buildWords.description': 'Gabungkan kana dan kanji untuk membentuk kata.',
    'dashboard.module.practiceSentences.title': 'Latihan Kalimat',
    'dashboard.module.practiceSentences.description': 'Buat dan pahami kalimat-kalimat dasar.',
    'dashboard.locked': 'Terkunci',
    'dashboard.stats.level': 'Level',
    'dashboard.stats.xp': 'Pengalaman',
    'dashboard.stats.streak': 'Rentetan Harian',
    'dashboard.stats.characters': 'Karakter Dipelajari',
    'dashboard.progress.toNextLevel': 'Progres ke level berikutnya',
    'dashboard.achievements.title': 'Pencapaian Saya',
    'dashboard.achievements.none': 'Anda belum mendapatkan pencapaian apapun. Teruslah belajar!',
    'dashboard.unlocks.hint.words': 'Buka dengan menguasai semua Hiragana, semua Katakana, dan 20% Kanji.',
    'dashboard.unlocks.hint.sentences': 'Buka dengan menguasai semua Hiragana, semua Katakana, dan 50% Kanji.',
    'kanaView.startQuiz': 'Mulai Kuis',
    'kanaView.quizTitle': 'Kuis {kanaType}',
    'flashcard.meaning': 'Arti',
    'flashcard.onyomi': "On'yomi (Cara Baca Cina)",
    'flashcard.kunyomi': "Kun'yomi (Cara Baca Jepang)",
    'flashcard.none': 'Tidak ada',
    'kanjiView.title': 'Studi Kanji',
    'kanjiView.startQuiz': 'Mulai Kuis',
    'kanjiView.quizTitle': 'Kuis Kanji',
    'wordBuilder.title': 'Penyusun Kata',
    'wordBuilder.comingSoon': 'Fitur ini akan segera hadir! Perluas kosakata Anda dengan menggabungkan karakter yang telah Anda pelajari.',
    'sentencePractice.title': 'Latihan Kalimat',
    'sentencePractice.comingSoon': 'Fitur ini akan segera hadir! Pelajari tata bahasa dan buat kalimat untuk meningkatkan kelancaran Anda.',
    'quiz.complete.title': 'Kuis Selesai!',
    'quiz.complete.score': 'Skor Anda {correct} dari {total}.',
    'quiz.complete.finish': 'Selesai',
    'quiz.noQuestions': 'Tidak ada pertanyaan.',
    'quiz.close': 'Tutup',
    'quiz.prompt.chooseMeaning': 'Pilih arti yang benar.',
    'quiz.prompt.chooseReading': 'Pilih cara baca {reading} yang benar.',
    'quiz.prompt.chooseRomaji': 'Pilih romaji yang benar.',
    'quiz.prompt.chooseKana': 'Pilih kana yang benar.',
    'quiz.next': 'Berikutnya',
    'quiz.seeResults': 'Lihat Hasil',
    'onboarding.step1.title': 'Selamat Datang di Nihongo Master!',
    'onboarding.step1.text': 'Mulailah perjalanan Anda belajar bahasa Jepang, dari karakter dasar hingga kalimat kompleks.',
    'onboarding.step2.title': 'Belajar Sesuai Kecepatan Anda',
    'onboarding.step2.text': 'Kuasai hiragana, katakana, dan kanji dengan pelajaran dan kuis interaktif.',
    'onboarding.step3.title': 'Lacak Kemajuan Anda',
    'onboarding.step3.text': 'Sistem SRS kami membantu Anda mengingat apa yang Anda pelajari. Dapatkan XP, naik level, dan raih prestasi!',
    'onboarding.step4.title': 'Siap untuk Memulai?',
    'onboarding.step4.text': 'Mari kita mulai petualangan belajar bahasa Jepang Anda!',
    'onboarding.finish': 'Ayo Mulai!',
    'onboarding.next': 'Lanjut',
    'achievements.first_steps_h.name': 'Langkah Pertama Hiragana',
    'achievements.first_steps_h.description': 'Pelajari 10 hiragana pertamamu.',
    'achievements.first_steps_k.name': 'Langkah Pertama Katakana',
    'achievements.first_steps_k.description': 'Pelajari 10 katakana pertamamu.',
    'achievements.kanji_beginner.name': 'Pemula Kanji',
    'achievements.kanji_beginner.description': 'Pelajari 10 kanji pertamamu.',
    'achievements.level_5.name': 'Mencapai Level 5',
    'achievements.level_5.description': 'Capai level 5.',
    'achievements.quick_learner.name': 'Pelajar Cepat',
    'achievements.quick_learner.description': 'Dapatkan 100 XP dalam satu hari.',
    'achievements.consistent.name': 'Pelajar Konsisten',
    'achievements.consistent.description': 'Pertahankan rentetan 3 hari.',
    'achievements.hiragana_master.name': 'Master Hiragana',
    'achievements.hiragana_master.description': 'Pelajari semua karakter dasar hiragana.',
    'dashboard.settings.title': 'Pengaturan',
    'dashboard.settings.reset.title': 'Atur Ulang Data Aplikasi',
    'dashboard.settings.reset.button': 'Atur Ulang Progres',
    'dashboard.settings.reset.description': 'Ini akan menghapus semua data belajar Anda, termasuk XP, level, dan pencapaian. Tindakan ini tidak dapat diurungkan.',
    'resetModal.title': 'Apakah Anda benar-benar yakin?',
    'resetModal.warning': 'Ini akan menghapus semua kemajuan Anda secara permanen. Tindakan ini tidak dapat dibatalkan.',
    'resetModal.cancel': 'Batal',
    'resetModal.confirm': 'Ya, hapus data saya',
    'leaderboard.title': 'Papan Peringkat',
    'leaderboard.rank': 'Pkt',
    'leaderboard.player': 'Pemain',
    'leaderboard.level': 'Level',
    'leaderboard.xp': 'XP',
    'leaderboard.empty': 'Jadilah yang pertama masuk papan peringkat!',
    'leaderboard.loading': 'Memuat Papan Peringkat...',
  }
};


export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

interface LocalizationContextType {
  language: Language;
  changeLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;
  isInitialized: boolean;
  showLanguageSelection: boolean;
  supportedLanguages: Language[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('nihongoMasterLanguage') as Language;
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      } else {
        setShowLanguageSelection(true);
      }
    } catch (error) {
      console.error("Failed to load language from localStorage", error);
      setShowLanguageSelection(true);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    setShowLanguageSelection(false);
    try {
      localStorage.setItem('nihongoMasterLanguage', lang);
    } catch (error) {
      console.error("Failed to save language to localStorage", error);
    }
  }, []);

  const t = useCallback((key: TranslationKey, replacements?: { [key: string]: string | number }): string => {
    const langTranslations = translations[language] || translations.en;
    let translation = langTranslations[key as keyof typeof langTranslations] || translations.en[key as keyof typeof translations.en] || String(key);
    
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            const value = replacements[rKey];
            translation = translation.replace(`{${rKey}}`, String(value));
        });
    }
    return translation;
  }, [language]);
  
  const supportedLanguages = Object.keys(translations) as Language[];

  return React.createElement(LocalizationContext.Provider, { value: { language, changeLanguage, t, isInitialized, showLanguageSelection, supportedLanguages } }, children);
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};