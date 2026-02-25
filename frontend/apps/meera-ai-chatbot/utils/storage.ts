
import { Message, UserProfile, TherapistProfile } from "../types";
import { FREE_TIER_LIMIT, VOICE_TIER_LIMIT_SECONDS } from "../constants";

const STORAGE_KEYS = {
  TEXT_HISTORY: 'manas360_text_history',
  VOICE_HISTORY: 'manas360_voice_history',
  PROFILE: 'manas360_user_profile',
  THERAPIST: 'manas360_therapist_profile'
};

export const saveTextHistory = (history: Message[]) => {
  const historyToSave = history.slice(-50);
  localStorage.setItem(STORAGE_KEYS.TEXT_HISTORY, JSON.stringify(historyToSave));
};

export const getTextHistory = (): Message[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TEXT_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const saveVoiceHistory = (history: Message[]) => {
  const historyToSave = history.slice(-50);
  localStorage.setItem(STORAGE_KEYS.VOICE_HISTORY, JSON.stringify(historyToSave));
};

export const getVoiceHistory = (): Message[] => {
  const data = localStorage.getItem(STORAGE_KEYS.VOICE_HISTORY);
  return data ? JSON.parse(data) : [];
};

export const getUserProfile = (): UserProfile => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  const today = new Date().toDateString();
  
  if (data) {
    const profile: UserProfile = JSON.parse(data);
    if (profile.lastMessageDate !== today) {
      return { 
        ...profile, 
        dailyMessageCount: 0, 
        totalVoiceSecondsUsed: 0, 
        lastMessageDate: today 
      };
    }
    return profile;
  }
  
  return {
    isPremium: false,
    dailyMessageCount: 0,
    totalVoiceSecondsUsed: 0,
    lastMessageDate: today,
    voiceEnabled: true
  };
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getTherapistProfile = (): TherapistProfile => {
  const data = localStorage.getItem(STORAGE_KEYS.THERAPIST);
  return data ? JSON.parse(data) : {
    name: "Dr. Alex Support",
    isCertified: false,
    certifications: [],
    trainingProgress: {},
    quizAttempts: {}
  };
};

export const saveTherapistProfile = (profile: TherapistProfile) => {
  localStorage.setItem(STORAGE_KEYS.THERAPIST, JSON.stringify(profile));
};

export const checkTextLimit = (profile: UserProfile): boolean => {
  if (profile.isPremium) return true;
  return profile.dailyMessageCount < FREE_TIER_LIMIT;
};

export const checkVoiceLimit = (profile: UserProfile): boolean => {
  if (profile.isPremium) return true;
  return profile.totalVoiceSecondsUsed < VOICE_TIER_LIMIT_SECONDS;
};
