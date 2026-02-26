
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' }
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      { replace: true }
    );
  };

  const getPillClass = (code: string) => {
    const isSelected = i18n.language === code;
    return `
      cursor-pointer
      px-4 py-1.5
      rounded-full
      text-sm font-bold
      transition-all duration-300
      border
      flex items-center justify-center
      whitespace-nowrap
      ${isSelected
        ? 'bg-[#0E5F6F] text-white border-[#0E5F6F] shadow-md'
        : 'bg-white text-[#334155] border-slate-200 hover:border-[#0E5F6F] hover:text-[#0E5F6F] shadow-sm'
      }
    `;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={getPillClass(lang.code)}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
