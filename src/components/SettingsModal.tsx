import React, { useState } from 'react';
import { AppSettings, CastingDevice, TVDisplayMode } from '../types';
import {
  Settings,
  Tv,
  Film,
  Subtitles,
  Palette,
  HardDrive,
  Check,
  X,
  Edit2,
  RefreshCw,
  FolderSync
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  devices: CastingDevice[];
  onTriggerScan: () => void;
  onOpenInstallModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  devices,
  onTriggerScan,
  onOpenInstallModal
}) => {
  const [activeTab, setActiveTab] = useState<'player' | 'casting' | 'subtitles' | 'appearance' | 'storage'>('casting');
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(settings.appName);

  if (!isOpen) return null;

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      onUpdateSettings({ appName: tempTitle.trim() });
    }
    setEditingTitle(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">App & Player Settings</h3>
              <div className="text-xs text-slate-400">Configure playback, TV casting, and storage</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('casting')}
            className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'casting'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Casting Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'player'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Player</span>
          </button>

          <button
            onClick={() => setActiveTab('subtitles')}
            className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'subtitles'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Subtitles</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'appearance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'storage'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Storage & Scan</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'casting' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="font-bold text-white mb-1">Dedicated TV Casting Preference</div>
                <div className="text-slate-300">
                  Controls how videos are transmitted to compatible Smart TVs while keeping the phone independent.
                </div>
              </div>

              {/* Default TV Display Mode */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">
                  Default TV Aspect Ratio Display Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['fit', 'fill', 'crop', 'original'] as TVDisplayMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdateSettings({ defaultAspectMode: mode })}
                      className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition-all ${
                        settings.defaultAspectMode === mode
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Smart TV */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">Preferred TV Device</label>
                <select
                  value={settings.preferredDeviceId || ''}
                  onChange={(e) =>
                    onUpdateSettings({ preferredDeviceId: e.target.value || null })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">None (Ask Every Time)</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.model})
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto Reconnect */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div>
                  <div className="font-semibold text-white">Auto-Reconnect to Last TV</div>
                  <div className="text-[11px] text-slate-400">
                    Automatically connect when video casting begins on home Wi-Fi
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoReconnect}
                  onChange={(e) => onUpdateSettings({ autoReconnect: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Background Casting */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div>
                  <div className="font-semibold text-white">Background TV Casting</div>
                  <div className="text-[11px] text-slate-400">
                    Keep video running on TV even when phone screen is turned off or app minimized
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.backgroundCasting}
                  onChange={(e) => onUpdateSettings({ backgroundCasting: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'player' && (
            <div className="space-y-4">
              {/* Default Quality */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">Default Playback Quality</label>
                <select
                  value={settings.defaultQuality}
                  onChange={(e) => onUpdateSettings({ defaultQuality: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Auto">Auto (Best for Hardware)</option>
                  <option value="4K UHD">4K UHD (2160p)</option>
                  <option value="1080p FHD">1080p FHD</option>
                  <option value="720p HD">720p HD</option>
                  <option value="480p SD">480p SD</option>
                </select>
              </div>

              {/* Playback Speed */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">Default Playback Speed</label>
                <div className="flex gap-2">
                  {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => onUpdateSettings({ defaultPlaybackSpeed: spd })}
                      className={`flex-1 py-2 rounded-xl border text-center font-semibold ${
                        settings.defaultPlaybackSpeed === spd
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume Playback */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div>
                  <div className="font-semibold text-white">Resume Playback Position</div>
                  <div className="text-[11px] text-slate-400">
                    Remember last played timestamp and prompt to resume
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.resumePlayback}
                  onChange={(e) => onUpdateSettings({ resumePlayback: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Hardware Acceleration */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div>
                  <div className="font-semibold text-white">Hardware Acceleration</div>
                  <div className="text-[11px] text-slate-400">
                    Use GPU hardware decoding (MediaCodec / WebCodec) for smooth 4K 60fps
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hardwareAcceleration}
                  onChange={(e) => onUpdateSettings({ hardwareAcceleration: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'subtitles' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">Default Subtitle Language</label>
                <select
                  value={settings.defaultSubtitleLang}
                  onChange={(e) => onUpdateSettings({ defaultSubtitleLang: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="off">Off by default</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">Subtitle Font Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateSettings({ subtitleSize: size })}
                      className={`py-2 rounded-xl border text-center font-semibold capitalize ${
                        settings.subtitleSize === size
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              {/* App Name Customization (from prompt: "ऐप का नाम आसानी से बदला जा सके") */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-white">App Branding Name</label>
                  {!editingTitle && (
                    <button
                      onClick={() => setEditingTitle(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change Name</span>
                    </button>
                  )}
                </div>

                {editingTitle ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="flex-1 bg-slate-900 border border-indigo-500 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTitle(false)}
                      className="px-2 py-2 text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-indigo-300">{settings.appName}</div>
                )}
                <div className="text-[11px] text-slate-400">
                  You can personalize the player title at any time.
                </div>
              </div>

              {/* Theme Mode */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 block">Theme Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`py-2.5 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                      settings.theme === 'dark'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Dark AMOLED</span>
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`py-2.5 rounded-xl border font-semibold flex items-center justify-center gap-2 ${
                      settings.theme === 'light'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>Light Mode</span>
                  </button>
                </div>
              </div>

              {/* Install on Mobile Prompt */}
              {onOpenInstallModal && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>Install on Mobile Device</span>
                    <span className="text-[10px] text-emerald-400 font-mono">PWA STANDALONE</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Install this video player as an independent app on your Android or iOS home screen without app store download.
                  </p>
                  <button
                    onClick={() => {
                      onOpenInstallModal();
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Open Install Instructions</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <FolderSync className="w-4 h-4 text-indigo-400" />
                  <span>Local Media Scanning</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Scans phone storage for MP4, MKV, WebM, AVI, and MOV files. All processing is 100% on-device with zero cloud uploads for maximum privacy.
                </p>
                <button
                  onClick={() => {
                    onTriggerScan();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan Storage for New Videos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
