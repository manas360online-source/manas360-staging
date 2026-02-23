import { Template, Patient, SessionData } from './types';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    title: 'Cognitive Restructuring',
    description: 'A structured approach to identify, challenge, and modify negative thought patterns.',
    type: 'cognitive_restructuring',
    tags: ['CBT', 'Anxiety', 'Depression', 'Thoughts'],
    duration: '45-60 min',
    difficulty: 'Moderate',
    isSystem: true
  },
  {
    id: 't2',
    title: 'Behavioral Activation',
    description: 'Break the cycle of depression by scheduling meaningful and enjoyable activities.',
    type: 'behavioral_activation',
    tags: ['Depression', 'Activity', 'Mood'],
    duration: '30-45 min',
    difficulty: 'Low',
    isSystem: true
  },
  {
    id: 't3',
    title: 'Exposure Therapy Planning',
    description: 'Create a fear hierarchy and plan gradual exposure exercises.',
    type: 'exposure_therapy',
    tags: ['Anxiety', 'Phobia', 'Fear'],
    duration: '45-60 min',
    difficulty: 'High',
    isSystem: true
  },
  {
    id: 't4',
    title: 'Anxiety Management Toolkit',
    description: 'Immediate tools for grounding and relaxation including 4-7-8 breathing.',
    type: 'anxiety_management',
    tags: ['Anxiety', 'Panic', 'Relaxation'],
    duration: '15-30 min',
    difficulty: 'Low',
    isSystem: true
  },
  {
    id: 't5',
    title: 'Depression Assessment (PHQ-9)',
    description: 'Standard screening tool to monitor severity of depressive symptoms.',
    type: 'depression_assessment',
    tags: ['Assessment', 'Depression', 'Screening'],
    duration: '5-10 min',
    difficulty: 'Low',
    isSystem: true
  }
];

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: 'p1', 
    name: 'Shivamani', 
    age: 34, 
    email: 'shivamani@example.com', 
    phone: '555-0123', 
    diagnosis: 'Generalized Anxiety Disorder', 
    lastSession: '2023-10-24', 
    nextSession: '2023-10-31', 
    status: 'Active',
    notes: 'Patient reports increased anxiety during work meetings. Focusing on breathing techniques and cognitive restructuring to address performance anxiety.',
    notesLastModified: '2023-10-24T14:30:00Z'
  },
  { 
    id: 'p2', 
    name: 'Harini', 
    age: 28, 
    email: 'harini@example.com', 
    phone: '555-0124', 
    diagnosis: 'Major Depressive Disorder', 
    lastSession: '2023-10-22', 
    nextSession: '2023-10-29', 
    status: 'Active',
    notes: 'Showing signs of improvement in energy levels. Behavioral activation plan seems effective. Recommended continuing daily walks.',
    notesLastModified: '2023-10-22T09:15:00Z'
  },
  { 
    id: 'p3', 
    name: 'Sankeerth', 
    age: 42, 
    email: 'sankeerth@example.com', 
    phone: '555-0125', 
    diagnosis: 'Social Anxiety', 
    lastSession: '2023-10-15', 
    nextSession: '2023-11-01', 
    status: 'Paused',
    notes: 'Sessions paused due to patient traveling. Provided list of grounding exercises to practice independently.',
    notesLastModified: '2023-10-15T16:45:00Z'
  },
  { 
    id: 'p4', 
    name: 'Mahapatil', 
    age: 30, 
    email: 'mahapatil@example.com', 
    phone: '555-0126', 
    diagnosis: 'Obsessive-Compulsive Disorder', 
    lastSession: '2023-10-20', 
    nextSession: '2023-10-27', 
    status: 'Active',
    notes: 'Working on exposure response prevention. Good progress on initial hierarchy items.',
    notesLastModified: '2023-10-20T10:00:00Z'
  },
];

export const MOCK_SESSIONS: SessionData[] = [
  { id: 's1', templateId: 't5', patientName: 'Shivamani', date: '2023-10-24', data: { score: 12, severity: 'Moderate' }, status: 'completed' },
  { id: 's2', templateId: 't1', patientName: 'Harini', date: '2023-10-22', data: { summary: 'Identified core belief about failure' }, status: 'completed' },
  { id: 's3', templateId: 't2', patientName: 'Shivamani', date: '2023-10-17', data: { activityLevel: 2 }, status: 'completed' },
  { id: 's4', templateId: 't4', patientName: 'Sankeerth', date: '2023-10-15', data: { completed: true }, status: 'completed' },
];