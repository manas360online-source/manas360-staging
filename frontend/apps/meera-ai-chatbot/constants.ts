
import { TrainingModule, QuizQuestion, Message, Role } from './types';

export const SUPPORTED_LANGUAGES = [
  { name: 'English', code: 'en-IN', native: 'English' },
  { name: 'Hindi', code: 'hi-IN', native: 'हिन्दी' },
  { name: 'Kannada', code: 'kn-IN', native: 'ಕನ್ನಡ' },
  { name: 'Telugu', code: 'te-IN', native: 'తెలుగు' },
  { name: 'Tamil', code: 'ta-IN', native: 'தமிழ்' }
];

export const LOCALIZED_UI: Record<string, any> = {
  'en-IN': {
    placeholder: "Share your feelings...",
    textMode: "TEXT MODE",
    voiceMode: "VOICE MODE",
    usageRemaining: "Usage Remaining",
    upgrade: "UPGRADE",
    tapToSpeak: "TAP TO SPEAK",
    privateSpace: "Your private, safe space to talk",
    recording: "Recording Live",
    finishSend: "FINISH & SEND",
    thinking: "Thinking...",
    discard: "DISCARD",
    send: "SEND MESSAGE",
    preview: "Transcription Preview",
    voiceOn: "VOICE ON",
    voiceOff: "VOICE OFF",
    voiceNote: "Voice Note",
    welcome: "Hi there, I'm Meera, your support companion. I'm here 24/7. How can I support you today?",
    starters: [
      "Help me with a breathing exercise",
      "I'm feeling very anxious",
      "I'm struggling to sleep",
      "Give me a positive affirmation"
    ]
  },
  'hi-IN': {
    placeholder: "अपनी भावनाएं साझा करें...",
    textMode: "टेक्स्ट मोड",
    voiceMode: "वॉइस मोड",
    usageRemaining: "शेष उपयोग",
    upgrade: "अपग्रेड",
    tapToSpeak: "बोलने के लिए टैप करें",
    privateSpace: "बात करने के लिए आपका निजी, सुरक्षित स्थान",
    recording: "लाइव रिकॉर्डिंग",
    finishSend: "समाप्त करें और भेजें",
    discard: "रद्द करें",
    thinking: "सोच रहा हूँ...",
    welcome: "नमस्ते, मैं मित्रा हूं, आपका सहायता साथी। मैं यहाँ 24/7 उपलब्ध हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    starters: [
      "सांस लेने के व्यायाम में मेरी मदद करें",
      "मुझे बहुत घबराहट हो रही है",
      "मुझे सोने में परेशानी हो रही है",
      "मुझे एक सकारात्मक विचार दें"
    ]
  },
  'kn-IN': {
    placeholder: "ನಿಮ್ಮ ಭಾವನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...",
    textMode: "ಪಠ್ಯ ಮೋಡ್",
    voiceMode: "ಧ್ವನಿ ಮೋಡ್",
    usageRemaining: "ಬಳಕೆ ಬಾಕಿ ಇದೆ",
    upgrade: "ಅಪ್‌ಗ್ರೇಡ್",
    tapToSpeak: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    privateSpace: "ಮಾತನಾಡಲು ನಿಮ್ಮ ಖಾಸಗಿ, ಸುರಕ್ಷಿತ ಸ್ಥಳ",
    recording: "ಲೈವ್ ರೆಕಾರ್ಡಿಂಗ್",
    finishSend: "ಮುಗಿಸಿ ಮತ್ತು ಕಳುಹಿಸಿ",
    discard: "ಬಿಟ್ಟುಬಿಡಿ",
    thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
    welcome: "ನಮಸ್ಕಾರ, ನಾನು ಮಿತ್ರ, ನಿಮ್ಮ ಬೆಂಬಲ ಸಂಗಾತಿ. ನಾನು 24/7 ಇಲ್ಲಿದ್ದೇನೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    starters: [
      "ಉಸಿರಾಟದ ವ್ಯಾಯಾಮದಲ್ಲಿ ನನಗೆ ಸಹಾಯ ಮಾಡಿ",
      "ನನಗೆ ತುಂಬಾ ಆತಂಕವಾಗುತ್ತಿದೆ",
      "ನನಗೆ ನಿದ್ರೆ ಮಾಡಲು ಕಷ್ಟವಾಗುತ್ತಿದೆ",
      "ನನಗೆ ಒಂದು ಸಕಾರಾತ್ಮಕ ದೃಢೀಕರಣ ನೀಡಿ"
    ]
  },
  'te-IN': {
    placeholder: "మీ భావాలను పంచుకోండి...",
    textMode: "టెక్స్ట్ మోడ్",
    voiceMode: "వాయిస్ మోడ్",
    usageRemaining: "వినియోగం మిగిలి ఉంది",
    upgrade: "అప్‌గ్రేడ్",
    tapToSpeak: "మాట్లాడటానికి నొక్కండి",
    privateSpace: "మాట్లాడటానికి మీ ప్రైవేట్, సురక్షితమైన స్థలం",
    recording: "లైవ్ రికార్డింగ్",
    finishSend: "ముగించి పంపండి",
    discard: "రద్దు చేయండి",
    thinking: "ఆలోచిస్తున్నాను...",
    welcome: "నమస్కారం, నేను మిత్రను, మీ మద్దతు భాగస్వామిని. నేను 24/7 ఇక్కడ ఉన్నాను. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
    starters: [
      "శ్వాస ವ್ಯಾಯಾಮದಲ್ಲಿ నాకు సహాయం చేయండి",
      "నేను చాలా ఆందోళనగా ఉన్నాను",
      "నేను నిద్రపోవడానికి ఇబ్బంది పడుతున్నాను",
      "నాకు ఒక సానుకూల ధృవీకరణ ఇవ్వండి"
    ]
  },
  'ta-IN': {
    placeholder: "உங்கள் உணர்வுகளைப் பகிர்ந்து கொள்ளுங்கள்...",
    textMode: "உரை முறை",
    voiceMode: "குரல் முறை",
    usageRemaining: "பயன்பாடு மீதமுள்ளது",
    upgrade: "மேம்படுத்து",
    tapToSpeak: "பேச தட்டவும்",
    privateSpace: "பேசுவதற்கு உங்கள் தனிப்பட்ட, பாதுகாப்பான இடம்",
    recording: "நேரடி பதிவு",
    finishSend: "முடித்து அனுப்பவும்",
    discard: "புறக்கணிக்கவும்",
    thinking: "யோசிக்கிறேன்...",
    welcome: "வணக்கம், நான் மித்ரா, உங்கள் ஆதரவு துணை. நான் 24/7 இங்கே இருக்கிறேன். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    starters: [
      "சுவாசப் பயிற்சியில் எனக்கு உதவுங்கள்",
      "நான் மிகவும் கவலையாக உணர்கிறேன்",
      "நான் தூங்க சிரமப்படுகிறேன்",
      "எனக்கு ஒரு நேர்மறையான உறுதிமொழியைத் தாருங்கள்"
    ]
  }
};

