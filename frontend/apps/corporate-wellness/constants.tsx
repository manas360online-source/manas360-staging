
import React from 'react';
import { WellnessChallenge, Role, User } from './types';

export const MOCK_CHALLENGES: WellnessChallenge[] = [
  {
    id: 'ch-1',
    challenge_name: '30-Day Mindfulness Challenge',
    challenge_slug: '30-day-mindfulness',
    challenge_type: 'mindfulness',
    duration_days: 30,
    description: 'Build a daily meditation practice over 30 days to reduce stress and improve focus.',
    short_description: 'Daily 5-minute meditation practice',
    goal: 'Complete 30 consecutive days of mindfulness meditation',
    benefits: ['Reduced stress', 'Improved focus', 'Better emotional regulation'],
    difficulty_level: 'beginner',
    estimated_time_per_day: 5,
    points_per_day: 5,
    points_per_completion: 50,
    badge_name: 'Mindfulness Master',
    badge_description: 'Completed 30 days of mindfulness',
    featured: true,
    daily_prompts: {
      '1': { title: 'Breath Awareness', prompt: 'Focus on your natural breath for 5 minutes.', duration_minutes: 5 },
      '2': { title: 'Body Scan', prompt: 'Notice sensations in each part of your body.', duration_minutes: 5 }
    }
  },
  {
    id: 'ch-2',
    challenge_name: '8-Week Sleep Optimization',
    challenge_slug: '8-week-sleep',
    challenge_type: 'sleep',
    duration_days: 56,
    description: 'Improve sleep hygiene and quality through science-based evening routines.',
    short_description: 'Better sleep in 8 weeks',
    goal: 'Maintain consistent 7-8 hours of sleep for 8 weeks',
    benefits: ['Higher energy', 'Better mood', 'Enhanced cognitive function'],
    difficulty_level: 'intermediate',
    estimated_time_per_day: 10,
    points_per_day: 10,
    points_per_completion: 100,
    badge_name: 'Sleep Champion',
    badge_description: 'Mastered sleep hygiene',
    featured: true,
    daily_prompts: {
      '1': { title: 'Digital Detox', prompt: 'No screens 30 minutes before bed.', duration_minutes: 10 }
    }
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Priya Rao',
    email: 'priya.rao@ibm.com',
    role: Role.HR_ADMIN,
    department: 'HR',
    entity_id: 'ent-1'
  },
  {
    id: 'u-2',
    name: 'Ankit Sharma',
    email: 'ankit.s@ibm.com',
    role: Role.MANAGER,
    department: 'Engineering',
    entity_id: 'ent-1'
  },
  {
    id: 'u-3',
    name: 'Sneha Gupta',
    email: 'sneha.g@ibm.com',
    role: Role.EMPLOYEE,
    department: 'Engineering',
    entity_id: 'ent-1'
  }
];

export const ANIMAL_NAMES = [
  'Eagle', 'Tiger', 'Lion', 'Panther', 'Wolf', 'Falcon', 'Dragon', 'Phoenix', 'Hawk', 'Bear'
];
