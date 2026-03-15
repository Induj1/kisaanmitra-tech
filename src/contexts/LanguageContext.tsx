
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'english' | 'hindi' | 'kannada';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  english: {
    home: 'Home',
    features: 'Features',
    demo: 'Demo',
    government: 'Government Schemes',
    dashboard: 'Dashboard',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    welcome: 'Welcome to KisaanMitra',
    weather: 'Weather',
    marketplace: 'Marketplace',
    farmPlanner: 'Farm Planner',
    loans: 'Loans',
    settings: 'Settings',
    language: 'Language',
    personalizedAssistant: 'Your personalized farming assistant',
    checkForecasts: 'Check forecasts and alerts',
    planFarmActivities: 'Plan your farm activities',
    checkCropPrices: 'Check current crop prices',
    buyAndSellProducts: 'Buy and sell products',
    applyForLoans: 'Apply for agricultural loans',
    askExpert: 'Ask Expert',
    getAIAdvice: 'Get advice from AI assistant',
    cropCalendar: 'Crop Calendar',
    seasonalPlanting: 'Seasonal planting guide',
    managePreferences: 'Manage your preferences',
    learnMore: 'Learn More',
    viewUpdates: 'View Updates',
    tryDemo: 'Try Demo',
    askQuestions: 'Ask Questions',
    findSchemes: 'Find Schemes',
    pageNotFound: 'Page Not Found',
    pageNotFoundDescription: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
    userSince: 'KisaanMitra user since 2023',
    eligibility: 'Eligibility',
    benefits: 'Benefits',
    documentsReady: 'Keep all documents ready',
    apply: 'Apply',
  },
  hindi: {
    home: 'होम',
    features: 'फीचर्स',
    demo: 'डेमो',
    government: 'सरकारी योजनाएँ',
    dashboard: 'डैशबोर्ड',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    welcome: 'किसानमित्र में आपका स्वागत है',
    weather: 'मौसम',
    marketplace: 'बाज़ार',
    farmPlanner: 'खेत योजनाकार',
    loans: 'ऋण',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    personalizedAssistant: 'आपका व्यक्तिगत कृषि सहायक',
    checkForecasts: 'पूर्वानुमान और अलर्ट देखें',
    planFarmActivities: 'अपनी कृषि गतिविधियों की योजना बनाएं',
    checkCropPrices: 'वर्तमान फसल मूल्य देखें',
    buyAndSellProducts: 'उत्पादों को खरीदें और बेचें',
    applyForLoans: 'कृषि ऋण के लिए आवेदन करें',
    askExpert: 'विशेषज्ञ से पूछें',
    getAIAdvice: 'AI सहायक से सलाह प्राप्त करें',
    cropCalendar: 'फसल कैलेंडर',
    seasonalPlanting: 'मौसमी रोपण मार्गदर्शिका',
    managePreferences: 'अपनी प्राथमिकताओं का प्रबंधन करें',
    learnMore: 'अधिक जानें',
    viewUpdates: 'अपडेट देखें',
    tryDemo: 'डेमो देखें',
    askQuestions: 'प्रश्न पूछें',
    findSchemes: 'योजनाएँ देखें',
    pageNotFound: 'पेज नहीं मिला',
    pageNotFoundDescription: 'आप जिस पेज की तलाश कर रहे हैं वह हटा दिया गया है, उसका नाम बदल दिया गया है, या अस्थायी रूप से उपलब्ध नहीं है।',
    userSince: 'किसानमित्र उपयोगकर्ता 2023 से',
    eligibility: 'पात्रता',
    benefits: 'लाभ',
    documentsReady: 'सभी कागजात तैयार रखें',
    apply: 'आवेदन करें',
  },
  kannada: {
    home: 'ಮುಖಪುಟ',
    features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    demo: 'ಡೆಮೋ',
    government: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    signIn: 'ಸೈನ್ ಇನ್',
    signOut: 'ಸೈನ್ ಔಟ್',
    welcome: 'ಕಿಸಾನ್‌ಮಿತ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ',
    weather: 'ಹವಾಮಾನ',
    marketplace: 'ಮಾರುಕಟ್ಟೆ',
    farmPlanner: 'ಕೃಷಿ ಯೋಜನಾಕಾರ',
    loans: 'ಸಾಲಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    language: 'ಭಾಷೆ',
    personalizedAssistant: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕೃಷಿ ಸಹಾಯಕ',
    checkForecasts: 'ಮುನ್ಸೂಚನೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    planFarmActivities: 'ನಿಮ್ಮ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಯೋಜಿಸಿ',
    checkCropPrices: 'ಪ್ರಸ್ತುತ ಬೆಳೆ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    buyAndSellProducts: 'ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ ಮತ್ತು ಮಾರಾಟ ಮಾಡಿ',
    applyForLoans: 'ಕೃಷಿ ಸಾಲಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    askExpert: 'ತಜ್ಞರನ್ನು ಕೇಳಿ',
    getAIAdvice: 'AI ಸಹಾಯಕರಿಂದ ಸಲಹೆ ಪಡೆಯಿರಿ',
    cropCalendar: 'ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್',
    seasonalPlanting: 'ಋತುವಿನ ಬೇಸಾಯ ಮಾರ್ಗದರ್ಶಿ',
    managePreferences: 'ನಿಮ್ಮ ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    learnMore: 'ಹೆಚ್ಚು ತಿಳಿಯಿರಿ',
    viewUpdates: 'ಅಪ್ಡೇಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    tryDemo: 'ಡೆಮೋ ನೋಡಿ',
    askQuestions: 'ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ',
    findSchemes: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
    pageNotFound: 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ',
    pageNotFoundDescription: 'ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿರಬಹುದು, ಅದರ ಹೆಸರನ್ನು ಬದಲಾಯಿಸಲಾಗಿರಬಹುದು ಅಥವಾ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ.',
    userSince: 'ಕಿಸಾನ್‌ಮಿತ್ರ ಬಳಕೆದಾರ 2023 ರಿಂದ',
    eligibility: 'ಅರ್ಹತೆ',
    benefits: 'ಪ್ರಯೋಜನಗಳು',
    documentsReady: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ',
    apply: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
  translate: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get the saved language from localStorage
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'english'; // Default to English
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const translate = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = language === 'english' ? 'en' : language === 'hindi' ? 'hi' : 'kn';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
