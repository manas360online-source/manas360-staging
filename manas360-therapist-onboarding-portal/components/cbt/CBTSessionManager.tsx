
import React, { useState, useEffect } from 'react';
import { ViewState, SessionTemplate, SessionResult } from './types';
import CBTDashboard from './CBTDashboard';
import SessionBuilder from './SessionBuilder';
import SessionRunner from './SessionRunner';
import ResultsView from './ResultsView';
import TrainingEngine from './TrainingEngine';
import { getTemplates, saveTemplate, deleteTemplate, getResults, saveResult } from './storageService';

interface CBTSessionManagerProps {
    onBack: () => void;
}

import TrainingSidebar from '../TrainingSidebar';

const CBTSessionManager: React.FC<CBTSessionManagerProps> = ({ onBack }) => {
    return (
        <>
            <TrainingSidebar />
            <div className="flex-1 h-screen overflow-y-auto bg-slate-50">
                <CBTSessionManagerInternal onBack={onBack} />
            </div>
        </>
    );
};

const CBTSessionManagerInternal: React.FC<CBTSessionManagerProps> = ({ onBack }) => {
    const [viewState, setViewState] = useState<ViewState>('DASHBOARD');
    const [templates, setTemplates] = useState<SessionTemplate[]>([]);
    const [results, setResults] = useState<SessionResult[]>([]);
    const [activeTemplate, setActiveTemplate] = useState<SessionTemplate | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setTemplates(getTemplates());
        setResults(getResults());
    };

    const handleSaveTemplate = (template: SessionTemplate) => {
        saveTemplate(template);
        loadData();
        setViewState('DASHBOARD');
        setActiveTemplate(null);
    };

    const handleDeleteTemplate = (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            deleteTemplate(id);
            loadData();
        }
    };

    const handleSaveResult = (result: SessionResult) => {
        saveResult(result);
        loadData();
        setViewState('RESULTS');
    };

    const renderContent = () => {
        switch (viewState) {
            case 'DASHBOARD':
                return (
                    <CBTDashboard
                        templates={templates}
                        results={results}
                        onCreate={() => {
                            setActiveTemplate(null);
                            setViewState('BUILDER');
                        }}
                        onEdit={(t) => {
                            setActiveTemplate(t);
                            setViewState('BUILDER');
                        }}
                        onDelete={handleDeleteTemplate}
                        onRun={(t) => {
                            setActiveTemplate(t);
                            setViewState('RUNNER');
                        }}
                        onAddGenerated={(t) => {
                            saveTemplate(t);
                            loadData();
                        }}
                        onViewResults={() => setViewState('RESULTS')}
                        onEnterAcademy={() => setViewState('TRAINING')}
                        onBack={onBack}
                    />
                );
            case 'BUILDER':
                return (
                    <SessionBuilder
                        initialTemplate={activeTemplate}
                        onSave={handleSaveTemplate}
                        onCancel={() => {
                            setActiveTemplate(null);
                            setViewState('DASHBOARD');
                        }}
                        onPreview={(t) => {
                            setActiveTemplate(t);
                            setViewState('PREVIEW');
                        }}
                    />
                );
            case 'RUNNER':
                if (!activeTemplate) return null;
                return (
                    <SessionRunner
                        template={activeTemplate}
                        onComplete={handleSaveResult}
                        onExit={() => {
                            setActiveTemplate(null);
                            setViewState('DASHBOARD');
                        }}
                    />
                );
            case 'PREVIEW':
                if (!activeTemplate) return null;
                return (
                    <SessionRunner
                        template={activeTemplate}
                        mode="preview"
                        onComplete={() => {
                            alert('Preview finished! No data saved.');
                            setViewState('BUILDER');
                        }}
                        onExit={() => setViewState('BUILDER')}
                    />
                );
            case 'RESULTS':
                return (
                    <ResultsView
                        results={results}
                        onBack={() => setViewState('DASHBOARD')}
                        onDelete={(id) => {
                            // Assuming logic to delete result if needed, though not explicitly in source interface often
                            loadData();
                        }}
                    />
                );
            case 'TRAINING':
                return (
                    <TrainingEngine
                        onBack={() => setViewState('DASHBOARD')}
                        onComplete={() => setViewState('DASHBOARD')}
                    />
                );
            default:
                return <div>Unknown View</div>;
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-900">
            {renderContent()}
        </div>
    );
};

export default CBTSessionManager;
