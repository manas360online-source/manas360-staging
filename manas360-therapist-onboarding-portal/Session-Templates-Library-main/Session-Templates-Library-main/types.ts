export type TemplateType = 
  | 'cognitive_restructuring'
  | 'behavioral_activation'
  | 'exposure_therapy'
  | 'anxiety_management'
  | 'depression_assessment';

export interface Template {
  id: string;
  title: string;
  description: string;
  type: TemplateType;
  tags: string[];
  duration: string;
  difficulty: 'Low' | 'Moderate' | 'High';
  isSystem: boolean;
  lastModified?: string;
  author?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  diagnosis: string;
  lastSession: string;
  nextSession: string;
  status: 'Active' | 'Paused';
  notes?: string;
  notesLastModified?: string;
}

export interface SessionData {
  id: string;
  templateId: string;
  patientName: string;
  date: string;
  data: any; // Dynamic data based on the tool
  status: 'active' | 'completed';
}

export interface NavState {
  view: 'library' | 'session' | 'editor' | 'history' | 'patients' | 'patient-profile';
  activeTemplateId?: string;
  activeSessionId?: string;
}