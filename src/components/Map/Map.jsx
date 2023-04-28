import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import data from "../../data.json";
import esriConfig from "@arcgis/core/config";
import {
  addVisibleButton,
  addHomeButton,
} from "./helper";

import PopupTemplate from "@arcgis/core/PopupTemplate";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

esriConfig.apiKey =
  "AAPK12af8db0336d4e65a123b486f6537b63r9KMbOKhhBj57s-_NEz_nIq6WumZTvSrhOg_MVkBLu-lWpuOEvsoSOIDj9k-gKkc";

const ArcGISMap = () => {
  const mapDiv = useRef(null);
  const polygonLayerRef = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      const map = new Map({ basemap: "streets-vector" });
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        zoom: 13,
        center: [71.430411, 51.128207],
        constraints: {
          minZoom: 2,
          maxZoom: 18,
        },
      });

      const graphics = data.features.map((feature) => {
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

      const graphicCollection = new FeatureLayer({
        source: graphics,
        objectIdField: "OBJECTID",
        geometryType: "polygon",
        fields: [
          {
            name: "OBJECTID",
            alias: "OBJECTID",
            type: "oid",
          },
          {
            name: "name",
            alias: "Name",
            type: "string",
          },
          {
            name: "address",
            alias: "Address",
            type: "string",
          },
          {
            name: "phone",
            alias: "Phone",
            type: "string",
          },
          {
            name: "description",
            alias: "Description",
            type: "string",
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

      map.add(graphicCollection);
      polygonLayerRef.current = graphicCollection;

      view.ui.remove("attribution");

      addHomeButton(view);
      addVisibleButton(view, polygonLayerRef);

      const popupTemplate = new PopupTemplate({
        title: "{name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "name",
                label: "Наименование",
                visible: true,
              },
              {
                fieldName: "address",
                label: "Адресс",
                visible: true,
              },
              {
                fieldName: "phone",
                label: "Телефон",
                visible: true,
              },
              {
                fieldName: "description",
                label: "Описание",
                visible: true,
              },
            ],
          },
        ],
      });

      graphicCollection.popupTemplate = popupTemplate;
      view.on("click", async (event) => {
        const mapPoint = view.toMap(event);

        const query = graphicCollection.createQuery();
        query.geometry = mapPoint;
        query.distance = 5;
        query.units = "meters";
        query.spatialRelationship = "intersects";
        const response = await graphicCollection.queryFeatures(query);

        const graphic = response.features[0];
        if (graphic) {
          view.popup.close();
          await view.whenPopupClose();

          view.popup.open({
            features: [graphic],
            location: mapPoint,
            updateLocationEnabled: true,
          });
        } else {
          view.popup.close();
        }
      });

      MapView.prototype.whenPopupClose = function () {
        return new Promise((resolve) => {
          if (!this.popup.visible) {
            resolve();
          } else {
            const handle = this.popup.watch("visible", (visible) => {
              if (!visible) {
                handle.remove();
                resolve();
              }
            });
          }
        });
      };
    }
    return () => {
      if (mapDiv.current) {
        mapDiv.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapDiv}
      style={{ height: "100%", width: "100%", position: "relative" }}
    />
  );
};
export default ArcGISMap;
