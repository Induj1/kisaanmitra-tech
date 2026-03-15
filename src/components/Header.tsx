
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  toggleContrast?: () => void;
  isHighContrast?: boolean;
  language?: 'english' | 'hindi' | 'kannada';
  setLanguage?: React.Dispatch<React.SetStateAction<'english' | 'hindi' | 'kannada'>>;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleContrast, 
  isHighContrast,
  language,
  setLanguage
}) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative">
      <Navigation />
      
      {/* Accessibility Controls */}
      {toggleContrast && (
        <div className="container mx-auto px-4 flex justify-end items-center py-2 bg-gray-50 dark:bg-gray-800 gap-3">
          {/* Language Selector */}
          <LanguageSelector />
          
          {/* Contrast Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleContrast}
            className="flex items-center"
          >
            {isHighContrast ? (
              <>
                <Sun className="h-4 w-4 mr-1" />
                <span className="text-xs">Normal Contrast</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-1" />
                <span className="text-xs">High Contrast</span>
              </>
            )}
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
