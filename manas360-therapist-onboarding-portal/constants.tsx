
import React from 'react';
import { Specialization, Shift, Step } from './types';

export const STEPS: Step[] = [
  { num: 1, label: "Identity" },
  { num: 2, label: "Credentials" },
  { num: 3, label: "Specialize" },
  { num: 4, label: "Languages" },
  { num: 5, label: "Availability" },
  { num: 6, label: "Certify" },
  { num: 7, label: "Submit" },
];

export const SPECS: Specialization[] = [
  { icon: "😞", name: "Depression & Mood Disorders", symptoms: "Major depression, Bipolar, Dysthymia, Seasonal affective, Persistent depressive" },
  { icon: "😰", name: "Anxiety Disorders", symptoms: "GAD, Panic disorder, Social anxiety, Phobias, Agoraphobia, Separation anxiety" },
  { icon: "😵", name: "Trauma & Stress Disorders", symptoms: "PTSD, Complex PTSD, Acute stress, Adjustment disorders, Abuse survivors" },
  { icon: "🧪", name: "Substance Use & Addiction", symptoms: "Alcohol, Drug, Tobacco, Behavioral addictions, Gambling, Internet/gaming" },
  { icon: "🍽️", name: "Eating Disorders", symptoms: "Anorexia, Bulimia, Binge eating, ARFID, Orthorexia, Body dysmorphia" },
  { icon: "🎭", name: "Personality Disorders", symptoms: "Borderline, Narcissistic, Avoidant, Antisocial, Dependent, Obsessive-compulsive PD" },
  { icon: "🌀", name: "Psychotic Disorders", symptoms: "Schizophrenia, Schizoaffective, Delusional disorder, Brief psychotic episode" },
  { icon: "⚡", name: "ADHD & Neurodevelopmental", symptoms: "ADHD, Autism spectrum, Learning disabilities, Intellectual disability, Tic disorders" },
  { icon: "🌙", name: "Sleep & Somatic Disorders", symptoms: "Insomnia, Narcolepsy, Restless legs, Somatic symptom, Conversion disorder, Chronic fatigue" },
];

export const FOCUSED_EXPERTISE = [
  { icon: "💑", label: "Couples / Relationship" },
  { icon: "👨‍👧", label: "Child & Adolescent" },
  { icon: "👴", label: "Geriatric / Elderly" },
  { icon: "🤰", label: "Perinatal / Postpartum" },
  { icon: "🏳️‍🌈", label: "LGBTQIA+ Affirming" },
  { icon: "🎖️", label: "Trauma / Abuse Survivors" },
  { icon: "💼", label: "Workplace / Burnout" },
  { icon: "📱", label: "Digital / Gaming Addiction" },
  { icon: "🧬", label: "Psychosomatic Disorders" },
  { icon: "🏫", label: "Academic / Exam Anxiety" },
  { icon: "🕊️", label: "Grief & Bereavement" },
  { icon: "🧘", label: "Chronic Pain / Illness" },
];

export const LANGUAGES = [
  "🇬🇧 English", "🇮🇳 Hindi / हिन्दी", "Tamil / தமிழ்", "Telugu / తెలుగు", 
  "Kannada / ಕನ್ನಡ", "Malayalam", "Bengali", "Marathi", "Gujarati", 
  "Punjabi", "Urdu", "Odia", "Assamese", "Other…"
];

export const SHIFTS: Shift[] = [
  { id: 'morning', icon: "🌅", time: "8:00 AM — 4:00 PM", label: "Morning Shift", days: ['M', 'T', 'W', 'T', 'F'] },
  { id: 'evening', icon: "🌆", time: "4:00 PM — 10:00 PM", label: "Evening Shift", days: ['M', 'T', 'W', 'T', 'F', 'S'] },
  { id: 'night', icon: "🌙", time: "10:00 PM — 6:00 AM", label: "Night Owl Shift", days: [] },
];

export const THERAPEUTIC_APPROACHES = [
  "CBT", "DBT", "EMDR", "Psychoanalytic", "Humanistic", "Family Systems", 
  "ACT", "Solution-Focused", "Mindfulness-Based", "Art / Expressive", 
  "Play Therapy", "Motivational Interviewing", "Somatic", "NLP", "Medication Management"
];
