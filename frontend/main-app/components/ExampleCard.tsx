/**
 * Example: Professional Component with Proper Theme Support
 * 
 * This demonstrates the correct way to add dark mode support:
 * 
 * 1. Light mode: Default classes
 * 2. Dark mode: Use dark: prefix
 * 3. Never hardcode colors - always use semantic Tailwind colors
 * 4. Keep spacing and layout the same - only change colors/backgrounds
 * 
 * Pattern:
 * - bg-white dark:bg-gray-900
 * - text-black dark:text-white
 * - border-gray-200 dark:border-gray-700
 * - shadow-md dark:shadow-none (or dark:shadow-xl)
 */

import React from 'react';

interface ExampleCardProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        /* Container - Light and dark backgrounds */
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        
        /* Spacing - Same in both modes */
        p-6 rounded-lg
        
        /* Border - Lighter in light mode, darker in dark mode */
        border border-gray-200 dark:border-gray-700
        
        /* Shadow - Visible in light mode, minimal in dark mode */
        shadow-md dark:shadow-none
        
        /* Interactive states */
        hover:shadow-lg dark:hover:shadow-lg
        hover:scale-105 dark:hover:scale-105
        transition-all duration-200
        
        /* Optional: cursor for interactivity */
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Icon Container */}
      <div
        className={`
          w-12 h-12 rounded-lg
          bg-blue-100 dark:bg-blue-900
          flex items-center justify-center
          text-2xl mb-4
          transition-colors duration-200
        `}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`
          text-lg font-bold
          text-gray-900 dark:text-white
          mb-2
        `}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`
          text-sm
          text-gray-600 dark:text-gray-400
          leading-relaxed
        `}
      >
        {description}
      </p>

      {/* Footer Link/Action - if needed */}
      <div
        className={`
          mt-4 pt-4
          border-t border-gray-200 dark:border-gray-700
          flex items-center
          text-blue-600 dark:text-blue-400
          font-medium text-sm
          group/link
        `}
      >
        Learn more
        <span
          className={`
            ml-2 transition-transform
            group-hover/link:translate-x-1
          `}
        >
          →
        </span>
      </div>
    </div>
  );
};

/**
 * Grid Example - Shows layout consistency across themes
 */
export const ExampleCardGrid: React.FC = () => {
  const cards = [
    {
      icon: '💚',
      title: 'Health',
      description: 'Monitor your wellness journey with daily check-ins',
    },
    {
      icon: '🎯',
      title: 'Focus',
      description: 'Stay on track with personalized health goals',
    },
    {
      icon: '🧘',
      title: 'Mindfulness',
      description: 'Practice meditation and breathing exercises',
    },
  ];

  return (
    <div
      className={`
        /* Container background - light and dark */
        bg-gray-50 dark:bg-gray-950
        
        /* Padding - same in both modes */
        p-8 rounded-xl
        
        /* Layout - unchanged */
        space-y-6
      `}
    >
      {/* Section Heading */}
      <div>
        <h2
          className={`
            text-2xl font-bold
            text-gray-900 dark:text-white
            mb-2
          `}
        >
          Example Features
        </h2>
        <p
          className={`
            text-gray-600 dark:text-gray-400
            text-sm
          `}
        >
          All components automatically adapt to light and dark modes
        </p>
      </div>

      {/* Card Grid */}
      <div
        className={`
          /* Grid layout - unchanged */
          grid grid-cols-1 md:grid-cols-3 gap-6
        `}
      >
        {cards.map((card, idx) => (
          <ExampleCard
            key={idx}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ExampleCard;
