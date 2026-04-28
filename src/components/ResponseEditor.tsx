import React, { useState, useEffect } from 'react';
import { useStore } from '../store/responseStore';
import { X } from 'lucide-react';

interface ResponseEditorProps {
  responseId: string | null;
  onClose: () => void;
}

export default function ResponseEditor({ responseId, onClose }: ResponseEditorProps) {
  const { responses, addResponse, updateResponse, modules } = useStore();
  
  const [intent, setIntent] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [targetApp, setTargetApp] = useState<string[]>(['All']);
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (responseId) {
      const existing = responses.find(r => r.id === responseId);
      if (existing) {
        setIntent(existing.intent);
        setKeywordsInput(existing.keywords.join(', '));
        setResponse(existing.response);
        setStatus(existing.status);
        setTargetApp(existing.targetApp || ['All']);
      }
    } else {
      setIntent('');
      setKeywordsInput('');
      setResponse('');
      setStatus('active');
      setTargetApp(['All']);
    }
  }, [responseId, responses]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!intent.trim()) newErrors.intent = 'Intent identifier required';
    if (!keywordsInput.trim()) newErrors.keywords = 'At least one keyword required';
    if (!response.trim()) newErrors.response = 'Payload required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);
    
    if (responseId) {
      updateResponse(responseId, { intent, keywords, response, status, targetApp });
    } else {
      addResponse({ intent, keywords, response, status, targetApp });
    }
    
    onClose();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-6 shrink-0">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {responseId ? 'RESPONSE EDITOR' : 'NEW RESPONSE'}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1 overflow-auto">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Intent Identifier
          </label>
          <input
            type="text"
            value={intent}
            onChange={e => setIntent(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
            placeholder="e.g. ORDER_STATUS"
            className={`border bg-slate-50 p-2 text-xs font-mono rounded-sm focus:outline-none focus:border-primary transition-colors ${errors.intent ? 'border-red-400' : 'border-slate-200'}`}
          />
          {errors.intent && <span className="text-[10px] text-red-500 -mt-1">{errors.intent}</span>}
        </div>

        <div className="flex flex-col gap-1">
           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Trigger Keywords
          </label>
          <input
            type="text"
            value={keywordsInput}
            onChange={e => setKeywordsInput(e.target.value)}
            placeholder="refund, return, money"
            className={`border bg-white p-2 text-xs rounded-sm focus:outline-none focus:border-primary transition-colors ${errors.keywords ? 'border-red-400' : 'border-slate-200'}`}
          />
           {errors.keywords && <span className="text-[10px] text-red-500 -mt-1">{errors.keywords}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex flex-col gap-1 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Target App
            </label>
            <div 
              className="border border-slate-200 p-2 text-xs rounded-sm bg-white cursor-pointer min-h-[34px] flex items-center shadow-sm"
              onClick={() => setIsAppDropdownOpen(!isAppDropdownOpen)}
            >
              <div className="truncate">
                {targetApp.length === 0 ? "Select target apps" : targetApp.includes('All') ? 'All' : targetApp.join(', ')}
              </div>
            </div>
            
            {isAppDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsAppDropdownOpen(false)}
                />
                <div className="absolute top-10 left-0 z-20 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-sm max-h-48 overflow-y-auto">
                  <div 
                    className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer flex items-center gap-2 border-b border-slate-100"
                    onClick={() => setTargetApp(['All'])}
                  >
                    <input 
                      type="checkbox" 
                      checked={targetApp.includes('All')} 
                      readOnly 
                      className="pointer-events-none rounded-sm border-slate-300 text-primary focus:ring-primary h-3 w-3" 
                    />
                    <span className="font-medium">All</span>
                  </div>
                  {modules.map(mod => (
                    <div 
                      key={mod}
                      className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        if (targetApp.includes('All')) {
                          setTargetApp([mod]);
                        } else {
                          if (targetApp.includes(mod)) {
                            const newApps = targetApp.filter(a => a !== mod);
                            setTargetApp(newApps.length === 0 ? ['All'] : newApps);
                          } else {
                            setTargetApp([...targetApp, mod]);
                          }
                        }
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={!targetApp.includes('All') && targetApp.includes(mod)} 
                        readOnly 
                        className="pointer-events-none rounded-sm border-slate-300 text-primary focus:ring-primary h-3 w-3" 
                      />
                      {mod}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Status
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="border border-slate-200 p-2 text-xs rounded-sm bg-white focus:outline-none focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-h-[150px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Static Response Template
          </label>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Provide exact instructions or prescribed response text..."
            className={`flex-1 border p-3 text-xs leading-relaxed focus:outline-none focus:border-primary rounded-sm resize-none ${errors.response ? 'border-red-400' : 'border-slate-200'}`}
          />
           {errors.response && <span className="text-[10px] text-red-500 -mt-1">{errors.response}</span>}
        </div>

        <div className="pt-4 border-t border-slate-200 flex gap-3 shrink-0">
          <button 
            onClick={handleSave}
            className="flex-[2] py-3 bg-primary hover:opacity-90 text-white text-[10px] font-bold tracking-widest uppercase rounded-sm transition-opacity cursor-pointer"
          >
            {responseId ? 'UPDATE RESPONSE' : 'CREATE RESPONSE'}
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-colors text-center cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
