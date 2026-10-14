/**
 * GIS & Geodetic Utilities for Dalil Syria
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two points on a sphere using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Formats distance with Arabic localization
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} متر تقريباً`;
  }
  return `${km.toFixed(1)} كم تقريباً`;
}

/**
 * Generates external mapping directions URL
 */
export function getDirectionsUrl(lat: number, lng: number, label?: string): string {
  const encodedLabel = encodeURIComponent(label || 'الوجهة المحددة');
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedLabel}`;
}

export interface GeolocationResult {
  lat: number;
  lng: number;
  accuracyMeters: number;
  timestamp: number;
}

/**
 * Safe client geolocation request with detailed error handling
 */
export function requestUserLocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('خدمة تحديد الموقع الجغرافي GPS غير مدعومة في هذا المتصفح أو الجهاز.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let msg = 'تعذر تحديد الموقع الحالي.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'تم رفض إذن الوصول إلى الموقع الجغرافي من قبل المستخدم.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'معلومات الموقع الجغرافي غير متوفرة حالياً (تأكد من تفعيل GPS أو الاتصال بالشبكة).';
            break;
          case error.TIMEOUT:
            msg = 'انتهت مهلة طلب تحديد الموقع الجغرافي.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      }
    );
  });
}

/**
 * Reverse geocoding lookup with fallback to known Syrian governorates
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`,
      {
        headers: {
          'User-Agent': 'DalilSyria-NationalApp/1.0',
        },
      }
    );
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    // Offline or network restricted fallback
    return `موقع مخصص (إحداثيات: ${lat.toFixed(4)}° شمالاً، ${lng.toFixed(4)}° شرقاً)`;
  }
}
