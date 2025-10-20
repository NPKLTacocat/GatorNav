import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

const Map = () => {
  const [buildingData, setBuildingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch building data from ArcGIS API
  useEffect(() => {
    fetch(
      "https://services9.arcgis.com/IiuFUnlkob76Az9k/arcgis/rest/services/UF_Building_Footprints_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Building data loaded:", data);
        setBuildingData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading building data:", error);
        setLoading(false);
      });
  }, []);

  // Orange style for all buildings
  const orangeStyle = {
    fillColor: "#f97316",
    fillOpacity: 0.5,
    color: "#ea580c",
    weight: 2,
  };

  return (
    <MapContainer
      center={[29.6483, -82.3494]}
      zoom={20}
      className="h-screen w-screen"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        className="grayscale"
      />
      {loading && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-[1000]">
          Loading buildings...
        </div>
      )}
      {buildingData && <GeoJSON data={buildingData} style={orangeStyle} />}
    </MapContainer>
  );
};

export default Map;
