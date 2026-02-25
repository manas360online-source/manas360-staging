
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Define theme data structure matching Landing page
const AR_THEMES = [
  {
    id: 'boat-ocean',
    title: 'Boat Near Ocean',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/boats-near-ocean-beach-with-huts-among-palm-trees.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3'
  },
  {
    id: 'green-tea',
    title: 'Green Tea Plantation',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/green-tea-plantations-in-munnar-kerala-india.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/04/27/audio_65b3693f93.mp3'
  },
  {
    id: 'butterfly',
    title: 'Butterfly Meadow',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/butterfly_meadow_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/09/audio_03d6924610.mp3'
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/ocean_waves_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/02/07/audio_65893b04b9.mp3'
  },
  {
    id: 'sakura',
    title: 'Sakura Garden',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/sakura_garden_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2021/09/06/audio_35930062a4.mp3'
  },
  {
    id: 'forest',
    title: 'Enchanted Forest',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/enchanted_forest_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/07/04/audio_323281d897.mp3'
  },
  {
    id: 'himalaya',
    title: 'Himalayan Sunrise',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/himalayan_sunrise_1080p.mp4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/09/02/audio_72502a492a.mp3'
  },
  {
    id: 'calm-lake',
    title: 'Calm Lake View',
    videoUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/themes/wonderful-dusk-over-calm-lake.mp4',
    audioUrl: 'https://manas360-themed-rooms.s3.ap-south-1.amazonaws.com/Sound%20Therapy%20Track/TunePocket-Relaxing-Piano-Music-With-Ocean-Sounds-1-Hour-Preview.mp3'
  }
];

interface ARThemePlayerProps {
  themeId: string;
}

export const ARThemePlayer: React.FC<ARThemePlayerProps> = ({ themeId }) => {
  const { i18n } = useTranslation();
  const theme = AR_THEMES.find(t => t.id === themeId);
  
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlTimeoutRef = useRef<number | null>(null);

  // Hide cursor when controls are hidden
  useEffect(() => {
    if (!showControls) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [showControls]);

  // Auto-hide controls logic
  useEffect(() => {
    const clearTimer = () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
        controlTimeoutRef.current = null;
      }
    };

    clearTimer();

    // Only auto-hide if playing AND controls are currently shown
    if (isPlaying && showControls) {
      controlTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000); // 3 seconds timeout
    }

    return () => clearTimer();
  }, [isPlaying, showControls]);

  // Determine playback rate based on theme
  const getPlaybackRate = () => {
    if (themeId === 'ocean-waves' || themeId === 'calm-lake') {
      return 1.0;
    }
    return 0.5;
  };

  // Handle Video Events to Sync State
  const onVideoPlay = () => {
    setIsPlaying(true);
    // Enforce playback rate on play
    if (videoRef.current) {
      videoRef.current.playbackRate = getPlaybackRate();
    }
    // Sync audio start
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => {
        // Ignore abort/interrupt errors
        if (e.name !== 'AbortError') {
           console.log("Audio play sync failed", e);
        }
      });
    }
  };

  const onVideoPause = () => {
    setIsPlaying(false);
    setShowControls(true); // Always show controls when paused
    // Sync audio pause
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  // Autoplay on mount
  useEffect(() => {
    let isMounted = true;

    const startPlayback = async () => {
      if (videoRef.current && audioRef.current) {
        // Set initial playback rate
        if (isMounted) {
          videoRef.current.playbackRate = getPlaybackRate();
        }

        try {
          // Video must be muted to autoplay in most browsers
          if (isMounted && videoRef.current) videoRef.current.muted = true; 
          
          if (!isMounted) return;

          const videoPromise = videoRef.current ? videoRef.current.play() : Promise.reject('No video ref');
          
          // Try playing audio (might fail if no user interaction yet)
          if (isMounted && audioRef.current) audioRef.current.muted = false; 
          
          if (!isMounted) return;

          const audioPromise = audioRef.current ? audioRef.current.play().catch(err => {
             // If unmounted during attempt, don't fallback
             if (!isMounted) return;
             console.warn("Audio autoplay blocked, falling back to muted", err);
             if (audioRef.current) {
                audioRef.current.muted = true;
                setIsMuted(true);
                return audioRef.current.play();
             }
          }) : Promise.resolve();
          
          await Promise.all([videoPromise, audioPromise]);
          // State update handled by onPlay event listener
        } catch (err) {
          if (isMounted) {
             console.warn("Autoplay failed completely", err);
             setShowControls(true); // Show controls if autoplay fails
          }
        }
      }
    };
    
    startPlayback();

    return () => {
      isMounted = false;
      // Stop media on unmount to prevent "playing" in background if navigation is SPA
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src'); // Detach media source
        videoRef.current.load();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
    };
  }, [themeId]);

  const handleContainerClick = () => {
    setShowControls(prev => !prev);
  };

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => {
           console.warn("Play interrupted", e);
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleExit = () => {
    if (window.location.hash.includes('source=free-tools')) {
        window.location.hash = `#/${i18n.language}/free-tools`;
    } else {
        window.location.hash = `#/${i18n.language}/ar-themed-room`;
    }
  };

  if (!theme) return <div className="text-center p-20">Theme not found</div>;

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden z-[5000]"
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={theme.videoUrl}
        className="w-full h-full object-cover absolute inset-0"
        loop
        playsInline
        muted // Video track always muted visually, sound comes from audio element
        onPlay={onVideoPlay}
        onPause={onVideoPause}
      />

      <audio
        ref={audioRef}
        src={theme.audioUrl}
        loop
      />

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 flex flex-col justify-between p-6 md:p-10 ${showControls ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }} 
      >
        {/* Top Controls: Back and Mute */}
        <div className="flex justify-between items-start">
          <button 
            onClick={(e) => { e.stopPropagation(); handleExit(); }}
            className="text-white font-bold text-lg flex items-center gap-2 bg-black/30 backdrop-blur-md px-5 py-2.5 rounded-full hover:bg-black/50 transition-all shadow-lg active:scale-95"
          >
            ← Back
          </button>

          <button 
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-all active:scale-95 shadow-lg"
          >
            {isMuted ? <span className="text-2xl">🔇</span> : <span className="text-2xl">🔊</span>}
          </button>
        </div>

        {/* Center Control: Play/Pause */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button 
            onClick={handlePlayPauseClick}
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all shadow-2xl active:scale-95 pointer-events-auto"
          >
            {isPlaying ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>

        {/* Bottom Area: Title */}
        <div className="flex justify-center pb-4">
           <h2 className="text-white/90 font-serif text-2xl drop-shadow-md tracking-wide bg-black/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
             {theme.title}
           </h2>
        </div>
      </div>
    </div>
  );
};
