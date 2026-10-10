import React, { useState, useEffect, useRef } from 'react';
import { TVDisplayMode, VideoItem, CastingDevice } from '../types';
import { castService, CastMessage } from '../services/castService';
import { Maximize, Tv, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';

interface TVReceiverScreenProps {
  currentVideo: VideoItem | null;
  displayMode: TVDisplayMode;
  targetDevice: CastingDevice | null;
  onExitReceiver?: () => void;
  isStandaloneWindow?: boolean;
}

export const TVReceiverScreen: React.FC<TVReceiverScreenProps> = ({
  currentVideo: initialVideo,
  displayMode: initialDisplayMode,
  targetDevice,
  onExitReceiver,
  isStandaloneWindow = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(initialVideo);
  const [activeDisplayMode, setActiveDisplayMode] = useState<TVDisplayMode>(initialDisplayMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');
  const [activeSubId, setActiveSubId] = useState<string>('off');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [osdMessage, setOsdMessage] = useState<string | null>(
    targetDevice ? `Connected to ${targetDevice.name}` : 'SmartCast TV Receiver Online'
  );
  const [osdVisible, setOsdVisible] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Auto-hide OSD
  useEffect(() => {
    setOsdVisible(true);
    const timer = setTimeout(() => {
      setOsdVisible(false);
    }, 3200);
    return () => clearTimeout(timer);
  }, [osdMessage, activeDisplayMode]);

  // Sync props if provided
  useEffect(() => {
    if (initialVideo) {
      setActiveVideo(initialVideo);
    }
  }, [initialVideo]);

  useEffect(() => {
    if (initialDisplayMode) {
      setActiveDisplayMode(initialDisplayMode);
    }
  }, [initialDisplayMode]);

  // Subscribe to Cast commands from Mobile
  useEffect(() => {
    const unsubscribe = castService.subscribe((msg: CastMessage) => {
      switch (msg.type) {
        case 'CAST_LOAD_MEDIA':
          if (msg.payload?.video) {
            setActiveVideo(msg.payload.video);
            setActiveDisplayMode(msg.payload.displayMode || 'fit');
            setActiveSubId(msg.payload.subtitleId || 'off');
            setOsdMessage(`Now Playing: ${msg.payload.video.title}`);
            if (videoRef.current) {
              videoRef.current.currentTime = msg.payload.startTime || 0;
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
          }
          break;

        case 'CAST_PLAY':
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
            setOsdMessage('Playing');
          }
          break;

        case 'CAST_PAUSE':
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
            setOsdMessage('Paused');
          }
          break;

        case 'CAST_SEEK':
          if (videoRef.current && typeof msg.payload?.time === 'number') {
            videoRef.current.currentTime = msg.payload.time;
            setOsdMessage(`Seek: ${formatSeconds(msg.payload.time)}`);
          }
          break;

        case 'CAST_VOLUME':
          if (typeof msg.payload?.volume === 'number') {
            setVolume(msg.payload.volume);
            if (videoRef.current) {
              videoRef.current.volume = msg.payload.volume / 100;
            }
          }
          if (typeof msg.payload?.isMuted === 'boolean') {
            setIsMuted(msg.payload.isMuted);
            if (videoRef.current) {
              videoRef.current.muted = msg.payload.isMuted;
            }
          }
          setOsdMessage(`Volume: ${msg.payload?.isMuted ? 'Muted' : `${msg.payload?.volume}%`}`);
          break;

        case 'CAST_DISPLAY_MODE':
          if (msg.payload?.mode) {
            setActiveDisplayMode(msg.payload.mode);
            setOsdMessage(`Display Mode: ${msg.payload.mode.toUpperCase()}`);
          }
          break;

        case 'CAST_SUBTITLE':
          setActiveSubId(msg.payload?.subId || 'off');
          const subName = msg.payload?.subId === 'off' ? 'Subtitles Off' : 'Subtitles Enabled';
          setOsdMessage(subName);
          break;

        case 'CAST_SPEED':
          if (videoRef.current && msg.payload?.speed) {
            videoRef.current.playbackRate = msg.payload.speed;
            setPlaybackSpeed(msg.payload.speed);
            setOsdMessage(`Speed: ${msg.payload.speed}x`);
          }
          break;

        case 'CAST_DISCONNECT':
          setOsdMessage('Cast Disconnected by Mobile');
          break;

        default:
          break;
      }
    });

    // Notify sender that TV Receiver is alive
    castService.sendMessage('TV_READY_PING', {
      deviceName: targetDevice?.name || 'Smart TV Receiver'
    });

    return () => unsubscribe();
  }, [targetDevice]);

  // Video time update loop & subtitle parsing
  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeVideo) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || activeVideo.duration;

    // Report back to mobile phone
    castService.sendMessage('TV_TIME_UPDATE', {
      currentTime: current,
      duration: total,
      isPlaying: !videoRef.current.paused
    });

    // Parse active subtitle
    if (activeSubId && activeSubId !== 'off') {
      const track = activeVideo.subtitles?.find((s) => s.id === activeSubId);
      if (track && track.cues) {
        const activeCue = track.cues.find((c) => current >= c.start && current <= c.end);
        setCurrentSubtitleText(activeCue ? activeCue.text : '');
      } else {
        setCurrentSubtitleText('');
      }
    } else {
      setCurrentSubtitleText('');
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    castService.sendMessage('TV_ENDED', { videoId: activeVideo?.id });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Helper for formatting time
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute CSS object-fit & transform based on TV display modes
  const getVideoStyle = (): React.CSSProperties => {
    switch (activeDisplayMode) {
      case 'fit':
        // Fits entire video with aspect ratio intact (minimal letterbox if video doesn't match 16:9)
        return {
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        };
      case 'fill':
        // Stretches to fill entire 16:9 TV canvas
        return {
          objectFit: 'fill',
          width: '100%',
          height: '100%'
        };
      case 'crop':
        // Zooms in to completely eliminate all black bars while preserving aspect ratio (crops edges)
        return {
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        };
      case 'original':
        // Displays at original aspect ratio without distortion
        return {
          objectFit: 'scale-down',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: 'auto'
        };
      default:
        return { objectFit: 'contain', width: '100%', height: '100%' };
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] bg-black text-white overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-slate-900/40 via-black to-black pointer-events-none" />

      {activeVideo ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={activeVideo.url}
            style={getVideoStyle()}
            className="transition-all duration-300 pointer-events-none"
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Subtitles Overlay on TV */}
          {currentSubtitleText && (
            <div className="absolute bottom-12 left-0 right-0 px-8 text-center pointer-events-none z-20">
              <span className="inline-block px-5 py-2 rounded-lg bg-black/85 text-amber-300 font-medium text-lg md:text-2xl tracking-wide shadow-2xl border border-white/10 backdrop-blur-sm">
                {currentSubtitleText}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 z-10 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 shadow-2xl shadow-indigo-500/20">
            <Tv className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Ready to Cast to TV</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Select any video from your phone to start streaming. The video will stream in fullscreen here while your phone remains free to use!
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/50 px-3 py-1.5 rounded-full border border-indigo-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Media Stream Active · Zero Screen Mirroring</span>
          </div>
        </div>
      )}

      {/* Discrete TV On-Screen Display (OSD) Banner - Fades out */}
      <div
        className={`absolute top-6 left-6 z-30 transition-all duration-500 pointer-events-none ${
          osdVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-2xl backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-xs">
            <div className="font-semibold text-slate-100 tracking-wide flex items-center gap-2">
              <span>{targetDevice?.name || 'Smart TV 4K Display'}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activeDisplayMode}
              </span>
            </div>
            {osdMessage && <div className="text-slate-400 text-[11px] truncate max-w-[280px]">{osdMessage}</div>}
          </div>
        </div>
      </div>

      {/* Bottom right TV controls / watermark */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
        {/* TV Mode Badge */}
        <div className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[10px] text-slate-400 font-mono tracking-wider">
          TV RECEIVER · {activeVideo?.resolution || '4K HDR'}
        </div>

        {/* Fullscreen Button for test monitor */}
        <button
          onClick={toggleFullscreen}
          title="Fullscreen on this TV display"
          className="p-2 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {isStandaloneWindow && onExitReceiver && (
          <button
            onClick={onExitReceiver}
            className="px-3 py-1 text-xs rounded bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-700 transition-colors"
          >
            Close Receiver
          </button>
        )}
      </div>

      {/* Discrete volume indicator when muted */}
      {isMuted && (
        <div className="absolute top-6 right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs">
          <VolumeX className="w-4 h-4" />
          <span>MUTED</span>
        </div>
      )}
    </div>
  );
};
