import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { RAW_PROMPT_TEMPLATE, INITIAL_MODULES } from '../constants';
import { SimrsModule } from '../types';

interface PromptViewerProps {
  modules: SimrsModule[];
}

const PromptViewer: React.FC<PromptViewerProps> = ({ modules }) => {
  const [copied, setCopied] = useState(false);

  // Generate the dynamic prompt based on selected modules
  const selectedModuleNames = modules
    .filter(m => m.selected)
    .map(m => `    *   ${m.name}: ${m.description}`)
    .join('\n');

  const fullPrompt = RAW_PROMPT_TEMPLATE.replace('{{MODULES_LIST}}', selectedModuleNames || "    *   (Tidak ada modul spesifik dipilih, buat model umum)");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Prompt Google AI Studio
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gunakan prompt ini di Google AI Studio jika Anda ingin melakukan kustomisasi manual yang lebih mendalam.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            copied 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Disalin' : 'Salin Prompt'}
        </button>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-slate-900/5 to-transparent pointer-events-none rounded-t-xl" />
        <textarea
          readOnly
          value={fullPrompt}
          className="w-full h-[600px] p-6 bg-slate-900 text-slate-100 font-mono text-sm rounded-xl focus:outline-none resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default PromptViewer;
