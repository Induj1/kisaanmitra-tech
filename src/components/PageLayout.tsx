
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  
  const toggleContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    document.documentElement.classList.toggle('high-contrast', newValue);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleContrast={toggleContrast}
        isHighContrast={isHighContrast}
        language={language}
        setLanguage={setLanguage}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
