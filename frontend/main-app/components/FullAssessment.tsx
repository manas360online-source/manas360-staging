
import React from 'react';
import { SessionRunner } from './SessionRunner';
import { Session } from '../types';
import { useTranslation } from 'react-i18next';

export const FullAssessment: React.FC = () => {
  const { t } = useTranslation();

  // Localized Session Object
  const getFullAssessmentSession = (): Session => ({
    id: 'full_health_assessment',
    title: t('session_full_health_assessment_title'),
    description: t('session_full_health_assessment_desc'),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    questions: [
      {
        id: 'f_q1',
        text: t('q_f_q1_text'),
        type: 'multiple-choice',
        required: true,
        options: [
          { id: 'not_at_all', label: t('opt_not_at_all') },
          { id: 'several_days', label: t('opt_several_days') },
          { id: 'more_than_half', label: t('opt_more_than_half') },
          { id: 'nearly_every_day', label: t('opt_nearly_every_day') }
        ]
      },
      {
        id: 'f_q2',
        text: t('q_f_q2_text'),
        type: 'multiple-choice',
        required: true,
        options: [
          { id: 'not_at_all', label: t('opt_not_at_all') },
          { id: 'several_days', label: t('opt_several_days') },
          { id: 'more_than_half', label: t('opt_more_than_half') },
          { id: 'nearly_every_day', label: t('opt_nearly_every_day') }
        ]
      },
      {
        id: 'f_q3',
        text: t('q_f_q3_text'),
        type: 'multiple-choice',
        required: true,
        options: [
          { id: 'not_at_all', label: t('opt_not_at_all') },
          { id: 'several_days', label: t('opt_several_days') },
          { id: 'more_than_half', label: t('opt_more_than_half') },
          { id: 'nearly_every_day', label: t('opt_nearly_every_day') }
        ]
      },
      {
        id: 'f_q4',
        text: t('q_f_q4_text'),
        type: 'slider',
        min: 0,
        max: 10,
        minLabel: t('label_calm'),
        maxLabel: t('label_overwhelmed'),
        required: true
      },
      {
        id: 'f_q5',
        text: t('q_f_q5_text'),
        type: 'text',
        required: false
      }
    ]
  });

  const handleComplete = (answers: any) => {
    // Logic to process full assessment results
    console.log("Full Assessment Complete:", answers);
    // Navigate back to results or a specific "Full Report" page
    window.location.hash = '#/results'; 
    // In a real app, this would calculate scores and update global state
  };

  const handleExit = () => {
    window.location.hash = '#/results';
  };

  return (
    <SessionRunner 
      session={getFullAssessmentSession()} 
      onComplete={handleComplete} 
      onExit={handleExit} 
    />
  );
};
