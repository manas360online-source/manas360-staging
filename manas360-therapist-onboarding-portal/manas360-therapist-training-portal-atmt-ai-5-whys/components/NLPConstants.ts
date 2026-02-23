
import { NLPModule, ModuleLevel } from './NLPTypes';

export const NLP_MODULES: NLPModule[] = [
    {
        id: 1,
        code: 'ATMT_0.1',
        title: 'NLP Orientation',
        description: 'The definitive foundation for clinical empathy and professional NLP. Understand the core pillars of neuro-linguistic architecture and established ethical boundaries.',
        level: ModuleLevel.INTRODUCTION,
        price: 0,
        early_bird_price: 0,
        prerequisite_modules: [],
        unlocks_modules: [],
        passing_score: 80,
        display_order: 1,
        narration_url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
        quiz_questions: [
            {
                id: 'q1',
                question: 'What is the primary goal of the MindFlow Orientation?',
                options: ['Selling products', 'Establishing ethical clinical boundaries', 'Learning to code', 'Counting breathing cycles'],
                correctAnswer: 1
            },
            {
                id: 'q2',
                question: 'Which is a core pillar of professional NLP?',
                options: ['Rapport', 'Sensory Awareness', 'Outcome Thinking', 'All of the above'],
                correctAnswer: 3
            },
            {
                id: 'q3',
                question: 'Neuro-Linguistic Programming primarily focuses on the relationship between:',
                options: ['Diet and exercise', 'Neurological processes and language', 'Hardware and software', 'Reading and writing'],
                correctAnswer: 1
            }
        ]
    }
];

export const BUNDLES = [];
