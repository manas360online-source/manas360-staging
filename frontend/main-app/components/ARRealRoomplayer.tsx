
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Declare global types
declare global {
  interface Window {
    THREE: any;
    DeviceOrientationEvent: any;
  }
}

export const ARRealRoomPlayer: React.FC = () => {
  const { i18n } = useTranslation();
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);
  const [arStarted, setArStarted] = useState(false);
  const [activeTimer, setActiveTimer] = useState(10); // Default 10 min
  
  // Refs for Three.js and State (Persist across renders without re-rendering)
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  const creaturesRef = useRef<any[]>([]);
  const particlesRef = useRef<any>(null);
  const clockRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  
  const currentThemeRef = useRef('butterfly');
  const timerSecondsRef = useRef(600);
  const intensityRef = useRef(1);
  const facingModeRef = useRef('environment');
  const deviceOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });

  // THEME CONFIGURATION
  const THEMES: any = {
      butterfly: {
        name: '🦋 Butterfly Garden',
        creatures: 'butterfly',
        count: 18,
        particleColor: 0xFFD700,
        particleCount: 80,
        ambientColor: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(144,238,144,0.1))',
        colors: [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0xFF85A1, 0xA0E7E5, 0xB4F8C8, 0xFBE7C6],
        wingSpeed: 0.15,
        flightSpeed: 0.3,
      },
      ocean: {
        name: '🏖️ Ocean Waves',
        creatures: 'fish',
        count: 12,
        particleColor: 0x87CEEB,
        particleCount: 120,
        ambientColor: 'linear-gradient(135deg, rgba(0,119,190,0.15), rgba(0,180,216,0.1))',
        colors: [0x0077B6, 0x0096C7, 0x00B4D8, 0x48CAE4, 0x90E0EF, 0xADE8F4, 0xCAF0F8],
        wingSpeed: 0.08,
        flightSpeed: 0.15,
      },
      sakura: {
        name: '🌸 Sakura Rain',
        creatures: 'petal',
        count: 60,
        particleColor: 0xFFB7C5,
        particleCount: 150,
        ambientColor: 'linear-gradient(135deg, rgba(255,183,197,0.15), rgba(255,218,233,0.1))',
        colors: [0xFFB7C5, 0xFFC1CC, 0xFFD1DC, 0xFFE0E6, 0xFF91A4, 0xFFA3B5, 0xFFCCDB],
        wingSpeed: 0.02,
        flightSpeed: 0.08,
      },
      forest: {
        name: '🌲 Enchanted Forest',
        creatures: 'firefly',
        count: 40,
        particleColor: 0x90EE90,
        particleCount: 60,
        ambientColor: 'linear-gradient(135deg, rgba(34,139,34,0.12), rgba(107,142,35,0.08))',
        colors: [0xADFF2F, 0x7FFF00, 0x98FB98, 0x90EE90, 0x32CD32, 0xFFFF00, 0xF0E68C],
        wingSpeed: 0.05,
        flightSpeed: 0.1,
      },
      himalaya: {
        name: '🏔️ Himalayan Dawn',
        creatures: 'light_orb',
        count: 25,
        particleColor: 0xFFA500,
        particleCount: 50,
        ambientColor: 'linear-gradient(135deg, rgba(255,165,0,0.12), rgba(255,99,71,0.08))',
        colors: [0xFFA500, 0xFF8C00, 0xFF7F50, 0xFFD700, 0xFFEFD5, 0xF4A460, 0xDAA520],
        wingSpeed: 0.03,
        flightSpeed: 0.06,
      }
  };

  // Load Three.js
  useEffect(() => {
    if (window.THREE) {
      setIsThreeLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => setIsThreeLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      handleExit(false); // Clean up on unmount without navigation
    };
  }, []);

  const handleExit = (navigate = true) => {
    // 1. Stop Camera
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    // 2. Stop Animation
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
    }
    // 3. Clear Timer
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
    }
    // 4. Cleanup Three.js
    if (rendererRef.current) {
        try {
            rendererRef.current.dispose();
            const canvas = document.getElementById('ar-canvas');
            if (canvas) canvas.remove();
        } catch(e) { console.log("Cleanup error", e); }
    }
    // 5. Remove Listeners
    window.removeEventListener('deviceorientation', handleOrientation);

    if (navigate) {
        window.location.hash = `#/${i18n.language}/ar-themed-room`;
    }
  };

  // --- AR ENGINE FUNCTIONS ---

  const startCamera = async () => {
    try {
        const constraints = {
            video: {
                facingMode: facingModeRef.current,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        };
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.style.transform = facingModeRef.current === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
        }
        
        const demoBg = document.getElementById('demo-bg');
        if (demoBg) demoBg.style.display = 'none';
        return true;
    } catch (err) {
        console.warn('Camera not available, using demo mode', err);
        const demoBg = document.getElementById('demo-bg');
        if (demoBg) demoBg.style.display = 'block';
        return false;
    }
  };

  const initScene = () => {
    const THREE = window.THREE;
    if (!THREE) return;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    cameraRef.current.position.set(0, 0, 5);
    
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current.setClearColor(0x000000, 0);
    rendererRef.current.domElement.id = 'ar-canvas';
    
    if (containerRef.current) {
        // Remove old canvas if exists
        const old = containerRef.current.querySelector('#ar-canvas');
        if (old) old.remove();
        containerRef.current.appendChild(rendererRef.current.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneRef.current.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 5, 3);
    sceneRef.current.add(dirLight);
    
    const rimLight = new THREE.DirectionalLight(0xFFD700, 0.3);
    rimLight.position.set(-3, 2, -2);
    sceneRef.current.add(rimLight);

    clockRef.current = new THREE.Clock();
  };

  // --- CREATURE FACTORIES (Matched to Reference) ---

  const createButterfly = (theme: any) => {
    const THREE = window.THREE;
    const group = new THREE.Group();
    
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.bezierCurveTo(0.15, 0.2, 0.35, 0.35, 0.4, 0.15);
    wingShape.bezierCurveTo(0.42, 0.05, 0.3, -0.1, 0.15, -0.15);
    wingShape.bezierCurveTo(0.05, -0.1, 0, -0.05, 0, 0);
    const wingGeo = new THREE.ShapeGeometry(wingShape, 8);

    const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
    const wingMat = new THREE.MeshPhongMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        emissive: color,
        emissiveIntensity: 0.15,
        shininess: 80,
    });

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.scale.set(-1, 1, 1);

    const bodyGeo = new THREE.CylinderGeometry(0.015, 0.01, 0.2, 6);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;

    group.add(leftWing);
    group.add(rightWing);
    group.add(body);

    group.userData = {
        leftWing, rightWing,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: theme.wingSpeed + Math.random() * 0.05,
        pathA: 2 + Math.random() * 3,
        pathB: 1.5 + Math.random() * 2,
        pathSpeedX: (0.1 + Math.random() * 0.2) * theme.flightSpeed,
        pathSpeedY: (0.08 + Math.random() * 0.15) * theme.flightSpeed,
        pathSpeedZ: (0.05 + Math.random() * 0.1) * theme.flightSpeed,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseScale: 0.4 + Math.random() * 0.6,
    };
    const s = group.userData.baseScale;
    group.scale.set(s, s, s);
    return group;
  };

  const createPetal = (theme: any) => {
    const THREE = window.THREE;
    const group = new THREE.Group();
    const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
    
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.05, 0.1, 0.1, 0.15, 0.05, 0.2);
    shape.bezierCurveTo(0, 0.22, -0.05, 0.2, -0.05, 0.15);
    shape.bezierCurveTo(-0.1, 0.1, -0.05, 0.05, 0, 0);
    
    const geo = new THREE.ShapeGeometry(shape, 6);
    const mat = new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const petal = new THREE.Mesh(geo, mat);
    group.add(petal);
    
    group.userData = {
        leftWing: petal, rightWing: petal,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: theme.wingSpeed,
        pathA: 1 + Math.random() * 2,
        pathB: 1 + Math.random() * 1.5,
        pathSpeedX: 0.02 + Math.random() * 0.03,
        pathSpeedY: 0.01 + Math.random() * 0.02,
        pathSpeedZ: 0.005 + Math.random() * 0.01,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseScale: 0.5 + Math.random() * 1,
        isFalling: true,
        fallSpeed: 0.003 + Math.random() * 0.005,
        rotSpeed: 0.01 + Math.random() * 0.03,
    };
    const s = group.userData.baseScale;
    group.scale.set(s, s, s);
    return group;
  };

  const createFirefly = (theme: any) => {
    const THREE = window.THREE;
    const group = new THREE.Group();
    const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
    
    const geo = new THREE.SphereGeometry(0.04, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const core = new THREE.Mesh(geo, mat);
    group.add(core);
    
    const glowGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);
    
    group.userData = {
        leftWing: core, rightWing: glow,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: theme.wingSpeed,
        pathA: 1.5 + Math.random() * 2,
        pathB: 1 + Math.random() * 1.5,
        pathSpeedX: 0.03 + Math.random() * 0.05,
        pathSpeedY: 0.02 + Math.random() * 0.04,
        pathSpeedZ: 0.01 + Math.random() * 0.02,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseScale: 0.5 + Math.random() * 1,
        glowPhase: Math.random() * Math.PI * 2,
        core, glow,
    };
    return group;
  };

  const createFish = (theme: any) => {
    const THREE = window.THREE;
    const group = new THREE.Group();
    const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
    
    const bodyGeo = new THREE.SphereGeometry(0.1, 8, 6);
    bodyGeo.scale(2, 0.8, 0.5);
    const bodyMat = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.7, shininess: 100 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);
    
    const tailGeo = new THREE.ConeGeometry(0.08, 0.15, 4);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.x = -0.2;
    tail.rotation.z = -Math.PI / 2;
    group.add(tail);
    
    group.userData = {
        leftWing: body, rightWing: tail,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: theme.wingSpeed,
        pathA: 2.5 + Math.random() * 2,
        pathB: 1 + Math.random() * 1,
        pathSpeedX: 0.04 + Math.random() * 0.04,
        pathSpeedY: 0.02 + Math.random() * 0.02,
        pathSpeedZ: 0.01 + Math.random() * 0.02,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseScale: 0.5 + Math.random() * 0.8,
    };
    const s = group.userData.baseScale;
    group.scale.set(s, s, s);
    return group;
  };

  const createLightOrb = (theme: any) => {
    const THREE = window.THREE;
    const group = new THREE.Group();
    const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
    
    const geo = new THREE.SphereGeometry(0.06, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const core = new THREE.Mesh(geo, mat);
    group.add(core);
    
    const glowGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);
    
    const ringGeo = new THREE.RingGeometry(0.1, 0.12, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);
    
    group.userData = {
        leftWing: core, rightWing: glow,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: theme.wingSpeed,
        pathA: 2 + Math.random() * 2,
        pathB: 2 + Math.random() * 2,
        pathSpeedX: 0.015 + Math.random() * 0.02,
        pathSpeedY: 0.01 + Math.random() * 0.02,
        pathSpeedZ: 0.008 + Math.random() * 0.01,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        baseScale: 0.6 + Math.random() * 0.8,
        ring, core, glow,
        glowPhase: Math.random() * Math.PI * 2,
    };
    const s = group.userData.baseScale;
    group.scale.set(s, s, s);
    return group;
  };

  const createParticles = (theme: any) => {
    const THREE = window.THREE;
    const count = theme.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 1] = Math.random() * 8 - 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = -0.005 - Math.random() * 0.01; 
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
        sizes[i] = 0.03 + Math.random() * 0.06;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.userData = { velocities };
    
    const material = new THREE.PointsMaterial({
        color: theme.particleColor,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });
    return new THREE.Points(geometry, material);
  };

  const populateScene = (themeName: string) => {
    if (!sceneRef.current) return;
    const theme = THEMES[themeName];
    
    // Clear
    creaturesRef.current.forEach(c => sceneRef.current.remove(c));
    creaturesRef.current = [];
    if (particlesRef.current) sceneRef.current.remove(particlesRef.current);

    // Populate
    for (let i = 0; i < theme.count * intensityRef.current; i++) {
        let creature;
        if (theme.creatures === 'butterfly') creature = createButterfly(theme);
        else if (theme.creatures === 'petal') creature = createPetal(theme);
        else if (theme.creatures === 'firefly') creature = createFirefly(theme);
        else if (theme.creatures === 'fish') creature = createFish(theme);
        else if (theme.creatures === 'light_orb') creature = createLightOrb(theme);
        else creature = createButterfly(theme);

        creature.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -2 - Math.random() * 6);
        sceneRef.current.add(creature);
        creaturesRef.current.push(creature);
    }
    
    particlesRef.current = createParticles(theme);
    sceneRef.current.add(particlesRef.current);
    
    const overlay = document.getElementById('ambient-overlay');
    if(overlay) overlay.style.background = theme.ambientColor;
  };

  const animate = () => {
    requestRef.current = requestAnimationFrame(animate);
    
    if (!clockRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const time = clockRef.current.getElapsedTime();
    const theme = THEMES[currentThemeRef.current];

    creaturesRef.current.forEach(creature => {
        const d = creature.userData;
        
        // Specific Animations
        if (theme.creatures === 'butterfly') {
            const flapAngle = Math.sin(time * 12 * d.wingSpeed + d.wingPhase) * 0.8;
            d.leftWing.rotation.y = flapAngle;
            d.rightWing.rotation.y = -flapAngle;
        }
        else if (d.isFalling) { // Petals
            creature.position.y -= d.fallSpeed;
            creature.rotation.x += d.rotSpeed;
            creature.rotation.z += d.rotSpeed * 0.5;
            if (creature.position.y < -4) {
                creature.position.y = 4;
                creature.position.x = (Math.random() - 0.5) * 8;
            }
        }
        else if (d.core && d.glow) { // Firefly / Orb
            const pulse = 0.5 + Math.sin(time * 2 + d.glowPhase) * 0.5;
            d.glow.material.opacity = 0.1 + pulse * 0.2;
            d.core.material.opacity = 0.6 + pulse * 0.4;
            if (d.ring) {
               d.ring.rotation.x = time * 0.5;
               d.ring.rotation.y = time * 0.3;
            }
        }

        // Common Path Logic (Lissajous)
        if (!d.isFalling) {
            const px = Math.sin(time * d.pathSpeedX + d.phaseX) * d.pathA;
            const py = Math.sin(time * d.pathSpeedY * 1.3 + d.phaseY) * d.pathB;
            const pz = Math.cos(time * d.pathSpeedZ * 0.7 + d.phaseZ) * 3 - 4;
            
            creature.position.x += (px - creature.position.x) * 0.02;
            creature.position.y += (py - creature.position.y) * 0.02;
            creature.position.z += (pz - creature.position.z) * 0.01;

            const dx = px - creature.position.x;
            if (Math.abs(dx) > 0.01 && (theme.creatures === 'butterfly' || theme.creatures === 'fish')) {
                creature.rotation.y = dx > 0 ? 0 : Math.PI;
            }
        }

        // Gyro response
        creature.position.x += deviceOrientationRef.current.gamma * 0.0001;
        creature.position.y -= deviceOrientationRef.current.beta * 0.0001;
    });

    // Particles
    if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        const velocities = particlesRef.current.geometry.userData.velocities;
        for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.001;
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];
            if (positions[i * 3 + 1] < -4) {
                positions[i * 3 + 1] = 5;
                positions[i * 3] = (Math.random() - 0.5) * 12;
            }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Camera Sway
    cameraRef.current.position.x = Math.sin(time * 0.1) * 0.1;
    cameraRef.current.position.y = Math.cos(time * 0.15) * 0.05;
    
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const handleOrientation = (event: any) => {
    deviceOrientationRef.current.alpha = event.alpha || 0;
    deviceOrientationRef.current.beta = event.beta || 0;
    deviceOrientationRef.current.gamma = event.gamma || 0;
  };

  const startTimer = () => {
    clearInterval(timerIntervalRef.current);
    const display = document.getElementById('timer-display');
    
    // Update display immediately on start
    const updateDisplay = () => {
        const min = Math.floor(timerSecondsRef.current / 60);
        const sec = timerSecondsRef.current % 60;
        if(display) display.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    };
    updateDisplay();

    timerIntervalRef.current = setInterval(() => {
        timerSecondsRef.current--;
        updateDisplay();
        if (timerSecondsRef.current <= 0) {
            clearInterval(timerIntervalRef.current);
            timerSecondsRef.current = 0;
        }
    }, 1000);
  };

  // --- REACT HANDLERS ---

  const handleStartAR = async () => {
    if (!isThreeLoaded) return;
    
    // Check permission for iOS
    if (typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const response = await (window as any).DeviceOrientationEvent.requestPermission();
            if (response === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        window.addEventListener('deviceorientation', handleOrientation);
    }

    setArStarted(true);
    await startCamera();
    initScene();
    populateScene(currentThemeRef.current);
    animate();
    startTimer();
  };

  const handleThemeChange = (themeId: string) => {
    currentThemeRef.current = themeId;
    const nameEl = document.getElementById('theme-name');
    if(nameEl) nameEl.textContent = THEMES[themeId].name;
    
    const chips = document.querySelectorAll('.theme-chip');
    chips.forEach(c => {
        if((c as HTMLElement).dataset.theme === themeId) c.classList.add('active');
        else c.classList.remove('active');
    });

    populateScene(themeId);
  };

  const handleTimerChange = (minutes: number) => {
    setActiveTimer(minutes);
    timerSecondsRef.current = minutes * 60;
    
    // Update display immediately without waiting for interval tick
    const display = document.getElementById('timer-display');
    if(display) display.textContent = `${minutes}:00`;
    
    // Restart timer logic to ensure smooth countdown
    startTimer();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
      <style>{`
        #camera-feed { position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
        #ar-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
        .ui-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none; }
        .ui-overlay > * { pointer-events: auto; }
        .theme-strip { display: flex; gap: 10px; overflow-x: auto; padding: 10px 0; margin-bottom: 8px; scrollbar-width: none; }
        .theme-chip { flex-shrink: 0; padding: 8px 18px; border-radius: 25px; border: 1.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); cursor: pointer; transition: all 0.3s ease; }
        .theme-chip.active { border-color: #6B8E7C; background: rgba(107,142,124,0.25); color: white; }
        .timer-display { position: absolute; top: 110px; left: 50%; transform: translateX(-50%); font-family: serif; font-size: 2.8rem; font-weight: 300; text-shadow: 0 2px 20px rgba(0,0,0,0.5); opacity: 0.8; }
        #demo-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; background: linear-gradient(135deg, #e8e4d8 0%, #d4c8a8 30%, #c8d8c4 70%, #e8e4d8 100%); display: none; }
        .room-grid { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.15; background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 40px 40px; display: none; }
        #ambient-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; mix-blend-mode: soft-light; opacity: 0.3; transition: background 1s ease; }
        
        .timer-chip {
            padding: 6px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.6);
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .timer-chip.active {
            border-color: #C9A96E;
            background: rgba(201,169,110,0.2);
            color: white;
        }
      `}</style>

      {/* Container for AR */}
      <div id="ar-container" ref={containerRef}>
        <div id="demo-bg"></div>
        <div className="room-grid" id="room-grid"></div>
        <video id="camera-feed" ref={videoRef} autoPlay playsInline muted></video>
        <div id="ambient-overlay"></div>
      </div>

      {/* Start Screen */}
      <div id="start-screen" className={`fixed top-0 left-0 w-full h-full z-[100] bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-700 ${arStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* UPPER BACK BUTTON (Requested Fix) */}
        <button 
            onClick={() => handleExit(true)}
            className="absolute top-6 left-6 z-[200] text-white flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all font-bold"
        >
            <span className="text-xl">←</span> Back
        </button>

        <div className="text-6xl mb-4 animate-bounce">🦋</div>
        <h1 className="text-4xl font-serif text-[#6B8E7C] mb-2">Butterfly Garden</h1>
        <p className="text-sm uppercase tracking-widest text-white/50 mb-8">AR Ambience</p>
        <div className="px-3 py-1 border border-[#6B8E7C] rounded-full text-[#6B8E7C] text-xs mb-6 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-[#6B8E7C] animate-pulse"></span> AUGMENTED REALITY MODE
        </div>
        <p className="text-center text-white/60 text-sm max-w-xs mb-8">
           Point your phone at any wall or window.<br/>
           Watch as <em>digital butterflies</em> fill your room.
        </p>
        
        {/* CLICK HANDLER FIXED TO REACT FUNCTION */}
        <button 
            onClick={handleStartAR} 
            className="px-16 py-4 rounded-full bg-gradient-to-r from-[#6B8E7C] to-[#4A6B5C] text-white font-bold text-lg shadow-lg hover:scale-105 transition-all"
        >
            Enter Garden
        </button>
        
        <p className="text-white/30 text-xs mt-4">📷 Camera access required</p>
      </div>

      {/* UI Overlay */}
      <div className={`ui-overlay ${arStarted ? 'block' : 'hidden'}`} id="ui-overlay">
        <div className="top-bar absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
           <div>
             <div className="text-xl font-serif text-white" id="theme-name">🦋 Butterfly Garden</div>
             <div className="text-xs text-[#6B8E7C] uppercase tracking-widest mt-1 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> AR ACTIVE
             </div>
           </div>
           <button 
             onClick={() => handleExit(true)} 
             className="w-10 h-10 rounded-full bg-black/30 border border-white/20 text-white flex items-center justify-center backdrop-blur-md"
           >
             ✕
           </button>
        </div>

        <div className="timer-display" id="timer-display">10:00</div>

        <div className="bottom-controls absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
           
           {/* THEME SELECTOR */}
           <div className="theme-strip">
              <div className="theme-chip active" data-theme="butterfly" onClick={() => handleThemeChange('butterfly')}>🦋 Butterfly Garden</div>
              <div className="theme-chip" data-theme="ocean" onClick={() => handleThemeChange('ocean')}>🏖️ Ocean Waves</div>
              <div className="theme-chip" data-theme="sakura" onClick={() => handleThemeChange('sakura')}>🌸 Sakura Rain</div>
              <div className="theme-chip" data-theme="forest" onClick={() => handleThemeChange('forest')}>🌲 Enchanted Forest</div>
              <div className="theme-chip" data-theme="himalaya" onClick={() => handleThemeChange('himalaya')}>🏔️ Himalayan Dawn</div>
           </div>

           {/* TIMER SELECTOR (ADDED) */}
           <div className="flex justify-center gap-2 mb-4">
              {[5, 10, 15, 30].map(min => (
                  <div 
                      key={min}
                      className={`timer-chip ${activeTimer === min ? 'active' : ''}`}
                      onClick={() => handleTimerChange(min)}
                  >
                      {min} min
                  </div>
              ))}
           </div>
           
           {/* ACTION BUTTONS */}
           <div className="flex justify-center gap-8 mt-4 text-white/70 text-xs uppercase tracking-widest">
              <div className="flex flex-col items-center gap-1">
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xl bg-white/5 backdrop-blur-sm">🔄</div>
                 <span>Flip</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white">
                 <div className="w-12 h-12 rounded-full border border-[#6B8E7C] flex items-center justify-center text-xl bg-[#6B8E7C]/20 backdrop-blur-sm">🔊</div>
                 <span>Sound</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xl bg-white/5 backdrop-blur-sm">📸</div>
                 <span>Cap</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
