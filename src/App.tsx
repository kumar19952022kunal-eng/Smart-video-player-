import React, { useState, useEffect, useCallback } from 'react';
import {
  VideoItem,
  CastingDevice,
  TVDisplayMode,
  AppSettings
} from './types';
import { INITIAL_VIDEOS, INITIAL_DEVICES } from './services/sampleMedia';
import { castService, CastMessage } from './services/castService';
import { HomeScreen } from './components/HomeScreen';
import { MobilePlayer } from './components/MobilePlayer';
import { CastControlPanel } from './components/CastControlPanel';
import { MiniCastPlayerBar } from './components/MiniCastPlayerBar';
import { DeviceDiscoveryModal } from './components/DeviceDiscoveryModal';
import { QueueDrawer } from './components/QueueDrawer';
import { MultitaskSimulatorModal } from './components/MultitaskSimulatorModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallAppModal } from './components/InstallAppModal';
import { TVReceiverScreen } from './components/TVReceiverScreen';
import { TVSplitMonitorView } from './components/TVSplitMonitorView';
import { BottomNavBar, MainNavTab } from './components/BottomNavBar';
import {
  Tv,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  SplitSquareVertical,
  Cast
} from 'lucide-react';

export default function App() {
  // Check if this window was opened as a dedicated TV Receiver (?mode=tv-receiver)
  const isDedicatedTVWindow =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'tv-receiver';

  if (isDedicatedTVWindow) {
    return (
      <div className="w-screen h-screen bg-black overflow-hidden select-none">
        <TVReceiverScreen
          currentVideo={INITIAL_VIDEOS[0]}
          displayMode="fit"
          targetDevice={INITIAL_DEVICES[0]}
          isStandaloneWindow={true}
          onExitReceiver={() => {
            window.close();
          }}
        />
      </div>
    );
  }

  // --- Main Mobile Sender Application State ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    return {
      appName: 'SmartCast Video Player',
      theme: 'dark',
      defaultQuality: 'Auto',
      defaultAspectMode: 'fit',
      defaultPlaybackSpeed: 1,
      autoPlayNext: true,
      resumePlayback: true,
      backgroundCasting: true,
      preferredDeviceId: null,
      autoReconnect: true,
      subtitleSize: 'medium',
      defaultSubtitleLang: 'hi',
      hardwareAcceleration: true
    };
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    return INITIAL_VIDEOS;
  });

  const [devices, setDevices] = useState<CastingDevice[]>(() => {
    return INITIAL_DEVICES;
  });

  // Active Casting State
  const [connectedDevice, setConnectedDevice] = useState<CastingDevice | null>(null);
  const [castingVideo, setCastingVideo] = useState<VideoItem | null>(null);
  const [isTVPlaying, setIsTVPlaying] = useState<boolean>(false);
  const [tvCurrentTime, setTvCurrentTime] = useState<number>(0);
  const [tvDuration, setTvDuration] = useState<number>(100);
  const [tvVolume, setTvVolume] = useState<number>(85);
  const [tvIsMuted, setTvIsMuted] = useState<boolean>(false);
  const [tvDisplayMode, setTvDisplayMode] = useState<TVDisplayMode>('fit');
  const [tvActiveSubId, setTvActiveSubId] = useState<string>('off');
  const [tvActiveAudio, setTvActiveAudio] = useState<string>('Stereo');
  const [queue, setQueue] = useState<VideoItem[]>([]);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);

  // Mobile local player state
  const [activeMobileVideo, setActiveMobileVideo] = useState<VideoItem | null>(null);
  const [mobileInitialTime, setMobileInitialTime] = useState<number>(0);

  // Modals & Panels
  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('home');
  const [showCastModal, setShowCastModal] = useState<boolean>(false);
  const [showCastRemote, setShowCastRemote] = useState<boolean>(false);
  const [showQueueDrawer, setShowQueueDrawer] = useState<boolean>(false);
  const [showMultitaskDemo, setShowMultitaskDemo] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [showTVSplitMonitor, setShowTVSplitMonitor] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync with Cast Channel (listen for TV receiver feedback)
  useEffect(() => {
    const unsubscribe = castService.subscribe((msg: CastMessage) => {
      switch (msg.type) {
        case 'TV_TIME_UPDATE':
          if (typeof msg.payload?.currentTime === 'number') {
            setTvCurrentTime(msg.payload.currentTime);
          }
          if (typeof msg.payload?.duration === 'number') {
            setTvDuration(msg.payload.duration);
          }
          if (typeof msg.payload?.isPlaying === 'boolean') {
            setIsTVPlaying(msg.payload.isPlaying);
          }
          break;

        case 'TV_ENDED':
          // Auto play next video from queue
          handleTVVideoEnded();
          break;

        case 'TV_READY_PING':
          if (!connectedDevice && devices.length > 0) {
            setConnectedDevice(devices[0]);
          }
          break;

        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [queue, autoPlayNext, connectedDevice, devices]);

  // Handle video ending on TV
  const handleTVVideoEnded = useCallback(() => {
    if (autoPlayNext && queue.length > 0) {
      const nextVid = queue[0];
      const remainingQueue = queue.slice(1);
      setQueue(remainingQueue);
      setCastingVideo(nextVid);
      setTvCurrentTime(0);
      setIsTVPlaying(true);

      castService.sendMessage('CAST_LOAD_MEDIA', {
        video: nextVid,
        startTime: 0,
        displayMode: tvDisplayMode,
        subtitleId: tvActiveSubId
      });
      showToast(`Auto-playing next on TV: ${nextVid.title}`);
    } else {
      setIsTVPlaying(false);
      showToast('TV Playback Finished');
    }
  }, [autoPlayNext, queue, tvDisplayMode, tvActiveSubId]);

  // Connect to TV Device
  const handleSelectDevice = (device: CastingDevice) => {
    setConnectedDevice(device);
    setShowCastModal(false);
    showToast(`Connected to ${device.name}`);

    // If currently playing a video on mobile, transfer stream to TV!
    if (activeMobileVideo) {
      const vid = activeMobileVideo;
      setActiveMobileVideo(null); // Free mobile screen!
      handleCastVideoToTV(vid, tvCurrentTime);
    } else if (castingVideo) {
      // Send current media to newly connected device
      castService.sendMessage('CAST_CONNECT', { device });
      castService.sendMessage('CAST_LOAD_MEDIA', {
        video: castingVideo,
        startTime: tvCurrentTime,
        displayMode: tvDisplayMode,
        subtitleId: tvActiveSubId
      });
      setShowCastRemote(true);
    } else {
      // Connect ready state
      castService.sendMessage('CAST_CONNECT', { device });
      setShowCastRemote(true);
    }
  };

  const handleDisconnectTV = () => {
    castService.sendMessage('CAST_DISCONNECT');
    setConnectedDevice(null);
    setShowCastRemote(false);
    showToast('Disconnected from Smart TV');
  };

  // Cast video to TV
  const handleCastVideoToTV = (video: VideoItem, startAt: number = 0) => {
    // If not connected yet, connect to preferred or first available TV
    const targetDev = connectedDevice || devices[0];
    if (!connectedDevice) {
      setConnectedDevice(targetDev);
    }

    setCastingVideo(video);
    setTvCurrentTime(startAt);
    setTvDuration(video.duration);
    setIsTVPlaying(true);
    setTvActiveAudio(video.audioTracks[0] || 'Stereo');

    castService.sendMessage('CAST_LOAD_MEDIA', {
      video,
      startTime: startAt,
      displayMode: tvDisplayMode,
      subtitleId: tvActiveSubId
    });

    // Close mobile video player so phone is 100% free!
    setActiveMobileVideo(null);
    showToast(`Streaming "${video.title}" to ${targetDev.name}`);
    setShowCastRemote(true);
  };

  // Play on phone locally
  const handlePlayOnPhone = (video: VideoItem) => {
    setActiveMobileVideo(video);
    setMobileInitialTime(video.lastPlayedPosition || 0);
  };

  // Queue actions
  const handleAddToQueue = (video: VideoItem) => {
    setQueue((prev) => [...prev, video]);
    showToast(`Added "${video.title}" to TV queue`);
  };

  const handleRemoveFromQueue = (videoId: string) => {
    setQueue((prev) => prev.filter((v) => v.id !== videoId));
    showToast('Removed from TV queue');
  };

  const handleClearQueue = () => {
    setQueue([]);
    showToast('TV queue cleared');
  };

  const handleMoveQueueItem = (from: number, to: number) => {
    const updated = [...queue];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setQueue(updated);
  };

  const handlePlayQueueVideoNow = (video: VideoItem) => {
    setQueue((prev) => prev.filter((v) => v.id !== video.id));
    handleCastVideoToTV(video, 0);
  };

  // Playback remote control handlers
  const handleRemotePlay = () => {
    setIsTVPlaying(true);
    castService.sendMessage('CAST_PLAY');
  };

  const handleRemotePause = () => {
    setIsTVPlaying(false);
    castService.sendMessage('CAST_PAUSE');
  };

  const handleRemoteSeek = (time: number) => {
    setTvCurrentTime(time);
    castService.sendMessage('CAST_SEEK', { time });
  };

  const handleRemoteVolume = (vol: number) => {
    setTvVolume(vol);
    setTvIsMuted(vol === 0);
    castService.sendMessage('CAST_VOLUME', { volume: vol, isMuted: vol === 0 });
  };

  const handleRemoteToggleMute = () => {
    const newMute = !tvIsMuted;
    setTvIsMuted(newMute);
    castService.sendMessage('CAST_VOLUME', { volume: tvVolume, isMuted: newMute });
  };

  const handleDisplayModeChange = (mode: TVDisplayMode) => {
    setTvDisplayMode(mode);
    castService.sendMessage('CAST_DISPLAY_MODE', { mode });
    showToast(`TV Mode: ${mode.toUpperCase()}`);
  };

  const handleSubtitleChange = (subId: string) => {
    setTvActiveSubId(subId);
    castService.sendMessage('CAST_SUBTITLE', { subId });
    showToast(subId === 'off' ? 'TV Subtitles Off' : 'TV Subtitles On');
  };

  const handleAudioTrackChange = (track: string) => {
    setTvActiveAudio(track);
    castService.sendMessage('CAST_AUDIO_TRACK', { track });
    showToast(`Audio Track: ${track}`);
  };

  const handleNextVideo = () => {
    if (queue.length > 0) {
      const nextVid = queue[0];
      setQueue(queue.slice(1));
      handleCastVideoToTV(nextVid, 0);
    }
  };

  const handlePrevVideo = () => {
    if (tvCurrentTime > 5) {
      handleRemoteSeek(0);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  // Import custom local video files
  const handleAddNewVideoFiles = (files: FileList) => {
    const newItems: VideoItem[] = [];
    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'MP4';
      const sizeMB = (file.size / (1024 * 1024)).toFixed(0);
      const item: VideoItem = {
        id: `user-vid-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        url,
        duration: 120, // default placeholder until metadata loads
        size: `${sizeMB} MB`,
        resolution: '1080p FHD',
        format: (['MP4', 'MKV', 'WebM', 'AVI', 'MOV'].includes(ext) ? ext : 'MP4') as any,
        folder: 'Device Storage',
        thumbnailGradient: 'from-indigo-600 via-blue-700 to-slate-900',
        lastPlayedPosition: 0,
        addedDate: new Date().toISOString().split('T')[0],
        isFavorite: false,
        isDownloaded: true,
        bitrate: '14.2 Mbps',
        fps: 60,
        codec: 'H.264 / AAC (Hardware Accelerated)',
        audioTracks: ['Device Audio'],
        subtitles: []
      };
      newItems.push(item);
    });

    if (newItems.length > 0) {
      setVideos((prev) => [...newItems, ...prev]);
      showToast(`Added ${newItems.length} video(s) to library`);
    }
  };

  // Rescan storage simulation
  const handleRescanMedia = () => {
    setIsScanning(true);
    showToast('Scanning device storage for videos...');
    setTimeout(() => {
      setIsScanning(false);
      showToast('Media library scan completed (6 videos verified)');
    }, 1500);
  };

  // Launch independent TV popup window
  const handleLaunchIndependentTVWindow = () => {
    const win = castService.launchIndependentTVWindow();
    if (win) {
      showToast('Opened Smart TV Receiver window on secondary display');
    } else {
      setShowTVSplitMonitor(true);
      showToast('Popup blocked: Enabled embedded Smart TV monitor');
    }
  };

  // Handle bottom navigation tab switch
  const handleNavTabChange = (tab: MainNavTab) => {
    setActiveNavTab(tab);
    if (tab === 'cast') {
      if (connectedDevice) {
        setShowCastRemote(true);
      } else {
        setShowCastModal(true);
      }
    } else if (tab === 'settings') {
      setShowSettingsModal(true);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        settings.theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-indigo-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick TV Second Screen Monitor Bar (Desktop/Tablet feature) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-slate-900/70 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Tv className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold">{settings.appName} Dual Screen Architecture</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">
            Dedicated video streaming (zero screen mirroring, 100% free phone)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTVSplitMonitor(!showTVSplitMonitor)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 hover:text-white border border-indigo-700/60 transition-colors"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>{showTVSplitMonitor ? 'Hide TV Screen' : 'Show TV Screen Beside Phone'}</span>
          </button>

          <button
            onClick={handleLaunchIndependentTVWindow}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in TV Window / Monitor</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Left/Main Column: Mobile Phone View */}
        <div className="flex-1 flex flex-col min-w-0 max-w-2xl mx-auto w-full relative">
          <HomeScreen
            appName={settings.appName}
            videos={videos}
            connectedDevice={connectedDevice}
            onPlayVideoOnPhone={handlePlayOnPhone}
            onCastVideoToTV={(vid) => handleCastVideoToTV(vid, 0)}
            onAddToQueue={handleAddToQueue}
            onToggleFavorite={handleToggleFavorite}
            onOpenCastModal={() => setShowCastModal(true)}
            onOpenCastRemote={() => setShowCastRemote(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenInstallModal={() => setShowInstallModal(true)}
            onAddNewVideoFiles={handleAddNewVideoFiles}
            onRescanMedia={handleRescanMedia}
            isScanning={isScanning}
          />

          {/* Floating Mini Cast Player Bar (Active when video is streaming to TV) */}
          {connectedDevice && castingVideo && !showCastRemote && (
            <MiniCastPlayerBar
              currentVideo={castingVideo}
              targetDevice={connectedDevice}
              isPlaying={isTVPlaying}
              currentTime={tvCurrentTime}
              duration={tvDuration}
              onPlayPause={() => (isTVPlaying ? handleRemotePause() : handleRemotePlay())}
              onExpandRemote={() => setShowCastRemote(true)}
              onDisconnect={handleDisconnectTV}
              onSeekForward={() => handleRemoteSeek(Math.min(tvCurrentTime + 10, tvDuration))}
            />
          )}

          {/* Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={activeNavTab}
            onChangeTab={handleNavTabChange}
            isCastingActive={!!connectedDevice}
          />
        </div>

        {/* Right Column: Simulated TV Split Monitor (Visible on wide screens or when enabled) */}
        {showTVSplitMonitor && (
          <div className="w-full lg:w-[480px] xl:w-[540px] p-4 lg:p-6 lg:border-l border-slate-800/80 shrink-0">
            <div className="sticky top-6">
              <TVSplitMonitorView
                currentVideo={castingVideo || INITIAL_VIDEOS[0]}
                targetDevice={connectedDevice || INITIAL_DEVICES[0]}
                displayMode={tvDisplayMode}
                onClose={() => setShowTVSplitMonitor(false)}
                onLaunchIndependentWindow={handleLaunchIndependentTVWindow}
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Mobile Video Player */}
      {activeMobileVideo && (
        <MobilePlayer
          video={activeMobileVideo}
          onClose={() => setActiveMobileVideo(null)}
          onOpenCastModal={() => setShowCastModal(true)}
          isCastingActive={!!connectedDevice}
          onOpenCastRemote={() => setShowCastRemote(true)}
          initialTime={mobileInitialTime}
          onTimeUpdate={(t) => {
            // Record last played position
            setVideos((prev) =>
              prev.map((v) =>
                v.id === activeMobileVideo.id ? { ...v, lastPlayedPosition: t } : v
              )
            );
          }}
        />
      )}

      {/* Dedicated Cast Control Remote Panel */}
      {showCastRemote && connectedDevice && (
        <CastControlPanel
          device={connectedDevice}
          currentVideo={castingVideo}
          isPlaying={isTVPlaying}
          currentTime={tvCurrentTime}
          duration={tvDuration}
          volume={tvVolume}
          isMuted={tvIsMuted}
          displayMode={tvDisplayMode}
          activeSubtitleId={tvActiveSubId}
          activeAudioTrack={tvActiveAudio}
          queue={queue}
          onPlay={handleRemotePlay}
          onPause={handleRemotePause}
          onSeek={handleRemoteSeek}
          onVolumeChange={handleRemoteVolume}
          onToggleMute={handleRemoteToggleMute}
          onDisplayModeChange={handleDisplayModeChange}
          onSubtitleChange={handleSubtitleChange}
          onAudioTrackChange={handleAudioTrackChange}
          onNextVideo={handleNextVideo}
          onPrevVideo={handlePrevVideo}
          onDisconnect={handleDisconnectTV}
          onCloseRemote={() => setShowCastRemote(false)}
          onOpenQueue={() => setShowQueueDrawer(true)}
          onOpenMultitaskDemo={() => setShowMultitaskDemo(true)}
          onLaunchTVWindow={handleLaunchIndependentTVWindow}
        />
      )}

      {/* Device Discovery & Connection Modal */}
      <DeviceDiscoveryModal
        isOpen={showCastModal}
        onClose={() => setShowCastModal(false)}
        devices={devices}
        onSelectDevice={handleSelectDevice}
        connectedDevice={connectedDevice}
        onDisconnect={handleDisconnectTV}
        onLaunchTVWindow={handleLaunchIndependentTVWindow}
      />

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={showQueueDrawer}
        onClose={() => setShowQueueDrawer(false)}
        queue={queue}
        currentVideo={castingVideo}
        autoPlayNext={autoPlayNext}
        onToggleAutoPlay={() => setAutoPlayNext(!autoPlayNext)}
        onPlayVideoNow={handlePlayQueueVideoNow}
        onRemoveFromQueue={handleRemoveFromQueue}
        onClearQueue={handleClearQueue}
        onMoveItem={handleMoveQueueItem}
      />

      {/* Multitask & Background Playback Simulator Modal */}
      <MultitaskSimulatorModal
        isOpen={showMultitaskDemo}
        onClose={() => setShowMultitaskDemo(false)}
        currentVideo={castingVideo}
        targetDevice={connectedDevice}
        onOpenCastRemote={() => {
          setShowMultitaskDemo(false);
          setShowCastRemote(true);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((s) => ({ ...s, ...newVals }))}
        devices={devices}
        onTriggerScan={handleRescanMedia}
        onOpenInstallModal={() => setShowInstallModal(true)}
      />

      {/* Mobile Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
