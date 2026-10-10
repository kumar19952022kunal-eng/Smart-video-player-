import React from 'react';
import { TVReceiverScreen } from './TVReceiverScreen';
import { CastingDevice, VideoItem, TVDisplayMode } from '../types';
import { Tv, ExternalLink, X, Maximize2 } from 'lucide-react';

interface TVSplitMonitorViewProps {
  currentVideo: VideoItem | null;
  targetDevice: CastingDevice | null;
  displayMode: TVDisplayMode;
  onClose: () => void;
  onLaunchIndependentWindow: () => void;
}

export const TVSplitMonitorView: React.FC<TVSplitMonitorViewProps> = ({
  currentVideo,
  targetDevice,
  displayMode,
  onClose,
  onLaunchIndependentWindow
}) => {
  return (
    <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-4 shadow-2xl space-y-3">
      {/* TV Frame Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Tv className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Smart TV Monitor (Simulated Second Screen)</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                16:9 4K
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {targetDevice ? `${targetDevice.name} · Mode: ${displayMode.toUpperCase()}` : 'Ready for Casting'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onLaunchIndependentWindow}
            className="p-1.5 rounded-lg bg-indigo-950 text-indigo-300 hover:text-white hover:bg-indigo-900 border border-indigo-700/60 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Pop out into separate window for dual-monitor testing"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pop Out</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TV Bezel and Screen */}
      <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-800 to-black border-2 border-slate-700/80 shadow-2xl">
        {/* Subtle TV Stand Top Notch */}
        <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-1.5 opacity-50" />

        {/* 16:9 Aspect Ratio Display Screen */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
          <TVReceiverScreen
            currentVideo={currentVideo}
            displayMode={displayMode}
            targetDevice={targetDevice}
          />
        </div>

        {/* TV Bottom Bezel with Brand Logo & Power LED */}
        <div className="flex items-center justify-between px-3 pt-2">
          <div className="flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-400 uppercase">
            <span>SMARTCAST BRAVIA ENGINE 4K</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-slate-400 font-mono">HDMI · CAST ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