export const SYSTEM_INSTRUCTION = `
You are an empathetic, non-judgmental AI emotional support companion named Mitra. 
Your goal is to provide a safe space for users to express their feelings.
CORE PRINCIPLES: Active Listening, Empowerment, Safety First.
STRICT LANGUAGE POLICY: Respond in the user's selected regional language.
`;

export const EMERGENCY_RESOURCES = [
  { title: "National Suicide Prevention Lifeline", contact: "988" },
  { title: "Tele-MANAS Helpline", contact: "14416" }
];

export const FREE_TIER_LIMIT = 3;
export const VOICE_TIER_LIMIT_SECONDS = 120;

export const WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  role: Role.MODEL,
  content: "Hi there, I'm Mitra, your support companion. I'm here 24/7. How can I support you today?",
  timestamp: Date.now(),
  status: 'read'
};

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'm1',
    code: 'nlp_basics',
    title: 'NLP Fundamentals for Therapists',
    description: 'Learn anchoring, reframing, and core NLP techniques for rapid emotional shifts and patient empowerment.',
    durationMinutes: 120,
    requiredForCertification: true,
    badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    sections: [
      { id: 's1', title: 'The Neurology of NLP', durationMinutes: 20, content: 'Understanding how neurological pathways and brain processes interpret external data and internal representation.' },
      { id: 's2', title: 'Reframing Techniques', durationMinutes: 30, content: 'How to change the context or meaning of a situation to change the patient\'s interpretation and emotional response.' },
      { id: 's3', title: 'Anchoring Emotional States', durationMinutes: 40, content: 'Creating triggers for positive psychological responses to allow patients to access resourceful states on demand.' },
      { id: 's4', title: 'Representational Systems', durationMinutes: 30, content: 'Learning about visual, auditory, and kinesthetic modalities and how patients prefer to process information.' }
    ]
  },
  {
    id: 'm2',
    code: 'cbt_fundamentals',
    title: 'CBT: Cognitive Behavioral Foundations',
    description: 'Master the identification and restructuring of cognitive distortions through structured clinical practice.',
    durationMinutes: 180,
    requiredForCertification: true,
    badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3472/3472580.png',
    sections: [
      { id: 's5', title: 'Identifying Distortions', durationMinutes: 60, content: 'Deep dive into catastrophizing, black-and-white thinking, and personalization.' },
      { id: 's6', title: 'Behavioral Activation', durationMinutes: 60, content: 'Strategies for re-engaging patients in positive activities to break the cycle of depression.' },
      { id: 's7', title: 'The Socratic Method', durationMinutes: 60, content: 'Using guided discovery to help patients challenge their own automatic negative thoughts.' }
    ]
  },
  {
    id: 'm3',
    code: 'crisis_management',
    title: 'Crisis Management & Tele-MANAS Protocol',
    description: 'Essential protocols for handling acute distress, suicide ideation, and emergency interventions in a remote setting.',
    durationMinutes: 150,
    requiredForCertification: true,
    badgeUrl: 'https://cdn-icons-png.flaticon.com/512/10530/10530132.png',
    sections: [
      { id: 's8', title: 'Standard Tele-MANAS Protocol', durationMinutes: 75, content: 'Official government-mandated steps for stabilization and risk assessment during help-line calls.' },
      { id: 's9', title: 'Lethality Assessment', durationMinutes: 75, content: 'Scientific evaluation of immediate risk levels and safety planning for high-risk individuals.' }
    ]
  }
];

