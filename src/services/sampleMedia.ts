import { VideoItem, CastingDevice } from '../types';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Himalayan Wildlife: Snow Leopard Sanctuary',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596, // ~10m
    size: '840 MB',
    resolution: '4K UHD',
    format: 'MP4',
    folder: 'Documentaries',
    thumbnailGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    lastPlayedPosition: 142,
    addedDate: '2026-10-02',
    isFavorite: true,
    isDownloaded: true,
    bitrate: '18.4 Mbps',
    fps: 60,
    codec: 'HEVC / H.265 (Hardware Accelerated)',
    audioTracks: ['Hindi (5.1 Dolby Audio)', 'English (Stereo)', 'Original Nature Audio'],
    subtitles: [
      {
        id: 'sub-hi-1',
        language: 'hi',
        label: 'हिंदी (Hindi)',
        cues: [
          { start: 0, end: 5, text: 'हिमालय की ऊँची चोटियों पर प्राकृतिक वन्यजीव...' },
          { start: 6, end: 12, text: 'यहाँ दुर्लभ हिम तेंदुए अपने क्षेत्र की निगरानी करते हैं।' },
          { start: 13, end: 20, text: 'माइनस बीस डिग्री में जीवित रहने की अद्भुत क्षमता।' }
        ]
      },
      {
        id: 'sub-en-1',
        language: 'en',
        label: 'English',
        cues: [
          { start: 0, end: 5, text: 'High in the rugged peaks of the Himalayas...' },
          { start: 6, end: 12, text: 'The elusive snow leopard roams its ancient territory.' },
          { start: 13, end: 20, text: 'Mastering survival in extreme alpine conditions.' }
        ]
      }
    ]
  },
  {
    id: 'vid-2',
    title: 'Neo-Tokyo 2099: Cyberpunk City Lights',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
    size: '620 MB',
    resolution: '1080p FHD',
    format: 'MKV',
    folder: 'Sci-Fi Trailers',
    thumbnailGradient: 'from-purple-600 via-pink-700 to-rose-950',
    lastPlayedPosition: 45,
    addedDate: '2026-10-04',
    isFavorite: true,
    isDownloaded: false,
    bitrate: '12.2 Mbps',
    fps: 60,
    codec: 'AV1 / Opus',
    audioTracks: ['Original Synthwave (Dolby Atmos)', 'Hindi Dubbed (Stereo)'],
    subtitles: [
      {
        id: 'sub-hi-2',
        language: 'hi',
        label: 'हिंदी (Hindi)',
        cues: [
          { start: 0, end: 6, text: 'वर्ष 2099: जब कृत्रिम बुद्धिमत्ता ने शहरों की बागडोर संभाली...' },
          { start: 7, end: 14, text: 'नियॉन रोशनी के नीचे एक नई क्रांति की शुरुआत।' }
        ]
      },
      {
        id: 'sub-en-2',
        language: 'en',
        label: 'English',
        cues: [
          { start: 0, end: 6, text: 'Year 2099: Where synthetic neural systems govern the skyline...' },
          { start: 7, end: 14, text: 'Beneath the holographic rain, humanity seeks freedom.' }
        ]
      }
    ]
  },
  {
    id: 'vid-3',
    title: 'Coastal Odyssey: Pacific Drone Cine 60FPS',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
    size: '125 MB',
    resolution: '4K UHD',
    format: 'MP4',
    folder: 'Drone Shots',
    thumbnailGradient: 'from-cyan-600 via-teal-700 to-slate-900',
    lastPlayedPosition: 0,
    addedDate: '2026-10-05',
    isFavorite: false,
    isDownloaded: true,
    bitrate: '22.0 Mbps',
    fps: 60,
    codec: 'H.264 / AAC High Profile',
    audioTracks: ['Ambient Waves Audio (Spatial)'],
    subtitles: []
  },
  {
    id: 'vid-4',
    title: 'Deep Cosmos: James Webb Interstellar Voyage',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 15,
    size: '190 MB',
    resolution: '1440p QHD',
    format: 'WebM',
    folder: 'Space & Astronomy',
    thumbnailGradient: 'from-amber-600 via-violet-800 to-indigo-950',
    lastPlayedPosition: 8,
    addedDate: '2026-10-06',
    isFavorite: true,
    isDownloaded: false,
    bitrate: '14.5 Mbps',
    fps: 30,
    codec: 'VP9 / Vorbis',
    audioTracks: ['Orchestral Score (Stereo)', 'Hindi Narration'],
    subtitles: [
      {
        id: 'sub-en-4',
        language: 'en',
        label: 'English',
        cues: [
          { start: 0, end: 5, text: 'Witnessing the birth of stars 13 billion light years away.' },
          { start: 6, end: 12, text: 'Unraveling the cosmic dawn with infrared precision.' }
        ]
      }
    ]
  },
  {
    id: 'vid-5',
    title: 'Action Sequence: Tears of Steel Mech Assault',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
    size: '1.2 GB',
    resolution: '4K UHD',
    format: 'MP4',
    folder: 'Movies',
    thumbnailGradient: 'from-emerald-600 via-slate-800 to-black',
    lastPlayedPosition: 210,
    addedDate: '2026-10-07',
    isFavorite: false,
    isDownloaded: true,
    bitrate: '19.8 Mbps',
    fps: 60,
    codec: 'H.264 / AC3 5.1',
    audioTracks: ['English (5.1 Surround)', 'Hindi (DTS-HD)'],
    subtitles: [
      {
        id: 'sub-hi-5',
        language: 'hi',
        label: 'हिंदी (Hindi)',
        cues: [
          { start: 0, end: 6, text: 'रोबोटिक डिफेंस शील्ड तैयार हो रही है।' },
          { start: 7, end: 15, text: 'सभी पायलट अपनी पोजिशन संभालें!' }
        ]
      }
    ]
  },
  {
    id: 'vid-6',
    title: 'Speed Formula: Desert Grand Prix Highlights',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    duration: 47,
    size: '95 MB',
    resolution: '720p HD',
    format: 'AVI',
    folder: 'Sports',
    thumbnailGradient: 'from-red-600 via-orange-700 to-neutral-900',
    lastPlayedPosition: 0,
    addedDate: '2026-10-08',
    isFavorite: false,
    isDownloaded: false,
    bitrate: '6.2 Mbps',
    fps: 60,
    codec: 'MPEG-4 / MP3',
    audioTracks: ['Track Commentary (Hindi)', 'Engine Sound FX'],
    subtitles: []
  }
];

