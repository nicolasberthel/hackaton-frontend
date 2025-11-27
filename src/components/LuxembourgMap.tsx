import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Investment project locations across Luxembourg
const projectLocations = [
  { name: "Luxembourg City Solar Park", coords: [6.1296, 49.6116], mw: 12.5 },
  { name: "Esch-sur-Alzette Wind Farm", coords: [5.9809, 49.4958], mw: 18.3 },
  { name: "Differdange Battery Storage", coords: [5.8908, 49.5247], mw: 8.7 },
  { name: "Dudelange Solar Installation", coords: [6.0858, 49.4781], mw: 15.2 },
  { name: "Ettelbruck Community Energy", coords: [6.1042, 49.8474], mw: 9.8 },
  { name: "Diekirch Wind Project", coords: [6.1597, 49.8669], mw: 22.1 },
  { name: "Wiltz Renewable Hub", coords: [5.9322, 49.9658], mw: 14.6 },
  { name: "Echternach Solar Array", coords: [6.4175, 49.8114], mw: 11.4 },
  { name: "Grevenmacher Battery Park", coords: [6.4411, 49.6808], mw: 7.9 },
  { name: "Remich Solar Farm", coords: [6.3667, 49.5453], mw: 13.8 },
  { name: "Mersch Wind Installation", coords: [6.1069, 49.7544], mw: 19.2 },
  { name: "Redange Community Solar", coords: [5.8892, 49.7642], mw: 10.5 },
  { name: "Vianden Hydro Storage", coords: [6.2019, 49.9350], mw: 25.4 },
  { name: "Clervaux Wind Farm", coords: [6.0303, 50.0547], mw: 16.7 },
  { name: "Capellen Solar Park", coords: [5.9958, 49.6444], mw: 12.1 },
];

interface LuxembourgMapProps {
  apiKey?: string;
}

export default function LuxembourgMap({ apiKey }: LuxembourgMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [6.1296, 49.8153], // Luxembourg center
      zoom: 9,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add markers for each project
    map.current.on('load', () => {
      projectLocations.forEach((project) => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s;
        `;
        
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; font-family: system-ui;">
              <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 14px;">${project.name}</h3>
              <p style="margin: 0; color: #666; font-size: 12px;">${project.mw} MW capacity</p>
            </div>
          `);

        new mapboxgl.Marker(markerElement)
          .setLngLat(project.coords as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="relative h-80 bg-muted rounded-lg flex items-center justify-center border-2 border-border">
        <div className="text-center space-y-2 p-6">
          <p className="text-muted-foreground font-medium">Map requires Mapbox API key</p>
          <p className="text-sm text-muted-foreground">
            Please add your Mapbox public token to display the interactive map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}