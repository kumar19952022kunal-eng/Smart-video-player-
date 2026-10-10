import React from 'react';
import { VideoItem } from '../types';
import { ListVideo, Play, Trash2, X, MoveUp, MoveDown, ToggleLeft, ToggleRight } from 'lucide-react';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: VideoItem[];
  currentVideo: VideoItem | null;
  autoPlayNext: boolean;
  onToggleAutoPlay: () => void;
  onPlayVideoNow: (video: VideoItem) => void;
  onRemoveFromQueue: (videoId: string) => void;
  onClearQueue: () => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  currentVideo,
  autoPlayNext,
  onToggleAutoPlay,
  onPlayVideoNow,
  onRemoveFromQueue,
  onClearQueue,
  onMoveItem
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ListVideo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Playback Queue ({queue.length})</h3>
              <div className="text-[11px] text-slate-400">Next videos to stream on TV</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={onClearQueue}
                className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto Play Next Toggle Bar */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">Auto-Play Next Video on TV</span>
          <button
            onClick={onToggleAutoPlay}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white"
          >
            {autoPlayNext ? (
              <span className="text-emerald-400 flex items-center gap-1">
                ON <ToggleRight className="w-5 h-5 text-emerald-400 inline" />
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                OFF <ToggleLeft className="w-5 h-5 text-slate-500 inline" />
              </span>
            )}
          </button>
        </div>

        {/* Current Video Playing Card */}
        {currentVideo && (
          <div className="p-3 bg-indigo-950/30 border-b border-indigo-800/30">
            <div className="text-[10px] uppercase font-semibold text-indigo-300 tracking-wider mb-1">
              Currently Streaming on TV
            </div>
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-white truncate">{currentVideo.title}</div>
                <div className="text-[11px] text-slate-400">{currentVideo.resolution} · {currentVideo.format}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono shrink-0">
                Active
              </span>
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="p-3 flex-1 overflow-y-auto space-y-2">
          {queue.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <ListVideo className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p>Queue is empty</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Add any video from the library to queue it for the Smart TV.
              </p>
            </div>
          ) : (
            queue.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-3 group hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-slate-500 w-4">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {item.resolution} · {item.folder}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder Buttons */}
                  {index > 0 && (
                    <button
                      onClick={() => onMoveItem(index, index - 1)}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {index < queue.length - 1 && (
                    <button
                      onClick={() => onMoveItem(index, index + 1)}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Play Now Button */}
                  <button
                    onClick={() => onPlayVideoNow(item)}
                    className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors"
                    title="Play on TV Now"
                  >
                    <Play className="w-3 h-3 ml-0.5" />
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromQueue(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Remove from Queue"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
