import React, { useState } from 'react';
import { VideoItem, CastingDevice } from '../types';
import {
  MessageSquare,
  Globe,
  Camera,
  Lock,
  Tv,
  ArrowLeft,
  Send,
  Search,
  CheckCheck,
  Sparkles,
  Smartphone,
  Maximize2
} from 'lucide-react';

interface MultitaskSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideo: VideoItem | null;
  targetDevice: CastingDevice | null;
  onOpenCastRemote: () => void;
}

export const MultitaskSimulatorModal: React.FC<MultitaskSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentVideo,
  targetDevice,
  onOpenCastRemote
}) => {
  const [activeApp, setActiveApp] = useState<'whatsapp' | 'browser' | 'locked'>('whatsapp');
  const [chatMessages, setChatMessages] = useState<string[]>([
    'Hey! Did you check out the 4K video I sent you?',
    'Yes, it is streaming directly onto my Living Room TV right now!',
    'Without screen mirroring? Your phone is completely free?',
    'Exactly! I am typing to you on WhatsApp while the TV plays smoothly!'
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setChatMessages([...chatMessages, inputVal.trim()]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        {/* Top App Header */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Multitasking Mode Active</span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>TV Video Streaming in Background</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCastRemote}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>TV Remote</span>
          </button>
        </div>

        {/* App Switcher Tabs */}
        <div className="grid grid-cols-3 bg-slate-900/60 p-1 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveApp('whatsapp')}
            className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeApp === 'whatsapp'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveApp('browser')}
            className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeApp === 'browser'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Browser</span>
          </button>
          <button
            onClick={() => setActiveApp('locked')}
            className={`py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeApp === 'locked'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Screen</span>
          </button>
        </div>

        {/* Floating TV Status Pip Banner */}
        <div className="bg-indigo-950/80 border-b border-indigo-800/40 px-3 py-1.5 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2 truncate">
            <Tv className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
            <span className="truncate">
              Playing on <strong>{targetDevice?.name || 'Smart TV'}</strong>: {currentVideo?.title}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono shrink-0">100% UNINTERRUPTED</span>
        </div>

        {/* Body App Simulation */}
        <div className="flex-1 overflow-y-auto bg-slate-900/50">
          {activeApp === 'whatsapp' ? (
            <div className="h-full flex flex-col justify-between p-3">
              <div className="space-y-2.5 overflow-y-auto">
                <div className="text-center">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                    Today · End-to-End Encrypted
                  </span>
                </div>

                {chatMessages.map((msg, idx) => {
                  const isUser = idx % 2 === 1;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                          isUser
                            ? 'bg-emerald-700 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg}</p>
                        <div className="text-[9px] text-slate-300/80 text-right mt-1 flex items-center justify-end gap-1">
                          <span>10:42 AM</span>
                          {isUser && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : activeApp === 'browser' ? (
            <div className="p-4 space-y-4">
              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center gap-2 text-xs text-slate-300">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="truncate">https://en.wikipedia.org/wiki/Smart_TV_Casting</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">
                  Why Dedicated Media Casting beats Screen Mirroring
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Screen mirroring captures every pixel on your phone screen and transmits it as a compressed video stream to your TV. When you receive a WhatsApp notification, lock your screen, or switch apps, everything appears on the TV.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In contrast, <strong>SmartCast Video Player</strong> uses dedicated media protocol streaming. The Smart TV directly renders the media codec in 4K resolution, freeing your phone CPU, battery, and screen for other apps!
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-light text-white font-mono">10:45</div>
                <div className="text-xs text-slate-400 mt-1">Thursday, October 8</div>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 max-w-xs">
                Phone Screen is Locked. TV is playing in the background at full 4K 60FPS!
              </div>
              <button
                onClick={() => setActiveApp('whatsapp')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Swipe Up to Unlock
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Phone CPU: 4% · Battery Saved</span>
          <button
            onClick={onClose}
            className="text-indigo-400 font-semibold hover:text-indigo-300"
          >
            Return to SmartCast Player
          </button>
        </div>
      </div>
    </div>
  );
};
