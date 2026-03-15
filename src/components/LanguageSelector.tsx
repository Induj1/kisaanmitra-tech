
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिंदी' },
  { value: 'kannada', label: 'ಕನ್ನಡ' },
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, translate } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white dark:bg-gray-800">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {translate('language')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value as 'english' | 'hindi' | 'kannada')}
            className={`cursor-pointer ${language === lang.value ? 'bg-primary/10 font-medium' : ''}`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
