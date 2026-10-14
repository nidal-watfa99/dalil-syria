import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  Compass,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  ChevronDown,
  Info,
  LocateFixed,
  Route,
  RotateCcw,
  X,
  Maximize2,
  Minimize2,
  ArrowRight,
  Sparkles,
  Layers2
} from 'lucide-react';
import { Authority, Governorate } from '../../types';
import { AUTHORITIES_DATA } from '../../data/authoritiesData';
import { GOVERNORATES_DATA } from '../../data/governoratesData';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import {
  calculateHaversineDistance,
  formatDistance,
  getDirectionsUrl,
  requestUserLocation,
  reverseGeocode
} from '../../utils/geoUtils';
import { logDiagnostic } from '../../utils/storageAndLogs';
import { VoiceSearchButton } from '../common/VoiceSearchButton';

interface SyriaInteractiveMapProps {
  initialGovernorateId?: string;
  selectedAuthorityId?: string;
  onSelectAuthority?: (authority: Authority) => void;
  onRequestInaccuracyReport?: (authority: Authority) => void;
  onBackToHome?: () => void;
  className?: string;
  isExpandedView?: boolean;
}

export const SyriaInteractiveMap: React.FC<SyriaInteractiveMapProps> = ({
  initialGovernorateId,
  selectedAuthorityId,
  onSelectAuthority,
  onRequestInaccuracyReport,
  onBackToHome,
  className = '',
  isExpandedView = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // States
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(initialGovernorateId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAuthority, setActiveAuthority] = useState<Authority | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [tileStyle, setTileStyle] = useState<'voyager' | 'osm' | 'dark'>('voyager');
  const [showCalculationInfo, setShowCalculationInfo] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Filtered authorities
  const filteredAuthorities = useMemo(() => {
    return AUTHORITIES_DATA.filter((auth) => {
      if (selectedGovernorate !== 'all' && auth.governorateId !== selectedGovernorate) {
        return false;
      }
      if (selectedCategory !== 'all' && auth.categoryId !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = auth.nameAr.toLowerCase().includes(q) || auth.nameEn.toLowerCase().includes(q);
        const matchAddress = auth.address.toLowerCase().includes(q) || auth.district.toLowerCase().includes(q);
        if (!matchName && !matchAddress) return false;
      }
      return true;
    });
  }, [selectedGovernorate, selectedCategory, searchQuery]);

  // Compute distances if user location exists
  const authoritiesWithDistance = useMemo(() => {
    if (!userLocation) return filteredAuthorities;
    return [...filteredAuthorities]
      .map((auth) => {
        const dist = calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          auth.lat,
          auth.lng
        );
        return { ...auth, calculatedDistanceKm: dist };
      })
      .sort((a, b) => (a.calculatedDistanceKm || 0) - (b.calculatedDistanceKm || 0));
  }, [filteredAuthorities, userLocation]);

  // Tile URL resolver - Voyager and OpenStreetMap provide clear, immediate, colorful views of Syria
  const getTileConfig = (style: 'voyager' | 'osm' | 'dark') => {
    if (style === 'osm') {
      return {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          subdomains: 'abc',
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        },
      };
    }
    if (style === 'dark') {
      return {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
        options: {
          subdomains: 'abcd',
          maxZoom: 19,
          attribution: '&copy; CARTO',
        },
      };
    }
    // Default: CartoDB Voyager - high contrast, beautiful Syrian roads, Arabic/English labels, blue sea
    return {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      options: {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; CARTO &copy; OpenStreetMap',
      },
    };
  };

  // Helper to force resize and redraw
  const forceInvalidateSize = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  }, []);

  // Initialize Leaflet Map (Runs on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any stale map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {
        // ignore
      }
      mapInstanceRef.current = null;
    }

    // Geographic center of the Syrian Arab Republic
    const syriaCenter: L.LatLngExpression = [35.0, 38.2];
    const initialZoom = 7;

    const map = L.map(mapContainerRef.current, {
      center: syriaCenter,
      zoom: initialZoom,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    // Add zoom control at bottom-left for Arabic RTL layout
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Initial Tile Layer
    const tileConf = getTileConfig(tileStyle);
    const tiles = L.tileLayer(tileConf.url, tileConf.options);
    tiles.addTo(map);
    tileLayerRef.current = tiles;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;
    setIsMapLoaded(true);

    // Repeated invalidateSize to guarantee rendering in all browsers and iframe contexts
    const timers = [
      setTimeout(() => map.invalidateSize(), 50),
      setTimeout(() => map.invalidateSize(), 150),
      setTimeout(() => map.invalidateSize(), 300),
      setTimeout(() => map.invalidateSize(), 600),
      setTimeout(() => map.invalidateSize(), 1200),
    ];

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    logDiagnostic('info', 'GISMap', 'Leaflet map initialized successfully with auto-reveal and vibrant tile engine');

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) resizeObserver.disconnect();
      try {
        map.remove();
      } catch {
        // ignore
      }
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Invalidate size when fullscreen mode toggles
  useEffect(() => {
    const t = setTimeout(() => {
      forceInvalidateSize();
    }, 100);
    return () => clearTimeout(t);
  }, [isFullscreen, forceInvalidateSize]);

  // Update Tile Layer when tileStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch {
        // ignore
      }
    }

    const tileConf = getTileConfig(tileStyle);
    const newTiles = L.tileLayer(tileConf.url, tileConf.options);
    newTiles.addTo(map);
    tileLayerRef.current = newTiles;
    map.invalidateSize();
    logDiagnostic('info', 'GISMap', `Switched map layer style to: ${tileStyle}`);
  }, [tileStyle]);

  // Update Pins on Filtered Data Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredAuthorities.forEach((auth) => {
      const isSelected = activeAuthority?.id === auth.id;

      const colorBg = isSelected
        ? 'bg-amber-400 text-slate-950 scale-125 border-white ring-4 ring-amber-400/50 z-30'
        : auth.isVerified
        ? 'bg-[#0B0F17] text-amber-300 border-amber-500 hover:scale-110 shadow-lg'
        : 'bg-slate-800 text-slate-200 border-slate-500 hover:scale-110';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-transform shadow-xl ${colorBg}" style="cursor: pointer;">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([auth.lat, auth.lng], { icon: customIcon });
      marker.on('click', () => {
        setActiveAuthority(auth);
        if (onSelectAuthority) onSelectAuthority(auth);
        map.setView([auth.lat, auth.lng], Math.max(map.getZoom(), 14), { animate: true });
      });

      markersLayer.addLayer(marker);
    });
  }, [filteredAuthorities, activeAuthority, onSelectAuthority]);

  // Handle external selection
  useEffect(() => {
    if (selectedAuthorityId) {
      const found = AUTHORITIES_DATA.find((a) => a.id === selectedAuthorityId);
      if (found) {
        setActiveAuthority(found);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([found.lat, found.lng], 14, { animate: true });
        }
      }
    }
  }, [selectedAuthorityId]);

  // Handle Governorate Zoom
  const handleGovernorateChange = (govId: string) => {
    setSelectedGovernorate(govId);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (govId === 'all') {
      map.setView([35.0, 38.2], 7, { animate: true });
    } else {
      const gov = GOVERNORATES_DATA.find((g) => g.id === govId);
      if (gov) {
        map.setView([gov.lat, gov.lng], gov.zoom, { animate: true });
        logDiagnostic('info', 'GISMap', `Panned map to governorate: ${gov.nameAr}`);
      }
    }
  };

  // Recenter Syria View
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([35.0, 38.2], 7, { animate: true });
      setSelectedGovernorate('all');
      forceInvalidateSize();
    }
  };

  // Request GPS Location
  const handleRequestGPS = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const res = await requestUserLocation();
      const addr = await reverseGeocode(res.lat, res.lng);
      setUserLocation({ lat: res.lat, lng: res.lng, address: addr });

      const map = mapInstanceRef.current;
      if (map) {
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white border-2 border-white shadow-2xl cursor-grab">
              <span class="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping"></span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([res.lat, res.lng], {
          icon: userIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', async () => {
          const pos = marker.getLatLng();
          const newAddr = await reverseGeocode(pos.lat, pos.lng);
          setUserLocation({ lat: pos.lat, lng: pos.lng, address: newAddr });
          logDiagnostic('info', 'GISMap', `User dragged position pin to: ${pos.lat}, ${pos.lng}`);
        });

        userMarkerRef.current = marker;
        map.setView([res.lat, res.lng], 13, { animate: true });
        logDiagnostic('info', 'GISMap', 'User GPS position resolved successfully', { accuracy: res.accuracyMeters });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر تحديد الموقع';
      setLocationError(msg);
      logDiagnostic('warn', 'GISMap', `Location error: ${msg}`);
    } finally {
      setIsLocating(false);
    }
  };

  const containerStyle: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        borderRadius: 0,
        margin: 0,
      }
    : {
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        height: className.includes('h-') ? undefined : '580px',
      };

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#0e1422] ${
        isFullscreen ? '!fixed !inset-0 !z-[9999] !w-screen !h-screen !rounded-none' : className
      }`}
      style={containerStyle}
    >
      {/* Native Direct Leaflet Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full relative z-0"
        style={{
          width: '100%',
          height: '100%',
          minHeight: isFullscreen ? '100vh' : '520px',
          backgroundColor: '#0e1422',
        }}
      />

      {/* Top Floating Header & Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Back Button ("زر رجوع") - Prominent when maximized or in expanded view */}
          {(isFullscreen || onBackToHome || isExpandedView) && (
            <button
              type="button"
              onClick={() => {
                if (isFullscreen) {
                  setIsFullscreen(false);
                } else if (onBackToHome) {
                  onBackToHome();
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl transition-all hover:scale-105 active:scale-95"
              title="الرجوع إلى الصفحة السابقة"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isFullscreen ? 'رجوع (إنهاء وضع التكبير)' : 'الرجوع إلى الصفحة الرئيسية'}
              </span>
            </button>
          )}

          {/* Quick Syrian Flag & Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 shadow-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">الخريطة المباشرة جاهزة</span>
            <span className="text-slate-500 font-mono">· ١٤ محافظة</span>
          </div>

          {/* Fullscreen / Maximize Map Toggle */}
          <div className="flex items-center gap-1.5 mr-auto">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl shadow-xl transition-all ${
                isFullscreen
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/40'
              }`}
              title={isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'تكبير الخريطة على كامل الشاشة'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">تصغير</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>تكبير الخريطة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Input Bar with Integrated Voice Search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الصوت عن مديرية، محكمة، فرع هجرة، أو كراج..."
              className="w-full pl-20 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-900/95 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 shadow-2xl backdrop-blur-md"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            
            {/* Action buttons inside search field (Voice Search + Clear) */}
            <div className="absolute left-2.5 top-1.5 flex items-center gap-1">
              <VoiceSearchButton
                size="sm"
                onTranscript={(voiceText) => {
                  setSearchQuery(voiceText);
                  logDiagnostic('info', 'GISMap', `Voice query applied to map: ${voiceText}`);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Governorates & Style Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {/* Governorate dropdown */}
            <select
              value={selectedGovernorate}
              onChange={(e) => handleGovernorateChange(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900/95 border border-slate-700 text-slate-200 focus:outline-none shadow-xl cursor-pointer"
            >
              <option value="all">كل المحافظات (١٤ محافظة)</option>
              {GOVERNORATES_DATA.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.nameAr}
                </option>
              ))}
            </select>

            {/* Recenter Syria */}
            <button
              type="button"
              onClick={handleRecenter}
              className="p-2 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors shadow-xl"
              title="إعادة ضبط الرؤية لكامل سورية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Map Layer Mode Toggle (Voyager, OSM, Dark) */}
            <button
              type="button"
              onClick={() => {
                const styles: Array<'voyager' | 'osm' | 'dark'> = ['voyager', 'osm', 'dark'];
                const nextIdx = (styles.indexOf(tileStyle) + 1) % styles.length;
                setTileStyle(styles[nextIdx]);
              }}
              className="p-2 rounded-xl bg-slate-900/95 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors shadow-xl"
              title={`نمط الخريطة الحالي: ${
                tileStyle === 'voyager' ? 'ملون تفصيلي (Carto Voyager)' : tileStyle === 'osm' ? 'طرق OpenStreetMap' : 'داكن (Dark Matter)'
              } - انقر للتبديل`}
            >
              <Layers2 className="w-4 h-4" />
            </button>

            {/* Category filter toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-colors shadow-xl bg-slate-900/95 border ${
                showFilters || selectedCategory !== 'all'
                  ? 'text-amber-400 border-amber-500/60'
                  : 'text-slate-300 border-slate-700'
              }`}
              title="تصفية حسب القطاع"
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={handleRequestGPS}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl shadow-xl transition-all ${
                userLocation
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700'
              }`}
              title="تحديد موقعي الحالي بدقة وحساب أقرب المراكز"
            >
              <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline whitespace-nowrap">
                {isLocating ? 'جارٍ التحديد...' : userLocation ? 'موقعي محدد' : 'موقعي'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Category Selector Bar */}
      {showFilters && (
        <div className="absolute top-28 left-3 right-3 z-20 p-3 rounded-xl bg-slate-900/95 shadow-2xl flex flex-wrap gap-1.5 pointer-events-auto border border-slate-700 animate-fade-in max-h-56 overflow-y-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            جميع القطاعات
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.titleAr}
            </button>
          ))}
        </div>
      )}

      {/* Location Notification/Error Banner */}
      {locationError && (
        <div className="absolute top-28 left-3 right-3 z-30 flex items-center justify-between p-3 rounded-xl bg-red-950/90 border border-red-700/60 text-red-200 text-xs shadow-xl backdrop-blur-md">
          <span>{locationError}</span>
          <button type="button" onClick={() => setLocationError(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Counter Bar */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-auto flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-xs text-slate-300 flex items-center gap-2 shadow-xl border border-slate-700/80 backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>المراكز المعروضة: <strong className="text-white font-mono">{filteredAuthorities.length}</strong></span>
        </div>

        {userLocation && (
          <button
            type="button"
            onClick={() => setShowCalculationInfo(!showCalculationInfo)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 shadow-xl border border-slate-700/80 backdrop-blur-md"
            title="طريقة احتساب المسافات"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">صيغة المسافة</span>
          </button>
        )}
      </div>

      {/* Haversine Formula Modal */}
      {showCalculationInfo && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 p-5 rounded-2xl border border-slate-700 text-slate-100 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                طريقة احتساب المسافة الجغرافية (Haversine Formula)
              </h4>
              <button type="button" onClick={() => setShowCalculationInfo(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحسب المسافة بين موقعك والمراكز الحكومية باستخدام معادلة <strong>هافيرسين الكروية (Great-Circle Distance)</strong> على سطح الأرض بنصف قطر وسطي يعادل <strong>6,371 كم</strong>:
            </p>
            <div className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-amber-300 text-left dir-ltr">
              d = 2R · asin(√(sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)))
            </div>
            <p className="text-xs text-slate-400">
              * المسافة المقدرة هي مسافة خط مستقيم كروي، وتعتمد في الدليل لفرز وتصنيف أقرب المراكز التابعة للجمهورية العربية السورية.
            </p>
            <button
              type="button"
              onClick={() => setShowCalculationInfo(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Detailed Pin Card (Floating Bottom Right) */}
      {activeAuthority && (
        <div className="absolute bottom-3 right-3 left-3 md:left-auto md:w-96 z-20 pointer-events-auto rounded-2xl bg-slate-900/95 p-4 border border-slate-700 text-slate-100 shadow-2xl animate-fade-in space-y-3 backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {activeAuthority.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    موثق رسمياً
                  </span>
                )}
                {userLocation && (
                  <span className="text-[11px] font-mono text-amber-300">
                    تبعد: {formatDistance(calculateHaversineDistance(userLocation.lat, userLocation.lng, activeAuthority.lat, activeAuthority.lng))}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">{activeAuthority.nameAr}</h3>
              <p className="text-[11px] text-slate-400">{activeAuthority.district} · {activeAuthority.nameEn}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveAuthority(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-2">
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{activeAuthority.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono text-slate-200">{activeAuthority.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeAuthority.workingHours}</span>
            </p>
          </div>

          {activeAuthority.notes && (
            <p className="text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              {activeAuthority.notes}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={getDirectionsUrl(activeAuthority.lat, activeAuthority.lng, activeAuthority.nameAr)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
            >
              <Route className="w-3.5 h-3.5" />
              <span>الاتجاهات والملاحة</span>
            </a>
            {onRequestInaccuracyReport && (
              <button
                type="button"
                onClick={() => onRequestInaccuracyReport(activeAuthority)}
                className="py-2 px-3 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="الإبلاغ عن خطأ في العنوان أو ساعات العمل"
              >
                إبلاغ عن خطأ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
