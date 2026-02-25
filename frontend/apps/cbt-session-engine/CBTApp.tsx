import React, { useState, useEffect } from 'react';
import { ViewState, SessionTemplate, SessionResult } from './types';
import Dashboard from './components/Dashboard';
import SessionBuilder from './components/SessionBuilder';
import SessionRunner from './components/SessionRunner';
import ResultsView from './components/ResultsView';
import TrainingEngine from './components/Training/TrainingEngine';
import { getTemplates, saveTemplate, deleteTemplate, getResults, saveResult } from './services/storageService';

interface CBTAppProps {
  onBack?: () => void;
}

const CBTApp: React.FC<CBTAppProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [templates, setTemplates] = useState<SessionTemplate[]>([]);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isDirectLaunch, setIsDirectLaunch] = useState(false);
  const directLaunchHandled = React.useRef(false);

  // Active state for editing/running
  const [activeTemplate, setActiveTemplate] = useState<SessionTemplate | null>(null);

  useEffect(() => {
    const allTemplates = getTemplates();
    setTemplates(allTemplates);
    setResults(getResults());

    // Handle direct launch via templateId in URL
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1]);
    const directTemplateId = params.get('templateId');

    if (directTemplateId && !directLaunchHandled.current) {
      const template = allTemplates.find(t => t.id === directTemplateId);
      if (template) {
        setActiveTemplate(template);
        setView('RUNNER');
        setIsDirectLaunch(true);
        directLaunchHandled.current = true;

        // Remove param from URL to prevent loops on back/refresh
        const newHash = hash.split('?')[0];
        window.history.replaceState(null, '', newHash);
      }
    }
  }, [view]); // Refresh when view changes

  const handleCreate = () => {
    setActiveTemplate(null);
    setView('BUILDER');
  };

  const handleEdit = (t: SessionTemplate) => {
    setActiveTemplate(t);
    setView('BUILDER');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id);
      setTemplates(getTemplates());
    }
  };

  const handleRun = (t: SessionTemplate) => {
    setActiveTemplate(t);
    setView('RUNNER');
    setIsDirectLaunch(false); // Entering from dashboard is not direct launch
  };

  const handleSaveTemplate = (t: SessionTemplate) => {
    saveTemplate(t);
    setTemplates(getTemplates());
    setView('DASHBOARD');
  };

  const handlePreview = (t: SessionTemplate) => {
    setActiveTemplate(t);
    setView('PREVIEW');
  };

  const handleSessionComplete = (r: SessionResult) => {
    saveResult(r);
    setResults(getResults());
  };

  const handleAddGenerated = (t: SessionTemplate) => {
    saveTemplate(t);
    setTemplates(getTemplates());
  };

  // Improved exit/back logic
  const handleExit = () => {
    if (isDirectLaunch && onBack) {
      onBack();
    } else {
      setView('DASHBOARD');
    }
  };

  return (
    <div className="min-h-screen bg-accent text-slate-900 font-sans">
      {view === 'DASHBOARD' && (
        <Dashboard
          templates={templates}
          results={results}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRun={handleRun}
          onAddGenerated={handleAddGenerated}
          onViewResults={() => setView('RESULTS')}
          onEnterAcademy={() => setView('TRAINING')}
          onBack={onBack}
        />
      )}

      {view === 'BUILDER' && (
        <SessionBuilder
          initialTemplate={activeTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => setView('DASHBOARD')}
          onPreview={handlePreview}
        />
      )}

      {view === 'RUNNER' && activeTemplate && (
        <SessionRunner
          template={activeTemplate}
          onComplete={handleSessionComplete}
          onExit={handleExit}
          mode="live"
        />
      )}

      {view === 'PREVIEW' && activeTemplate && (
        <SessionRunner
          template={activeTemplate}
          onComplete={() => { }}
          onExit={() => setView('BUILDER')}
          mode="preview"
        />
      )}

      {view === 'RESULTS' && (
        <ResultsView
          results={results}
          onBack={() => setView('DASHBOARD')}
        />
      )}

      {view === 'TRAINING' && (
        <TrainingEngine
          onBack={() => setView('DASHBOARD')}
        />
      )}
    </div>
  );
};

export { CBTApp };
export default CBTApp;