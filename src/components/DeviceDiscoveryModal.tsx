import React, { useState, useEffect } from 'react';
import { CastingDevice, CastProtocol } from '../types';
import {
  Tv,
  Wifi,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  X,
  Radio,
  Cast
} from 'lucide-react';

interface DeviceDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: CastingDevice[];
  onSelectDevice: (device: CastingDevice) => void;
  connectedDevice: CastingDevice | null;
  onDisconnect: () => void;
  onLaunchTVWindow: () => void;
}

export const DeviceDiscoveryModal: React.FC<DeviceDiscoveryModalProps> = ({
  isOpen,
  onClose,
  devices,
  onSelectDevice,
  connectedDevice,
  onDisconnect,
  onLaunchTVWindow
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'devices' | 'guide'>('devices');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'google-cast' | 'dlna'>('all');

  const handleRefreshScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  useEffect(() => {
    if (isOpen) {
      handleRefreshScan();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDevices = devices.filter((d) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'google-cast') return d.type === 'google-cast';
    if (selectedFilter === 'dlna') return d.type === 'dlna' || d.type === 'tizen' || d.type === 'webos';
    return true;
  });

  const getProtocolBadge = (type: CastProtocol) => {
    switch (type) {
      case 'google-cast':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">Google Cast</span>;
      case 'dlna':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">DLNA / UPnP</span>;
      case 'tizen':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">Samsung Smart</span>;
      case 'webos':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">LG webOS</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">Compatible TV</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cast to Smart TV</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wi-Fi Network: LivingRoom_5G</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshScan}
              disabled={isScanning}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Rescan network for TVs"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-1 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'devices'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Discovered TVs ({devices.length})
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Connection Guide</span>
            </button>
          </div>

          {activeTab === 'devices' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2 py-1 text-[11px] rounded ${
                  selectedFilter === 'all' ? 'text-indigo-300 font-bold' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('google-cast')}
                className={`px-2 py-1 text-[11px] rounded ${
                  selectedFilter === 'google-cast' ? 'text-indigo-300 font-bold' : 'text-slate-500'
                }`}
              >
                Cast
              </button>
              <button
                onClick={() => setSelectedFilter('dlna')}
                className={`px-2 py-1 text-[11px] rounded ${
                  selectedFilter === 'dlna' ? 'text-indigo-300 font-bold' : 'text-slate-500'
                }`}
              >
                DLNA
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'devices' ? (
            <>
              {/* Scan Banner */}
              {isScanning ? (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
                  <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <div className="text-xs text-indigo-200">
                    Scanning local subnet for Google Cast, DLNA/UPnP, and AirPlay renderers...
                  </div>
                </div>
              ) : null}

              {/* Already Connected Banner */}
              {connectedDevice && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Connected to {connectedDevice.name}
                      </div>
                      <div className="text-[11px] text-emerald-300">
                        Independent Media Casting Active
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onDisconnect}
                    className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-medium border border-red-700/60"
                  >
                    Disconnect
                  </button>
                </div>
              )}

              {/* Discovered Device Cards */}
              <div className="space-y-2.5">
                {filteredDevices.map((dev) => {
                  const isCurrent = connectedDevice?.id === dev.id;
                  return (
                    <div
                      key={dev.id}
                      onClick={() => onSelectDevice(dev)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40'
                          : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/70 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                            isCurrent
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          <Tv className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">
                              {dev.name}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 truncate">
                            {dev.model} · {dev.ipAddress}
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            {getProtocolBadge(dev.type)}
                            <span className="text-[10px] text-slate-400 font-mono">
                              {dev.resolution}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        {isCurrent ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                            Connected
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDevice(dev);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pop-Out TV Receiver Window for testing dual screens */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-700/40 space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <ExternalLink className="w-4 h-4" />
                    <span>Second-Screen TV Mode</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 uppercase font-mono">
                    Dual Display
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Want to see the Smart TV running on an external monitor or separate browser tab while using your phone here?
                </p>
                <button
                  onClick={onLaunchTVWindow}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Independent Smart TV Window</span>
                </button>
              </div>
            </>
          ) : (
            /* Connection Instructions / Guide */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>5-Step Smart TV Connection</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Follow these steps to cast directly to your Smart TV without mirroring your screen:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">Same Wi-Fi Network</strong>
                    <span className="text-slate-300 leading-relaxed">
                      Make sure both your mobile phone and Smart TV are connected to the exact same Wi-Fi router (2.4GHz or 5GHz).
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">Press "Cast to TV"</strong>
                    <span className="text-slate-300 leading-relaxed">
                      Tap the Cast icon on the top bar or inside any video player screen to scan compatible TVs.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">Select Your TV Model</strong>
                    <span className="text-slate-300 leading-relaxed">
                      Choose your device (Sony Bravia, Samsung QLED, LG OLED, Chromecast, or DLNA Box).
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">Select Video</strong>
                    <span className="text-slate-300 leading-relaxed">
                      Pick any local video from Folders, Downloads, or Favorites.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    5
                  </span>
                  <div>
                    <strong className="text-white block font-semibold">Independent Playback Begins</strong>
                    <span className="text-slate-300 leading-relaxed">
                      Video plays fullscreen on TV. Your phone turns into a remote controller and is 100% free for WhatsApp and other apps!
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Technical Limitation Notice */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Real-World Protocol Notice</span>
                </div>
                <p className="leading-relaxed text-slate-300 text-[11px]">
                  SmartCast prioritizes Google Cast and UPnP/DLNA dedicated media streaming protocols. If a particular TV brand does not support direct media rendering, dedicated casting protocols take precedence over battery-draining screen mirroring.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
