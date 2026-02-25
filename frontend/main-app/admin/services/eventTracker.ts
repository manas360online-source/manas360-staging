// ================================================
// MANAS360 Event Tracking Service
// Story 3.7: User Behavior Tracking
// ================================================

/**
 * Event names for comprehensive tracking
 */
export enum AnalyticsEvents {
    // Auth & Identity
    USER_SIGNUP = 'User Signup',
    USER_LOGIN = 'User Login',
    PROFILE_COMPLETED = 'Profile Completed',

    // Assessments
    ASSESSMENT_STARTED = 'Assessment Started',
    ASSESSMENT_COMPLETED = 'Assessment Completed',
    ASSESSMENT_ABANDONED = 'Assessment Abandoned',

    // Sessions
    SESSION_BOOKED = 'Session Booked',
    SESSION_STARTED = 'Session Started',
    SESSION_COMPLETED = 'Session Completed',
    SESSION_CANCELLED = 'Session Cancelled',

    // Chatbot (Anytime Buddy)
    CHAT_STARTED = 'Chat Started',
    CHAT_MESSAGE_SENT = 'Chat Message Sent',
    CHAT_SUGGESTION_CLICKED = 'Chat Suggestion Clicked',

    // Resources
    RESOURCE_VIEWED = 'Resource Viewed',
    RESOURCE_DOWNLOADED = 'Resource Downloaded',
    SOUND_PLAYED = 'Sound Played',

    // Payments & Revenue
    PAYMENT_INITIATED = 'Payment Initiated',
    PAYMENT_SUCCESS = 'Payment Success',
    PAYMENT_FAILED = 'Payment Failed',
    SUBSCRIPTION_UPGRADED = 'Subscription Upgraded',

    // Features & Interaction
    DASHBOARD_VIEWED = 'Dashboard Viewed',
    FEATURE_USED = 'Feature Used',
    EXPORT_TRIGGERED = 'Export Triggered',
    ONBOARDING_MODAL_OPENED = 'Onboarding Modal Opened',
}

/**
 * User properties for segmentation
 */
export interface UserProperties {
    userId: string;
    email: string;
    role: 'patient' | 'therapist' | 'admin';
    plan: 'free' | 'premium' | 'enterprise';
    lastLogin: string;
    engagementScore: number;
    sessionsCompleted: number;
}

class EventTrackingService {
    private isInitialized: boolean = false;
    private provider: 'mixpanel' | 'amplitude' | 'internal' = 'internal';

    constructor() {
        this.init();
    }

    private init() {
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 Initializing Event Tracking Service...');
        }
        this.isInitialized = true;

        // In a real app, you would initialize SDKs here
        // mixpanel.init(process.env.MIXPANEL_TOKEN);
    }

    /**
     * Set user identity and properties
     */
    identify(userId: string, properties: Partial<UserProperties>) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`👤 Identifying User: ${userId}`, properties);
        }

        if (this.provider === 'mixpanel') {
            // mixpanel.identify(userId);
            // mixpanel.people.set(properties);
        }
    }

    /**
     * Track an event with optional properties
     */
    track(eventName: AnalyticsEvents | string, properties: Record<string, any> = {}) {
        const timestamp = new Date().toISOString();
        const eventData = {
            ...properties,
            timestamp,
            platform: 'web',
            environment: process.env.NODE_ENV || 'development',
        };

        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 Tracking Event: [${eventName}]`, eventData);
        }

        if (this.provider === 'mixpanel') {
            // mixpanel.track(eventName, eventData);
        }
    }

    /**
     * Record a feature selection for A/B testing
     */
    setVariant(experimentName: string, variant: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🧪 Experiment [${experimentName}]: Variant [${variant}]`);
        }
        this.track('Experiment Variant Assigned', {
            experiment: experimentName,
            variant: variant
        });
    }
}

export const eventTracker = new EventTrackingService();
export default eventTracker;
