import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'icon';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '', variant = 'button' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  if (variant === 'icon') {
      return (
        <button 
            onClick={toggleLanguage}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${className}`}
            title={i18n.language === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
        >
            <Globe className="w-5 h-5 text-gray-300 hover:text-white" />
            <span className="sr-only">{i18n.language === 'en' ? 'VI' : 'EN'}</span>
        </button>
      )
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm text-gray-300 hover:text-white ${className}`}
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language === 'en' ? 'English' : 'Tiếng Việt'}</span>
    </button>
  );
};

export default LanguageSwitcher;
