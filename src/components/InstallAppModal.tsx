import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  QrCode,
  Menu,
  PlusSquare,
  Check
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                फोन में ऐप इंस्टॉल करें (Install on Mobile)
              </h3>
              <div className="text-xs text-slate-400">
                PWA Standalone App · No Play Store required
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 text-xs">
          {/* Status Banner */}
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <strong className="block text-white text-sm font-semibold">
                  ऐप पहले से इंस्टॉल है! (Already Installed)
                </strong>
                <span>यह ऐप आपके फोन में standalone मोड में सफलतापूर्वक चल रहा है।</span>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>One-Click Android Installation Ready!</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                नीचे दिए गए बटन को दबाकर आप इस ऐप को तुरंत अपने Android फोन में इंस्टॉल कर सकते हैं।
              </p>
              <button
                onClick={handleTriggerInstall}
                className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Download className="w-5 h-5" />
                <span>अभी इंस्टॉल करें (Install Now)</span>
              </button>
            </div>
          ) : null}

          {/* Step-by-Step Mobile Instructions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Android फोन में इंस्टॉल करने का आसान तरीका:</span>
            </h4>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">
                    फोन के ब्राउज़र में खोलें (Open in Chrome)
                  </strong>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    इस ऐप का लिंक अपने मोबाइल के <strong>Google Chrome</strong> या <strong>Samsung Internet</strong> ब्राउज़र में खोलें।
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">
                    ब्राउज़र मेन्यू खोलें (Tap 3 Dots ⋮)
                  </strong>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    ऊपर दाएँ कोने में <strong>तीन डॉट्स (⋮)</strong> या नीचे मेन्यू बटन दबाएं।
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">
                    "Install app" या "Add to Home screen" चुनें
                  </strong>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    मेन्यू में <strong>"Install app"</strong> (ऐप इंस्टॉल करें) या <strong>"Add to Home screen"</strong> (होम स्क्रीन पर जोड़ें) विकल्प पर टैप करें।
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <strong className="text-white block font-semibold text-xs">
                    इंस्टॉल पर क्लिक करें (Tap Install)
                  </strong>
                  <span className="text-slate-300 leading-relaxed block mt-0.5">
                    पुष्टि करने के लिए <strong>Install</strong> दबाएं। ऐप का आइकॉन आपके मोबाइल की होम स्क्रीन और ऐप ड्रॉअर में आ जाएगा और बिल्कुल असली नेटिव Android ऐप की तरह फुलस्क्रीन में खुलेगा!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* iPhone / iOS Guide if needed */}
          {isIOS && (
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
              <strong className="text-white font-bold block">iPhone / iPad यूज़र्स के लिए:</strong>
              <p className="text-slate-300">
                1. Safari में <strong>Share (शेयर)</strong> बटन दबाएं।<br />
                2. नीचे स्क्रॉल करके <strong>"Add to Home Screen"</strong> पर टैप करें।
              </p>
            </div>
          )}

          {/* Share Link to Phone */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>फोन में खोलने के लिए लिंक कॉपी करें:</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-[11px] truncate focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Features of Installed PWA */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>नो ब्राउज़र बार (Full Standalone)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>फास्ट लोडिंग व ऑफलाइन सपोर्ट</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>स्मार्ट टीवी कास्टिंग सपोर्ट</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>कम मेमोरी व बैटरी की बचत</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
