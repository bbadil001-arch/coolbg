import { useEffect, useState } from "react";
import { Sparkles, X, ArrowLeft, Loader2 } from "lucide-react";
import { composePrompt } from "../lib/aiGenerate";

const QUESTIONS = [
  {
    key: "purpose",
    q: "What's this background for?",
    options: ["Website hero", "App / SaaS UI", "Social media post", "Presentation slide"],
  },
  {
    key: "vibe",
    q: "Pick a vibe",
    options: ["Calm & minimal", "Bold & energetic", "Professional & clean", "Playful & fun"],
  },
  {
    key: "mood",
    q: "Color mood?",
    options: ["Cool tones", "Warm tones", "Vibrant multicolor", "Dark & moody"],
  },
  {
    key: "motion",
    q: "Static or animated?",
    options: ["Static", "Subtly animated"],
  },
];

// 4 quick-pick questions build a precise starting prompt (composePrompt),
// then a review step lets the person edit that exact prompt before it's
// sent to the real image model. `onGenerate(prompt)` does the actual API
// call and is expected to throw on failure so this modal can show the
// error inline and let the person retry without losing their edits.
export default function AIWizardModal({ open, onClose, onGenerate }) {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 = questions, QUESTIONS.length = review
  const [answers, setAnswers] = useState({});
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = QUESTIONS.length + 1;
  const isQuestionStep = step < QUESTIONS.length;
  const current = QUESTIONS[step];

  useEffect(() => {
    if (!open) {
      setStep(0); setAnswers({}); setPrompt(""); setGenerating(false); setError("");
    }
  }, [open]);

  if (!open) return null;

  const choose = (value) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (step === QUESTIONS.length - 1) {
      setPrompt(composePrompt(next));
      setStep(QUESTIONS.length);
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => { setError(""); setStep((s) => Math.max(0, s - 1)); };
  const handleClose = () => { if (!generating) onClose(); };

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setError("");
    try {
      await onGenerate(prompt.trim());
      // on success the parent closes this modal itself
    } catch (err) {
      setError(err?.message || "Couldn't generate that image — try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#12151C]/95 backdrop-blur-2xl shadow-2xl p-6">
        {!generating && (
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex items-center gap-2 text-violet-300 text-xs font-mono uppercase tracking-wide mb-1">
          <Sparkles size={14} />
          {isQuestionStep ? `AI Match — question ${step + 1} of ${QUESTIONS.length}` : "Review your prompt"}
        </div>

        <div className="flex gap-1.5 mb-5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-violet-400" : "bg-white/10"}`} />
          ))}
        </div>

        {isQuestionStep ? (
          <>
            <h2 className="font-display font-semibold text-xl text-white mb-4">{current.q}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className="text-left rounded-xl border border-white/12 hover:border-violet-400/60 hover:bg-white/5 px-4 py-3 text-sm text-white/85 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display font-semibold text-xl text-white mb-2">Fine-tune the prompt</h2>
            <p className="text-xs text-white/50 mb-3">
              Built from your answers — edit it for a more precise result, then generate.
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              disabled={generating}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400 resize-none disabled:opacity-60"
            />
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold py-2.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {generating ? "Generating your background…" : "Generate background"}
            </button>
          </>
        )}

        {step > 0 && !generating && (
          <button onClick={back} className="mt-5 flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={13} /> Back
          </button>
        )}
      </div>
    </div>
  );
}
