import { useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { MapPin, ExternalLink } from 'lucide-react';

interface HeadOfficeMapProps {
  latitude: number;
  longitude: number;
  organizationName: string;
  address: string;
}

function OfficeMarkerWithInfo({
  latitude,
  longitude,
  organizationName,
  address,
}: HeadOfficeMapProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: latitude, lng: longitude }}
        title={organizationName}
        onClick={() => setInfoOpen((prev) => !prev)}
      >
        <Pin background="#14452F" borderColor="#0D3121" glyphColor="#FBBF24" />
      </AdvancedMarker>
      {infoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={260}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 text-stone-900">
            <p className="font-semibold text-sm text-[#14452F]">{organizationName}</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{address}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function HeadOfficeMap({
  latitude,
  longitude,
  organizationName,
  address,
}: HeadOfficeMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const center = { lat: latitude || 19.1712, lng: longitude || 83.4165 };
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${organizationName}, ${address}`
  )}`;

  if (!apiKey) {
    return (
      <div className="w-full h-[420px] rounded-xl border border-stone-200 bg-[#F3F5F0] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#14452F] text-white flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-stone-900">{organizationName}</h3>
        <p className="text-sm text-stone-600 max-w-md mt-2 leading-relaxed">{address}</p>
        <p className="text-xs font-mono text-stone-500 mt-2 tabular-nums">
          Coordinates: {center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E
        </p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14452F] text-white text-sm font-medium hover:bg-[#1E5B3F] transition-colors"
        >
          Open in Google Maps
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
      <APIProvider apiKey={apiKey} libraries={['marker']} language="en" region="IN">
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={center}
          defaultZoom={13}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <OfficeMarkerWithInfo
            latitude={center.lat}
            longitude={center.lng}
            organizationName={organizationName}
            address={address}
          />
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
