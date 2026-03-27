import { useEffect, useState, useRef } from 'react';
import { Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export default function AreaPicker({ value, onChange }) {
  const [center] = useState({ lat: 51.505, lng: -0.09 });
  const [markerPos, setMarkerPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [geolocated, setGeolocated] = useState(false);
  const map = useMap('area-picker');
  const geocoding = useMapsLibrary('geocoding');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  function reverseGeocode(lat, lng) {
    if (!geocoding) return;
    const geocoder = new geocoding.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) return;

      let suburb = '';
      let postcode = '';
      for (const result of results) {
        for (const component of result.address_components) {
          if (component.types.includes('postal_code') && !postcode) {
            postcode = component.long_name;
          }
          if (
            !suburb &&
            (component.types.includes('locality') ||
              component.types.includes('sublocality') ||
              component.types.includes('neighborhood'))
          ) {
            suburb = component.long_name;
          }
        }
      }

      const display = [suburb, postcode].filter(Boolean).join(', ');
      if (display) onChangeRef.current(display);
    });
  }

  // Auto-locate on mount — runs once when map + geocoding are ready
  useEffect(() => {
    if (!map || !geocoding || geolocated || !navigator.geolocation) return;
    setGeolocated(true);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.panTo(loc);
        map.setZoom(14);
        setMarkerPos(loc);
        reverseGeocode(loc.lat, loc.lng);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, [map, geocoding, geolocated]);

  // Click to pick a different spot
  useEffect(() => {
    if (!map || !geocoding) return;
    const listener = map.addListener('click', (e) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      reverseGeocode(lat, lng);
    });
    return () => listener.remove();
  }, [map, geocoding]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Your area / neighbourhood
      </label>
      <div className="h-36 rounded-xl overflow-hidden border border-gray-200 relative">
        {locating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <p className="text-sm text-gray-500">Finding your location...</p>
          </div>
        )}
        <Map
          id="area-picker"
          defaultCenter={center}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          style={{ width: '100%', height: '100%' }}
        >
          {markerPos && <Marker position={markerPos} />}
        </Map>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        placeholder="e.g. Shoreditch, E2"
      />
      <p className="text-xs text-gray-400">
        Tap the map or let it auto-detect. Visible to other users.
      </p>
    </div>
  );
}
