import React from 'react';
import { Clock, Play, Heart, Brain, Zap, Shield, AlertCircle } from 'lucide-react';
import { Template } from '../types';

interface Props {
  template: Template;
  onPreview: (t: Template) => void;
  onClone: (t: Template) => void;
  onRun: (t: Template) => void;
  onEdit: (t: Template) => void;
  onShare: (t: Template) => void;
}

const ACCENT_BLUE = '#1D72FE';

export const TemplateCard: React.FC<Props> = ({ template, onPreview, onRun }) => {
  const getIcon = () => {
    switch(template.type) {
      case 'anxiety_management': return <Zap className="text-orange-500" size={32} />;
      case 'depression_assessment': return <Heart className="text-red-500" size={32} />;
      case 'cognitive_restructuring': return <Brain className="text-purple-500" size={32} />;
      case 'exposure_therapy': return <Shield className="text-green-500" size={32} />;
      default: return <AlertCircle className="text-gray-400" size={32} />;
    }
  };

  return (
    <div className="glass-card rounded-[32px] p-8 flex flex-col h-full transition-all cursor-pointer group bg-white" onClick={() => onRun(template)}>
      <div className="mb-6">
        {getIcon()}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{template.title}</h3>
      <p className="text-gray-600 text-sm mb-8 leading-relaxed line-clamp-3">
        {template.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Clock size={14} />
          {template.duration}
        </div>
        <div 
          style={{backgroundColor: `${ACCENT_BLUE}15`}} 
          className="w-10 h-10 rounded-full group-hover:bg-[#1D72FE] transition-all flex items-center justify-center"
        >
          <Play size={16} style={{color: ACCENT_BLUE}} className="group-hover:text-white" fill="currentColor" />
        </div>
      </div>
    </div>
  );
};