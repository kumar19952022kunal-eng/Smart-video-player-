import React, { useState, useRef } from 'react';
import { VideoItem, CastingDevice } from '../types';
import {
  Search,
  Cast,
  Settings as SettingsIcon,
  Folder,
  FolderOpen,
  Heart,
  Clock,
  DownloadCloud,
  Film,
  Play,
  Tv,
  Plus,
  Filter,
  Check,
  MoreVertical,
  ListPlus,
  Sparkles,
  RefreshCw,
  UploadCloud,
  Download
} from 'lucide-react';

interface HomeScreenProps {
  appName: string;
  videos: VideoItem[];
  connectedDevice: CastingDevice | null;
  onPlayVideoOnPhone: (video: VideoItem) => void;
  onCastVideoToTV: (video: VideoItem) => void;
  onAddToQueue: (video: VideoItem) => void;
  onToggleFavorite: (videoId: string) => void;
  onOpenCastModal: () => void;
  onOpenCastRemote: () => void;
  onOpenSettings: () => void;
  onOpenInstallModal: () => void;
  onAddNewVideoFiles: (files: FileList) => void;
  onRescanMedia: () => void;
  isScanning: boolean;
}

export type CategoryTab = 'all' | 'folders' | 'recent' | 'favorites' | 'downloads';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  appName,
  videos,
  connectedDevice,
  onPlayVideoOnPhone,
  onCastVideoToTV,
  onAddToQueue,
  onToggleFavorite,
  onOpenCastModal,
  onOpenCastRemote,
  onOpenSettings,
  onOpenInstallModal,
  onAddNewVideoFiles,
  onRescanMedia,
  isScanning
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group videos by folder
  const foldersMap = videos.reduce<Record<string, VideoItem[]>>((acc, vid) => {
    acc[vid.folder] = acc[vid.folder] || [];
    acc[vid.folder].push(vid);
    return acc;
  }, {});
  const folderNames = Object.keys(foldersMap);

  // Filter videos
  const filteredVideos = videos.filter((vid) => {
    // Search query matching title, folder, resolution, codec, format
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        vid.title.toLowerCase().includes(q) ||
        vid.folder.toLowerCase().includes(q) ||
        vid.resolution.toLowerCase().includes(q) ||
        vid.format.toLowerCase().includes(q) ||
        vid.codec.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Resolution filter
    if (selectedResolution !== 'all' && !vid.resolution.includes(selectedResolution)) {
      return false;
    }

    // Category filter
    switch (activeCategory) {
      case 'folders':
        if (selectedFolder) return vid.folder === selectedFolder;
        return true;
      case 'recent':
        return vid.lastPlayedPosition > 0;
      case 'favorites':
        return vid.isFavorite;
      case 'downloads':
        return vid.isDownloaded;
      case 'all':
      default:
        return true;
    }
  });

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddNewVideoFiles(e.target.files);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-28">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                {appName}
              </h1>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>{videos.length} Videos</span>
                <span>·</span>
                <span className="text-indigo-400">SmartCast Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`p-2 rounded-xl transition-colors ${
                showSearchInput ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Search Videos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Prominent Cast Button with active connection indicator */}
            <button
              onClick={() => {
                if (connectedDevice) {
                  onOpenCastRemote();
                } else {
                  onOpenCastModal();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                connectedDevice
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                  : 'bg-slate-800/90 text-indigo-300 hover:bg-indigo-950/60 hover:text-white border border-indigo-500/30'
              }`}
              title="Cast to Smart TV"
            >
              <Cast className={`w-4 h-4 ${connectedDevice ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">
                {connectedDevice ? connectedDevice.name.split(' ')[0] : 'Cast to TV'}
              </span>
            </button>

            {/* Install on Mobile Button */}
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40 text-xs font-semibold transition-all shadow-sm"
              title="Install App on Phone (PWA)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install</span>
            </button>

            {/* Scan Storage Button */}
            <button
              onClick={onRescanMedia}
              disabled={isScanning}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Scan Phone Storage"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {showSearchInput && (
          <div className="pt-3 pb-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="वीडियो खोजें... (Search by name, folder, 4K, codec)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Casting Banner (When TV Connected) */}
      {connectedDevice && (
        <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-indigo-900/60 to-slate-900 border border-indigo-500/40 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
              <Tv className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Streaming to {connectedDevice.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[11px] text-indigo-200">
                Phone is 100% free for WhatsApp and multitasking
              </div>
            </div>
          </div>
          <button
            onClick={onOpenCastRemote}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Remote
          </button>
        </div>
      )}

      {/* Main Categories Navigation */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedFolder(null);
            }}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Local Videos</span>
          </button>

          <button
            onClick={() => setActiveCategory('folders')}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeCategory === 'folders'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Folders ({folderNames.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('recent');
              setSelectedFolder(null);
            }}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeCategory === 'recent'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Videos</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('favorites');
              setSelectedFolder(null);
            }}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeCategory === 'favorites'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Favorites</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('downloads');
              setSelectedFolder(null);
            }}
            className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeCategory === 'downloads'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Downloads</span>
          </button>
        </div>
      </div>

      {/* Folder Sub-selector if in 'folders' tab */}
      {activeCategory === 'folders' && (
        <div className="px-4 py-2 border-b border-slate-800/80 mb-2">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFolder === null
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Folders
            </button>
            {folderNames.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedFolder === f
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{f} ({foldersMap[f]?.length})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Quick Filter Bar & Pick Local Video CTA */}
      <div className="px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-mono text-[11px]">Quality:</span>
          {['all', '4K', '1080p', '720p'].map((res) => (
            <button
              key={res}
              onClick={() => setSelectedResolution(res)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                selectedResolution === res
                  ? 'bg-slate-800 text-indigo-300 font-bold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {res.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Real File Input for adding custom local files */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40"
            title="Import video files from device"
          >
            <Plus className="w-3 h-3" />
            <span>Add File</span>
          </button>
        </div>
      </div>

      {/* Video Cards Grid / List */}
      <div className="px-4 pt-2 space-y-3">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Film className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-300">No videos found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Try searching for a different keyword or scan your phone storage.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg inline-flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Select Video from Device</span>
            </button>
          </div>
        ) : (
          filteredVideos.map((video) => {
            const hasProgress = video.lastPlayedPosition > 0;
            const progressPercent =
              video.duration > 0 ? (video.lastPlayedPosition / video.duration) * 100 : 0;

            return (
              <div
                key={video.id}
                className="group p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col sm:flex-row gap-3"
              >
                {/* Video Thumbnail */}
                <div
                  onClick={() => onPlayVideoOnPhone(video)}
                  className={`relative w-full sm:w-44 h-32 sm:h-28 rounded-xl bg-gradient-to-br ${video.thumbnailGradient} overflow-hidden cursor-pointer shrink-0 shadow-inner flex items-center justify-center`}
                >
                  {/* Subtle cinema vignette */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  {/* Play Overlay Icon */}
                  <div className="w-10 h-10 rounded-full bg-black/60 group-hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110 shadow-lg">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-200">
                    {formatSeconds(video.duration)}
                  </div>

                  {/* Resolution Tag */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                    {video.resolution}
                  </div>

                  {/* Resume Progress Bar */}
                  {hasProgress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Video Metadata & Actions */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => onPlayVideoOnPhone(video)}
                        className="text-sm font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {video.title}
                      </h3>
                      <button
                        onClick={() => onToggleFavorite(video.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                        title={video.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            video.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mt-1">
                      <span>Folder: {video.folder}</span>
                      <span>·</span>
                      <span>{video.size}</span>
                      <span>·</span>
                      <span className="font-mono text-indigo-300">{video.format}</span>
                      <span>·</span>
                      <span className="text-emerald-400">{video.codec}</span>
                    </div>

                    {hasProgress && (
                      <div className="text-[11px] text-indigo-400 mt-1 font-mono">
                        Resume at {formatSeconds(video.lastPlayedPosition)}
                      </div>
                    )}
                  </div>

                  {/* Bottom Row Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60 mt-2">
                    {/* Play Phone */}
                    <button
                      onClick={() => onPlayVideoOnPhone(video)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Play Phone</span>
                    </button>

                    {/* Cast to Smart TV Directly */}
                    <button
                      onClick={() => onCastVideoToTV(video)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-colors"
                      title="Cast this video directly to Smart TV"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Cast to TV</span>
                    </button>

                    {/* Add to Queue */}
                    <button
                      onClick={() => onAddToQueue(video)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Add to TV Playback Queue"
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
