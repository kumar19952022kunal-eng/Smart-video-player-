export type TVDisplayMode = 'fit' | 'fill' | 'crop' | 'original';

export type CastProtocol = 'google-cast' | 'dlna' | 'webos' | 'tizen' | 'airplay' | 'presentation-api';

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  src?: string;
  cues?: SubtitleCue[];
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  duration: number; // in seconds
  size: string; // e.g., "450 MB"
  resolution: '4K UHD' | '1440p QHD' | '1080p FHD' | '720p HD' | '480p SD';
  format: 'MP4' | 'MKV' | 'WebM' | 'AVI' | 'MOV';
  folder: string;
  thumbnailGradient: string;
  thumbnailIconName?: string;
  lastPlayedPosition: number; // seconds
  addedDate: string;
  isFavorite: boolean;
  isDownloaded: boolean;
  bitrate: string;
  fps: number;
  codec: string;
  audioTracks: string[];
  subtitles: SubtitleTrack[];
}

export interface CastingDevice {
  id: string;
  name: string;
  type: CastProtocol;
  model: string;
  ipAddress: string;
  resolution: string;
  status: 'available' | 'connecting' | 'connected' | 'disconnected';
  icon: 'tv' | 'chromecast' | 'apple';
  signal: 'strong' | 'good' | 'fair';
}

export interface CastingState {
  isCasting: boolean;
  targetDevice: CastingDevice | null;
  currentVideo: VideoItem | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number; // 0 - 100
  isMuted: boolean;
  displayMode: TVDisplayMode;
  activeSubtitleId: string | 'off';
  activeAudioTrack: string;
  queue: VideoItem[];
  autoPlayNext: boolean;
  playbackSpeed: number;
}

export interface AppSettings {
  appName: string;
  theme: 'dark' | 'light';
  defaultQuality: string;
  defaultAspectMode: TVDisplayMode;
  defaultPlaybackSpeed: number;
  autoPlayNext: boolean;
  resumePlayback: boolean;
  backgroundCasting: boolean;
  preferredDeviceId: string | null;
  autoReconnect: boolean;
  subtitleSize: 'small' | 'medium' | 'large';
  defaultSubtitleLang: string;
  hardwareAcceleration: boolean;
}
