
import { WellnessChallenge, Role, User } from './types';

export const MOCK_CHALLENGES: WellnessChallenge[] = [
  {
    id: 'ch-1',
    challenge_name: 'Mindful Mornings',
    challenge_slug: 'mindful-mornings',
    challenge_type: 'mindfulness',
    duration_days: 14,
    description: 'Help students start their day with focus and calm through short 5-minute breathing exercises.',
    short_description: 'Daily focus exercises for class',
    goal: 'Complete 14 days of morning mindfulness',
    benefits: ['Improved concentration', 'Better emotional control', 'Reduced test anxiety'],
    difficulty_level: 'beginner',
    estimated_time_per_day: 5,
    points_per_day: 10,
    points_per_completion: 100,
    badge_name: 'Zen Student',
    badge_description: 'Mastered the morning calm',
    featured: true,
    daily_prompts: {
      '1': { title: 'Box Breathing', prompt: 'Inhale for 4, hold for 4, exhale for 4, hold for 4.', duration_minutes: 5 }
    }
  },
  {
    id: 'ch-2',
    challenge_name: 'Digital Balance',
    challenge_slug: 'digital-balance',
    challenge_type: 'focus',
    duration_days: 7,
    description: 'Encourage healthy screen time habits and better sleep hygiene for students.',
    short_description: 'Healthy tech habits',
    goal: 'Limit leisure screen time to 1 hour daily',
    benefits: ['Better sleep', 'Higher social engagement', 'Improved eye health'],
    difficulty_level: 'intermediate',
    estimated_time_per_day: 15,
    points_per_day: 20,
    points_per_completion: 150,
    badge_name: 'Tech Master',
    badge_description: 'Balanced digital life',
    featured: true,
    daily_prompts: {
      '1': { title: 'Outdoor Play', prompt: 'Spend 30 minutes outside without a device.', duration_minutes: 30 }
    }
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Dr. Sarah Wilson',
    email: 'principal@st-xavier.edu',
    role: Role.SCHOOL_ADMIN,
    institution_id: 'inst-1'
  }
];

export const ANIMAL_NAMES = [
  'Eagle', 'Tiger', 'Lion', 'Panther', 'Wolf', 'Falcon', 'Dragon', 'Phoenix', 'Hawk', 'Bear'
];
