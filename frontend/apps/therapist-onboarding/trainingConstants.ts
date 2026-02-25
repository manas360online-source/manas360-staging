import { Patient, QuizQuestion, VideoMeta } from './trainingTypes';

export const VIDEO_TUTORIALS: VideoMeta[] = [
    {
        id: 'v_start',
        title: 'Opening: The 5 Whys Introduction',
        duration: '0:30',
        description: 'Welcome to the AI Training for Therapists series.',
        thumbnailColor: 'bg-indigo-100',
        embedUrl: 'https://player.vimeo.com/video/1153459106'
    },
    {
        id: 'v_m1',
        title: 'Module 1: The Problem with Surface-Level Therapy',
        duration: '1:30',
        description: 'Understanding why treating symptoms fails to address core wounds.',
        thumbnailColor: 'bg-blue-100',
        embedUrl: 'https://player.vimeo.com/video/1154207098'
    },
    {
        id: 'v_m2',
        title: 'Module 2: What is the 5 Whys Technique',
        duration: '1:30',
        description: 'Moving from surface complaints to core healing through questioning.',
        thumbnailColor: 'bg-purple-100',
        embedUrl: 'https://player.vimeo.com/video/1154207372'
    },
    {
        id: 'v_m3',
        title: 'Module 3: Why This Works',
        duration: '1:15',
        description: 'The neurology and psychology behind deep self-knowledge.',
        thumbnailColor: 'bg-red-50',
        embedUrl: 'https://player.vimeo.com/video/1154207381'
    },
    {
        id: 'v_m4',
        title: 'Module 4: How to Apply the 5 Whys',
        duration: '1:45',
        description: 'A step-by-step guide to applying the technique in sessions.',
        thumbnailColor: 'bg-green-100',
        embedUrl: 'https://player.vimeo.com/video/1154207398'
    },
    {
        id: 'v_m5',
        title: 'Module 5: Common Mistakes to Avoid',
        duration: '1:15',
        description: 'Pitfalls that can cause the technique to fail.',
        thumbnailColor: 'bg-yellow-100',
        embedUrl: 'https://player.vimeo.com/video/1154207411'
    },
    {
        id: 'v_recap',
        title: 'Recap & Summary',
        duration: '0:30',
        description: 'Final thoughts and when to use this power tool.',
        thumbnailColor: 'bg-gray-100',
        embedUrl: 'https://player.vimeo.com/video/1154207425'
    },
];

