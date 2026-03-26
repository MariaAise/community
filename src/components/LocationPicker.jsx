import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

function PlacesAutocomplete({ onSelect }) {
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onSelect(
        { lat, lng },
        place.formatted_address || place.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      );
    });
  }, [places, onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search address..."
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
    />
  );
}

function MapClickHandler({ onSelect }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onSelect({ lat, lng }, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });
    return () => listener.remove();
  }, [map, onSelect]);

  return null;
}

export default function LocationPicker({ label, value, onChange }) {
  const [center] = useState({ lat: 51.505, lng: -0.09 });
  const map = useMap(label);

  useEffect(() => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.panTo(loc);
        map.setZoom(13);
      },
      () => {}
    );
  }, [map]);

  const handleSelect = useCallback(
    (coords, name) => {
      onChange({ coords: [coords.lat, coords.lng], name });
      if (map) {
        map.panTo(coords);
        map.setZoom(15);
      }
    },
    [onChange, map]
  );

  const markerPos = value?.coords
    ? { lat: value.coords[0], lng: value.coords[1] }
    : null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <PlacesAutocomplete onSelect={handleSelect} />
      <div className="h-48 rounded-xl overflow-hidden border border-gray-200">
        <Map
          id={label}
          defaultCenter={center}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl
          style={{ width: '100%', height: '100%' }}
        >
          <MapClickHandler onSelect={handleSelect} />
          {markerPos && <Marker position={markerPos} />}
        </Map>
      </div>
      {value?.name && (
        <p className="text-xs text-gray-500 truncate">{value.name}</p>
      )}
    </div>
  );
}