export const MODULE_QUIZZES: { [moduleId: string]: QuizQuestion[] } = {
  'm1': [
    { id: 'q1', text: 'What does the NEURO in NLP refer to?', options: { 'a': 'New strategies for therapy', 'b': 'Neurological pathways and brain processes', 'c': 'Nervous system responses' }, correctAnswer: 'b', explanation: 'NEURO refers to the neurological pathways and the biological ways we process sensory information.' },
    { id: 'q2', text: 'What is the primary goal of Reframing?', options: { 'a': 'Changing interpretation of an event', 'b': 'Forgetting a traumatic memory', 'c': 'Identifying physical triggers' }, correctAnswer: 'a', explanation: 'Reframing changes the context or meaning of an event to alter its emotional impact.' },
    { id: 'q3', text: 'Which technique is used to create positive psychological triggers?', options: { 'a': 'Blocking', 'b': 'Anchoring', 'c': 'Mirroring' }, correctAnswer: 'b', explanation: 'Anchoring links a specific external trigger to a resourceful internal state.' },
    { id: 'q4', text: 'NLP stands for...', options: { 'a': 'Natural Language Processing', 'b': 'Neuro-Linguistic Programming', 'c': 'Neural Linear Path' }, correctAnswer: 'b', explanation: 'Neuro-Linguistic Programming is the study of how language and thought patterns influence behavior.' },
    { id: 'q5', text: 'In NLP, "Matching and Mirroring" is primarily used for...', options: { 'a': 'Hypnosis', 'b': 'Building Rapport', 'c': 'Cognitive Restructuring' }, correctAnswer: 'b', explanation: 'Matching and Mirroring helps establish a subconscious connection or rapport with the patient.' },
    { id: 'q6', text: 'A "Visual" person in NLP might use which phrase?', options: { 'a': "I hear what you're saying", 'b': "I see what you mean", 'c': "I feel that's right" }, correctAnswer: 'b', explanation: 'Visual processors use predicates that relate to sight and imagery.' },
    { id: 'q7', text: 'What is the "Meta-Model" in NLP?', options: { 'a': 'A set of language patterns for gathering information', 'b': 'A physical exercise for stress', 'c': 'A type of medication' }, correctAnswer: 'a', explanation: 'The Meta-Model is a linguistic tool for de-obfuscating vague language.' },
    { id: 'q8', text: 'Reframing "I failed" to "I learned something" is an example of...', options: { 'a': 'Content Reframing', 'b': 'Context Reframing', 'c': 'Meaning Reframing' }, correctAnswer: 'c', explanation: 'Meaning reframing changes the significance assigned to an outcome.' }
  ],
  'm2': [
    { id: 'q2_1', text: 'What is "Catastrophizing"?', options: { 'a': 'Assuming the worst outcome', 'b': 'Ignoring positives', 'c': 'Physical symptoms' }, correctAnswer: 'a', explanation: 'Catastrophizing is a cognitive distortion involving irrational belief in a disaster.' }
  ],
  'm3': [
    { id: 'q3_1', text: 'Tele-MANAS first priority in a crisis call is:', options: { 'a': 'Providing advice', 'b': 'Immediate risk assessment', 'c': 'Scheduling' }, correctAnswer: 'b', explanation: 'Risk assessment is the immediate priority to ensure patient safety.' }
  ]
};