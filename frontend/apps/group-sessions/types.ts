
export enum UserRole {
  THERAPIST = 'THERAPIST',
  PATIENT = 'PATIENT',
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  LIVE = 'LIVE'
}

export enum VRAccessTier {
  BROWSER_3D = 'BROWSER_3D',    // Standard screen, 360 movement
  MOBILE_VR = 'MOBILE_VR',      // Split screen (Google Cardboard)
  IMMERSIVE_VR = 'IMMERSIVE_VR' // Full WebXR (Meta Quest/Pico)
}

export interface DeviceCapabilities {
  hasWebXR: boolean;
  isMobile: boolean;
  isHeadset: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  anonymousName?: string;
}

export interface GroupTheme {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  description: string;
}

export interface VREnvironment {
  id: string;
  name: string;
  name_hi: string;
  icon: string;
  thumbnail: string;
  therapy_type: 'grounding' | 'exposure' | 'general';
  target_conditions: string[];
}

export interface Session {
  id: string;
  patientName?: string;
  therapistName: string;
  startTime: string; 
  durationMinutes: number;
  status: SessionStatus;
  notes?: string;
  isEncrypted: boolean;
  isGroup?: boolean;
  isVR?: boolean;
  vrEnvironment?: VREnvironment;
  vrTier?: VRAccessTier;
  modules_planned?: string[];
  theme?: GroupTheme;
  currentParticipants?: number;
  maxParticipants?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export type ViewState = 'DASHBOARD' | 'WAITING_ROOM' | 'VIDEO_ROOM' | 'VR_LAUNCHER' | 'FEEDBACK';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}
