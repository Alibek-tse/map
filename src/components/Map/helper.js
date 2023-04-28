import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import ReactDOM from "react-dom";
import Popup from "@arcgis/core/widgets/Popup";
import HomeButton from "./components/HomeButton/HomeButton";
import VisibleButton from "./components/VisibleButton/VisibleButton";

export const createGraphicsFromGeoJSON = (geoJSON) => {
  const graphics = geoJSON.features.map((feature) => {
    const { geometry, properties } = feature;
    return new Graphic({
      geometry: {
        type: "polygon",
        rings: geometry.coordinates,
        spatialReference: { wkid: 4326 },
      },
      attributes: properties,
    });
  });

  return graphics;
};
export const getGraficCollection = (graphicCollection) => {
  return new FeatureLayer({
    source: graphicCollection,
    objectIdField: "OBJECTID",
    geometryType: "polygon",
    fields: [
      {
        name: "OBJECTID",
        alias: "OBJECTID",
        type: "oid",
      },
    ],
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [255, 0, 0, 0.5],
        outline: {
          color: [0, 0, 0, 1],
          width: 1,
        },
      },
    },
  });
};

export const addVisibleButton = (view, polygonLayerRef) => {
  const handleTogglePolygon = () => {
    if (polygonLayerRef.current) {
      polygonLayerRef.current.visible = !polygonLayerRef.current.visible;
    }
  };
  const visibleButtonContainer = document.createElement("div");
  ReactDOM.render(
    <VisibleButton onClick={handleTogglePolygon} />,
    visibleButtonContainer
  );
  view.ui.add(visibleButtonContainer, "top-right");
};

export const addHomeButton = (view) => {
  const handleHomeClick = () => {
    view.goTo({
      center: [71.430411, 51.128207],
      zoom: 14,
    });
  };
  const homeButtonContainer = document.createElement("div");
  ReactDOM.render(
    <HomeButton onClick={handleHomeClick} />,
    homeButtonContainer
  );

  view.ui.add(homeButtonContainer, "top-right");
};



export const popup = new Popup({
  autoOpenEnabled: false, 
  dockOptions: {
    buttonEnabled: false, 
    breakpoint: false, 
    position: "top-right",
  },
});
