import { MapContainer, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";

const Map = () => {
  const [buildingData, setBuildingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(20);
  const geoJsonRef = useRef(null);

  // Component to track zoom level
  const ZoomHandler = () => {
    const map = useMapEvents({
      zoomend: () => {
        const zoom = map.getZoom();
        setZoomLevel(zoom);

        // Toggle tooltip visibility based on zoom
        if (geoJsonRef.current) {
          geoJsonRef.current.eachLayer((layer) => {
            const tooltip = layer.getTooltip();
            if (tooltip) {
              if (zoom >= 18) {
                layer.openTooltip();
              } else {
                layer.closeTooltip();
              }
            }
          });
        }
      },
    });
    return null;
  };

  // Clear selected building state when clicking off a building
  const MapClickHandler = () => {
    useMapEvents({
      click: () => {
        setSelectedBuilding(null);
      },
    });
    return null;
  };

  // Fetch building data from ArcGIS API: This is the building footprints geojson data
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
        alert("Failed to load building data.");
        console.error("Error loading building data:", error);
        setLoading(false);
      });
  }, []);

  // Styiling for the buildings footprints layer
  const orangeStyle = (feature) => ({
    fillColor: "#f97316",
    // Highlights the building when hovered or selected
    fillOpacity:
      selectedBuilding === feature.properties.OBJECTID ||
      hoveredId === feature.properties.OBJECTID
        ? 0.8
        : 0.5,
    color: "#ea580c",
    weight:
      selectedBuilding === feature.properties.OBJECTID ||
      hoveredId === feature.properties.OBJECTID
        ? 3
        : 2,
  });

  // Add interactivity to each building
  const onEachFeature = (feature, layer) => {
    const buildingName = feature.properties.NAME || "Unknown Building";

    // Bind permanent tooltip with building name (Basically its the building labels)
    layer.bindTooltip(buildingName, {
      permanent: true,
      direction: "center",
      className: "building-label",
      opacity: zoomLevel >= 18 ? 1 : 0, // Show the labels only at zoom level 18 or up
    });

    // Handles the popup when clicking on a building
    // Todo - Make a separate component for these type of popup for consistent styling
    layer.bindPopup(
      `<p>Room search is currently not available for this room</p>`
    );

    layer.on({
      click: () => {
        setSelectedBuilding(feature.properties.OBJECTID);
        console.log("Selected building:", buildingName, feature.properties);
      },
      mouseover: () => {
        setHoveredBuilding(buildingName);
        setHoveredId(feature.properties.OBJECTID);
      },
      mouseout: () => {
        setHoveredBuilding(null);
        setHoveredId(null);
      },
    });
  };

  return (
    <MapContainer
      center={[29.6483, -82.3494]}
      zoom={20}
      className="h-screen w-screen flex justify-center items-center"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        className="grayscale"
      />
      {/*Todo - Make a separate component for these type of popup for consistent styling */}
      {loading && (
        <div className="bg-white p-2 rounded shadow z-[1000]">
          Loading buildings...
        </div>
      )}
      {buildingData && (
        <GeoJSON
          ref={geoJsonRef}
          data={buildingData}
          style={orangeStyle}
          onEachFeature={onEachFeature}
        />
      )}
      <ZoomHandler />
      <MapClickHandler />
      {/*Todo - Make a separate component for these type of popup for consistent styling */}
      {hoveredBuilding && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded shadow z-[1000]">
          <strong>{hoveredBuilding}</strong>
        </div>
      )}
    </MapContainer>
  );
};

export default Map;
