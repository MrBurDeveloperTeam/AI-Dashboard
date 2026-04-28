import React, { useState, useEffect, useRef } from 'react';
import { useStore, defaultConfigs } from '../store/responseStore';
import { Bot, Plus, Trash2, ChevronDown, Play, MessageCircle, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCat } from '../store/catStore';

export default function DialogCustomization() {
  const { simulatorConfig, updateSimulatorConfig, activeModule, setActiveModule, modules } = useStore();
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewStep, setPreviewStep] = useState(0);
  const [loginStateMode, setLoginStateMode] = useState<'pre-login' | 'post-login'>('pre-login');
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  
  const { setBubble, setOnCatClick } = useCat();
  
  const steps = loginStateMode === 'pre-login' 
    ? (simulatorConfig.dialogSteps || defaultConfigs[activeModule]?.dialogSteps || [])
    : (simulatorConfig.postLoginDialogSteps || defaultConfigs[activeModule]?.postLoginDialogSteps || []);

  const handleUpdateStep = (index: number, text: string) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    if (loginStateMode === 'pre-login') {
      updateSimulatorConfig({ dialogSteps: newSteps });
    } else {
      updateSimulatorConfig({ postLoginDialogSteps: newSteps });
    }
  };

  const handleAddStep = () => {
    const newSteps = [...steps, 'New dialog message...'];
    if (loginStateMode === 'pre-login') {
      updateSimulatorConfig({ dialogSteps: newSteps });
    } else {
      updateSimulatorConfig({ postLoginDialogSteps: newSteps });
    }
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    if (loginStateMode === 'pre-login') {
      updateSimulatorConfig({ dialogSteps: newSteps });
    } else {
      updateSimulatorConfig({ postLoginDialogSteps: newSteps });
    }
    if (previewStep >= newSteps.length) {
      setPreviewStep(Math.max(0, newSteps.length - 1));
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    const temp = newSteps[index - 1];
    newSteps[index - 1] = newSteps[index];
    newSteps[index] = temp;
    if (loginStateMode === 'pre-login') {
      updateSimulatorConfig({ dialogSteps: newSteps });
    } else {
      updateSimulatorConfig({ postLoginDialogSteps: newSteps });
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    const temp = newSteps[index + 1];
    newSteps[index + 1] = newSteps[index];
    newSteps[index] = temp;
    if (loginStateMode === 'pre-login') {
      updateSimulatorConfig({ dialogSteps: newSteps });
    } else {
      updateSimulatorConfig({ postLoginDialogSteps: newSteps });
    }
  };

  const handleReplay = () => {
    setPreviewKey(k => k + 1);
    setPreviewStep(0);
    setIsPreviewActive(true);
  };

  // Register bubble + click handler into the global cat context
  useEffect(() => {
    const isLastStep = previewStep === steps.length - 1;

    const bubble = (steps[previewStep] && isPreviewActive) ? (
      <motion.div
        key={`dialog-bubble-${previewStep}-${previewKey}`}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-[280px] bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-visible -mb-1 relative pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 text-sm font-semibold leading-relaxed text-slate-700 flex flex-col relative z-10 bg-white rounded-lg">
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="whitespace-pre-wrap">{steps[previewStep]}</p>
          </div>
          <div className="pt-4 flex justify-between items-center mt-auto">
            <button
              onClick={() => setPreviewStep(p => Math.max(0, p - 1))}
              disabled={previewStep === 0}
              className={`flex items-center gap-1 text-xs font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900 cursor-pointer ${
                previewStep === 0 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {isLastStep ? (
              <button
                onClick={() => setIsPreviewActive(false)}
                className="flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                Close <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setPreviewStep(p => Math.min(steps.length - 1, p + 1))}
                className="flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-white transform rotate-45 -translate-x-1/2 shadow-md border-r border-b border-slate-100 z-0"></div>
      </motion.div>
    ) : null;

    setBubble(bubble);

    return () => {
      setBubble(null);
    };
  }, [previewStep, previewKey, steps, isPreviewActive]);


  // Reset preview when switching modes
  useEffect(() => {
    setPreviewStep(0);
    setPreviewKey(k => k + 1);
  }, [loginStateMode]);

  return (
    <div className="h-full overflow-hidden p-6 bg-slate-50/30 flex flex-col">
      
      {/* Editor Section */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-0">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-200 bg-slate-50 shrink-0 gap-3">
          <div className="flex items-center gap-3 relative">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Dialog Flow
            </h2>
            <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
            <div className="relative flex items-center gap-2">
              <button 
                onClick={() => setShowModuleDropdown(!showModuleDropdown)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-widest hover:text-primary transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-sm"
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
                        onClick={() => {
                          setActiveModule(mod);
                          setShowModuleDropdown(false);
                          setPreviewKey(k => k + 1);
                        }}
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
        
        <div className="flex items-center gap-3">
            <div className="flex bg-slate-200/50 p-1 rounded-sm">
              <button
                onClick={() => setLoginStateMode('pre-login')}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  loginStateMode === 'pre-login' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Pre-Login
              </button>
              <button
                onClick={() => setLoginStateMode('post-login')}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  loginStateMode === 'post-login' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Post-Login
              </button>
            </div>

            <div className="flex bg-slate-200/50 p-1 rounded-sm">
              <button 
                onClick={handleReplay}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-primary hover:bg-white transition-colors cursor-pointer rounded-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET
              </button>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          <AnimatePresence initial={false}>
            {steps.map((step, index) => (
              <motion.div
                key={`step-${index}`}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="relative group bg-white border border-slate-200 p-4 rounded-sm shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Step {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-slate-500 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-300 transition-colors p-1 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === steps.length - 1}
                      className="text-slate-500 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-300 transition-colors p-1 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="text-slate-500 hover:text-red-500 transition-colors p-1 ml-1 cursor-pointer"
                      title="Remove step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={step}
                  onChange={(e) => handleUpdateStep(index, e.target.value)}
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  rows={3}
                  placeholder="Enter dialog message..."
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={handleAddStep}
            className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-500 rounded-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-semibold hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      </div>

    </div>
  );
}