export const DUMMY_PATIENTS: Patient[] = [
    {
        id: 'p1',
        name: 'Rahul V.',
        age: 34,
        diagnosis: 'Generalized Anxiety Disorder',
        lastSessionDate: '2023-10-25',
        lastSessionSummary: 'Patient reported increased anxiety due to work deadlines. Practiced deep breathing techniques. Sleep has been erratic.',
        riskLevel: 'Low',
    },
    {
        id: 'p2',
        name: 'Sarah K.',
        age: 28,
        diagnosis: 'Major Depressive Disorder',
        lastSessionDate: '2023-10-24',
        lastSessionSummary: 'Mood remains low. Discussed behavioral activation strategies. Patient completed 2/5 homework assignments.',
        riskLevel: 'Moderate',
    },
    {
        id: 'p3',
        name: 'Amit B.',
        age: 42,
        diagnosis: 'PTSD',
        lastSessionDate: '2023-10-20',
        lastSessionSummary: 'Flashbacks triggered by loud noises. Worked on grounding techniques using 5-4-3-2-1 method.',
        riskLevel: 'Moderate',
    },
    {
        id: 'p4',
        name: 'Priya M.',
        age: 19,
        diagnosis: 'Social Anxiety',
        lastSessionDate: '2023-10-26',
        lastSessionSummary: 'Attended a college social event for 15 minutes. Significant progress noted despite high distress.',
        riskLevel: 'Low',
    },
    {
        id: 'p5',
        name: 'Vikram S.',
        age: 55,
        diagnosis: 'Adjustment Disorder',
        lastSessionDate: '2023-10-22',
        lastSessionSummary: 'Discussing retirement transition. Feelings of loss of purpose. Identified 3 potential hobbies.',
        riskLevel: 'Low',
    },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        text: "What is the primary purpose of the 5 Whys technique in therapy?",
        options: [
            "To make patients feel uncomfortable",
            "To fill session time with questions",
            "To uncover root causes beneath surface symptoms",
            "To test patient intelligence",
            "To avoid addressing difficult emotions"
        ],
        correctAnswer: 2,
        correctFeedback: "Excellent! The 5 Whys is designed to move beyond surface symptoms and identify the underlying root causes that drive patient behavior and emotions.",
        incorrectFeedback: "Not quite. The 5 Whys is specifically designed to uncover root causes beneath surface symptoms. Review Section 2 of the module.",
        explanation: "The 5 Whys is specifically designed to uncover root causes beneath surface symptoms."
    },
    {
        id: 2,
        text: "In the sleep example from the module, what was the root cause of the patient's insomnia?",
        options: [
            "Too much caffeine",
            "A childhood promise to never feel powerless again",
            "Work stress",
            "A racing mind",
            "Anxiety disorder"
        ],
        correctAnswer: 1,
        correctFeedback: "Correct! The patient's insomnia traced back to childhood helplessness and a protective mechanism formed in response to trauma.",
        incorrectFeedback: "Not correct. The root cause was a childhood promise to never feel powerless again. The other options were symptoms along the way.",
        explanation: "The root cause was a childhood promise to never feel powerless again."
    },
    {
        id: 3,
        text: "Which of the following is a common mistake when using the 5 Whys?",
        options: [
            "Asking 'why' in a mechanical, robotic manner",
            "Building rapport before using the technique",
            "Slowing down when a patient becomes emotional",
            "Varying phrasing to keep it conversational",
            "Addressing the root cause after identifying it"
        ],
        correctAnswer: 0,
        correctFeedback: "Yes! Asking 'why' mechanically can make patients feel interrogated rather than supported.",
        incorrectFeedback: "Incorrect. The common mistake is asking 'why' mechanically. Review Section 5.",
        explanation: "Asking 'why' mechanically can make patients feel interrogated rather than supported."
    },
    {
        id: 4,
        text: "When should you NOT use the 5 Whys technique?",
        options: [
            "When a patient is stuck in repetitive patterns",
            "During a crisis when the patient is dysregulated",
            "When surface interventions haven't worked",
            "When the presenting problem isn't the real issue",
            "After building trust and safety"
        ],
        correctAnswer: 1,
        correctFeedback: "Correct! Safety and stabilization come first.",
        incorrectFeedback: "Not correct. The 5 Whys should NOT be used during crises. Review Section 6.",
        explanation: "Safety and stabilization come first; do not use during crises."
    },
    {
        id: 5,
        text: "What typically signals that you've reached the root cause during the 5 Whys process?",
        options: [
            "The patient starts laughing",
            "The patient gives a very long answer",
            "The room energy shifts and the patient has a moment of recognition",
            "You've asked exactly five 'why' questions",
            "The patient changes the subject"
        ],
        correctAnswer: 2,
        correctFeedback: "Excellent! A shift in energy and an 'aha' moment signal reaching the root.",
        incorrectFeedback: "Not quite. It's not about counting questions. Review Section 4.",
        explanation: "A shift in energy and an 'aha' moment signal reaching the root."
    }
];

export enum ModuleLevel {
    INTRODUCTION = 'Introduction',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced'
}

export interface NLPModule {
    id: number;
    code: string;
    title: string;
    description: string;
    level: ModuleLevel;
    price: number;
    early_bird_price: number;
    prerequisite_modules: string[];
    unlocks_modules: string[];
    passing_score: number;
    display_order: number;
    narration_url: string;
    quiz_questions: {
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
}


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
