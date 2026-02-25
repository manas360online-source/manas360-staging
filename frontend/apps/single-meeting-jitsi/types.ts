
export enum SessionStatus {
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

/** 
 * Added VRAccessTier enum to support immersive session configurations
 */
export enum VRAccessTier {
  MOBILE_VR = 'MOBILE_VR',
  PC_VR = 'PC_VR'
}

/** 
 * Added UserRole enum for identity management
 */
export enum UserRole {
  PATIENT = 'PATIENT',
  THERAPIST = 'THERAPIST'
}

/** 
 * Added User interface for identifying session participants
 */
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

/** 
 * Added Session interface for detailed clinical session data
 */
export interface Session {
  id: string;
  patientName: string;
  therapistName: string;
  isVR: boolean;
  vrTier?: VRAccessTier;
  vrEnvironment?: {
    id: string;
    name: string;
    thumbnail: string;
    therapy_type: string;
  };
}

/** 
 * Added ChatMessage interface for in-session communication
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface SessionInfo {
  therapistName: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  phone: string;
}

export type AppStep = 'CONFIRMED' | 'SESSION' | 'POST_SESSION';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
