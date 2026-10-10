import React, { useState, useRef, useEffect } from 'react';
import { VideoItem, TVDisplayMode, SubtitleTrack } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Sun,
  Maximize,
  Minimize,
  Lock,
  Unlock,
  Tv,
  Settings,
  Subtitles,
  AudioWaveform,
  Gauge,
  ArrowLeft,
  ChevronRight,
  PictureInPicture,
  Info,
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface MobilePlayerProps {
  video: VideoItem;
  onClose: () => void;
  onOpenCastModal: () => void;
  isCastingActive: boolean;
  onOpenCastRemote: () => void;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
}

export const MobilePlayer: React.FC<MobilePlayerProps> = ({
  video,
  onClose,
  onOpenCastModal,
  isCastingActive,
  onOpenCastRemote,
  initialTime = 0,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(initialTime);
  const [duration, setDuration] = useState<number>(video.duration || 100);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100); // 20% to 150%
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('off');
  const [currentSubText, setCurrentSubText] = useState<string>('');
  const [activeAudioTrack, setActiveAudioTrack] = useState<string>(video.audioTracks[0] || 'Stereo');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showSubtitlesDrawer, setShowSubtitlesDrawer] = useState<boolean>(false);
  const [showAudioDrawer, setShowAudioDrawer] = useState<boolean>(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState<boolean>(false);
  const [gestureFeedback, setGestureFeedback] = useState<{ type: string; value: string } | null>(null);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Resume prompt notification
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(
    video.lastPlayedPosition > 10 && initialTime === 0
  );

  // Auto-hide controls
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = () => {
    if (isLocked) return;
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 4000);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, isLocked]);

  // Set initial time
  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    showGestureOverlay(seconds > 0 ? `+${seconds}s` : `${seconds}s`, 'Seek');
    resetControlsTimer();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);
    onTimeUpdate?.(t);

    // Subtitle rendering
    if (activeSubtitle !== 'off') {
      const track = video.subtitles?.find((s) => s.id === activeSubtitle);
      if (track && track.cues) {
        const cue = track.cues.find((c) => t >= c.start && t <= c.end);
        setCurrentSubText(cue ? cue.text : '');
      } else {
        setCurrentSubText('');
      }
    } else {
      setCurrentSubText('');
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || video.duration);
    }
  };

  // Picture in Picture
  const handleTogglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP not allowed or failed', err);
    }
  };

  // Gesture feedback banner
  const showGestureOverlay = (value: string, type: string) => {
    setGestureFeedback({ type, value });
    setTimeout(() => {
      setGestureFeedback(null);
    }, 1200);
  };

  // Touch gesture handling for volume / brightness
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const isLeftSide = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return;
    if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      const rect = e.currentTarget.getBoundingClientRect();
      isLeftSide.current = e.touches[0].clientX - rect.left < rect.width / 2;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isLocked) return;
    if (e.touches.length === 1) {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      // Vertical swipe
      if (Math.abs(deltaY) > 20) {
        if (isLeftSide.current) {
          // Brightness (Left half of screen)
          const newB = Math.min(Math.max(brightness + (deltaY > 0 ? 3 : -3), 30), 140);
          setBrightness(newB);
          showGestureOverlay(`${newB}%`, 'Brightness');
        } else {
          // Volume (Right half of screen)
          const newVol = Math.min(Math.max(volume + (deltaY > 0 ? 2 : -2), 0), 100);
          setVolume(newVol);
          if (videoRef.current) videoRef.current.volume = newVol / 100;
          setIsMuted(newVol === 0);
          showGestureOverlay(`${newVol}%`, 'Volume');
        }
        touchStartY.current = e.touches[0].clientY;
      }
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResume = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = video.lastPlayedPosition;
      setCurrentTime(video.lastPlayedPosition);
      setShowResumeBanner(false);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsDrawer(false);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center player-container overflow-hidden select-none transition-all ${
        isLandscape ? 'rotate-90 md:rotate-0' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={() => {
        if (!isLocked) resetControlsTimer();
      }}
    >
      {/* Video Element with Brightness Filter */}
      <video
        ref={videoRef}
        src={video.url}
        playsInline
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-contain"
        style={{ filter: `brightness(${brightness}%)` }}
      />

      {/* Subtitle On-Screen Overlay */}
      {currentSubText && (
        <div className="absolute bottom-24 left-0 right-0 px-6 text-center pointer-events-none z-20">
          <span className="inline-block px-4 py-1.5 rounded-lg bg-black/80 text-amber-300 font-medium text-base md:text-lg shadow-lg backdrop-blur-sm border border-white/10">
            {currentSubText}
          </span>
        </div>
      )}

      {/* Gesture Feedback HUD (Brightness/Volume/Seek) */}
      {gestureFeedback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/20 shadow-2xl">
          {gestureFeedback.type === 'Brightness' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : gestureFeedback.type === 'Volume' ? (
            <Volume2 className="w-5 h-5 text-indigo-400" />
          ) : (
            <RotateCw className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-semibold text-white tracking-wide">
            {gestureFeedback.type}: {gestureFeedback.value}
          </span>
        </div>
      )}

      {/* Lock State Overlay Button */}
      {isLocked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLocked(false);
          }}
          className="absolute top-6 left-6 z-40 p-3 rounded-full bg-slate-900/90 text-amber-400 border border-amber-400/40 shadow-xl flex items-center gap-2 text-xs font-semibold"
        >
          <Unlock className="w-4 h-4" />
          <span>Tap to Unlock</span>
        </button>
      )}

      {/* Casting Notice Banner inside Player */}
      {isCastingActive && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenCastRemote();
          }}
          className="absolute top-20 left-4 right-4 z-30 p-3 rounded-xl bg-indigo-950/90 border border-indigo-500/50 shadow-xl backdrop-blur-md flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Tv className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-white">Streaming on Smart TV</div>
              <div className="text-[11px] text-indigo-200">Phone is free · Tap for TV Remote</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </div>
      )}

      {/* Resume playback banner */}
      {showResumeBanner && !isLocked && (
        <div className="absolute top-20 left-4 right-4 z-30 p-3 rounded-xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl backdrop-blur-md flex items-center justify-between">
          <div className="text-xs text-slate-200">
            Resume from <span className="font-semibold text-indigo-400">{formatSeconds(video.lastPlayedPosition)}</span>?
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
            >
              Resume
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="px-2 py-1 text-slate-400 hover:text-white text-xs"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Main Controls Overlay */}
      {!isLocked && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/80 flex flex-col justify-between p-4 transition-opacity duration-300 pointer-events-auto ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Back to library"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate max-w-[200px] md:max-w-md">
                  {video.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-mono text-indigo-300">{video.resolution}</span>
                  <span>·</span>
                  <span>{video.format}</span>
                  <span>·</span>
                  <span className="text-emerald-400">{video.codec}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Cast to Smart TV Button */}
              <button
                onClick={() => {
                  if (isCastingActive) {
                    onOpenCastRemote();
                  } else {
                    onOpenCastModal();
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isCastingActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Cast to Smart TV"
              >
                <Tv className={`w-4 h-4 ${isCastingActive ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{isCastingActive ? 'TV Remote' : 'Cast to TV'}</span>
              </button>

              {/* PiP Button */}
              <button
                onClick={handleTogglePiP}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Picture-in-Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Lock Controls Button */}
              <button
                onClick={() => setIsLocked(true)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Lock Controls"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Video Info Drawer Toggle */}
              <button
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Video Metadata & Hardware Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Playback Controls (10s Back, Play/Pause, 10s Forward) */}
          <div className="flex items-center justify-center gap-8 md:gap-12 my-auto">
            <button
              onClick={() => seekBy(-10)}
              className="p-3 rounded-full hover:bg-white/10 text-white transition-transform active:scale-90"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-7 h-7" />
              <span className="text-[10px] block font-mono text-center mt-0.5">-10s</span>
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 transition-transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>

            <button
              onClick={() => seekBy(10)}
              className="p-3 rounded-full hover:bg-white/10 text-white transition-transform active:scale-90"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-7 h-7" />
              <span className="text-[10px] block font-mono text-center mt-0.5">+10s</span>
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="space-y-2 pb-2">
            {/* Seekbar and Timestamps */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-300 w-11 text-right tabular-nums">
                {formatSeconds(currentTime)}
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
                />
              </div>
              <span className="text-xs font-mono text-slate-400 w-11 tabular-nums">
                {formatSeconds(duration)}
              </span>
            </div>

            {/* Bottom Row Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {/* Volume Button */}
                <button
                  onClick={() => {
                    const newMute = !isMuted;
                    setIsMuted(newMute);
                    if (videoRef.current) videoRef.current.muted = newMute;
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-200 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Subtitle Selector */}
                <button
                  onClick={() => setShowSubtitlesDrawer(!showSubtitlesDrawer)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    activeSubtitle !== 'off'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Subtitles className="w-3.5 h-3.5" />
                  <span>CC {activeSubtitle !== 'off' ? 'ON' : ''}</span>
                </button>

                {/* Audio Track Selector */}
                <button
                  onClick={() => setShowAudioDrawer(!showAudioDrawer)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <AudioWaveform className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Audio</span>
                </button>

                {/* Playback Speed */}
                <button
                  onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/10 flex items-center gap-1 transition-colors"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{playbackSpeed}x</span>
                </button>
              </div>

              {/* Right orientation and fullscreen */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsLandscape(!isLandscape)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-200 transition-colors"
                  title="Toggle Orientation"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtitles Drawer */}
      {showSubtitlesDrawer && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowSubtitlesDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-indigo-400" />
                <span>Subtitle Tracks</span>
              </h4>
              <button
                onClick={() => setShowSubtitlesDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveSubtitle('off');
                  setShowSubtitlesDrawer(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-colors ${
                  activeSubtitle === 'off'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>Subtitles Off</span>
                {activeSubtitle === 'off' && <Check className="w-4 h-4" />}
              </button>

              {video.subtitles && video.subtitles.length > 0 ? (
                video.subtitles.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveSubtitle(sub.id);
                      setShowSubtitlesDrawer(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-colors ${
                      activeSubtitle === sub.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{sub.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {sub.language.toUpperCase()} · Embedded Cues
                      </div>
                    </div>
                    {activeSubtitle === sub.id && <Check className="w-4 h-4" />}
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center py-3">
                  No embedded subtitle tracks found in this file.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audio Tracks Drawer */}
      {showAudioDrawer && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowAudioDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AudioWaveform className="w-4 h-4 text-emerald-400" />
                <span>Audio Tracks</span>
              </h4>
              <button
                onClick={() => setShowAudioDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>

            <div className="space-y-2">
              {video.audioTracks.map((track) => (
                <button
                  key={track}
                  onClick={() => {
                    setActiveAudioTrack(track);
                    setShowAudioDrawer(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-colors ${
                    activeAudioTrack === track
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-medium text-white">{track}</span>
                  {activeAudioTrack === track && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Speed & Settings Drawer */}
      {showSettingsDrawer && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowSettingsDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>Playback Speed</span>
              </h4>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedSelect(s)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    playbackSpeed === s
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Hardware & Quality Info Drawer */}
      {showInfoDrawer && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setShowInfoDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border-t border-slate-700 rounded-t-3xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Video Quality & Decoder Info</span>
              </h4>
              <button
                onClick={() => setShowInfoDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Resolution</span>
                <span className="font-semibold text-white">{video.resolution}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">File Container</span>
                <span className="font-semibold text-white">{video.format}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Bitrate</span>
                <span className="font-semibold text-white">{video.bitrate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Framerate</span>
                <span className="font-semibold text-white">{video.fps} FPS</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Video Codec</span>
                <span className="font-semibold text-emerald-400">{video.codec}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Hardware Acceleration</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  Enabled (MediaCodec / GPU)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
