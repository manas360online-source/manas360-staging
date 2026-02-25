import React from 'react';
import { VREnvironment } from './types';

export const GROUP_THEMES: any[] = [
  { id: 'student-stress', name: 'Student Stress Room', slug: 'student-stress', emoji: '📚', color: '#4CAF50', description: 'Academic pressure & exam anxiety support for college students.' },
  { id: 'heartbreak-hotel', name: 'Heartbreak Hotel', slug: 'heartbreak-hotel', emoji: '💔', color: '#E91E63', description: 'Healing from relationship loss, breakups, and grief.' },
  { id: 'anxiety-lounge', name: 'Anxiety Lounge', slug: 'anxiety-lounge', emoji: '😰', color: '#9C27B0', description: 'Managing panic attacks and general social anxiety.' },
  { id: 'lgbtq-safe', name: 'LGBTQ+ Safe Space', slug: 'lgbtq-safe', emoji: '🏳️‍🌈', color: '#FF5722', description: 'Safe space for LGBTQ+ identity and community support.' },
  { id: 'gamer-support', name: 'Gamer Support', slug: 'gamer-support', emoji: '🎮', color: '#2196F3', description: 'Gaming addiction, esports burnout, and toxic communities.' },
  { id: 'gym-bros', name: 'Gym Bros Mental', slug: 'gym-bros', emoji: '💪', color: '#795548', description: 'Body image, performance pressure, and fitness anxiety.' }
];

export interface VREnvironmentWithVideo extends VREnvironment {
  videoUrl: string;
}

export const VR_ENVIRONMENTS: VREnvironmentWithVideo[] = [
  {
    id: 'therapy_forest',
    name: 'Peaceful Forest',
    name_hi: 'शांत जंगल',
    icon: '🌲',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    therapy_type: 'grounding',
    target_conditions: ['anxiety']
  },
  {
    id: 'office_meeting',
    name: 'Office Meeting Room',
    name_hi: 'ऑफिस मीटिंग रूम',
    icon: '🏢',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-office-building-empty-at-night-42415-large.mp4',
    therapy_type: 'exposure',
    target_conditions: ['social anxiety']
  },
  {
    id: 'public_stage',
    name: 'Auditorium Stage',
    name_hi: 'सभागार मंच',
    icon: '🎤',
    thumbnail: 'https://images.unsplash.com/photo-1503095396549-80705bc06ee0?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-view-of-a-theater-from-the-stage-41916-large.mp4',
    therapy_type: 'exposure',
    target_conditions: ['public speaking']
  },
  {
    id: 'airplane_cabin',
    name: 'Airplane Cabin',
    name_hi: 'हवाई जहाज केबिन',
    icon: '✈️',
    thumbnail: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://cdn.pixabay.com/vimeo/152342930/airplane-1466.mp4?width=1280&hash=85e8a32a26563e41c4d4f4e5e4063f6390142274',
    therapy_type: 'exposure',
    target_conditions: ['flying phobia']
  },
  {
    id: 'crowded_market',
    name: 'Indian Market',
    name_hi: 'भारतीय बाजार',
    icon: '🛒',
    thumbnail: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crowded-city-street-during-daylight-1249-large.mp4',
    therapy_type: 'exposure',
    target_conditions: ['agoraphobia']
  },
  {
    id: 'nature_trail',
    name: 'Nature Trail',
    name_hi: 'प्राकृतिक पथ',
    icon: '🕷️',
    thumbnail: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    therapy_type: 'exposure',
    target_conditions: ['spider phobia']
  },
  {
    id: 'hospital_room',
    name: 'Hospital Room',
    name_hi: 'अस्पताल का कमरा',
    icon: '🏥',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2560&q=100',
    videoUrl: 'https://cdn.pixabay.com/vimeo/305284347/hospital-19597.mp4?width=1280&hash=d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3',
    therapy_type: 'exposure',
    target_conditions: ['medical anxiety']
  }
];

export const VR_MODULES = [
  { id: 'thought_record', name: 'Thought Record 3D', icon: '💭', description: '3D floating thought bubbles for cognitive restructuring.' },
  { id: 'exposure', name: 'Exposure Session', icon: '🎯', description: 'Controlled interaction with anxiety triggers.' },
  { id: 'grounding', name: '5-4-3-2-1 Grounding', icon: '🌿', description: 'Immersive sensory grounding in a virtual forest.' },
  { id: 'behavioral', name: 'Behavioral Challenges', icon: '🔥', description: 'Gamified CBT activation tasks with XP rewards.' },
  { id: 'roleplay', name: 'AI NPC Role-Play', icon: '👥', description: 'Practice social skills with AI-powered avatars.' }
];

export const ANON_ADJECTIVES = ['Silent', 'Gentle', 'Brave', 'Calm', 'Kind', 'Hopeful', 'Peaceful', 'Strong', 'Wise', 'Warm'];
export const ANON_NOUNS = ['Panda', 'Owl', 'Fox', 'Bear', 'Deer', 'Wolf', 'Eagle', 'Dolphin', 'Tiger', 'Butterfly'];

export const generateAnonymousName = () => {
    const adj = ANON_ADJECTIVES[Math.floor(Math.random() * ANON_ADJECTIVES.length)];
    const noun = ANON_NOUNS[Math.floor(Math.random() * ANON_NOUNS.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj}${noun}${num}`;
};

export const ICONS = {
  Video: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" })
  ),
  Users: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" })
  ),
  Lock: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-4 h-4" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" })
  ),
  Chart: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" })
  ),
  ShieldCheck: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" })
  ),
  Mic: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" })
  ),
  Chat: () => React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" })
  )
};