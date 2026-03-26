import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function SearchBox({ onResult }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timeoutRef.current);
    if (val.length < 3) {
      setResults([]);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      }
    }, 400);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search address..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
          {results.map((r) => (
            <li
              key={r.place_id}
              className="px-3 py-2 text-sm text-left hover:bg-emerald-50 cursor-pointer truncate"
              onClick={() => {
                onResult([parseFloat(r.lat), parseFloat(r.lon)], r.display_name);
                setQuery(r.display_name.split(',')[0]);
                setResults([]);
              }}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LocationPicker({ label, value, onChange }) {
  const [center, setCenter] = useState([51.505, -0.09]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setCenter(loc);
          if (mapRef.current) mapRef.current.setView(loc, 13);
        },
        () => {}
      );
    }
  }, []);

  function handleSearchResult(coords, name) {
    onChange({ coords, name });
    if (mapRef.current) mapRef.current.setView(coords, 14);
  }

  function handleMapClick(coords) {
    onChange({ coords, name: `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}` });
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <SearchBox onResult={handleSearchResult} />
      <div className="h-48 rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={13}
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleMapClick} />
          {value?.coords && <Marker position={value.coords} />}
        </MapContainer>
      </div>
      {value?.name && (
        <p className="text-xs text-gray-500 truncate">{value.name}</p>
      )}
    </div>
  );
}
