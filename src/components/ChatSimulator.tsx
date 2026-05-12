import React, { useState, useRef, useEffect } from 'react';
import { simulateChat } from '../lib/gemini';
import { useStore } from '../store/responseStore';
import { SimulatorConfig } from '../types';
import {
  Send, Bot, User, RefreshCw, Zap, ShieldCheck, AlertCircle, BarChart3, Edit2,
  Search, Lightbulb, Star, Box, MessageCircle, Info, Settings, Clock, Activity, Cloud,
  Heart, ThumbsUp, ShoppingCart, Users, Folder, ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AVAILABLE_ICONS: Record<string, React.ElementType> = {
  Zap, ShieldCheck, AlertCircle, BarChart3,
  Search, Lightbulb, Star, Box,
  MessageCircle, Info, Settings, Clock,
  Activity, Cloud, Heart, ThumbsUp,
  ShoppingCart, Users, Folder
};

const ICON_NAMES = Object.keys(AVAILABLE_ICONS);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const PROMPT_STYLE_META = [
  { textClass: 'text-emerald-500', bgClass: 'bg-emerald-50' },
  { textClass: 'text-teal-600', bgClass: 'bg-teal-50' },
  { textClass: 'text-rose-500', bgClass: 'bg-rose-50' },
  { textClass: 'text-indigo-500', bgClass: 'bg-indigo-50' },
];

export default function ChatSimulator() {
  const { responses, simulatorConfig, updateSimulatorConfig, activeModule, setActiveModule, modules } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [expandedIntents, setExpandedIntents] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();
    const textToSend = promptText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: textToSend, timestamp: Date.now() }
    ]);

    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }]
      }));

      const responseText = await simulateChat(textToSend, responses, activeModule, chatHistory);
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: responseText, timestamp: Date.now() }
      ]);
    } catch (error) {
       setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Simulation failed.', timestamp: Date.now() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleModuleSwitch = (mod: string) => {
    setActiveModule(mod);
    setShowModuleDropdown(false);
    handleClear(); // clear chat logically when switching modules
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-5xl border border-slate-200 rounded-sm bg-white mx-auto overflow-hidden relative">
      <div className="flex flex-col flex-1 relative bg-slate-50/50 min-h-0">
        <div className="absolute top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-200 flex justify-between items-center px-6 py-4 z-10 shrink-0">
          <div className="flex items-center gap-3 relative">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 animate-pulse shrink-0"></span>
            
            <div className="relative">
              <button 
                onClick={() => setShowModuleDropdown(!showModuleDropdown)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-widest hover:text-primary transition-colors bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
              >
                {activeModule}
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showModuleDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModuleDropdown(false)}></div>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-lg z-50 overflow-hidden py-1 max-h-64 overflow-y-auto">
                    {modules.map(mod => (
                      <button
                        key={mod}
                        onClick={() => handleModuleSwitch(mod)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${mod === activeModule ? 'bg-primary/5 text-primary' : 'text-slate-600'}`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" /> RESTART SESSION
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-20 pb-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full py-4 text-center px-4">
              <input
                type="text"
                value={simulatorConfig.title}
                onChange={(e) => updateSimulatorConfig({ title: e.target.value })}
                className="text-xl font-bold text-slate-800 mb-2 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none w-full max-w-lg transition-colors px-2 py-1"
                placeholder="Title..."
              />
              <textarea
                value={simulatorConfig.subtitle}
                onChange={(e) => updateSimulatorConfig({ subtitle: e.target.value })}
                className="text-sm text-slate-500 mb-6 max-w-md w-full bg-transparent text-center border border-transparent hover:border-slate-300 focus:border-primary focus:outline-none resize-none transition-colors px-2 py-1"
                rows={2}
                placeholder="Subtitle..."
              />
              
              <div className="flex flex-col gap-3 w-full max-w-md">
                {simulatorConfig.prompts.map((promptConfig, i) => {
                  const styleMeta = PROMPT_STYLE_META[i % PROMPT_STYLE_META.length];
                  const IconComp = AVAILABLE_ICONS[promptConfig.iconName] || AVAILABLE_ICONS['Zap'];
                  return (
                    <div
                      key={i}
                      className="flex items-center px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group gap-2"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIndex = ICON_NAMES.indexOf(promptConfig.iconName);
                          const nextIndex = (currentIndex + 1) % ICON_NAMES.length;
                          const newPrompts = [...simulatorConfig.prompts] as SimulatorConfig['prompts'];
                          newPrompts[i] = { ...newPrompts[i], iconName: ICON_NAMES[nextIndex] };
                          updateSimulatorConfig({ prompts: newPrompts });
                        }}
                        title="Click to change icon"
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110 cursor-pointer ${styleMeta.bgClass} hover:ring-2 ring-primary/20 ring-offset-2`}
                      >
                        <IconComp className={`w-5 h-5 ${styleMeta.textClass}`} />
                      </button>
                      <input
                        type="text"
                        value={promptConfig.text}
                        onChange={(e) => {
                          const newPrompts = [...simulatorConfig.prompts] as SimulatorConfig['prompts'];
                          newPrompts[i] = { ...newPrompts[i], text: e.target.value };
                          updateSimulatorConfig({ prompts: newPrompts });
                        }}
                        className="text-sm font-semibold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none w-full flex-1 px-1 py-1"
                        placeholder={`Prompt ${i + 1}...`}
                      />
                      <button
                        onClick={() => setInput(promptConfig.text)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        title="Try this prompt"
                      >
                        <Send className="w-4 h-4 ml-[2px]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm ${
                      msg.role === 'user' ? 'bg-primary-transparent text-primary ml-4' : 'bg-slate-200 text-slate-600 mr-4'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-3 text-sm leading-relaxed rounded-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-white border border-slate-200 text-slate-800'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] flex-row">
                    <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-200 text-slate-600 mr-4 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-sm bg-white border border-slate-200 text-slate-800 flex gap-1.5 items-center">
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <form onSubmit={(e) => handleSend(e)} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Test the AI's response..."
              className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-white rounded-sm hover:opacity-90 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      
      <div className="w-full lg:w-72 lg:border-l border-t lg:border-t-0 border-slate-200 bg-slate-50 p-4 overflow-y-auto hidden lg:block shrink-0">
         <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-wide mb-4">Active System Intents</h3>
         <div className="space-y-3">
           {responses.filter(r => r.status === 'active' && (!r.targetApp || r.targetApp.length === 0 || r.targetApp.includes('All') || r.targetApp.includes(activeModule))).length === 0 ? (
             <p className="text-xs text-slate-500 italic">No active predefined intents.</p>
           ) : (
             responses.filter(r => r.status === 'active' && (!r.targetApp || r.targetApp.length === 0 || r.targetApp.includes('All') || r.targetApp.includes(activeModule))).map(res => (
               <div 
                 key={res.id} 
                 onClick={() => setExpandedIntents(prev => prev.includes(res.id) ? prev.filter(id => id !== res.id) : [...prev, res.id])}
                 className="bg-white p-3 rounded-sm border border-slate-200 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
               >
                  <p className="text-xs font-bold text-slate-800">{res.intent}</p>
                  <p className={`text-[10px] text-slate-500 mt-1.5 leading-relaxed ${expandedIntents.includes(res.id) ? '' : 'truncate'}`}>{res.keywords.join(', ')}</p>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
}
