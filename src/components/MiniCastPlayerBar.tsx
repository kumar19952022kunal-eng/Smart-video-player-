import React from 'react';
import { VideoItem, CastingDevice } from '../types';
import { Tv, Play, Pause, ChevronUp, PowerOff, RotateCw, Volume2 } from 'lucide-react';

interface MiniCastPlayerBarProps {
  currentVideo: VideoItem | null;
  targetDevice: CastingDevice | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onExpandRemote: () => void;
  onDisconnect: () => void;
  onSeekForward: () => void;
}

export const MiniCastPlayerBar: React.FC<MiniCastPlayerBarProps> = ({
  currentVideo,
  targetDevice,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onExpandRemote,
  onDisconnect,
  onSeekForward
}) => {
  if (!currentVideo || !targetDevice) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={onExpandRemote}
      className="fixed bottom-16 left-3 right-3 sm:left-6 sm:right-6 md:max-w-xl md:mx-auto z-40 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden cursor-pointer group hover:border-indigo-400 transition-all"
    >
      {/* Progress Bar Top Line */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        {/* TV Icon & Video Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 relative">
            <Tv className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>{currentVideo.title}</span>
            </div>
            <div className="text-[11px] text-indigo-300 truncate flex items-center gap-1.5 mt-0.5">
              <span>Connected to {targetDevice.name}</span>
              <span>·</span>
              <span className="text-emerald-400">TV Streaming</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onSeekForward}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="+10s on TV"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title={isPlaying ? 'Pause TV' : 'Play TV'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={onExpandRemote}
            className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-indigo-950 transition-colors"
            title="Open Remote Control"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
