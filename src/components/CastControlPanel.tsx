import React, { useState } from 'react';
import { CastingDevice, VideoItem, TVDisplayMode } from '../types';
import {
  Tv,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Subtitles,
  AudioWaveform,
  PowerOff,
  Maximize2,
  Crop,
  Square,
  Expand,
  SkipForward,
  SkipBack,
  ListVideo,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

interface CastControlPanelProps {
  device: CastingDevice;
  currentVideo: VideoItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  displayMode: TVDisplayMode;
  activeSubtitleId: string;
  activeAudioTrack: string;
  queue: VideoItem[];
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onDisplayModeChange: (mode: TVDisplayMode) => void;
  onSubtitleChange: (subId: string) => void;
  onAudioTrackChange: (track: string) => void;
  onNextVideo: () => void;
  onPrevVideo: () => void;
  onDisconnect: () => void;
  onCloseRemote: () => void;
  onOpenQueue: () => void;
  onOpenMultitaskDemo: () => void;
  onLaunchTVWindow: () => void;
}

export const CastControlPanel: React.FC<CastControlPanelProps> = ({
  device,
  currentVideo,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  displayMode,
  activeSubtitleId,
  activeAudioTrack,
  queue,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onDisplayModeChange,
  onSubtitleChange,
  onAudioTrackChange,
  onNextVideo,
  onPrevVideo,
  onDisconnect,
  onCloseRemote,
  onOpenQueue,
  onOpenMultitaskDemo,
  onLaunchTVWindow
}) => {
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayModes: { id: TVDisplayMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'fit',
      label: 'Fit',
      desc: 'Keep original ratio, entire frame visible',
      icon: <Square className="w-4 h-4" />
    },
    {
      id: 'fill',
      label: 'Fill',
      desc: 'Fill entire TV screen canvas',
      icon: <Maximize2 className="w-4 h-4" />
    },
    {
      id: 'crop',
      label: 'Crop',
      desc: 'Zoom without stretch, 0 black bars',
      icon: <Crop className="w-4 h-4" />
    },
    {
      id: 'original',
      label: 'Original',
      desc: 'Native video resolution 1:1',
      icon: <Expand className="w-4 h-4" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onCloseRemote}
          className="flex items-center gap-2 p-2 -ml-2 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
          <span className="text-xs font-semibold">Minimize Remote</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Launch Independent Window Button */}
          <button
            onClick={onLaunchTVWindow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-700/60 hover:bg-indigo-900 text-xs font-medium transition-colors"
            title="Pop out Smart TV screen into dedicated window / monitor"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open TV Window</span>
          </button>

          {/* Disconnect Button */}
          <button
            onClick={onDisconnect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900 text-xs font-semibold transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-xl w-full mx-auto p-4 space-y-6">
        {/* Device Status Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Tv className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold">
                  Connected TV Device
                </div>
                <div className="text-base font-bold text-white">{device.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Streaming Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Model: {device.model}</span>
            <span className="font-mono text-indigo-300">{device.resolution}</span>
          </div>
        </div>

        {/* Independent Multitasking Feature Card (User Highlight) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Independent TV Casting</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Zero Mirroring
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The TV is playing the video stream directly. Your phone is completely free! You can minimize this remote, browse other videos, or switch to other apps like WhatsApp.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenMultitaskDemo}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulate Multitask / App Switch</span>
            </button>
            <button
              onClick={onCloseRemote}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Browse Library
            </button>
          </div>
        </div>

        {/* Now Playing Info */}
        {currentVideo ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white line-clamp-1">{currentVideo.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Folder: {currentVideo.folder} · {currentVideo.resolution} · {currentVideo.codec}
                </div>
              </div>
              <button
                onClick={onOpenQueue}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <ListVideo className="w-4 h-4 text-indigo-400" />
                <span>Queue ({queue.length})</span>
              </button>
            </div>

            {/* Seekbar and Scrubbing */}
            <div className="space-y-1.5">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400 tabular-nums">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(duration)}</span>
              </div>
            </div>

            {/* Tactile Remote Playback Buttons */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={onPrevVideo}
                disabled={queue.length === 0}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                title="Previous Video"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => onSeek(Math.max(currentTime - 10, 0))}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-[9px] block text-center font-mono mt-0.5">-10s</span>
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="w-16 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 transition-transform active:scale-95"
                title={isPlaying ? 'Pause TV' : 'Play TV'}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              <button
                onClick={() => onSeek(Math.min(currentTime + 10, duration))}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Forward 10 seconds"
              >
                <RotateCw className="w-5 h-5" />
                <span className="text-[9px] block text-center font-mono mt-0.5">+10s</span>
              </button>

              <button
                onClick={onNextVideo}
                disabled={queue.length === 0}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                title="Next Video"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <button
                onClick={onToggleMute}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                )}
              </button>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-xs font-mono text-slate-400 w-8 text-right tabular-nums">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
              </div>
            </div>

            {/* TV Display Scaling Modes (FIT, FILL, CROP, ORIGINAL) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  TV Display Mode (Screen Ratio)
                </span>
                <span className="text-[11px] text-indigo-400">
                  Current: {displayMode.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {displayModes.map((dm) => {
                  const isActive = displayMode === dm.id;
                  return (
                    <button
                      key={dm.id}
                      onClick={() => onDisplayModeChange(dm.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          {dm.icon}
                          {dm.label}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] leading-tight text-slate-400">{dm.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtitles & Audio Tracks */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Subtitle Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Subtitles className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-white">Subtitles</span>
                  </div>
                  <span className="text-slate-400 font-mono">
                    {activeSubtitleId === 'off' ? 'OFF' : 'ON'}
                  </span>
                </button>

                {showSubtitleMenu && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                    <button
                      onClick={() => {
                        onSubtitleChange('off');
                        setShowSubtitleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        activeSubtitleId === 'off'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      Off
                    </button>
                    {currentVideo.subtitles?.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSubtitleChange(s.id);
                          setShowSubtitleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                          activeSubtitleId === s.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Audio Track Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowAudioMenu(!showAudioMenu)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <AudioWaveform className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-white truncate">Audio Track</span>
                  </div>
                  <span className="text-slate-400 font-mono truncate max-w-[80px]">
                    {activeAudioTrack}
                  </span>
                </button>

                {showAudioMenu && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                    {currentVideo.audioTracks.map((track) => (
                      <button
                        key={track}
                        onClick={() => {
                          onAudioTrackChange(track);
                          setShowAudioMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                          activeAudioTrack === track
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Tv className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-sm">No video currently playing on TV</p>
          </div>
        )}
      </div>
    </div>
  );
};