export const INITIAL_DEVICES: CastingDevice[] = [
  {
    id: 'dev-bravia-1',
    name: 'Living Room Sony Bravia 4K',
    type: 'google-cast',
    model: 'Sony XR-65X90L (Android TV)',
    ipAddress: '192.168.1.104',
    resolution: '3840 x 2160 (4K 60Hz HDR)',
    status: 'available',
    icon: 'tv',
    signal: 'strong'
  },
  {
    id: 'dev-samsung-1',
    name: 'Bedroom Samsung QLED',
    type: 'tizen',
    model: 'Samsung QN85C (Tizen OS / DLNA)',
    ipAddress: '192.168.1.112',
    resolution: '3840 x 2160 (4K HDR10+)',
    status: 'available',
    icon: 'tv',
    signal: 'good'
  },
  {
    id: 'dev-lg-1',
    name: 'Hall LG OLED C3',
    type: 'webos',
    model: 'LG OLED65C3 (webOS / AirPlay 2)',
    ipAddress: '192.168.1.120',
    resolution: '3840 x 2160 (4K 120Hz Dolby Vision)',
    status: 'available',
    icon: 'tv',
    signal: 'strong'
  },
  {
    id: 'dev-chromecast-1',
    name: 'Chromecast with Google TV',
    type: 'google-cast',
    model: 'Google Chromecast 4K HDR',
    ipAddress: '192.168.1.108',
    resolution: '3840 x 2160 (4K 60Hz)',
    status: 'available',
    icon: 'chromecast',
    signal: 'strong'
  },
  {
    id: 'dev-dlna-1',
    name: 'Guest Room Smart Box (DLNA/UPnP)',
    type: 'dlna',
    model: 'Universal DLNA Media Renderer',
    ipAddress: '192.168.1.135',
    resolution: '1920 x 1080 (1080p FHD)',
    status: 'available',
    icon: 'tv',
    signal: 'fair'
  }
];
