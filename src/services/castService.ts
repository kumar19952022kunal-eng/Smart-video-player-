import { TVDisplayMode, VideoItem, CastingDevice } from '../types';

export interface CastMessage {
  type:
    | 'CAST_CONNECT'
    | 'CAST_DISCONNECT'
    | 'CAST_LOAD_MEDIA'
    | 'CAST_PLAY'
    | 'CAST_PAUSE'
    | 'CAST_SEEK'
    | 'CAST_VOLUME'
    | 'CAST_DISPLAY_MODE'
    | 'CAST_SUBTITLE'
    | 'CAST_AUDIO_TRACK'
    | 'CAST_SPEED'
    | 'TV_TIME_UPDATE'
    | 'TV_STATUS_UPDATE'
    | 'TV_ENDED'
    | 'TV_READY_PING';
  payload?: any;
  timestamp: number;
}

class CastCommunicationService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((message: CastMessage) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('smartcast_sync_bus');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization fallback to storage', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'smartcast_sync_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notifyListeners(data);
          } catch {
            // ignore JSON parse error
          }
        }
      });
    }
  }

  public sendMessage(type: CastMessage['type'], payload?: any) {
    const message: CastMessage = {
      type,
      payload,
      timestamp: Date.now()
    };

    if (this.channel) {
      this.channel.postMessage(message);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('smartcast_sync_event', JSON.stringify(message));
      } catch {
        // storage quota or incognito
      }
    }
  }

  public subscribe(callback: (message: CastMessage) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners(message: CastMessage) {
    this.listeners.forEach((cb) => {
      try {
        cb(message);
      } catch (e) {
        console.error('Error handling cast message', e);
      }
    });
  }

  public launchIndependentTVWindow(): Window | null {
    if (typeof window === 'undefined') return null;
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'tv-receiver');
    const tvWin = window.open(
      url.toString(),
      'SmartCast_TV_Display',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );
    return tvWin;
  }
}

export const castService = new CastCommunicationService();
