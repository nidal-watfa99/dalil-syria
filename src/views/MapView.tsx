import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Crosshair,
  Search,
  Filter,
  Building2,
  Bus,
  Plane,
  Ship,
  Phone,
  Clock,
  AlertCircle,
  ExternalLink,
  Settings,
  RotateCcw,
  Maximize2,
  Eye,
  Check,
  Compass,
  Navigation,
  Share2,
  Copy,
  Sliders,
} from 'lucide-react';
import { MAP_LOCATIONS } from '../data/mapLocations';
import { GOVERNORATES_DATA } from '../data/governorates';
import { MapPoint } from '../types';

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [mapLayerType, setMapLayerType] = useState<'standard' | 'dark' | 'satellite' | 'topo'>('standard');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [markerCount, setMarkerCount] = useState(MAP_LOCATIONS.length);
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);
  const [copiedCoordsToast, setCopiedCoordsToast] = useState(false);

  // Robust Tile Layers with reliable global tile providers
  const baseLayers: Record<string, { url: string; subdomains?: string; maxZoom?: number }> = {
    standard: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      maxZoom: 19,
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      subdomains: 'abcd',
      maxZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 18,
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      maxZoom: 17,
    },
  };

  // Safe Leaflet Initialization
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Prevent "Map container is already initialized"
    if ((container as any)._leaflet_id) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete (container as any)._leaflet_id;
    }

    try {
      // Syria geographic center
      const syriaCenter: [number, number] = [34.90, 38.30];
      const initialZoom = 7;

      const map = L.map(container, {
        center: syriaCenter,
        zoom: initialZoom,
        zoomControl: false, // We render custom Google-style zoom controls
        attributionControl: false,
      });

      // Add zoom control in top-left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Add base tile layer
      const layerConfig = baseLayers[mapLayerType] || baseLayers.standard;
      const tileLayer = L.tileLayer(layerConfig.url, {
        maxZoom: layerConfig.maxZoom || 19,
        subdomains: layerConfig.subdomains || 'abc',
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;

      // Add markers layer group
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Listen for click to inspect coordinates
      map.on('click', (e: L.LeafletMouseEvent) => {
        setClickedCoords([e.latlng.lat, e.latlng.lng]);
      });

      // Force size invalidation across multiple frames to guarantee rendering in all browsers/iframes
      const timer1 = setTimeout(() => map.invalidateSize(), 50);
      const timer2 = setTimeout(() => map.invalidateSize(), 250);
      const timer3 = setTimeout(() => map.invalidateSize(), 600);
      const timer4 = setTimeout(() => map.invalidateSize(), 1200);

      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
    }
  }, []);

  // Handle Layer Type Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const layerConfig = baseLayers[mapLayerType] || baseLayers.standard;
    const newLayer = L.tileLayer(layerConfig.url, {
      maxZoom: layerConfig.maxZoom || 19,
      subdomains: layerConfig.subdomains || 'abc',
    }).addTo(mapInstanceRef.current);

    currentTileLayerRef.current = newLayer;
    mapInstanceRef.current.invalidateSize();
  }, [mapLayerType]);

  // Update Markers when filter changes
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = MAP_LOCATIONS.filter((point) => {
      const matchCat = activeCategory === 'all' || point.category === activeCategory;
      const matchGov = selectedGovernorate === 'all' || point.governorate.includes(selectedGovernorate);
      const matchSearch =
        !searchLocation.trim() ||
        point.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        point.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
        point.governorate.toLowerCase().includes(searchLocation.toLowerCase());
      return matchCat && matchGov && matchSearch;
    });

    setMarkerCount(filtered.length);

    filtered.forEach((point) => {
      let iconColor = '#1a73e8'; // Google Blue
      let iconSymbol = '🏛️';
      if (point.category === 'وزارة') {
        iconColor = '#1a73e8';
        iconSymbol = '🏛️';
      } else if (point.category === 'مركز خدمة مواطن') {
        iconColor = '#0f9d58';
        iconSymbol = '📋';
      } else if (point.category === 'هجرة وجوازات') {
        iconColor = '#f29900';
        iconSymbol = '🛂';
      } else if (point.category === 'كراج ونقل') {
        iconColor = '#9333ea';
        iconSymbol = '🚌';
      } else if (point.category === 'مطار') {
        iconColor = '#d93025';
        iconSymbol = '✈️';
      } else if (point.category === 'مرفأ بحري') {
        iconColor = '#00acc1';
        iconSymbol = '⚓';
      }

      // Elegant SVG marker with Google AI Studio pin styling
      const customIcon = L.divIcon({
        className: 'custom-dalil-marker',
        html: `
          <div style="background-color: ${iconColor}; width: 34px; height: 34px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5); border: 2.5px solid #ffffff; cursor: pointer; transform: translate(-50%, -50%); transition: transform 0.15s ease;">
            <span style="font-size: 14px; line-height: 1;">${iconSymbol}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(point.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedPoint(point);
      });

      marker.bindPopup(`
        <div style="direction: rtl; text-align: right; font-family: 'IBM Plex Sans Arabic', sans-serif; min-width: 200px; color: #131314; padding: 4px;">
          <strong style="color: #1a73e8; font-size: 14px; display: block; margin-bottom: 4px;">${point.name}</strong>
          <span style="font-size: 11px; background: #e8f0fe; color: #1967d2; padding: 2px 8px; border-radius: 12px; display: inline-block; margin-bottom: 6px; font-weight: bold;">${point.category} — ${point.governorate}</span>
          <p style="font-size: 12px; color: #3c4043; margin: 0 0 6px 0; line-height: 1.4;">${point.address}</p>
          ${point.hours ? `<span style="font-size: 11px; color: #b06000; display: block; margin-bottom: 2px;">🕒 دوام: ${point.hours}</span>` : ''}
          ${point.phone ? `<span style="font-size: 11px; color: #0d652d; display: block; direction: ltr; text-align: right;">📞 هاتف: ${point.phone}</span>` : ''}
        </div>
      `);

      markersLayerRef.current?.addLayer(marker);
    });
  }, [activeCategory, selectedGovernorate, searchLocation]);

  // Center on Governorate
  const handleGovernorateSelect = (govName: string) => {
    setSelectedGovernorate(govName);
    if (govName === 'all') {
      handleResetView();
      return;
    }
    const gov = GOVERNORATES_DATA.find((g) => g.name.includes(govName) || govName.includes(g.name));
    if (gov && mapInstanceRef.current) {
      mapInstanceRef.current.setView(gov.coordinates, 12, { animate: true });
    }
  };

  // Reset to Whole Syria
  const handleResetView = () => {
    setSelectedGovernorate('all');
    setActiveCategory('all');
    setSearchLocation('');
    setSelectedPoint(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([34.90, 38.30], 7, { animate: true });
      mapInstanceRef.current.invalidateSize();
    }
  };

  // Geolocation
  const handleLocateUser = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('خاصية تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14, { animate: true });

          const userMarkerIcon = L.divIcon({
            className: 'user-pin-marker',
            html: `
              <div style="background-color: #ea4335; width: 26px; height: 26px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 0 16px #ea4335; display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; border-radius: 9999px; background: white;"></div>
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });

          L.marker([latitude, longitude], { icon: userMarkerIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<strong style="direction: rtl; font-family: sans-serif;">📍 موقعك الحالي التقريبي</strong>')
            .openPopup();
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('يرجى السماح بصلاحية الموقع من إعدادات المتصفح.');
        } else {
          setGeoError('تعذر تحديد موقعك الحالي بدقة.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleFocusPoint = (point: MapPoint) => {
    setSelectedPoint(point);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(point.coordinates, 15, { animate: true });
      mapInstanceRef.current.invalidateSize();
    }
  };

  const copyCoordinates = (coords: [number, number]) => {
    navigator.clipboard.writeText(`${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
    setCopiedCoordsToast(true);
    setTimeout(() => setCopiedCoordsToast(false), 2500);
  };

  return (
    <div className="space-y-4 animate-fadeIn text-right">
      {/* Top Header Card in Google AI Studio Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1a73e8]/20 text-[#a8c7fa] border border-[#1a73e8]/30">
              الخريطة التفاعلية الشاملة 2026
            </span>
            <span className="text-[11px] text-[#c4c7c5]">
              المواقع الموثقة: <strong className="text-white">{markerCount}</strong> موقعاً
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#e3e3e3]">
            خريطة المراكز الحكومية، خدمة المواطن، الهجرة والنقل بالمحافظات
          </h1>
          <p className="text-xs text-[#c4c7c5] mt-1">
            خريطة تفاعلية تلقائية تعمل بكامل إعداداتها وتتيح التبديل بين صور الأقمار الصناعية، شوارع المدن، والنمط الداكن.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#282a2c] border border-[#3c4043] text-xs font-semibold">
            <button
              onClick={() => setMapLayerType('standard')}
              className={`px-3 py-1 rounded-lg transition ${
                mapLayerType === 'standard' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#c4c7c5] hover:text-white'
              }`}
              title="خريطة الشوارع الواضحة"
            >
              شوارع
            </button>
            <button
              onClick={() => setMapLayerType('satellite')}
              className={`px-3 py-1 rounded-lg transition ${
                mapLayerType === 'satellite' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#c4c7c5] hover:text-white'
              }`}
              title="صور أقمار صناعية عالية الدقة"
            >
              أقمار صناعية
            </button>
            <button
              onClick={() => setMapLayerType('dark')}
              className={`px-3 py-1 rounded-lg transition ${
                mapLayerType === 'dark' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#c4c7c5] hover:text-white'
              }`}
              title="النمط الداكن"
            >
              داكنة
            </button>
            <button
              onClick={() => setMapLayerType('topo')}
              className={`px-3 py-1 rounded-lg transition ${
                mapLayerType === 'topo' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#c4c7c5] hover:text-white'
              }`}
              title="تضاريس وطبوغرافيا"
            >
              تضاريس
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-[#282a2c] border border-[#3c4043] text-[#c4c7c5] hover:text-white transition"
            title="إعادة ضبط الرؤية لكافة سوريا"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Locate Button */}
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a73e8] hover:bg-[#1b66c9] text-white text-xs font-bold transition active:scale-95 disabled:opacity-50"
            title="تحديد موقعي الجغرافي"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>موقعي</span>
          </button>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowSettingsDrawer((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              showSettingsDrawer
                ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                : 'bg-[#282a2c] border-[#3c4043] text-[#c4c7c5] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>لوحة التحكم</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Primary Toolbar: Category Pills & Governorate Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1e1f20] border border-[#333537]">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'كافة المعالم' },
            { id: 'وزارة', label: 'الوزارات' },
            { id: 'مركز خدمة مواطن', label: 'مراكز خدمة المواطن' },
            { id: 'هجرة وجوازات', label: 'الهجرة والجوازات' },
            { id: 'كراج ونقل', label: 'محطات النقل والكراجات' },
            { id: 'مطار', label: 'المطارات' },
            { id: 'مرفأ بحري', label: 'الموانئ' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'bg-[#282a2c] text-[#c4c7c5] hover:text-white border border-[#3c4043]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Governorate Select & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGovernorate}
            onChange={(e) => handleGovernorateSelect(e.target.value)}
            className="rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#1a73e8]"
          >
            <option value="all">كافة المحافظات السورية (14)</option>
            {GOVERNORATES_DATA.map((gov) => (
              <option key={gov.id} value={gov.name}>
                {gov.name}
              </option>
            ))}
          </select>

          <div className="relative w-44 sm:w-56">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="ابحث في الخريطة..."
              className="w-full rounded-xl bg-[#282a2c] border border-[#3c4043] px-3 pr-8 py-1.5 text-xs text-white placeholder-[#8e918f] focus:outline-none focus:border-[#1a73e8]"
            />
            <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-[#8e918f] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Map Canvas and Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-[#333537] shadow-2xl relative h-[560px] bg-[#131314]">
          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '560px', position: 'relative' }}
          />

          {/* Floating On-Map Indicator */}
          <div className="absolute bottom-4 left-4 z-[400] bg-[#1e1f20]/90 backdrop-blur-md border border-[#333537] px-3 py-1.5 rounded-xl text-[11px] text-[#c4c7c5] shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الخريطة مفعلة تلقائياً — طبقة {mapLayerType === 'standard' ? 'الشوارع' : mapLayerType === 'satellite' ? 'الأقمار الصناعية' : mapLayerType === 'dark' ? 'الداكنة' : 'التضاريس'}</span>
          </div>

          {clickedCoords && (
            <div className="absolute top-4 left-14 z-[400] bg-[#1e1f20]/95 backdrop-blur-md border border-[#333537] px-3 py-2 rounded-xl text-xs text-white shadow-xl flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#a8c7fa]" />
              <span>الإحداثيات: {clickedCoords[0].toFixed(5)}, {clickedCoords[1].toFixed(5)}</span>
              <button
                onClick={() => copyCoordinates(clickedCoords)}
                className="p-1 rounded bg-[#282a2c] hover:bg-[#333537] text-[#a8c7fa] text-[10px]"
                title="نسخ"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Selected Landmark & Points Sidebar */}
        <div className="lg:col-span-1 rounded-3xl bg-[#1e1f20] border border-[#333537] p-4 h-[560px] flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#333537]">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#a8c7fa]" />
                المواقع المسجلة ({markerCount})
              </h4>
              <span className="text-[10px] text-[#8e918f]">اضغط للتركيز</span>
            </div>

            {selectedPoint && (
              <div className="p-3.5 rounded-2xl bg-[#282a2c] border border-[#1a73e8] space-y-2 animate-fadeIn shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#1a73e8]/20 text-[#a8c7fa]">
                    {selectedPoint.category}
                  </span>
                  <span className="text-[10px] text-[#c4c7c5]">{selectedPoint.governorate}</span>
                </div>
                <h5 className="text-sm font-bold text-white leading-snug">{selectedPoint.name}</h5>
                <p className="text-xs text-[#c4c7c5] leading-relaxed">{selectedPoint.address}</p>
                {selectedPoint.hours && (
                  <p className="text-[11px] text-amber-300">ساعات الدوام: {selectedPoint.hours}</p>
                )}
                {selectedPoint.phone && (
                  <p className="text-[11px] text-emerald-300" dir="ltr">
                    هاتف: {selectedPoint.phone}
                  </p>
                )}
                <div className="pt-2 border-t border-[#333537] flex items-center justify-between text-[11px]">
                  <span className="text-[#8e918f]">
                    {selectedPoint.coordinates[0].toFixed(3)}, {selectedPoint.coordinates[1].toFixed(3)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyCoordinates(selectedPoint.coordinates)}
                      className="p-1 rounded bg-[#333537] text-[#c4c7c5] hover:text-white"
                      title="نسخ الإحداثيات"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedPoint.coordinates[0]},${selectedPoint.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-[#1a73e8] text-white hover:bg-[#1b66c9]"
                      title="فتح في خرائط Google"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {MAP_LOCATIONS.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => handleFocusPoint(pt)}
                    className={`p-2.5 rounded-xl border cursor-pointer text-xs transition ${
                      isSelected
                        ? 'bg-[#282a2c] border-[#1a73e8] text-white shadow-sm'
                        : 'bg-[#282a2c]/60 border-[#333537] text-[#c4c7c5] hover:border-[#3c4043] hover:bg-[#282a2c]'
                    }`}
                  >
                    <strong className="block text-white truncate">{pt.name}</strong>
                    <div className="flex items-center justify-between text-[10px] text-[#8e918f] mt-1">
                      <span className="truncate">{pt.governorate}</span>
                      <span className="text-[#a8c7fa] font-semibold">{pt.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#333537] text-[10px] text-[#8e918f] text-center">
            إحداثيات ومواقع المراكز الحكومية مؤكدة لعام 2026
          </div>
        </div>
      </div>

      {/* Collapsible Settings Drawer Panel */}
      {showSettingsDrawer && (
        <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333537] shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#333537]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#a8c7fa]" />
              لوحة إعدادات وتخصيص الخريطة المتقدمة
            </h3>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs text-[#8e918f] hover:text-white"
            >
              إغلاق
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Layer details */}
            <div className="p-3 rounded-2xl bg-[#282a2c] border border-[#3c4043] space-y-2">
              <strong className="text-white block">مزودات الخرائط المدمجة:</strong>
              <p className="text-[#c4c7c5] text-[11px] leading-relaxed">
                تستخدم الخريطة مزود OpenStreetMap ومزود ArcGIS للأقمار الصناعية عالي الدقة وCartoDB للنمط الداكن، وتعمل فورياً دون أي مفاتيح مدفوعة.
              </p>
            </div>

            {/* Offline Cache status */}
            <div className="p-3 rounded-2xl bg-[#282a2c] border border-[#3c4043] space-y-2">
              <strong className="text-white block">حالة التخزين والذاكرة:</strong>
              <p className="text-[#c4c7c5] text-[11px] leading-relaxed">
                إحداثيات وعناوين وهواتف جميع المراكز والوزارات الـ 14 مخزنة محلياً في التطبيق ومتاحة للبحث الفوري دون إنترنت.
              </p>
            </div>

            {/* Quick center actions */}
            <div className="p-3 rounded-2xl bg-[#282a2c] border border-[#3c4043] space-y-2">
              <strong className="text-white block">إجراءات سريعة:</strong>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleGovernorateSelect('دمشق')}
                  className="px-2.5 py-1 rounded-lg bg-[#333537] text-white hover:bg-[#3c4043]"
                >
                  دمشق
                </button>
                <button
                  onClick={() => handleGovernorateSelect('حلب')}
                  className="px-2.5 py-1 rounded-lg bg-[#333537] text-white hover:bg-[#3c4043]"
                >
                  حلب
                </button>
                <button
                  onClick={() => handleGovernorateSelect('حمص')}
                  className="px-2.5 py-1 rounded-lg bg-[#333537] text-white hover:bg-[#3c4043]"
                >
                  حمص
                </button>
                <button
                  onClick={() => handleGovernorateSelect('اللاذقية')}
                  className="px-2.5 py-1 rounded-lg bg-[#333537] text-white hover:bg-[#3c4043]"
                >
                  اللاذقية
                </button>
                <button
                  onClick={() => handleGovernorateSelect('طرطوس')}
                  className="px-2.5 py-1 rounded-lg bg-[#333537] text-white hover:bg-[#3c4043]"
                >
                  طرطوس
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {copiedCoordsToast && (
        <div className="fixed bottom-16 right-6 z-50 rounded-2xl bg-[#1e1f20] border border-[#1a73e8] p-3.5 text-xs font-bold text-[#a8c7fa] shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>تم نسخ الإحداثيات بنجاح!</span>
        </div>
      )}
    </div>
  );
};
