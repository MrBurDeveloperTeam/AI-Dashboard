import React, { useState, useEffect, useRef } from 'react';
import { useStore, defaultConfigs } from '../store/responseStore';
import { useAuth } from '../store/authStore';
import { Bot, Plus, Trash2, ChevronDown, Play, MessageCircle, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCat } from '../store/catStore';

const NAME_PLACEHOLDER = '[Name]';
const DEFAULT_AUTO_CLOSE_MS = 6000;
const MIN_AUTO_CLOSE_SEC = 1;
const MAX_AUTO_CLOSE_SEC = 60;

export default function DialogCustomization() {
  const { simulatorConfig, updateSimulatorConfig, activeModule, setActiveModule, modules } = useStore();
  const { user } = useAuth();
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewStep, setPreviewStep] = useState(0);
  const [loginStateMode, setLoginStateMode] = useState<'pre-login' | 'post-login' | 'welcome-back'>('pre-login');
  const [isPreviewActive, setIsPreviewActive] = useState(true);

  const { setBubble, setOnCatClick } = useCat();

  // Preview-only stand-in for the real logged-in end user's name, so admins
  // can see roughly what [Name] will resolve to. Real substitution in the
  // consumer apps uses profiles.name / profiles.full_name / user_metadata /
  // email, but here we only have the admin's own AIBoard session to show.
  const previewDisplayName =
    (user?.user_metadata as any)?.name ||
    (user?.email ? user.email.split('@')[0] : null) ||
    'Admin';

  const resolvePreviewText = (text: string) => text.replace(/\[name\]/gi, previewDisplayName);

  const steps = loginStateMode === 'pre-login'
    ? (simulatorConfig.dialogSteps || defaultConfigs[activeModule]?.dialogSteps || [])
    : loginStateMode === 'post-login'
    ? (simulatorConfig.postLoginDialogSteps || defaultConfigs[activeModule]?.postLoginDialogSteps || [])
    : (simulatorConfig.welcomeBackText ? [simulatorConfig.welcomeBackText] : []);

  const welcomeBackText = simulatorConfig.welcomeBackText ?? '';
  const welcomeBackAutoCloseMs = simulatorConfig.welcomeBackAutoCloseMs ?? DEFAULT_AUTO_CLOSE_MS;

  const handleUpdateAutoCloseSeconds = (seconds: number) => {
    if (!Number.isFinite(seconds)) return;
    const clamped = Math.min(MAX_AUTO_CLOSE_SEC, Math.max(MIN_AUTO_CLOSE_SEC, Math.round(seconds)));
    updateSimulatorConfig({ welcomeBackAutoCloseMs: clamped * 1000 });
  };

  const welcomeTextareaRef = useRef<HTMLTextAreaElement>(null);
  // Invisible element mirroring the textarea's exact text layout (font, padding,
  // border, wrapping), used only to translate drag mouse coordinates into a
  // character index + pixel position, since native <textarea> content isn't
  // addressable via Range/caretRangeFromPoint the way a regular DOM text node is.
  const mirrorRef = useRef<HTMLDivElement>(null);

  const [dragCaret, setDragCaret] = useState<{ index: number; top: number; left: number; height: number } | null>(null);

  const handleUpdateWelcomeBackText = (text: string) => {
    updateSimulatorConfig({ welcomeBackText: text });
  };

  // Finds every [Name]/[name] occurrence in text as {start, end} spans, so the
  // placeholder can be treated as a single atomic token rather than plain text.
  const getPlaceholderTokens = (text: string) => {
    const tokens: { start: number; end: number }[] = [];
    const re = /\[name\]/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length });
    }
    return tokens;
  };

  // Backspace/Delete: remove the whole [Name] token in one action when the
  // caret is adjacent to (or a selection overlaps) a token, instead of eating
  // it one character at a time.
  const handleWelcomeTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const text = welcomeBackText;
    const tokens = getPlaceholderTokens(text);
    const selStart = el.selectionStart ?? 0;
    const selEnd = el.selectionEnd ?? 0;
    const hasSelection = selStart !== selEnd;

    const deleteRange = (delStart: number, delEnd: number) => {
      e.preventDefault();
      handleUpdateWelcomeBackText(text.slice(0, delStart) + text.slice(delEnd));
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(delStart, delStart);
      });
    };

    if ((e.key === 'Backspace' || e.key === 'Delete') && hasSelection) {
      const overlapping = tokens.filter(t => selStart < t.end && selEnd > t.start);
      if (overlapping.length > 0) {
        const delStart = Math.min(selStart, ...overlapping.map(t => t.start));
        const delEnd = Math.max(selEnd, ...overlapping.map(t => t.end));
        deleteRange(delStart, delEnd);
      }
      return;
    }

    if (e.key === 'Backspace' && !hasSelection) {
      // Caret immediately after a token, or (defensively) already inside one.
      const token = tokens.find(t => t.end === selStart) ?? tokens.find(t => selStart > t.start && selStart < t.end);
      if (token) deleteRange(token.start, token.end);
      return;
    }

    if (e.key === 'Delete' && !hasSelection) {
      // Caret immediately before a token, or (defensively) already inside one.
      const token = tokens.find(t => t.start === selEnd) ?? tokens.find(t => selEnd > t.start && selEnd < t.end);
      if (token) deleteRange(token.start, token.end);
      return;
    }

    if (e.key === 'ArrowLeft' && !hasSelection && !e.shiftKey) {
      const token = tokens.find(t => selStart === t.end || (selStart > t.start && selStart < t.end));
      if (token) {
        e.preventDefault();
        el.setSelectionRange(token.start, token.start);
      }
      return;
    }

    if (e.key === 'ArrowRight' && !hasSelection && !e.shiftKey) {
      const token = tokens.find(t => selStart === t.start || (selStart > t.start && selStart < t.end));
      if (token) {
        e.preventDefault();
        el.setSelectionRange(token.end, token.end);
      }
      return;
    }
  };

  // Safety net for selection changes not covered by the key handler above
  // (mouse click/drag, Home/End, Ctrl+Arrow, etc.): if either selection edge
  // lands strictly inside a token, snap it outward so the token is either
  // fully selected or fully excluded — never partially.
  const handleWelcomeTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const tokens = getPlaceholderTokens(welcomeBackText);
    let start = el.selectionStart ?? 0;
    let end = el.selectionEnd ?? 0;
    let changed = false;

    for (const t of tokens) {
      if (start > t.start && start < t.end) { start = t.start; changed = true; }
      if (end > t.start && end < t.end) { end = t.end; changed = true; }
    }
    if (start > end) [start, end] = [end, start];

    if (changed) el.setSelectionRange(start, end);
  };

  // Inserts [Name] at a given character index (used by drag-drop), or, if no
  // index is given, at the current cursor/selection in the textarea (used by
  // a plain click on the token) — replacing any active selection either way.
  const insertNamePlaceholderAt = (index: number | null) => {
    const el = welcomeTextareaRef.current;
    const text = welcomeBackText;

    let start: number;
    let end: number;
    if (index !== null) {
      start = index;
      end = index;
    } else if (el) {
      start = el.selectionStart ?? text.length;
      end = el.selectionEnd ?? text.length;
    } else {
      start = text.length;
      end = text.length;
    }

    const newText = text.slice(0, start) + NAME_PLACEHOLDER + text.slice(end);
    handleUpdateWelcomeBackText(newText);

    const nextCursor = start + NAME_PLACEHOLDER.length;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const insertNamePlaceholder = () => insertNamePlaceholderAt(null);

  const handleNameTokenDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', NAME_PLACEHOLDER);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Maps a drag event's clientX/clientY to a character index + pixel position
  // within the textarea, via the invisible mirror element.
  //
  // Deliberately does NOT use document.caretRangeFromPoint/caretPositionFromPoint:
  // those do their own hit-testing at (x, y), which respects pointer-events —
  // and the mirror must stay pointer-events:none so it never blocks normal
  // clicking/typing in the real textarea. That hit-test would therefore resolve
  // to the textarea itself (which has no addressable text nodes) instead of the
  // mirror, and always fail. Instead we directly probe Range rects at every
  // character offset in the mirror's own text node and pick the closest one —
  // this needs no hit-testing at all, so pointer-events is irrelevant here.
  const getCaretFromPoint = (clientX: number, clientY: number) => {
    const ta = welcomeTextareaRef.current;
    const mirror = mirrorRef.current;
    if (!ta || !mirror) return null;

    const taRect = ta.getBoundingClientRect();
    const textNode = mirror.firstChild;

    if (!textNode || welcomeBackText.length === 0) {
      // Empty message: only one valid position, approximate the padded corner.
      return { index: 0, top: 12, left: 12, height: 16 };
    }

    const len = welcomeBackText.length;
    const range = document.createRange();
    let bestIndex = len;
    let bestRect: DOMRect | null = null;
    let bestScore = Infinity;

    for (let i = 0; i <= len; i++) {
      range.setStart(textNode, i);
      range.collapse(true);
      const rect = range.getBoundingClientRect();
      const dy = clientY - (rect.top + rect.height / 2);
      const dx = clientX - rect.left;
      // Snap to the nearest line first (large vertical weight), then the
      // nearest horizontal position within that line.
      const score = Math.abs(dy) * 1000 + Math.abs(dx);
      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
        bestRect = rect;
      }
    }

    if (!bestRect) return null;
    return {
      index: bestIndex,
      top: bestRect.top - taRect.top,
      left: bestRect.left - taRect.left,
      height: bestRect.height || 16,
    };
  };

  const handleWelcomeTextareaDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const caret = getCaretFromPoint(e.clientX, e.clientY);
    setDragCaret(caret);
  };

  const handleWelcomeTextareaDragLeave = () => {
    setDragCaret(null);
  };

  const handleWelcomeTextareaDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const index = dragCaret?.index ?? null;
    setDragCaret(null);
    insertNamePlaceholderAt(index);
  };

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
        className="max-w-[280px] bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-visible mb-4 relative pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 text-sm font-semibold leading-relaxed text-slate-700 flex flex-col relative z-10 bg-white rounded-lg">
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="whitespace-pre-wrap">{resolvePreviewText(steps[previewStep])}</p>
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

  // Welcome Back preview only: auto-close after the configured duration, matching
  // runtime behavior. Restarts whenever the timer value changes so an edit made
  // while the preview is showing takes effect immediately.
  useEffect(() => {
    if (loginStateMode !== 'welcome-back' || !isPreviewActive) return;
    const timer = setTimeout(() => setIsPreviewActive(false), welcomeBackAutoCloseMs);
    return () => clearTimeout(timer);
  }, [loginStateMode, isPreviewActive, previewKey, welcomeBackAutoCloseMs]);

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
              <button
                onClick={() => setLoginStateMode('welcome-back')}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  loginStateMode === 'welcome-back'
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Welcome Back
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

        {/* Steps List / Welcome Back editor */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {loginStateMode === 'welcome-back' ? (
            <div className="relative group bg-white border border-slate-200 p-4 rounded-sm shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Welcome Back Message
                </span>
                <span
                  draggable
                  onDragStart={handleNameTokenDragStart}
                  onClick={insertNamePlaceholder}
                  title="Drag into the message, or click to insert at the cursor"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full cursor-grab active:cursor-grabbing select-none hover:bg-primary/20 transition-colors"
                >
                  {NAME_PLACEHOLDER}
                </span>
              </div>
              <div className="relative">
                <textarea
                  ref={welcomeTextareaRef}
                  value={welcomeBackText}
                  onChange={(e) => handleUpdateWelcomeBackText(e.target.value)}
                  onKeyDown={handleWelcomeTextareaKeyDown}
                  onSelect={handleWelcomeTextareaSelect}
                  onDragOver={handleWelcomeTextareaDragOver}
                  onDragLeave={handleWelcomeTextareaDragLeave}
                  onDrop={handleWelcomeTextareaDrop}
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  rows={3}
                  placeholder="Enter the message shown to returning, already-onboarded users..."
                />
                {/* Invisible mirror: same box model/font/wrapping as the textarea,
                    used to translate drag coordinates into a text position. */}
                <div
                  ref={mirrorRef}
                  aria-hidden="true"
                  className="invisible absolute top-0 left-0 w-full text-sm border p-3 whitespace-pre-wrap break-words pointer-events-none"
                >
                  {welcomeBackText}
                </div>
                {dragCaret && (
                  <div
                    className="absolute w-0.5 bg-primary pointer-events-none animate-pulse"
                    style={{ top: dragCaret.top, left: dragCaret.left, height: dragCaret.height }}
                  />
                )}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Auto-Close Timer
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={MIN_AUTO_CLOSE_SEC}
                    max={MAX_AUTO_CLOSE_SEC}
                    step={1}
                    value={Math.round(welcomeBackAutoCloseMs / 1000)}
                    onChange={(e) => handleUpdateAutoCloseSeconds(Number(e.target.value))}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-700"
                  />
                  <span className="text-xs text-slate-500">seconds</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Shown once per visit to users who have already dismissed the Post-Login intro. Auto-closes after {Math.round(welcomeBackAutoCloseMs / 1000)}s.
                Drag <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{NAME_PLACEHOLDER}</code> into your message to personalize the Welcome Back dialog.
              </p>
            </div>
          ) : (
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
          )}

          {loginStateMode !== 'welcome-back' && (
            <button
              onClick={handleAddStep}
              className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-500 rounded-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-semibold hover:bg-primary/5"
            >
              <Plus className="w-4 h-4" /> Add Step
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

