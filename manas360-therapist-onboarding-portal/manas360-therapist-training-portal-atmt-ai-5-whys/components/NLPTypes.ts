
export enum ModuleLevel {
    INTRODUCTION = 'introduction',
    MANDATORY = 'mandatory',
    SPECIALIZATION = 'specialization',
    BUNDLE = 'bundle'
}

export enum EnrollmentStatus {
    ENROLLED = 'enrolled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    EXPIRED = 'expired'
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
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
    content_html?: string;
    narration_url?: string;
    ppt_url?: string;
    quiz_questions: QuizQuestion[];
}

export interface Certificate {
    id: string;
    moduleCode: string;
    moduleTitle: string;
    issueDate: string;
    verificationToken: string;
    studentName: string;
}

export interface UserProgress {
    userId: string;
    studentName: string;
    profileImage?: string;
    enrolledModules: string[]; // module codes
    completedModules: string[]; // module codes
    quizScores: Record<string, number>; // code -> percentage
    certificates: Certificate[];
}
