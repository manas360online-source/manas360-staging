import { useEffect, useRef, useCallback, useState } from 'react';

// ============================================

// FOCUS TRAP HOOK

// ============================================

export function useFocusTrap(isActive = true) {

  const containerRef = useRef(null);

  useEffect(() => {

    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const focusableElements = container.querySelectorAll(

      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    );

    

    const firstElement = focusableElements[0];

    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {

        if (document.activeElement === firstElement) {

          e.preventDefault();

          lastElement.focus();

        }

      } else {

        if (document.activeElement === lastElement) {

          e.preventDefault();

          firstElement.focus();

        }

      }

    };

    // Focus first element on mount

    firstElement?.focus();

    container.addEventListener('keydown', handleKeyDown);

    return () => container.removeEventListener('keydown', handleKeyDown);

  }, [isActive]);

  return containerRef;

}

// ============================================

// SCREEN READER ANNOUNCEMENT HOOK

// ============================================

export function useAnnounce() {

  const [message, setMessage] = useState('');

  const announceRef = useRef(null);

  const announce = useCallback((text, priority = 'polite') => {

    setMessage(''); // Clear first to ensure re-announcement

    

    setTimeout(() => {

      setMessage(text);

      

      // Also update the live region directly

      if (announceRef.current) {

        announceRef.current.setAttribute('aria-live', priority);

        announceRef.current.textContent = text;

      }

    }, 100);

  }, []);

  const AnnouncerComponent = () => (

    <div

      ref={announceRef}

      role="status"

      aria-live="polite"

      aria-atomic="true"

      className="sr-only"

    >

      {message}

    </div>

  );

  return { announce, AnnouncerComponent };

}

// ============================================

// REDUCED MOTION HOOK

// ============================================

export function useReducedMotion() {

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setReducedMotion(mediaQuery.matches);

    const handler = (e) => setReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handler);

    

    return () => mediaQuery.removeEventListener('change', handler);

  }, []);

  return reducedMotion;

}

// ============================================

// HIGH CONTRAST HOOK

// ============================================

export function useHighContrast() {

  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    setHighContrast(mediaQuery.matches);

    const handler = (e) => setHighContrast(e.matches);

    mediaQuery.addEventListener('change', handler);

    

    return () => mediaQuery.removeEventListener('change', handler);

  }, []);

  return highContrast;

}

// ============================================

// KEYBOARD NAVIGATION HOOK

// ============================================

export function useKeyboardNavigation(items, options = {}) {

  const {

    onSelect,

    onEscape,

    orientation = 'vertical', // 'vertical' | 'horizontal'

    loop = true

  } = options;

  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);

  const handleKeyDown = useCallback((e) => {

    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    switch (e.key) {

      case prevKey:

        e.preventDefault();

        setActiveIndex((prev) => {

          if (prev === 0) return loop ? items.length - 1 : 0;

          return prev - 1;

        });

        break;

      

      case nextKey:

        e.preventDefault();

        setActiveIndex((prev) => {

          if (prev === items.length - 1) return loop ? 0 : items.length - 1;

          return prev + 1;

        });

        break;

      

      case 'Enter':

      case ' ':

        e.preventDefault();

        onSelect?.(items[activeIndex], activeIndex);

        break;

      

      case 'Escape':

        e.preventDefault();

        onEscape?.();

        break;

      

      case 'Home':

        e.preventDefault();

        setActiveIndex(0);

        break;

      

      case 'End':

        e.preventDefault();

        setActiveIndex(items.length - 1);

        break;

    }

  }, [items, activeIndex, orientation, loop, onSelect, onEscape]);

  useEffect(() => {

    const container = containerRef.current;

    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);

    return () => container.removeEventListener('keydown', handleKeyDown);

  }, [handleKeyDown]);

  return {

    containerRef,

    activeIndex,

    setActiveIndex,

    getItemProps: (index) => ({

      tabIndex: index === activeIndex ? 0 : -1,

      'aria-selected': index === activeIndex,

      role: 'option'

    })

  };

}

// ============================================

// VOICE CONTROL HOOK

// ============================================

export function useVoiceControl(commands = {}) {

  const [isListening, setIsListening] = useState(false);

  const [transcript, setTranscript] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {

      console.warn('Speech recognition not supported');

      return;

    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();

    

    const recognition = recognitionRef.current;

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {

      const current = event.resultIndex;

      const result = event.results[current];

      const text = result[0].transcript.toLowerCase().trim();

      

      setTranscript(text);

      if (result.isFinal) {

        // Check for matching commands

        Object.entries(commands).forEach(([command, callback]) => {

          if (text.includes(command.toLowerCase())) {

            callback(text);

          }

        });

      }

    };

    recognition.onerror = (event) => {

      console.error('Speech recognition error:', event.error);

      setIsListening(false);

    };

    recognition.onend = () => {

      setIsListening(false);

    };

    return () => {

      recognition.stop();

    };

  }, [commands]);

  const startListening = useCallback(() => {

    if (recognitionRef.current) {

      recognitionRef.current.start();

      setIsListening(true);

    }

  }, []);

  const stopListening = useCallback(() => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

      setIsListening(false);

    }

  }, []);

  return {

    isListening,

    transcript,

    startListening,

    stopListening,

    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  };

}

// ============================================

// TEXT-TO-SPEECH HOOK

// ============================================

export function useTextToSpeech() {

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [voices, setVoices] = useState([]);

  const utteranceRef = useRef(null);

  useEffect(() => {

    const loadVoices = () => {

      const availableVoices = window.speechSynthesis.getVoices();

      // Prefer Indian English voices

      const indianVoices = availableVoices.filter(v => 

        v.lang.includes('en-IN') || v.lang.includes('hi-IN')

      );

      setVoices(indianVoices.length > 0 ? indianVoices : availableVoices);

    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {

      window.speechSynthesis.cancel();

    };

  }, []);

  const speak = useCallback((text, options = {}) => {

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = options.rate || 1;

    utterance.pitch = options.pitch || 1;

    utterance.volume = options.volume || 1;

    utterance.lang = options.lang || 'en-IN';

    if (options.voice) {

      utterance.voice = voices.find(v => v.name === options.voice) || voices[0];

    } else if (voices.length > 0) {

      utterance.voice = voices[0];

    }

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);

    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);

  }, [voices]);

  const stop = useCallback(() => {

    window.speechSynthesis.cancel();

    setIsSpeaking(false);

  }, []);

  const pause = useCallback(() => {

    window.speechSynthesis.pause();

  }, []);

  const resume = useCallback(() => {

    window.speechSynthesis.resume();

  }, []);

  return {

    speak,

    stop,

    pause,

    resume,

    isSpeaking,

    voices,

    isSupported: 'speechSynthesis' in window

  };

}
