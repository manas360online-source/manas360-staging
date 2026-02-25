import React, { useState } from 'react';
import { CheckCircle, Lock } from 'lucide-react';
import { VIDEO_TUTORIALS } from '../constants';
import { User } from '../types';

const ModuleLink = ({ id, title, active, locked, completed, onClick }: { id: string, title: string, active: boolean, locked: boolean, completed: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={locked}
    className={`block w-full text-left px-4 py-3 text-sm rounded-md transition-all flex items-center justify-between ${active
      ? 'bg-mans-100 text-mans-800 font-semibold border-l-4 border-mans-500'
      : locked
        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
  >
    <span>{title}</span>
    {locked && <Lock className="w-3 h-3 text-gray-400" />}
    {completed && <CheckCircle className="w-4 h-4 text-green-500" />}
  </button>
);

const VideoPlayer = ({ video }: { video: typeof VIDEO_TUTORIALS[0] }) => {
  // Append controls=1 to ensure controls are visible
  const embedSrc = video.embedUrl ? `${video.embedUrl}?controls=1` : '';

  return (
    <div className="bg-black rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 aspect-video">
      {video.embedUrl ? (
        <iframe
          src={embedSrc}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={video.title}
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">Video Unavailable</div>
      )}
    </div>
  );
};

const LockOverlay = () => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center border border-gray-200 rounded-xl">
    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 shadow-inner">
      <Lock className="w-6 h-6 text-gray-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-800">Module Locked</h3>
    <p className="text-sm text-gray-500">Complete previous module to unlock.</p>
  </div>
);

interface ModuleSectionProps {
  id: string;
  title: string;
  videoIndex: number;
  isLocked: boolean;
  progress: number;
  updateKey: keyof User['progress'];
  onUpdateProgress: (mod: keyof User['progress'], val: number) => void;
  children?: React.ReactNode;
}

const ModuleSection = ({
  id,
  title,
  videoIndex,
  isLocked,
  progress,
  updateKey,
  onUpdateProgress,
  children
}: ModuleSectionProps) => (
  <section id={id} className="scroll-mt-8 relative mb-16">
    {isLocked && <LockOverlay />}
    <div className="flex items-center mb-6">
      <span className={`font-bold px-3 py-1 rounded-full text-sm mr-3 ${progress === 100 ? 'bg-green-100 text-green-700' : 'bg-mans-100 text-mans-700'}`}>
        {title.split(':')[0]}
      </span>
      <h2 className="text-2xl font-bold text-gray-800">{title.split(':')[1]}</h2>
      {progress === 100 && <CheckCircle className="ml-2 w-6 h-6 text-green-500" />}
    </div>

    <VideoPlayer video={VIDEO_TUTORIALS[videoIndex]} />

    <div className="prose prose-blue max-w-none text-gray-600 mb-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      {children}
    </div>

    <div className="bg-mans-50 p-6 rounded-xl border border-mans-200 text-center">
      <h3 className="font-bold text-mans-900 mb-2">Module Completion</h3>
      <p className="text-mans-700 text-sm mb-4">I have watched the video and read the materials.</p>
      <button
        onClick={() => onUpdateProgress(updateKey, 100)}
        disabled={progress === 100}
        className={`px-6 py-2 rounded-lg font-bold transition-colors ${progress === 100 ? 'bg-green-500 text-white cursor-default' : 'bg-mans-600 hover:bg-mans-700 text-white'}`}
      >
        {progress === 100 ? 'Completed' : 'Mark as Read / Completed'}
      </button>
    </div>
  </section>
);

const TrainingGuide = ({ user, onUpdateProgress, onBack }: { user: User, onUpdateProgress: (mod: keyof User['progress'], val: number) => void, onBack?: () => void }) => {
  const [activeModule, setActiveModule] = useState('m1');

  React.useEffect(() => {
    // Only scroll if we are not at the top or if specific module behavior is needed.
    // Since we are entering the guide fresh, 'm1' is default.
    // If we want to auto-scroll to active module on load:
    const element = document.getElementById(activeModule);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeModule]);

  const scrollToModule = (id: string) => {
    setActiveModule(id);
  };

  const calculateTotalProgress = () => {
    const { module1, module2, module3, module4, module5, module6, module7 } = user.progress;
    return Math.round((module1 + module2 + module3 + module4 + module5 + module6 + module7) / 7);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sticky Table of Contents */}
      <div className="lg:w-72 flex-shrink-0">

        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-gray-500 hover:text-mans-600 font-medium transition-colors"
          >
            <span className="mr-2">←</span> Back to Dashboard
          </button>
        )}

        <div className="sticky top-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">ATMT1 – 5 WHYS</h3>
          <nav className="space-y-1">
            <ModuleLink id="m1" title="Opening: Introduction" active={activeModule === 'm1'} locked={false} completed={user.progress.module1 === 100} onClick={() => scrollToModule('m1')} />
            <ModuleLink id="m2" title="Mod 1: The Problem" active={activeModule === 'm2'} locked={user.progress.module1 < 100} completed={user.progress.module2 === 100} onClick={() => scrollToModule('m2')} />
            <ModuleLink id="m3" title="Mod 2: What is 5 Whys" active={activeModule === 'm3'} locked={user.progress.module2 < 100} completed={user.progress.module3 === 100} onClick={() => scrollToModule('m3')} />
            <ModuleLink id="m4" title="Mod 3: Why This Works" active={activeModule === 'm4'} locked={user.progress.module3 < 100} completed={user.progress.module4 === 100} onClick={() => scrollToModule('m4')} />
            <ModuleLink id="m5" title="Mod 4: How to Apply" active={activeModule === 'm5'} locked={user.progress.module4 < 100} completed={user.progress.module5 === 100} onClick={() => scrollToModule('m5')} />
            <ModuleLink id="m6" title="Mod 5: Common Mistakes" active={activeModule === 'm6'} locked={user.progress.module5 < 100} completed={user.progress.module6 === 100} onClick={() => scrollToModule('m6')} />
            <ModuleLink id="m7" title="Recap & Summary" active={activeModule === 'm7'} locked={user.progress.module6 < 100} completed={user.progress.module7 === 100} onClick={() => scrollToModule('m7')} />
          </nav>

          <div className="mt-6 px-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-600">Total Progress</span>
              <span className="text-xs font-bold text-mans-600">{calculateTotalProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-mans-500 h-2 rounded-full transition-all duration-500" style={{ width: `${calculateTotalProgress()}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">

        <div className="space-y-16 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-mans-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-12">
            <h1 className="text-3xl font-bold mb-2">Complete the Course</h1>
            <p className="text-mans-100 text-lg">Power Tool for Effective & Efficient Therapy</p>
          </div>

          <ModuleSection
            id="m1"
            title="Opening: The 5 Whys Introduction"
            videoIndex={0}
            isLocked={false}
            progress={user.progress.module1}
            updateKey="module1"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">Introduction</h3>
            <p>Welcome to Module starting video, your first module in the AI Training for Therapists series. I'm here to guide you through one of the most powerful yet underutilized tools in therapy: the 5 Whys technique.</p>
            <p>This isn't just another questioning method. The 5 Whys is your pathway to transformation. While most therapy scratches the surface, the 5 Whys takes you deep, uncovering the hidden roots that keep your patients stuck in cycles of pain.</p>
            <p>In the next eight minutes, you'll learn how to move from surface symptoms to core healing. Let's begin.</p>
          </ModuleSection>

          <ModuleSection
            id="m2"
            title="Module 1: The Problem with Surface-Level Therapy"
            videoIndex={1}
            isLocked={user.progress.module1 < 100}
            progress={user.progress.module2}
            updateKey="module2"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">Module 1: THE PROBLEM WITH SURFACE-LEVEL THERAPY</h3>
            <p>Picture this: A patient tells you they're stressed at work. Most conversations stop here. You discuss stress management techniques. Breathing exercises. Time management. The patient feels heard, leaves the session, and returns next week with the same complaint.</p>
            <p>Why? Because you treated the symptom, not the disease.</p>
            <p>Stress at work is rarely about work itself. It's a symptom pointing to something deeper. Maybe it's a fear of failure rooted in childhood criticism. Maybe it's a belief that their worth depends on productivity. Maybe it's unprocessed grief showing up as workaholism.</p>
            <p>This is where conventional therapy often fails. We address what the patient presents, not what the patient actually needs. We become band-aid providers when we should be root surgeons.</p>
            <p>The cost of this approach is immense. Patients attend therapy for months, even years, circling the same issues. They feel frustrated. You feel ineffective. The therapeutic alliance weakens. And the real problem remains buried, untouched, festering.</p>
            <p>The 5 Whys changes this dynamic completely.</p>
          </ModuleSection>

          <ModuleSection
            id="m3"
            title="Module 2: What is the 5 Whys Technique"
            videoIndex={2}
            isLocked={user.progress.module2 < 100}
            progress={user.progress.module3}
            updateKey="module3"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">Module 2: WHAT IS THE 5 WHYS TECHNIQUE</h3>
            <p>The 5 Whys originated in manufacturing. When a machine broke down, engineers didn't just fix the broken part. They asked "why" five times, each answer leading to a deeper question, until they reached the true cause.</p>
            <p>In therapy, we apply the same principle to human behavior and emotion.</p>
            <p>Here's how it works. Your patient presents a problem. Instead of immediately problem-solving, you ask "why." They answer. You ask "why" again. And again. And again. Usually by the fifth why, you've moved from the surface complaint to the core wound.</p>
            <p>Let me show you. A patient says: "I can't sleep at night."</p>
            <p>Why can't you sleep? "My mind races with worries."</p>
            <p>Why does your mind race? "I keep thinking about everything that could go wrong."</p>
            <p>Why do you think about what could go wrong? "I feel like I need to be prepared for every possibility."</p>
            <p>Why do you feel you need to be prepared for everything? "Because when I was young, bad things happened without warning, and I felt helpless."</p>
            <p>Why did feeling helpless as a child affect how you prepare today? "Because I promised myself I would never feel that powerless again."</p>
            <p>Notice the journey. We started with insomnia. We ended at childhood trauma and a defense mechanism formed decades ago. That's the power of the 5 Whys. It's emotional archaeology.</p>
          </ModuleSection>

          <ModuleSection
            id="m4"
            title="Module 3: Why This Works"
            videoIndex={3}
            isLocked={user.progress.module3 < 100}
            progress={user.progress.module4}
            updateKey="module4"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">Module 3: WHY THIS WORKS</h3>
            <p>The 5 Whys works because of how the human mind organizes information. We have surface-level conscious thoughts and deep-level unconscious drivers.</p>
            <p>Most therapy operates in the conscious layer. "I'm stressed" is conscious. "I'm anxious" is conscious. Even "I have childhood trauma" can be conscious. But knowing you have trauma isn't the same as understanding how it shapes your present behavior.</p>
            <p>The 5 Whys creates a bridge between conscious awareness and unconscious programming. Each "why" is a step down into deeper self-knowledge.</p>
            <p>Neurologically, this process activates the prefrontal cortex, the part of your brain responsible for insight and self-reflection. It interrupts automatic emotional reactions by engaging the thinking brain.</p>
            <p>Psychologically, it builds self-awareness. Patients begin to see patterns they've repeated for years. They connect dots they never connected before. This awareness alone is often therapeutic.</p>
            <p>But here's the real magic: once you identify the root cause, you can finally address it effectively. You're no longer treating symptoms. You're healing the wound.</p>
          </ModuleSection>

          <ModuleSection
            id="m5"
            title="Module 4: How to Apply the 5 Whys"
            videoIndex={4}
            isLocked={user.progress.module4 < 100}
            progress={user.progress.module5}
            updateKey="module5"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">Module 4: HOW TO APPLY THE 5 WHYS</h3>
            <p>Let's talk about practical application. How do you actually use the 5 Whys in your sessions?</p>
            <p>First, establish safety. The 5 Whys can be emotionally intense. Your patient needs to trust you before you guide them into vulnerable territory. Build rapport first. Explain what you're doing and why.</p>
            <p>Second, start with the presenting problem. Let your patient state what's bothering them in their own words. Don't rush to interpret or reframe. Just listen.</p>
            <p>Third, ask your first "why." Make it gentle. "Help me understand, why does this bother you?" or "What about this situation troubles you?" The word "why" can feel confrontational, so soften it with curiosity, not interrogation.</p>
            <p>Fourth, listen deeply to the answer. Don't jump ahead in your mind. Stay present. Their answer will guide your next question.</p>
            <p>Fifth, ask "why" again, building on their previous answer. "And why is that important to you?" or "What about that feels difficult?"</p>
            <p>Continue this process. Usually, by the third or fourth why, you'll notice a shift. The patient's voice might change. They might pause longer. Emotions might surface. These are signs you're approaching the root.</p>
            <p>When you reach the core issue, you'll feel it. The room changes. The patient often experiences a moment of recognition. "Oh. That's what this is really about."</p>
            <p>Once you're there, don't rush to fix it. Sit with the revelation. Validate it. Then, and only then, begin therapeutic work on the actual issue.</p>
          </ModuleSection>

          <ModuleSection
            id="m6"
            title="Module 5: Common Mistakes to Avoid"
            videoIndex={5}
            isLocked={user.progress.module5 < 100}
            progress={user.progress.module6}
            updateKey="module6"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">Module 5: COMMON MISTAKES TO AVOID</h3>
            <p>Even powerful techniques can fail if misused. Here are the most common mistakes therapists make with the 5 Whys.</p>
            <p>Mistake one: Asking "why" mechanically. If you sound like a robot repeating "why, why, why," your patient will shut down. Vary your phrasing. "What makes that significant?" "How does that connect to how you feel?" Keep it conversational.</p>
            <p>Mistake two: Stopping too soon. Sometimes you hit what feels like a root cause at "why" number three. But there's often another layer beneath. Don't assume the first emotional answer is the deepest one.</p>
            <p>Mistake three: Going too fast. The 5 Whys isn't an interrogation. If your patient becomes overwhelmed, slow down. One "why" per session is better than five "whys" that traumatize.</p>
            <p>Mistake four: Ignoring emotional cues. If your patient starts crying, dissociating, or becoming defensive, pause the process. Provide support. Return to the technique only when they're regulated.</p>
            <p>Mistake five: Forgetting to close the loop. Once you've identified the root cause, you must address it therapeutically. The 5 Whys is a diagnostic tool, not a treatment in itself. Use it to guide your intervention, whether that's cognitive restructuring, EMDR, somatic work, or another modality.</p>
          </ModuleSection>

          <ModuleSection
            id="m7"
            title="Recap & Summary"
            videoIndex={6}
            isLocked={user.progress.module6 < 100}
            progress={user.progress.module7}
            updateKey="module7"
            onUpdateProgress={onUpdateProgress}
          >
            <h3 className="text-xl font-bold mb-4">When to Use the 5 Whys</h3>
            <p>The 5 Whys isn't appropriate for every situation. Use it when your patient is stuck in repetitive patterns, when surface interventions haven't worked, or when you suspect the presenting problem isn't the real issue.</p>
            <p>Don't use it during a crisis, when your patient is dysregulated, or in the first session with someone who hasn't built trust with you yet.</p>
            <p>Clinical judgment matters. The 5 Whys is a scalpel, not a hammer. Use it precisely, carefully, and intentionally.</p>

            <hr className="my-8 border-gray-200" />

            <h3 className="text-xl font-bold mb-4">Recap & Summary</h3>
            <p>Let's recap. The 5 Whys is a technique for uncovering root causes beneath surface symptoms. It works by asking "why" progressively, moving from conscious complaints to unconscious drivers.</p>
            <p>Use it to bridge the gap between symptoms and healing. Apply it with safety, curiosity, and patience. Avoid mechanical questioning, rushing, or ignoring emotional signals.</p>
            <p>When used well, the 5 Whys transforms therapy from symptom management to genuine healing. It's not just a tool. It's a philosophy: go deeper, heal better.</p>
            <p>You're now ready to apply the 5 Whys in your practice. Take the quiz to test your understanding, and earn your certificate. Remember: the depth of your questions determines the depth of your healing.</p>
          </ModuleSection>
        </div>

      </div>
    </div>
  );
};

export default TrainingGuide;